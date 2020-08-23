const USDxV2deploy = require("./helpers/USDxV2deploy.js");
const supportDToken = require("./supportDToken.js");

const {
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");

const BN = require("bn.js");

contract("USDx with Pool & Engine V2", (accounts) => {
  let contracts;

  it("Deployment", async () => {
    var collateralNames = new Array("PAX", "TUSD", "USDC");
    var weights = new Array(8, 1, 1);
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
        contracts.usdxToken.start();
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
});
