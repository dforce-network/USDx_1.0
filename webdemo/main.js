var usdxAddr = "0x17996ea27d03d68ddc618f9b8f0faf43838acaf6";
var dfAddr = "0xfaacf3d2a2ce1102073038e035d24c1c78b6e9c4";

var protocolAddr = "0xA8a57b08235e40b4c76303AeE6E3051942E8a7D1";
var storeAddr = "0x780e4B1f0e779488C3C2f1D2D0A06211a0E80311";
var poolAddr = "0x203466d49c3Ebb8C7f2eFA8058844E1dadDa029e";
var collateralAddr = "0xCBC0d02c6F67de9185f670bba89ad5189Aa3DEA6";
var fundsAddr = "0x600A23758bF963BD549113B81b778C2E56681DD1";
var engineAddr = "0x06cAa25b17Bb588EAb300A51DF4A4F8169dDd5F0";
var guardAddr = "0xaAA6bfdEa01F41d285158aE8cc555e78d261da44";
var medianizer = "0x7E3B8f34fc427DA42B24C102972E6781d5A91a22";
var pricefeed = "0x2db4Dfbba8768207d7dA9Afd85A07b2934c3bB9A";
var sender = "0x18c30D9569fEb3ea3644573b013D329dD9fd01Af";

var contractUsdx = web3.eth.contract(usdxABI).at(usdxAddr);
var contractDF = web3.eth.contract(dfABI).at(dfAddr);

var contractProtocol = web3.eth.contract(protocolABI).at(protocolAddr);
var contractStore = web3.eth.contract(storeABI).at(storeAddr);
var contractPool = web3.eth.contract(poolABI).at(poolAddr);
var contractCollateral = web3.eth.contract(collateralABI).at(collateralAddr);
var contractFunds = web3.eth.contract(fundsABI).at(fundsAddr);
var contractEngine = web3.eth.contract(engineABI).at(engineAddr);
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

function setCollateralAuth2Guard() {
  contractCollateral.setAuthority.sendTransaction(
    guardAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function setFundsAuth2Guard() {
  contractFunds.setAuthority.sendTransaction(
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
    engineAddr, storeAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function permitPoolbyGuard() {
  contractGuard.permitx.sendTransaction(
    engineAddr, poolAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function permitCollateralbyGuard() {
  contractGuard.permitx.sendTransaction(
    engineAddr, collateralAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function permitFundsbyGuard() {
  contractGuard.permitx.sendTransaction(
    engineAddr, fundsAddr, {
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
function engineProtocolReq() {
  contractProtocol.requestImplChange.sendTransaction(
    engineAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function engineProtocolConfirm() {
  contractProtocol.confirmImplChange.sendTransaction({
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
    engineAddr, {
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
  contractEngine.updateMintSection.sendTransaction(
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
  contractDF.approvex.sendTransaction(engineAddr, {
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
  contractProtocol.deposit.sendTransaction(
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
  contractProtocol.deposit.sendTransaction(
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
  contractProtocol.deposit.sendTransaction(
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
  contractProtocol.deposit.sendTransaction(
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
  contractProtocol.withdraw.sendTransaction(
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
  contractProtocol.withdraw.sendTransaction(
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
  contractProtocol.withdraw.sendTransaction(
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
  contractProtocol.withdraw.sendTransaction(
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
  contractProtocol.destroy.sendTransaction(
    100 * 1000000000000000000, {
      gas: 2000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function DAIbalanceofCol() {
  contractPAX.balanceOf.call(
    collateralAddr,
    function (err, ret) {
      console.log(ret.toFixed(), err);
    }
  );
}