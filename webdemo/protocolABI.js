var protocolABI = [{
    "constant": false,
    "inputs": [],
    "name": "confirmImplChange",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "iDFEngine",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "_newDFEngine",
      "type": "address"
    }],
    "name": "requestImplChange",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "acceptOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
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
    "type": "function"
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
    "type": "function"
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
    "type": "function"
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
    "type": "function"
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
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "_tokenID",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_sender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_balance",
        "type": "uint256"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "_tokenID",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_sender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_balance",
        "type": "uint256"
      }
    ],
    "name": "Withdraw",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "_sender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "Destroy",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "_sender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_balance",
        "type": "uint256"
      }
    ],
    "name": "Claim",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "_msgSender",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_proposedImpl",
        "type": "address"
      }
    ],
    "name": "ImplChangeRequested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{
      "indexed": true,
      "name": "_newImpl",
      "type": "address"
    }],
    "name": "ImplChangeConfirmed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{
      "indexed": true,
      "name": "authority",
      "type": "address"
    }],
    "name": "LogSetAuthority",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{
      "indexed": true,
      "name": "owner",
      "type": "address"
    }],
    "name": "LogSetOwner",
    "type": "event"
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
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_tokenID",
        "type": "address"
      },
      {
        "name": "_feeTokenIdx",
        "type": "uint256"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_tokenID",
        "type": "address"
      },
      {
        "name": "_feeTokenIdx",
        "type": "uint256"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_feeTokenIdx",
        "type": "uint256"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "destroy",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "_feeTokenIdx",
      "type": "uint256"
    }],
    "name": "claim",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "tokenID",
        "type": "address"
      },
      {
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "getUSDXForDeposit",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "getUserMaxToClaim",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "getColMaxClaim",
    "outputs": [{
        "name": "",
        "type": "address[]"
      },
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "getMintingSection",
    "outputs": [{
        "name": "",
        "type": "address[]"
      },
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "getBurningSection",
    "outputs": [{
        "name": "",
        "type": "address[]"
      },
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "getUserWithdrawBalance",
    "outputs": [{
        "name": "",
        "type": "address[]"
      },
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "typeID",
      "type": "uint256"
    }],
    "name": "getPrice",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "typeID",
      "type": "uint256"
    }],
    "name": "getFeeRate",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];