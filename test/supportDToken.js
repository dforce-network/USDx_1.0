const DSWrappedToken = artifacts.require("DSWrappedToken.sol");
const DFPoolV2 = artifacts.require("DFPoolV2");
const DFEngineV2 = artifacts.require("DFEngineV2");
const DToken = artifacts.require("DToken");
const DTokenController = artifacts.require("DTokenController");
const Collaterals = artifacts.require("Collaterals_t.sol");

const BN = require("bn.js");
const UINT256_MAX = new BN("2").pow(new BN("256")).sub(new BN("1"));

async function getClaimableList(protocolView, accounts) {
  let claimableList = new Array();
  for (const account of accounts) {
    let amount = await protocolView.getUserMaxToClaim({ from: account });

    if (amount > 0) {
      let claimable = {};
      claimable.amount = amount;
      claimable.account = account;

      claimableList.push(claimable);
    }
  }

  return claimableList;
}

async function deployDTokens(srcTokens, dTokenController, accounts) {
  for (let index = 0; index < srcTokens.length; index++) {
    let srcToken = srcTokens[index];
    let dTokenName = "d" + (await srcToken.name());

    let dToken = await DToken.new(dTokenName, dTokenName, srcToken.address);
    await dTokenController.setdTokensRelation(
      [srcToken.address],
      [dToken.address]
    );

    // Mint some dToken and mock some interest
    let amount = new BN(1000).mul(new BN(10).pow(await srcToken.decimals()));
    await srcToken.approve(dToken.address, amount);
    await dToken.mint(accounts[0], amount);
    await srcToken.transfer(dToken.address, amount.div(new BN(10)));
  }
}
async function migrate(contracts) {
  let {
    store,
    guard,
    usdxToken,
    poolV2,
    poolV1,
    srcTokens,
    dTokenController,
    collateral,
  } = contracts;

  let wrapTokenAddresses = [];

  let balancesBefore = new Map();
  for (let srcToken of srcTokens) {
    console.log("\n-------------------------------------------------------");

    let srcTokenName = await srcToken.name();
    console.log("Source Token:\t", srcTokenName);

    let srcBalance = await srcToken.balanceOf(poolV1.address);
    console.log("SToken Balance of PoolV1:\t", srcBalance.toString());

    let wrapToken = await DSWrappedToken.at(
      await store.getWrappedToken(srcToken.address)
    );

    wrapTokenAddresses.push(wrapToken.address);

    let wrapBalance = await wrapToken.balanceOf(poolV1.address);
    console.log("XToken Balance of PoolV1:\t", wrapBalance.toString());

    let wrapColBalance = await wrapToken.balanceOf(collateral.address);
    console.log("XToken Balance of Collateral:\t", wrapColBalance.toString());

    await poolV2.approve(srcToken.address);

    let balanceBefore = {};
    balanceBefore.sBalancePool = srcBalance;
    balanceBefore.xBalancePool = wrapBalance;
    balanceBefore.xBalanceCol = wrapColBalance;

    balancesBefore.set(srcToken.address, balanceBefore);
  }

  let usdxClaimableBefore = await usdxToken.balanceOf(poolV1.address);
  console.log("Claimable USDx: \t", usdxClaimableBefore.toString());

  // Migrate from V1 to V2
  console.log(
    "\n===================================Migrating==================================="
  );
  await guard.permitx(poolV2.address, poolV1.address);
  await poolV2.migrateOldPool(wrapTokenAddresses, usdxToken.address);

  for (let srcToken of srcTokens) {
    console.log("\n-------------------------------------------------------");

    let srcTokenName = await srcToken.name();
    console.log("Source Token:\t", srcTokenName);

    let srcBalance = await srcToken.balanceOf(poolV2.address);
    console.log("SToken Balance of PoolV2:\t", srcBalance.toString());

    let wrapToken = await DSWrappedToken.at(
      await store.getWrappedToken(srcToken.address)
    );

    let wrapBalance = await wrapToken.balanceOf(poolV2.address);
    console.log("XToken Balance of PoolV2:\t", wrapBalance.toString());

    let wrapColBalance = await wrapToken.balanceOf(collateral.address);
    console.log("XToken Balance of Collateral:\t", wrapColBalance.toString());

    let dToken = await DToken.at(
      await dTokenController.getDToken(srcToken.address)
    );

    let dTokenBalance = await dToken.getTokenBalance.call(poolV2.address);
    console.log("DToken Balance of PoolV2:\t", dTokenBalance.toString());

    // Verify balance before and after
    assert.equal(
      balancesBefore.get(srcToken.address).sBalancePool.toString(),
      srcBalance.add(dTokenBalance).toString()
    );

    assert.equal(
      balancesBefore.get(srcToken.address).xBalancePool.toString(),
      wrapBalance.toString()
    );

    assert.equal(
      balancesBefore.get(srcToken.address).xBalanceCol.toString(),
      wrapColBalance.toString()
    );
  }

  assert.equal(
    usdxClaimableBefore.toString(),
    (await usdxToken.balanceOf(poolV2.address)).toString()
  );
}

