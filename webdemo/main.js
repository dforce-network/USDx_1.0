var usdxAddr = "0x17996ea27d03d68ddc618f9b8f0faf43838acaf6";
var dfnAddr = "0xfaacf3d2a2ce1102073038e035d24c1c78b6e9c4";

// var proxyAddr = "0x577fF076Fa10B29e46B35F4Bba6ed58a22919B44";
// var storeAddr = "0x0f47cA9e1f692E535829835FfDC086C45585DF1c";
// var poolAddr = "0xF51ef9DDdCFCa1B495C3bbfBc44446dd662F1400";
// var bankAddr = "0xa2a6AbFE39a835c35073B46e3614c059B3Dd5840";
// var feesAddr = "0x68e36a5e04384FCB019F79B9D7ce014649df24FB";
// var convertAddr = "0xfcaf6B782B484509A27D08403aCE1E2D3C066BC0";
// var guardAddr = "0x4b025B9B713FCBd8a635c6b34c2a10ECf12Ae6a1";

var proxyAddr = "0x458C21b2F0eEef8Cf97D4a3A36DB89d5343010CE";
var storeAddr = "0x901069049Ffc67F053c3B77597218FdBEfa3Bb2C";
var poolAddr = "0xFA82A7522B01A0fAFb1c9cBB651A5d6a8d8963Fc";
var bankAddr = "0x28BBEFdE119D3d092FbBD1fb554253F7D3A40149";
var feesAddr = "0xE064d694c6043aE9154287aC96AD1212A70d619E";
var convertAddr = "0xDfBa945139272d484e33DD241A01Dc3Fc739A5f9";
var guardAddr = "0x565e93Daa4A9989Bd657c5416A91c16E2B02DA25";

var contractUsdx = web3.eth.contract(usdxABI).at(usdxAddr);
var contractDFN = web3.eth.contract(dfnABI).at(dfnAddr);

var contractProxy = web3.eth.contract(proxyABI).at(proxyAddr);
var contractStore = web3.eth.contract(storeABI).at(storeAddr);
var contractPool = web3.eth.contract(poolABI).at(poolAddr);
var contractBank = web3.eth.contract(bankABI).at(bankAddr);
var contractFees = web3.eth.contract(feesABI).at(feesAddr);
var contractConvert = web3.eth.contract(convertABI).at(convertAddr);
var contractGuard = web3.eth.contract(guardABI).at(guardAddr);

var daiAddr = "0x235b370de0b0cd3fb9e987e4957a9db0f1c3dd5a";
var paxAddr = "0x9aa0fa0a4e2634fbbf1b716fcabf8650a8fa330f";
var tusdAddr = "0xebb02dbf58104b93af2a89ae55ef2d7a7be36247";
var usdcAddr = "0x676ce98a3bc9c191903262f887bb312ce20f851f";

var contractDAI = web3.eth.contract(erc20ABI).at(daiAddr);
var contractPAX = web3.eth.contract(erc20ABI).at(paxAddr);
var contractTUSD = web3.eth.contract(erc20ABI).at(tusdAddr);
var contractUSDC = web3.eth.contract(erc20ABI).at(usdcAddr);

function setStoreAuth2Guard() {
  contractStore.setAuthority.sendTransaction(
    guardAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function setPoolAuth2Guard() {
  contractPool.setAuthority.sendTransaction(
    guardAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function setBankAuth2Guard() {
  contractBank.setAuthority.sendTransaction(
    guardAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function setFeesAuth2Guard() {
  contractFees.setAuthority.sendTransaction(
    guardAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function permitStorebyGuard() {
  contractGuard.permitx.sendTransaction(
    convertAddr, storeAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function permitPoolbyGuard() {
  contractGuard.permitx.sendTransaction(
    convertAddr, poolAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function permitBankbyGuard() {
  contractGuard.permitx.sendTransaction(
    convertAddr, bankAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function permitFeesbyGuard() {
  contractGuard.permitx.sendTransaction(
    convertAddr, feesAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

/*
  let protocol know the instance of engine.
*/
function convertProxyReq() {
  contractProxy.requestImplChange.sendTransaction(
    convertAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function convertProxyConfirm() {
  contractProxy.confirmImplChange.sendTransaction({
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

/*
  let usdx know who can call mint/burn.
*/
function usdxSetAuth() {
  contractUsdx.setAuthority.sendTransaction(
    convertAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

/*
  set Auth carefully, only Owner can do this job.
*/
function updateMintSection() {
  contractConvert.updateMintSection.sendTransaction(
    [
      "0x235b370de0b0cd3fb9e987e4957a9db0f1c3dd5a",
      "0x9aa0fa0a4e2634fbbf1b716fcabf8650a8fa330f",
      "0xebb02dbf58104b93af2a89ae55ef2d7a7be36247",
      "0x676ce98a3bc9c191903262f887bb312ce20f851f"
    ],
    [60, 70, 80, 90], {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

/*
  user actions.
*/
function usdxBurnApprove() {
  contractUsdx.approvex.sendTransaction(convertAddr, {
    gas: 1000000
  }, function (
    err,
    ret
  ) {
    console.log(ret, err);
  });
}

function dfnApprove() {
  contractDFN.approvex.sendTransaction(convertAddr, {
    gas: 1000000
  }, function (
    err,
    ret
  ) {
    console.log(ret, err);
  });
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

function unlockPAX() {
  contractPAX.approve.sendTransaction(
    poolAddr,
    1000000000 * 1000000000000000000, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function unlockTUSD() {
  contractTUSD.approve.sendTransaction(
    poolAddr,
    1000000000 * 1000000000000000000, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function unlockUSDC() {
  contractUSDC.approve.sendTransaction(
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
  contractProxy.deposit.sendTransaction(
    daiAddr,
    100 * 1000000000000000000, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function depositPAX() {
  contractProxy.deposit.sendTransaction(
    paxAddr,
    200 * 1000000000000000000, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function depositTUSD() {
  contractProxy.deposit.sendTransaction(
    tusdAddr,
    300 * 1000000000000000000, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function depositUSDC() {
  contractProxy.deposit.sendTransaction(
    usdcAddr,
    500 * 1000000000000000000, {
      gas: 5000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function withdrawDAI() {
  contractProxy.withdraw.sendTransaction(
    daiAddr,
    20 * 1000000000000000000, {
      gas: 2000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function withdrawPAX() {
  contractProxy.withdraw.sendTransaction(
    paxAddr,
    20 * 1000000000000000000, {
      gas: 2000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function withdrawTUSD() {
  contractProxy.withdraw.sendTransaction(
    tusdAddr,
    20 * 1000000000000000000, {
      gas: 2000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function withdrawUSDC() {
  contractProxy.withdraw.sendTransaction(
    usdcAddr,
    20 * 1000000000000000000, {
      gas: 2000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function destroy() {
  contractProxy.destroy.sendTransaction(
    100 * 1000000000000000000, {
      gas: 2000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function DAIbalanceofBank() {
  contractPAX.balanceOf.call(
    bankAddr,
    function (err, ret) {
      console.log(ret.toFixed(), err);
    }
  );
}