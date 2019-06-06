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
// truffle test .\test\test0.1.js > test0.1.log
collateralNames = new Array('DAI', 'PAX', 'TUSD', 'USDC');
weightTest = new Array(100, 200, 300, 400);
runConfig = [
    // deposit-pool-claim-withdraw
            {
                'data':[
            //deposit-pool
                {
                    'type':'deposit',
                    // 'times':100,
                    'data':[
                        {
                            'tokenAddress':1,
                            'accountAddress':1,
                            'amount':100,
                        },
                        {
                            'tokenAddress':2,
                            'accountAddress':2,
                            'amount':200,
                        },
                        {
                            'tokenAddress':3,
                            'accountAddress':3,
                            'amount':300,
                        },
                        {
                            'tokenAddress':4,
                            'accountAddress':4,
                            'amount':299,
                        },
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1000,
                        }
                    ]
                },
            //deposit-claim 
                {
                    'type':'claim',
                    'data':[
                        {
                        'accountAddress':1
                        },
                        {
                        'accountAddress':2
                        },
                        {
                        'accountAddress':3
                        },
                        {
                        'accountAddress':4
                        },
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1001,
                        }
                    ]
                },
            //deposit-withdraw               
                {
                    'type':'withdraw',
                    'data':[
                        {
                            'tokenAddress':1,
                            'accountAddress':1,
                            'amount':1,
                        }
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1800,
                        }
                    ]
                },
            ],
            },

    //deposit-convert-destroy-deposit-withdraw-claim 
            {               
                'data':[
                    {
                        'type':'deposit',
                        // 'times':100,
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':100,
                            },
                            {
                                'tokenAddress':2,
                                'accountAddress':2,
                                'amount':200,
                            },
                            {
                                'tokenAddress':3,
                                'accountAddress':3,
                                'amount':300,
                            },
                            {
                                'tokenAddress':4,
                                'accountAddress':4,
                                'amount':400,
                            },
                        ]
                    }, 
                    {
                        'type':'oneClickMinting',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':1000,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':1,
                            }
                        ]
                    },
                    {
                        'type':'oneClickMinting',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':2000,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':4,
                                'amount':1,
                            }
                        ]
                    },
                    {
                        'type':'oneClickMinting',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':2000,
                            }
                        ]
                    },                  
                    {
                        'type':'deposit',
                        // 'times':100,
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':5,
                                'amount':50,
                            },
                        ]
                    },
                    {
                        'type':'oneClickMinting',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':1560,
                            }
                        ]
                    },              
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':1,
                            }
                        ]
                    },
                    {
                        'type':'oneClickMinting',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':1200,
                            }
                        ]
                    },
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':50,
                            }
                        ]
                    }, 
                    {
                        'type':'oneClickMinting',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':3000,
                            }
                        ]
                    },              
                    {
                        'type':'claim',
                        'data':[
                            {
                            'accountAddress':1
                            },
                            {
                            'accountAddress':2
                            },
                            {
                            'accountAddress':3
                            },
                            {
                            'accountAddress':4
                            },
                        ]
                    },
                ],
            },

    //deposit-convert-section[1]-deposit-withdraw3-destroy3              
            {
            'data':[
                    {
                        'type':'deposit',
                        // 'times':100,
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':100,
                            },
                            {
                                'tokenAddress':2,
                                'accountAddress':2,
                                'amount':200,
                            },
                            {
                                'tokenAddress':3,
                                'accountAddress':3,
                                'amount':300,
                            },
                            {
                                'tokenAddress':4,
                                'accountAddress':4,
                                'amount':400,
                            },
                        ]
                    },
                    {
                        'type':'oneClickMinting',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':1000,
                            }
                        ]
                    },
                //section[1]                
                    {
                        'type':'updateSection',
                        // 'times':100,
                        'data':[
                            {
                                'tokens':[1, 2],
                                'weight':[100, 200],
                            },
                        ]
                    },
                    {
                        'type':'oneClickMinting',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':1000,
                            }
                        ]
                    },                
                    {
                        'type':'deposit',
                        // 'times':100,
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':5,
                                'amount':100,
                            }
                        ]
                    },
                    {
                        'type':'oneClickMinting',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':600,
                            }
                        ]
                    },
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':1,
                            }
                        ]
                    },
                    {
                        'type':'oneClickMinting',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':900,
                            }
                        ]
                    },
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':100,
                            }
                        ]
                    },
                    {
                        'type':'oneClickMinting',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':300,
                            }
                        ]
                    },
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':99,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':5,
                                'amount':1,
                            }
                        ]
                    },
                    {
                        'type':'oneClickMinting',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':600,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':100,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':99,
                            }
                        ]
                    },
                ], 
            },

    //deposit-convert-deposit-withdraw3  
            {
                'data':[
                    {
                        'type':'deposit',
                        // 'times':100,
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':100,
                            },
                            {
                                'tokenAddress':2,
                                'accountAddress':2,
                                'amount':200,
                            },
                            {
                                'tokenAddress':3,
                                'accountAddress':3,
                                'amount':300,
                            },
                            {
                                'tokenAddress':4,
                                'accountAddress':4,
                                'amount':400,
                            },
                        ]
                    },
                    {
                        'type':'oneClickMinting',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':1000,
                            }
                        ]
                    },               
                    {
                        'type':'deposit',
                        // 'times':100,
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':5,
                                'amount':100,
                            }
                        ]
                    },
                    {
                        'type':'oneClickMinting',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':1000,
                            }
                        ]
                    },
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':1,
                            }
                        ]
                    },
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':100,
                            }
                        ]
                    },
                    {
                        'type':'oneClickMinting',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':600,
                            }
                        ]
                    },
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':99,
                            }
                        ]
                    },
                ],             
            },

    //deposit-convert-section[2]-deposit-withdraw-destroy3              
            {
                'data':[
                {
                    'type':'deposit',
                    // 'times':100,
                    'data':[
                        {
                            'tokenAddress':1,
                            'accountAddress':1,
                            'amount':100,
                        },
                        {
                            'tokenAddress':2,
                            'accountAddress':2,
                            'amount':200,
                        },
                        {
                            'tokenAddress':3,
                            'accountAddress':3,
                            'amount':300,
                        },
                        {
                            'tokenAddress':4,
                            'accountAddress':4,
                            'amount':400,
                        },
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1000,
                        }
                    ]
                },              
                {
                    'type':'updateSection',
                    // 'times':100,
                    'data':[
                        {
                            'tokens':[1],
                            'weight':[50],
                        },
                    ]
                }, 
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1000,
                        }
                    ]
                },               
                {
                    'type':'deposit',
                    // 'times':100,
                    'data':[
                        {
                            'tokenAddress':1,
                            'accountAddress':1,
                            'amount':50,
                        }
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1001,
                        }
                    ]
                },
                {
                    'type':'withdraw',
                    'data':[
                        {
                            'tokenAddress':1,
                            'accountAddress':1,
                            'amount':1,
                        }
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1300,
                        }
                    ]
                },
                {
                    'type':'destroy',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1,
                        }
                    ]
                },
                {
                    'type':'destroy',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':150,
                        }
                    ]
                },
                {
                    'type':'destroy',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':149,
                        }
                    ]
                },
            ],                        
            },

    //deposit-section[1]-deposit-section[2]-withdraw-destroy
    //section[0]user4 mint 400USDx
    //section[1]user2 mint 400USDx
    //section[2]user1 mint 400USdx               
            {
                'data':[
                {
                    'type':'deposit',
                    // 'times':100,
                    'data':[
                        {
                            'tokenAddress':1,
                            'accountAddress':1,
                            'amount':120,
                        },
                        {
                            'tokenAddress':2,
                            'accountAddress':2,
                            'amount':240,
                        },
                        {
                            'tokenAddress':3,
                            'accountAddress':3,
                            'amount':360,
                        },
                        {
                            'tokenAddress':4,
                            'accountAddress':4,
                            'amount':480,
                        },
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1000,
                        }
                    ]
                },
                //section[1]                
                {
                    'type':'updateSection',
                    // 'times':100,
                    'data':[
                        {
                            'tokens':[1, 2],
                            'weight':[100, 200],
                        },
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':300,
                        }
                    ]
                }, 
                {
                    'type':'deposit',
                    // 'times':100,
                    'data':[
                        {
                            'tokenAddress':1,
                            'accountAddress':1,
                            'amount':200,
                        },
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1000,
                        }
                    ]
                },
                {
                    'type':'deposit',
                    // 'times':100,
                    'data':[
                        {
                            'tokenAddress':2,
                            'accountAddress':2,
                            'amount':300,
                        },
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':600,
                        }
                    ]
                },
                //section[2]   
                {
                    'type':'updateSection',
                    // 'times':100,
                    'data':[
                        {
                            'tokens':[1],
                            'weight':[100],
                        },
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1000,
                        }
                    ]
                },
                {
                    'type':'deposit',
                    // 'times':100,
                    'data':[
                        {
                            'tokenAddress':1,
                            'accountAddress':1,
                            'amount':150,
                        },
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':400,
                        }
                    ]
                },
                //withdraw
                {
                    'type':'withdraw',
                    'data':[
                        {
                            'tokenAddress':1,
                            'accountAddress':1,
                            'amount':1,
                        }
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':401,
                        }
                    ]
                },
                                {
                    'type':'withdraw',
                    'data':[
                        {
                            'tokenAddress':1,
                            'accountAddress':1,
                            'amount':70,
                        }
                    ]
                },
                {
                    'type':'withdraw',
                    'data':[
                        {
                            'tokenAddress':1,
                            'accountAddress':1,
                            'amount':69,
                        }
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':300,
                        }
                    ]
                },
                {
                    'type':'withdraw',
                    'data':[
                        {
                            'tokenAddress':2,
                            'accountAddress':2,
                            'amount':1,
                        }
                    ]
                },
                {
                    'type':'withdraw',
                    'data':[
                        {
                            'tokenAddress':1,
                            'accountAddress':1,
                            'amount':140,
                        }
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1000,
                        }
                    ]
                },
                {
                    'type':'withdraw',
                    'data':[
                        {
                            'tokenAddress':1,
                            'accountAddress':1,
                            'amount':139,
                        }
                    ]
                },
                {
                    'type':'withdraw',
                    'data':[
                        {
                            'tokenAddress':3,
                            'accountAddress':3,
                            'amount':1,
                        }
                    ]
                },
                {
                    'type':'withdraw',
                    'data':[
                        {
                            'tokenAddress':3,
                            'accountAddress':3,
                            'amount':60,
                        }
                    ]
                },
                {
                    'type':'withdraw',
                    'data':[
                        {
                            'tokenAddress':3,
                            'accountAddress':3,
                            'amount':59,
                        }
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1000,
                        }
                    ]
                },
                {
                    'type':'withdraw',
                    'data':[
                        {
                            'tokenAddress':4,
                            'accountAddress':4,
                            'amount':1,
                        }
                    ]
                },
                {
                    'type':'withdraw',
                    'data':[
                        {
                            'tokenAddress':4,
                            'accountAddress':4,
                            'amount':80,
                        }
                    ]
                },
                {
                    'type':'withdraw',
                    'data':[
                        {
                            'tokenAddress':3,
                            'accountAddress':3,
                            'amount':79,
                        }
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1000,
                        }
                    ]
                },
                //destroy
                {
                    'type':'destroy',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1,
                        }
                    ]
                },
                {
                    'type':'destroy',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':270,
                        }
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1000,
                        }
                    ]
                },
                {
                    'type':'destroy',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':269,
                        }
                    ]
                },
                {
                    'type':'destroy',
                    'data':[
                        {
                            'accountAddress':2,
                            'amount':1,
                        }
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1000,
                        }
                    ]
                },
                {
                    'type':'destroy',
                    'data':[
                        {
                            'accountAddress':2,
                            'amount':400,
                        }
                    ]
                },
                {
                    'type':'destroy',
                    'data':[
                        {
                            'accountAddress':2,
                            'amount':399,
                        }
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1000,
                        }
                    ]
                },
                {
                    'type':'destroy',
                    'data':[
                        {
                            'accountAddress':4,
                            'amount':1,
                        }
                    ]
                },
                {
                    'type':'destroy',
                    'data':[
                        {
                            'accountAddress':4,
                            'amount':400,
                        }
                    ]
                },
                {
                    'type':'oneClickMinting',
                    'data':[
                        {
                            'accountAddress':1,
                            'amount':1000,
                        }
                    ]
                },
                {
                    'type':'destroy',
                    'data':[
                        {
                            'accountAddress':4,
                            'amount':397,
                        }
                    ]
                },
            ],          
            }

        ];
    
require('./DFEngine.js');