async function updateEngineAndPool(contracts, accounts) {
  console.log(
    "\n-------------------Updating Engine & Pool------------------------------------\n"
  );

  let {
    store,
    guard,
    usdxToken,
    dfToken,
    protocol,
    poolV2,
    engineV2,
    srcTokens,
    collateral,
    funds,
  } = contracts;

  await usdxToken.setAuthority(engineV2.address);
  await dfToken.setAuthority(engineV2.address);
  await engineV2.setAuthority(guard.address);
  await poolV2.setAuthority(guard.address);

  await guard.permitx(engineV2.address, store.address);
  await guard.permitx(engineV2.address, poolV2.address);
  await guard.permitx(engineV2.address, collateral.address);
  await guard.permitx(engineV2.address, funds.address);
  await guard.permitx(protocol.address, engineV2.address);

  for (let srcToken of srcTokens) {
    let wrapToken = await DSWrappedToken.at(
      await store.getWrappedToken(srcToken.address)
    );

    await poolV2.approveToEngine(wrapToken.address, engineV2.address);
    await collateral.approveToEngine(wrapToken.address, engineV2.address);
    await wrapToken.setAuthority(engineV2.address);
    await srcToken.approve(poolV2.address, UINT256_MAX);
  }

  await protocol.requestImplChange(engineV2.address);
  await protocol.confirmImplChange();

  for (const account of accounts) {
    await dfToken.approve(engineV2.address, UINT256_MAX, {
      from: account,
    });
    await usdxToken.approve(engineV2.address, UINT256_MAX, {
      from: account,
    });
  }
}
async function depositAndWithdraw(contracts, accounts) {
  console.log(
    "\n-------------------Checking Deposit & Withdraw------------------------------------\n"
  );

  let {
    usdxToken,
    protocol,
    protocolView,
    dTokenController,
    poolV2,
  } = contracts;

  let mintingSection = await protocolView.getMintingSection();
  let srcTokenAddress = mintingSection[0];

  let usdxBalanceBefore = (await usdxToken.balanceOf(accounts[0])).add(
    await usdxToken.balanceOf(poolV2.address)
  );

  async function getDTokenBalance(srcTokenAddr) {
    let dToken = await DToken.at(
      await dTokenController.getDToken(srcTokenAddr)
    );

    return await dToken.getTokenBalance(poolV2.address);
  }

  let dTokenBefore = await Promise.all(srcTokenAddress.map(getDTokenBalance));

  let weightSum = new BN(0);
  for (let index = 0; index < srcTokenAddress.length; index++) {
    weightSum = weightSum.add(mintingSection[1][index]);

    let srcTokenAddr = srcTokenAddress[index];
    let srcToken = await Collaterals.at(srcTokenAddr);
    let decimals = await srcToken.decimals();

    let amount = new BN(1000).mul(new BN(10).pow(decimals));
    await protocol.deposit(srcTokenAddr, 0, amount);

    amount = new BN(10).mul(new BN(10).pow(decimals));
    await protocol.withdraw(srcTokenAddr, 0, amount);
  }

  let usdxDecimals = await usdxToken.decimals();
  let usdxMinted = (await usdxToken.balanceOf(accounts[0]))
    .add(await usdxToken.balanceOf(poolV2.address))
    .sub(usdxBalanceBefore);
  console.log(
    "USDx minted:\t",
    usdxMinted.div(new BN(10).pow(usdxDecimals)).toString()
  );

  for (let index = 0; index < srcTokenAddress.length; index++) {
    let dToken = await DToken.at(
      await dTokenController.getDToken(srcTokenAddress[index])
    );
    let dTokenDecimals = await dToken.decimals();
    let balance = await dToken.getTokenBalance(poolV2.address);

    let weight = mintingSection[1][index].mul(new BN(100)).div(weightSum);
    let dTokenMinted = balance
      .sub(dTokenBefore[index])
      .div(new BN(10).pow(dTokenDecimals));

    console.log(
      await dToken.name(),
      "(",
      weight.toString(),
      "%)",
      "minted:\t",
      dTokenMinted.toString()
    );

    assert.equal(
      dTokenMinted.toString(),
      usdxMinted
        .mul(mintingSection[1][index])
        .div(weightSum)
        .div(new BN(10).pow(usdxDecimals))
        .toString()
    );
  }
}
async function claim(contracts, claimableList) {
  if (claimableList.length == 0) return;
  console.log(
    "\n-------------------Checking Claimable------------------------------------\n"
  );

  let { usdxToken, protocol } = contracts;
  for (const claimable of claimableList) {
    console.log(
      claimable.account,
      " can claim ",
      claimable.amount.toString(),
      "USDx"
    );

    let balanceBefore = await usdxToken.balanceOf(claimable.account);
    await protocol.claim(0, {
      from: claimable.account,
    });
    let balanceAfter = await usdxToken.balanceOf(claimable.account);

    assert.equal(
      balanceAfter.sub(balanceBefore).toString(),
      claimable.amount.toString()
    );
  }
}
async function destroy(contracts, accounts) {
  console.log(
    "\n-------------------Checking Destroy------------------------------------\n"
  );

  let {
    store,
    usdxToken,
    protocol,
    protocolView,
    dTokenController,
    poolV2,
  } = contracts;

  for (const account of accounts) {
    let balance = await usdxToken.balanceOf(account);
    if (balance.isZero()) break;

    let sectionData = await store.getSectionData(await store.getBurnPosition());
    let diff = sectionData[0].sub(sectionData[1]);

    let amount = balance.gt(diff) ? diff : balance;
    let burningSection = await protocolView.getBurningSection();

    let dTokenBefore = [];
    let weightSum = new BN(0);
    for (let index = 0; index < burningSection[0].length; index++) {
      let dToken = await DToken.at(
        await dTokenController.getDToken(burningSection[0][index])
      );
      let balance = await dToken.getTokenBalance(poolV2.address);
      dTokenBefore.push(balance);

      weightSum = weightSum.add(burningSection[1][index]);
    }

    let usdxDecimals = await usdxToken.decimals();

    if (amount > 0) {
      console.log(
        account,
        " destroy ",
        amount.div(new BN(10).pow(usdxDecimals)).toString(),
        " USDx"
      );
      await protocol.destroy(0, amount, { from: account });
    }

    for (let index = 0; index < burningSection[0].length; index++) {
      let dToken = await DToken.at(
        await dTokenController.getDToken(burningSection[0][index])
      );
      let dTokenDecimals = await dToken.decimals();
      let balance = await dToken.getTokenBalance(poolV2.address);

      let weight = burningSection[1][index].mul(new BN(100)).div(weightSum);
      let dTokenRedeemed = dTokenBefore[index]
        .sub(balance)
        .div(new BN(10).pow(dTokenDecimals));

      console.log(
        await dToken.name(),
        "(",
        weight.toString(),
        "%)",
        "Redeemed:\t",
        dTokenRedeemed.toString()
      );

      assert.equal(
        dTokenRedeemed.toString(),
        amount
          .mul(burningSection[1][index])
          .div(weightSum)
          .div(new BN(10).pow(usdxDecimals))
          .toString()
      );
    }
  }
}

