var usdxAddr = "0xB4aEE380a6586a78aAeC7C32Ede0cdB5eA2E620b";
var dfAddr = "0x4AF82b7C2F049574C9fc742A896DAbEA379b7d51";
var protocolAddr = "0x6507Cc2fFE3e4465499850404778749D412F5d25";
var daiAddr = "0xf494e07dfdbce883bf699cedf818fde2fa432db4";
var engineAddr = "0x85009C7dBbd497D908d82CcDb5c3Ac4949c0d4CD";
var poolAddr = "0xb8925aA1Ac58Ba598D7756b39445C03f1cda82B2";
var owner = "0x862AE9d72Da6B0cf93c58fCbD70e5d1172b3E7A0"; // _change_it_ to yours.
var contractUsdx = web3.eth.contract(usdxABI).at(usdxAddr);
var contractDF = web3.eth.contract(erc20faucet).at(dfAddr);
var contractProtocol = web3.eth.contract(protocolABI).at(protocolAddr);
var contractDAI = web3.eth.contract(erc20faucet).at(daiAddr);

function usdxBurnApprove() {
  contractUsdx.approvex.sendTransaction(engineAddr, {
    gas: 1000000
  }, function (
    err,
    ret
  ) {
    console.log(ret, err);
  });
}

function dfApprove() {
  contractDF.approve.sendTransaction(
    engineAddr,
    1000000000 * 1000000000000000000, {
      gas: 1000000
    },
    function (
      err,
      ret
    ) {
      console.log(ret, err);
    });
}

function tryMintingSection() {
  contractProtocol.getMintingSection.call(
    function (err, ret) {
      console.log(ret[1][0].toFixed(), err);
      console.log(ret[1][1].toFixed(), err);
    }
  );
}

function faucetDAI() {
  contractDAI.allocateTo.sendTransaction(
    owner,
    10000 * 1000000000000000000, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function unlockDAI() {
  contractDAI.approve.sendTransaction(
    poolAddr,
    1000000000 * 1000000000000000000, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function depositDAI() {
  contractProtocol.deposit.sendTransaction(
    daiAddr,
    0,
    100 * 1000000000000000000, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function MintinOneKey() {
  contractProtocol.oneClickMinting.sendTransaction(
    0,
    200 * 1000000000000000000, {
      gas: 5000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function getColMaxClaimUSDX() {
  contractProtocol.getColMaxClaim.call(
    function (err, ret) {
      console.log(ret, err);
    }
  );
}