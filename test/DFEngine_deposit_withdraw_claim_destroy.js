// type:'deposit', 'destroy', 'withdraw', 'updateSection', 'claim'
// tokenAddress 1~4
// accountAddress 1~20
// total true: 全部 false:参数无效
// times 执行次数，如果无此参数则按照data配置种类各执行一次。
// data 具体执行方式，如需插入随机模式可以，添加{}
// 各项配置如不填写，测采用随机模式执行

// ------------------------运行test case
// 终端启动节点
// ganache-cli --port=7545 --gasLimit=8000000 --accounts=20 --defaultBalanceEther=10000
// 编译合约
// npm run build
// 运行命令
// truffle test .\test\DFEngine_deposit_withdraw_claim_destroy.js > testDF_deposit_withdraw_claim_destroy.log

const runner = require("./helpers/DFEngine");

const collateralNames = new Array("DAI", "PAX", "TUSD", "USDC");
const weightTest = new Array(0.1, 0.3, 0.3, 0.3);
const runConfig = [
  {
    times: 10,
    data: [
      {
        type: "deposit",
        times: 20,
        data: [{}],
      },
      {
        type: "withdraw",
        data: [{}],
      },
      {
        type: "claim",
        data: [{}],
      },
      {
        type: "destroy",
        data: [{}],
      },
    ],
  },
];

describe("DFEngine deposit withdraw claim destroy", async () => {
  for (let configIndex = 0; configIndex < runConfig.length; configIndex++) {
    it("Config " + configIndex, async () => {
      const accounts = await web3.eth.getAccounts();
      await runner.runConfig(
        collateralNames,
        weightTest,
        runConfig,
        configIndex,
        accounts
      );
    });
  }
});
