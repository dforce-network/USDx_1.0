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
// truffle test .\test\DFEngine_random.js > testDF_random.log
collateralNames = new Array('DAI', 'PAX', 'TUSD', 'USDC');
weightTest = new Array(0.1, 0.3, 0.3, 0.3);
runConfig = [ 
    {
        'times':500, 
        'data':[
            {
                'data':[
                    {}
                ]
            }
        ],      
    },
      
];

require('./DFEngine.js');