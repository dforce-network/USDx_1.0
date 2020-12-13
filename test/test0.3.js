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
// truffle test .\test\test0.3.js > test0.3.log
const runner = require("./helpers/migrate.js");

const collateralNames = new Array("DAI", "PAX", "TUSD", "USDC");
const weightTest = new Array(0.1, 0.3, 0.3, 0.3);
const runConfig = [
  //deposit-convert-section[1]-deposit-withdraw3-destroy2-claim-deposit-claim-withdraw6-destroy3
  // X（USDx:0.8）
  // Y（USDx:4.2）
  // Z（USDx:2.4）
  // Q（USDx:2.4）
  // W（USDx:0.6）
  {
    data: [
      {
        type: "deposit",
        // 'times':100,
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
            amount: 4.8,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 11,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 12.1,
          },
        ],
      },
      //section[1]
      {
        type: "updateSection",
        // 'times':100,
        data: [
          {
            tokens: [1, 2],
            weight: [1, 3],
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 12,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 11,
          },
        ],
      },
      {
        type: "deposit",
        // 'times':100,
        data: [
          {
            tokenAddress: 1,
            accountAddress: 5,
            amount: 0.6,
          },
        ],
      },
      {
        type: "withdraw",
        data: [
          {
            tokenAddress: 3,
            accountAddress: 3,
            amount: 1.3,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 110,
          },
        ],
      },
      {
        type: "withdraw",
        data: [
          {
            tokenAddress: 3,
            accountAddress: 3,
            amount: 0.01,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 0.2,
          },
        ],
      },
      {
        type: "withdraw",
        data: [
          {
            tokenAddress: 3,
            accountAddress: 3,
            amount: 1.19,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 15.3,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 1,
            amount: 0.1,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 2,
            amount: 0.1,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 3,
            amount: 0.1,
          },
        ],
      },
      {
        type: "claim",
        data: [
          {
            accountAddress: 1, //提取0.2 USDx
          },
          {
            accountAddress: 2, //提取2.4 USDx
          },
          {
            accountAddress: 3, //提取2.4 USDx
          },
          {
            accountAddress: 4, //return 空或0
          },
          {
            accountAddress: 5, //return 空或0
          },
        ],
      },
      {
        type: "deposit",
        // 'times':100,
        data: [
          {
            tokenAddress: 2,
            accountAddress: 2,
            amount: 1.9,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 28,
          },
        ],
      },
      {
        type: "claim",
        data: [
          {
            accountAddress: 1, //提取0.6 USDx
          },
          {
            accountAddress: 2, //return 空或0
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 11,
          },
        ],
      },
      {
        type: "withdraw",
        data: [
          {
            tokenAddress: 1,
            accountAddress: 1,
            amount: 0.5,
          },
        ],
      },
      {
        type: "withdraw",
        data: [
          {
            tokenAddress: 1,
            accountAddress: 1,
            amount: 0.1,
          },
        ],
      },
      {
        type: "withdraw",
        data: [
          {
            tokenAddress: 1,
            accountAddress: 1,
            amount: 0.4,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 110,
          },
        ],
      },
      {
        type: "withdraw",
        data: [
          {
            tokenAddress: 2,
            accountAddress: 2,
            amount: 0.11,
          },
        ],
      },
      {
        type: "withdraw",
        data: [
          {
            tokenAddress: 2,
            accountAddress: 2,
            amount: 0.01,
          },
        ],
      },
      {
        type: "withdraw",
        data: [
          {
            tokenAddress: 2,
            accountAddress: 2,
            amount: 0.09,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 1,
            amount: 0.81,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 151,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 1,
            amount: 0.01,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 1,
            amount: 0.79,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 2,
            amount: 4.3,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 2,
            amount: 0.01,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 200,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 2,
            amount: 4.19,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 3,
            amount: 2.41,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 3,
            amount: 0.01,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 65,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 3,
            amount: 2.39,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 678,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 4,
            amount: 2.41,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 4,
            amount: 0.01,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 98,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 4,
            amount: 2.39,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 852,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 5,
            amount: 0.61,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 5,
            amount: 0.01,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 5,
            amount: 0.59,
          },
        ],
      },
    ],
  },
  //dection[0]-deposit-convert-section[1]-deposit(no convert)-withdraw3-destroy2-claim-deposit(convert)-claim-section[2]-deposit-convert-withdraw6-claim-destroy3
  // X（USDx:1.8）
  // Y（USDx:6.7）
  // Z（USDx:4.8）
  // Q（USDx:2.4）
  // W（USDx:0.6）
  {
    data: [
      {
        type: "deposit",
        // 'times':100,
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
            amount: 4.8,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 96.3,
          },
        ],
      },
      //section[1]
      {
        type: "updateSection",
        // 'times':100,
        data: [
          {
            tokens: [1, 2],
            weight: [1, 3],
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 8,
          },
        ],
      },
      {
        type: "deposit",
        // 'times':100,
        data: [
          {
            tokenAddress: 1,
            accountAddress: 5,
            amount: 0.6,
          },
        ],
      },
      {
        type: "withdraw",
        data: [
          {
            tokenAddress: 3,
            accountAddress: 3,
            amount: 1.3,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 11,
          },
        ],
      },
      {
        type: "withdraw",
        data: [
          {
            tokenAddress: 3,
            accountAddress: 3,
            amount: 0.01,
          },
        ],
      },
      {
        type: "withdraw",
        data: [
          {
            tokenAddress: 3,
            accountAddress: 3,
            amount: 1.19,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 5,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 1,
            amount: 0.1,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 2,
            amount: 0.1,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 672,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 3,
            amount: 0.1,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 60,
          },
        ],
      },
      {
        type: "claim",
        data: [
          {
            accountAddress: 1, //提取0.2 USDx
          },
          {
            accountAddress: 2, //提取2.4 USDx
          },
          {
            accountAddress: 3, //提取2.4 USDx
          },
          {
            accountAddress: 4, //return 空或0
          },
          {
            accountAddress: 5, //return 空或0
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 1000,
          },
        ],
      },
      {
        type: "deposit",
        // 'times':100,
        data: [
          {
            tokenAddress: 2,
            accountAddress: 2,
            amount: 1.9,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 100,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 2000.3,
          },
        ],
      },
      {
        type: "claim",
        data: [
          {
            accountAddress: 1, //提取0.6 USDx
          },
          {
            accountAddress: 2, //return 空或0
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 20,
          },
        ],
      },
      //section[2]
      {
        type: "updateSection",
        // 'times':100,
        data: [
          {
            tokens: [1, 2, 3],
            weight: [0.1, 0.3, 0.3],
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 7,
          },
        ],
      },
      {
        type: "deposit",
        // 'times':100,
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
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 14,
          },
        ],
      },
      {
        type: "withdraw",
        data: [
          {
            tokenAddress: 1,
            accountAddress: 1,
            amount: 0.1,
          },
        ],
      },
      {
        type: "withdraw",
        data: [
          {
            tokenAddress: 1,
            accountAddress: 1,
            amount: 0.7,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 1.4,
          },
        ],
      },
      {
        type: "withdraw",
        data: [
          {
            tokenAddress: 3,
            accountAddress: 3,
            amount: 0.01,
          },
        ],
      },
      {
        type: "withdraw",
        data: [
          {
            tokenAddress: 3,
            accountAddress: 3,
            amount: 0.19,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 2.8,
          },
        ],
      },
      {
        type: "claim",
        data: [
          {
            accountAddress: 1, //提取0.8 USDx
          },
          {
            accountAddress: 2, //提取2.5 USDx
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 1,
            amount: 1.81,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 6.3,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 1,
            amount: 0.01,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 1,
            amount: 1.79,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 56,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 2,
            amount: 6.8,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 11,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 2,
            amount: 0.01,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 2,
            amount: 6.69,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 3,
            amount: 4.81,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 69,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 3,
            amount: 0.01,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 3,
            amount: 4.79,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 89,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 4,
            amount: 2.41,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 4,
            amount: 0.01,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 4,
            amount: 2.39,
          },
        ],
      },
      {
        type: "oneClickMinting",
        data: [
          {
            accountAddress: 1,
            amount: 11.3,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 5,
            amount: 0.61,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 5,
            amount: 0.01,
          },
        ],
      },
      {
        type: "destroy",
        data: [
          {
            accountAddress: 5,
            amount: 0.59,
          },
        ],
      },
    ],
  },
];

describe("test0.3", () => {
  for (let configIndex = 0; configIndex < runConfig.length; configIndex++) {
    it("Config " + configIndex, async () => {
      const accounts = await web3.eth.getAccounts();
      await runner.runConfig(
        collateralNames,
        weightTest,
        runConfig[configIndex],
        configIndex == runConfig.length - 1, // Special checks for last config
        accounts
      );
    });
  }

  it("V2 migration and verify", async () => {
    await runner.runV2Migration();
  });
});
