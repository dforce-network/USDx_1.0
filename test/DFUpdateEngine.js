// type:'deposit', 'destroy', 'withdraw', 'updateSection', 'claim'
// tokenAddress 1~4
// accountAddress 1~20
// total true: all false: invalid parameter
// times The number of executions. If there is no such parameter, it will be executed once according to the data configuration type.
// data Specific implementation, if you need to insert random mode, add {}
// If the configuration is not filled in, the measurement is performed in random mode.
// ------------------------run test case
// The terminal starts the ETH node.
// ganache-cli --port=7545 --gasLimit=8000000 --accounts=10 --defaultBalanceEther=10000
// Compile contract
// npm run build
// Run command
// truffle test .\test\DFUpdateEngine.js > testUpdateEngine.log
const runner = require("./helpers/DFEngine");

const collateralNames = new Array("DAI", "PAX", "TUSD", "USDC");
const weightTest = new Array(0.1, 0.3, 0.3, 0.3);
const runConfig = [
  {
    data: [
      {
        type: "deposit",
        data: [
          {
            tokenAddress: 1,
            accountAddress: 1,
            amount: 1.2,
          },
          {
            tokenAddress: 2,
            accountAddress: 2,
            amount: 2.4,
          },
          {
            tokenAddress: 3,
            accountAddress: 3,
            amount: 3.6,
          },
          {
            tokenAddress: 4,
            accountAddress: 4,
            amount: 0.3,
          },
        ],
      },

      {
        type: "claim",
        // 'times':100,
        data: [
          {
            accountAddress: 1,
          },
          {
            accountAddress: 4,
          },
        ],
      },
      {
        type: "deposit",
        // 'times':100,
        data: [
          {
            tokenAddress: 4,
            accountAddress: 2,
            amount: 0.6,
          },
        ],
      },
      {
        type: "updateSection",
        // 'times':100,
        data: [
          {
            tokens: [0, 2, 3, 4],
            weight: [0.1, 0.3, 0.3, 0.3],
          },
        ],
      },
      {
        type: "deposit",
        // 'times':100,
        data: [
          {
            tokenAddress: 4,
            accountAddress: 2,
            amount: 0.2,
          },
          {
            tokenAddress: 4,
            accountAddress: 5,
            amount: 0.2,
          },
        ],
      },
      {
        type: "changeEngine",
        data: [{}],
      },
      {
        type: "claim",
        data: [
          {
            accountAddress: 1,
          },
          {
            accountAddress: 2,
          },
          {
            accountAddress: 3,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 1,
            amount: 0.3,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 2,
            amount: 1.6,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 3,
            amount: 1.2,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 5,
            amount: 0.1,
          },
        ],
      },
    ],
  },
];

describe("DFUpdateEngine", async () => {
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
