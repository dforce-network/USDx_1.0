var storeABI = [{
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "collateralQueue",
    "outputs": [{
        "name": "depositor",
        "type": "address"
      },
      {
        "name": "total",
        "type": "uint256"
      },
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x59fed907"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "acceptOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x79ba5097"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "authority_",
      "type": "address"
    }],
    "name": "setAuthority",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x7a9e5e4b"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x8da5cb5b"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "",
      "type": "uint256"
    }],
    "name": "sectionInfoList",
    "outputs": [{
        "name": "minted",
        "type": "uint256"
      },
      {
        "name": "burned",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x92e697a8"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "authority",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xbf7e214f"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "newOwner",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xd4ee1d90"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "newOwner_",
      "type": "address"
    }],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xf2fde38b"
  },
  {
    "inputs": [{
        "name": "_collateral",
        "type": "address[]"
      },
      {
        "name": "_weight",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor",
    "signature": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "_collateral",
        "type": "address[]"
      },
      {
        "indexed": false,
        "name": "number",
        "type": "uint256[]"
      }
    ],
    "name": "UpdateTokens",
    "type": "event",
    "signature": "0x6d86ff36b343fae45d647d6db3960802d5788c497ee9d0608d29ce5d372277e9"
  },
  {
    "anonymous": false,
    "inputs": [{
      "indexed": true,
      "name": "authority",
      "type": "address"
    }],
    "name": "LogSetAuthority",
    "type": "event",
    "signature": "0x1abebea81bfa2637f28358c371278fb15ede7ea8dd28d2e03b112ff6d936ada4"
  },
  {
    "anonymous": false,
    "inputs": [{
      "indexed": true,
      "name": "owner",
      "type": "address"
    }],
    "name": "LogSetOwner",
    "type": "event",
    "signature": "0xce241d7ca1f669fee44b6fc00b8eba2df3bb514eed0f6f668f8f89096e81ed94"
  },
  {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnerUpdate",
    "type": "event",
    "signature": "0x343765429aea5a34b3ff6a3785a98a5abb2597aca87bfbb58632c173d585373a"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "mintSectionPosition",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x1be5a60f"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "burnSectionPosition",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xd5802f39"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "_token",
      "type": "address"
    }],
    "name": "tokenPool",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x8238e9da"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalMinted",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xa2309ff8"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalBurned",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xd89135cd"
  },
  {
    "constant": true,
    "inputs": [{
        "name": "_token",
        "type": "address"
      },
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOfTokens",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x72cd383a"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_collateral",
        "type": "address[]"
      },
      {
        "name": "_weight",
        "type": "uint256[]"
      }
    ],
    "name": "setSectionInfo",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xffbfb7c6"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "_position",
      "type": "uint256"
    }],
    "name": "sectionToken",
    "outputs": [{
      "name": "",
      "type": "address[]"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xdd2d3205"
  },
  {
    "constant": true,
    "inputs": [{
        "name": "_position",
        "type": "uint256"
      },
      {
        "name": "_collateral",
        "type": "address"
      }
    ],
    "name": "collateralWeight",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xfc3c96a4"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "_newMinted",
      "type": "uint256"
    }],
    "name": "setSectionMinted",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x6dbd4a77"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "_position",
      "type": "uint256"
    }],
    "name": "sectionMinted",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xf2c93d92"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "_newBurned",
      "type": "uint256"
    }],
    "name": "setSectionBurned",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x151b7b86"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "sectionBurned",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x8d0c722a"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "burnSectionMoveon",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xe8974efc"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_token",
        "type": "address"
      },
      {
        "name": "_depositor",
        "type": "address"
      },
      {
        "name": "_total",
        "type": "uint256"
      }
    ],
    "name": "pushCollateralQueue",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xf571dbe0"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_token",
        "type": "address"
      },
      {
        "name": "_length",
        "type": "uint256"
      }
    ],
    "name": "popCollateralQueue",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x51008104"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "_token",
      "type": "address"
    }],
    "name": "headCollateralQueue",
    "outputs": [{
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x3b9b00fe"
  },
  {
    "constant": true,
    "inputs": [{
        "name": "_token",
        "type": "address"
      },
      {
        "name": "_consume",
        "type": "uint256"
      }
    ],
    "name": "getCollateralQueue",
    "outputs": [{
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "address[]"
      },
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x99228493"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_token",
        "type": "address"
      },
      {
        "name": "_depositor",
        "type": "address"
      },
      {
        "name": "_balance",
        "type": "uint256"
      }
    ],
    "name": "updateCollateralQueue",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x14ad8987"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_token",
        "type": "address"
      },
      {
        "name": "_depositor",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "takeOffCollateralQueue",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xd6627dbf"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_token",
        "type": "address"
      },
      {
        "name": "_newSupply",
        "type": "uint256"
      }
    ],
    "name": "setTokenPool",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x3d982951"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_token",
        "type": "address"
      },
      {
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "setBalanceOfTokens",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x7c7bdb96"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "_amount",
      "type": "uint256"
    }],
    "name": "setTotalMinted",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x16dbf906"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "_amount",
      "type": "uint256"
    }],
    "name": "setTotalBurned",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x553b3d29"
  }
];