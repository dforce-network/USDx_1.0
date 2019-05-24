var engineABI = [{
    "constant": true,
    "inputs": [],
    "name": "dfFunds",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x06c215ac"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "dfToken",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x3a25a1a6"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "dfStore",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x3cefae82"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "dfCol",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x473d18a7"
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
    "inputs": [],
    "name": "usdxToken",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x9798e39e"
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
    "name": "dfPool",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xc4d6a2f2"
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
        "name": "_usdxToken",
        "type": "address"
      },
      {
        "name": "_dfToken",
        "type": "address"
      },
      {
        "name": "_dfStore",
        "type": "address"
      },
      {
        "name": "_dfPool",
        "type": "address"
      },
      {
        "name": "_dfCol",
        "type": "address"
      },
      {
        "name": "_dfFunds",
        "type": "address"
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
    "constant": false,
    "inputs": [{
        "name": "_tokens",
        "type": "address[]"
      },
      {
        "name": "_weight",
        "type": "uint256[]"
      }
    ],
    "name": "updateMintSection",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xbb051654"
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
    "name": "deposit",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x8340f549"
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
    "name": "withdraw",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xd9caed12"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "_depositor",
      "type": "address"
    }],
    "name": "claim",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x1e83409a"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_depositor",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "claim",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xaad3ec96"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_depositor",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "destroy",
    "outputs": [{
      "name": "",
      "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xa24835d1"
  }
];