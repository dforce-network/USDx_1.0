const USDxV2deploy = require("./helpers/USDxV2deploy.js");
const supportDToken = require("./helpers/supportDToken.js");

const Collaterals = artifacts.require("Collaterals_t.sol");
const DToken = artifacts.require("DToken.sol");

const {
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");

const BN = require("bn.js");
const { assertion } = require("@openzeppelin/test-helpers/src/expectRevert");

describe("USDx with Pool & Engine V2", () => {
  let contracts, accounts;

  before(async () => {
    accounts = await web3.eth.getAccounts();
  });

  it("Deployment", async () => {
    var collateralNames = new Array("PAX", "TUSD", "USDC");
    var weights = new Array(1, 1, 8);
    contracts = await USDxV2deploy.contractsDeploy(
      accounts,
      collateralNames,
      weights
    );
  });

  describe("User Operations", () => {
    it("should be able to deposit and withdraw", async () => {
      await supportDToken.depositAndWithdraw(contracts, accounts);
    });
    it("should be able to destroy", async () => {
      await supportDToken.destroy(contracts, accounts);
    });
    it("should be able to one click minting", async () => {
      await supportDToken.oneClickMinting(contracts, accounts);
    });
  });

  describe("Admin Operations", () => {
    describe("Stop", () => {
      it("should be able to stop by owner", async () => {
        await contracts.usdxToken.stop();
        await expectRevert(
          supportDToken.oneClickMinting(contracts, accounts),
          "ds-stop-is-stopped"
        );
      });

      it("should not be able to stop by non-owner", async () => {
        await expectRevert(
          contracts.usdxToken.stop({ from: accounts[1] }),
          "ds-auth-non-owner"
        );
      });

      it("should not be able to start by non-owner", async () => {
        await expectRevert(
          contracts.usdxToken.start({ from: accounts[1] }),
          "ds-auth-non-owner"
        );
      });

      it("should be able to start by owner", async () => {
        await contracts.usdxToken.start();
        await supportDToken.oneClickMinting(contracts, accounts);
      });
    });

    describe("Transfer Assets", () => {
      it("should be able to transfer assets by owner", async () => {
        let account = accounts[1];
        let token = contracts.srcTokens[0].address;

        let amount = new BN(10).pow(await contracts.srcTokens[0].decimals());

        // transferFromSender()/transferOut() pair
        await contracts.poolV2.transferFromSender(token, account, amount);
        await contracts.poolV2.transferOut(token, account, amount);

        // transferFromSenderOneClick()/transferOutSrc() pair
        await contracts.poolV2.transferFromSenderOneClick(
          token,
          account,
          amount
        );
        await contracts.poolV2.transferOutSrc(token, account, amount);
      });

      it("should not be able to transfer assets by non-auth", async () => {
        let account = accounts[1];
        let token = contracts.srcTokens[0].address;
        // The pool may not have src token available, make some transfer
        let amount = new BN(10).pow(await contracts.srcTokens[0].decimals());

        // transferFromSender()/transferOut() pair
        await expectRevert(
          contracts.poolV2.transferFromSender(token, account, amount, {
            from: account,
          }),
          "ds-auth-unauthorized"
        );
        await expectRevert(
          contracts.poolV2.transferOut(token, account, amount, {
            from: account,
          }),
          "ds-auth-unauthorized"
        );

        // Redeem src token from dToken first
        await expectRevert(
          contracts.poolV2.transferFromSenderOneClick(token, account, amount, {
            from: account,
          }),
          "ds-auth-unauthorized"
        );
        await expectRevert(
          contracts.poolV2.transferOutSrc(token, account, amount, {
            from: account,
          }),
          "ds-auth-unauthorized"
        );
      });
    });
  });

  describe("Query Interface for USR", () => {
    it("should be able to call getUnderlying()", async () => {
      for (const srcToken of contracts.srcTokens) {
        let underlying = await contracts.poolV2.methods[
          "getUnderlying(address)"
        ].call(srcToken.address);

        console.log(
          "Underlying of ",
          await srcToken.name(),
          ":",
          underlying.toString()
        );
      }
    });
    it("should be able to call getInterestByXToken()", async () => {
      for (const wrapToken of contracts.wrapTokens) {
        let srcToken = await Collaterals.at(await wrapToken.getSrcERC20());
        let dToken = await DToken.at(
          await contracts.dTokenController.getDToken(srcToken.address)
        );

        let usdxUnderlying = await contracts.poolV2.methods[
          "getUnderlying(address)"
        ].call(srcToken.address);
        let dTokenTotalUnderlying = await dToken.getTotalBalance();

        let interestBefore = (
          await contracts.poolV2.methods["getInterestByXToken(address)"].call(
            wrapToken.address
          )
        )["1"];

        // Mock 10% interest
        let mockDTokenInterest = dTokenTotalUnderlying.div(new BN(10));
        let mockInterest = usdxUnderlying.div(new BN(10));
        mockInterest = await wrapToken.changeByMultiple(mockInterest);

        await srcToken.transfer(dToken.address, mockDTokenInterest);

        let interestAfter = (
          await contracts.poolV2.methods["getInterestByXToken(address)"].call(
            wrapToken.address
          )
        )["1"];

        let interestChanged = interestAfter.sub(interestBefore);

        console.log(
          "Interest of ",
          await srcToken.name(),
          ":",
          interestChanged.toString(),
          "vs",
          mockInterest.toString()
        );

        assert.equal(interestChanged.toString(), mockInterest.toString());
      }
    });
  });
});
