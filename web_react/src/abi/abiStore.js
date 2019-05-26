const abiStore = [{
    "constant": true,
    "inputs": [{
      "name": "",
      "type": "uint256"
    }],
    "name": "secList",
    "outputs": [{
        "name": "minted",
        "type": "uint256"
      },
      {
        "name": "burned",
        "type": "uint256"
      },
      {
        "name": "backupIdx",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x344fbe82"
  },
  {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "depositorsBalance",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x664b013c"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "",
      "type": "address"
    }],
    "name": "mintedTokens",
    "outputs": [{
      "name": "",
      "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x7241dfa0"
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
      "type": "address"
    }],
    "name": "mintingTokens",
    "outputs": [{
      "name": "",
      "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x9a4dffd9"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "",
      "type": "address"
    }],
    "name": "lockedBalance",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x9ae697bf"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "",
      "type": "uint256"
    }],
    "name": "secListBackup",
    "outputs": [{
        "name": "minted",
        "type": "uint256"
      },
      {
        "name": "burned",
        "type": "uint256"
      },
      {
        "name": "backupIdx",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xad7138d3"
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
    "inputs": [{
      "name": "",
      "type": "address"
    }],
    "name": "colsBalance",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xc51aa09b"
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
    "constant": true,
    "inputs": [{
      "name": "",
      "type": "address"
    }],
    "name": "tokenBackup",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xd6e14cd2"
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
        "name": "_colIDs",
        "type": "address[]"
      },
      {
        "name": "_weights",
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
        "name": "_colIDs",
        "type": "address[]"
      },
      {
        "indexed": false,
        "name": "_number",
        "type": "uint256[]"
      }
    ],
    "name": "UpdateSection",
    "type": "event",
    "signature": "0x69b498e975f93232bd0bd7fa4fde9063c08e4a452f87f8612fa6777c7951001d"
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
    "inputs": [{
      "name": "_position",
      "type": "uint256"
    }],
    "name": "getSectionMinted",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x8d7bde49"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_position",
        "type": "uint256"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "addSectionMinted",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x40806844"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "_amount",
      "type": "uint256"
    }],
    "name": "addSectionMinted",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xc4c731df"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_position",
        "type": "uint256"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "setSectionMinted",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xee026808"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "_amount",
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
    "name": "getSectionBurned",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xe3cc8414"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "_amount",
      "type": "uint256"
    }],
    "name": "addSectionBurned",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xc58c74c2"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_position",
        "type": "uint256"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "addSectionBurned",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x3e989950"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_position",
        "type": "uint256"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "setSectionBurned",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xad353a97"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "_amount",
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
    "inputs": [{
      "name": "_position",
      "type": "uint256"
    }],
    "name": "getSectionToken",
    "outputs": [{
      "name": "",
      "type": "address[]"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xb811a25f"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "_position",
      "type": "uint256"
    }],
    "name": "getSectionWeight",
    "outputs": [{
      "name": "",
      "type": "uint256[]"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x56cd885e"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "_position",
      "type": "uint256"
    }],
    "name": "getSectionData",
    "outputs": [{
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      },
      {
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
    "signature": "0xd648703c"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "_position",
      "type": "uint256"
    }],
    "name": "getBackupSectionData",
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
    "signature": "0x9a10ddc5"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "_position",
      "type": "uint256"
    }],
    "name": "getBackupSectionIndex",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xffb629be"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_position",
        "type": "uint256"
      },
      {
        "name": "_backupIdx",
        "type": "uint256"
      }
    ],
    "name": "setBackupSectionIndex",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xda1998cc"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_colIDs",
        "type": "address[]"
      },
      {
        "name": "_weight",
        "type": "uint256[]"
      }
    ],
    "name": "setSection",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x3bdfdb53"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_position",
        "type": "uint256"
      },
      {
        "name": "_colIDs",
        "type": "address[]"
      },
      {
        "name": "_weight",
        "type": "uint256[]"
      }
    ],
    "name": "setBackupSection",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x8305f078"
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
    "constant": true,
    "inputs": [{
      "name": "_token",
      "type": "address"
    }],
    "name": "getMintingToken",
    "outputs": [{
      "name": "",
      "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x23165430"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_token",
        "type": "address"
      },
      {
        "name": "_flag",
        "type": "bool"
      }
    ],
    "name": "setMintingToken",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xddd18f2e"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "_token",
      "type": "address"
    }],
    "name": "getMintedToken",
    "outputs": [{
      "name": "",
      "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xd699e472"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_token",
        "type": "address"
      },
      {
        "name": "_flag",
        "type": "bool"
      }
    ],
    "name": "setMintedToken",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x2514867c"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "_token",
      "type": "address"
    }],
    "name": "getBackupToken",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x8a2966c0"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_token",
        "type": "address"
      },
      {
        "name": "_backupToken",
        "type": "address"
      }
    ],
    "name": "setBackupToken",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xf39b75da"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getMintPosition",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x69112246"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getBurnPosition",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x590ee16d"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getTotalMinted",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x0ca1c5c9"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "_amount",
      "type": "uint256"
    }],
    "name": "addTotalMinted",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x27ef91da"
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
    "constant": true,
    "inputs": [],
    "name": "getTotalBurned",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xb55cd04b"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "_amount",
      "type": "uint256"
    }],
    "name": "addTotalBurned",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x93f0f55a"
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
  },
  {
    "constant": true,
    "inputs": [{
      "name": "_tokenID",
      "type": "address"
    }],
    "name": "getTokenBalance",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x3aecd0e3"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_tokenID",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "setTokenBalance",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x4ceb1f13"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "_tokenID",
      "type": "address"
    }],
    "name": "getLockedBalance",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xc4086893"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_tokenID",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "setLockedBalance",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xa4203fe5"
  },
  {
    "constant": true,
    "inputs": [{
        "name": "_depositor",
        "type": "address"
      },
      {
        "name": "_tokenID",
        "type": "address"
      }
    ],
    "name": "getDepositorBalance",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xcec3449a"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_depositor",
        "type": "address"
      },
      {
        "name": "_tokenID",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "setDepositorBalance",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x59168e78"
  }
];

export default abiStore;

