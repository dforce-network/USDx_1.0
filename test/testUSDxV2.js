const USDxV2deploy = require("./helpers/USDxV2deploy.js");
const supportDToken = require("./supportDToken.js");
const Collaterals = artifacts.require("Collaterals_t.sol");

const {
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");

const BN = require("bn.js");
const { assertion } = require("@openzeppelin/test-helpers/src/expectRevert");

contract("USDx with Pool & Engine V2", (accounts) => {
  let contracts;

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

      it("should be able to start by non-owner", async () => {
        await expectRevert(
          contracts.usdxToken.start({ from: accounts[1] }),
          "ds-auth-non-owner"
        );
      });

      it("should not be able to start by owner", async () => {
        await contracts.usdxToken.start();
        await supportDToken.oneClickMinting(contracts, accounts);
      });
    });

    describe("Transfer Assets", () => {
      it("should be able to transfer assets by owner", async () => {
        // The pool may not have src token available, make some transfer
        let amount = new BN(10).pow(await contracts.srcTokens[0].decimals());
        await contracts.srcTokens[0].transfer(contracts.poolV2.address, amount);

        await contracts.poolV2.transferOut(
          contracts.srcTokens[0].address,
          accounts[2],
          amount
        );

        // Redeem src token from dToken first
        await contracts.poolV2.transferOutSrc(
          contracts.srcTokens[0].address,
          accounts[2],
          1000
        );
      });

      it("should not be able to transfer assets by non-auth", async () => {
        // The pool may not have src token available, make some transfer
        let amount = new BN(10).pow(await contracts.srcTokens[0].decimals());
        await contracts.srcTokens[0].transfer(contracts.poolV2.address, amount);

        await expectRevert(
          contracts.poolV2.transferOut(
            contracts.srcTokens[0].address,
            accounts[2],
            amount,
            { from: accounts[1] }
          ),
          "ds-auth-unauthorized"
        );

        // Redeem src token from dToken first
        await expectRevert(
          contracts.poolV2.transferOutSrc(
            contracts.srcTokens[0].address,
            accounts[2],
            1000,
            { from: accounts[1] }
          ),
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
        let dToken = await contracts.dTokenController.getDToken(
          srcToken.address
        );

        let mockInterest = new BN(1000).mul(
          new BN(10).pow(await srcToken.decimals())
        );
        await srcToken.transfer(dToken, mockInterest);

        mockInterest = await wrapToken.changeByMultiple(mockInterest);

        let ret = await contracts.poolV2.methods[
          "getInterestByXToken(address)"
        ].call(wrapToken.address);

        let interest = ret["1"];

        console.log(
          "Interest of ",
          await srcToken.name(),
          ":",
          interest.toString(),
          "vs",
          mockInterest.toString()
        );

        //assert.equal(interest.toString(), mockInterest.toString());
      }
    });
  });
});