async function oneClickMinting(contracts, accounts) {
  console.log(
    "\n-------------------Verifying oneClickMinting------------------------------------\n"
  );

  let {
    usdxToken,
    protocol,
    protocolView,
    dTokenController,
    poolV2,
  } = contracts;

  let mintingSection = await protocolView.getMintingSection();
  let srcTokenAddress = mintingSection[0];

  let usdxBalanceBefore = await usdxToken.balanceOf(accounts[0]);

  let weightSum = new BN(0);
  mintingSection[1].forEach(function (weight) {
    weightSum = weightSum.add(weight);
  });

  async function getDTokenBalance(srcTokenAddr) {
    let dToken = await DToken.at(
      await dTokenController.getDToken(srcTokenAddr)
    );

    return await dToken.getTokenBalance(poolV2.address);
  }
  let dTokenBefore = await Promise.all(srcTokenAddress.map(getDTokenBalance));

  let usdxDecimals = await usdxToken.decimals();
  let amount = new BN(1000).mul(new BN(10).pow(usdxDecimals));
  await protocol.oneClickMinting(0, amount);

  let usdxMinted = (await usdxToken.balanceOf(accounts[0])).sub(
    usdxBalanceBefore
  );

  console.log(
    "USDx minted:\t",
    usdxMinted.div(new BN(10).pow(usdxDecimals)).toString()
  );

  assert.equal(usdxMinted.toString(), amount.toString());

  for (let index = 0; index < srcTokenAddress.length; index++) {
    let dToken = await DToken.at(
      await dTokenController.getDToken(srcTokenAddress[index])
    );
    let dTokenDecimals = await dToken.decimals();
    let balance = await dToken.getTokenBalance(poolV2.address);

    let weight = mintingSection[1][index].mul(new BN(100)).div(weightSum);
    let dTokenMinted = balance
      .sub(dTokenBefore[index])
      .div(new BN(10).pow(dTokenDecimals));

    console.log(
      await dToken.name(),
      "(",
      weight.toString(),
      "%)",
      "minted:\t",
      dTokenMinted.toString()
    );

    assert.equal(
      dTokenMinted.toString(),
      usdxMinted
        .mul(mintingSection[1][index])
        .div(weightSum)
        .div(new BN(10).pow(usdxDecimals))
        .toString()
    );
  }
}

async function runAll(contracts, accounts) {
  contracts.dTokenController = await DTokenController.new();

  contracts.poolV2 = await DFPoolV2.new(
    contracts.collateral.address,
    contracts.poolV1.address,
    contracts.dTokenController.address
  );

  contracts.engineV2 = await DFEngineV2.new(
    contracts.usdxToken.address,
    contracts.store.address,
    contracts.poolV2.address,
    contracts.collateral.address,
    contracts.funds.address
  );

  let claimableList = await getClaimableList(contracts.protocolView, accounts);

  await deployDTokens(
    contracts.srcTokens,
    contracts.dTokenController,
    accounts
  );
  await migrate(contracts);
  await updateEngineAndPool(contracts, accounts);
  await depositAndWithdraw(contracts, accounts);
  await claim(contracts, claimableList);
  await destroy(contracts, accounts);
  await oneClickMinting(contracts, accounts);
}

module.exports = {
  getClaimableList,
  deployDTokens,
  migrate,
  updateEngineAndPool,
  depositAndWithdraw,
  claim,
  destroy,
  oneClickMinting,
  runAll,
};
