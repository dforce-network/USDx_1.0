/* global artifacts, contract, it, assert */
/* eslint-disable prefer-reflect */
//truffle test .\test\DFUpdateEngine.js > testUpdateEngine.log
collateralNames = new Array('DAI', 'PAX', 'TUSD', 'USDC');
weightTest = new Array(0.1, 0.3, 0.3, 0.3);
runConfig = [ 
    {
        'data':[
                {
                'type':'deposit',
                'data':[
                    {
                        'tokenAddress':1,
                        'accountAddress':1,
                        'amount':1.2,
                    },
                    {
                        'tokenAddress':2,
                        'accountAddress':2,
                        'amount':2.4,
                    },
                    {
                        'tokenAddress':3,
                        'accountAddress':3,
                        'amount':3.6,
                    },
                    {
                        'tokenAddress':4,
                        'accountAddress':4,
                        'amount':0.3, 
                    },
                ]
                },
                            
                {
                    'type':'claim',
                    // 'times':100,
                    'data':[
                        {
                            'accountAddress':1,
                        },
                        {
                            'accountAddress':4,
                        },
                    ]
                },                
                {
                    'type':'deposit',
                    // 'times':100,
                    'data':[
                        {
                            'tokenAddress':4,
                            'accountAddress':2,
                            'amount':0.6,
                        },
                    ]
                },          
                {
                'type':'updateSection',
                // 'times':100,
                'data':[
                    {
                        'tokens':[0, 2, 3, 4],
                        'weight':[0.1, 0.3, 0.3, 0.3],
                    },
                    ]
                },
                {
                'type':'deposit',
                // 'times':100,
                'data':[
                        {
                            'tokenAddress':4,
                            'accountAddress':2,
                            'amount':0.2,
                        },
                        {
                            'tokenAddress':4,
                            'accountAddress':5,
                            'amount':0.2,
                        },
                    ]
                }, 
                {
                    'type':'changeEngine',
                    'data':[
                        {},
                    ]
                    },
                {
                'type':'claim',
                'data':[
                    {
                        'accountAddress':1,
                    },
                    {
                        'accountAddress':2,
                    },
                    {
                        'accountAddress':3,
                    }
                ]
                },
                {
                    'type':'destroy',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':0.3,
                        }
                    ]
                },
                {
                    'type':'destroy',
                    'data':[
                        {
                            'accountAddress':2,
                            'amount':1.6,
                        }
                    ]
                },
                {
                    'type':'destroy',
                    'data':[
                        {
                            'accountAddress':3,
                            'amount':1.2,
                        }
                    ]
                }, 
                {
                    'type':'destroy',
                    'data':[
                        {
                            'accountAddress':5,
                            'amount':0.1,
                        }
                    ]
                },       
            ]
            },
      ];
      
    require('./DFEngine.js');





