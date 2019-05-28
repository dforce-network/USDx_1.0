var protocolABI = [{
    "constant": false,
    "inputs": [],
    "name": "confirmImplChange",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x224a8432"
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
    "type": "function",
    "signature": "0x42a02b18"
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
    "type": "function",
    "signature": "0x48f9e246"
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
    "type": "event",
    "signature": "0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7"
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
    "type": "event",
    "signature": "0xf341246adaac6f497bc2a656f546ab9e182111d630394f0c57c710a59a2cb567"
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
    "type": "event",
    "signature": "0x81325e2a6c442af9d36e4ee9697f38d5f4bf0837ade0f6c411c6a40af7c057ee"
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
    "type": "event",
    "signature": "0x47cee97cb7acd717b3c0aa1435d004cd5b3c8c57d70dbceb4e4458bbd60e39d4"
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
    "type": "event",
    "signature": "0xa4cda21336443f58fb792c9bb28d68a9ffeb44f081daf4b9e25d140424091882"
  },
  {
    "anonymous": false,
    "inputs": [{
      "indexed": true,
      "name": "_newImpl",
      "type": "address"
    }],
    "name": "ImplChangeConfirmed",
    "type": "event",
    "signature": "0xa20a793e95ff06a728b23185902e629b99a8db24d274aeedd1f00d715de8b47d"
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
      },
      {
        "indexed": true,
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "LogSetOwner",
    "type": "event",
    "signature": "0xc66d1d23a5b7baf1f496bb19f580d7b12070ad5a08a758c990db97d961fa33a6"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "owner",
        "type": "address",
        "indexed": true
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true
      }
    ],
    "name": "OwnerUpdate",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "event",
    "signature": "0x343765429aea5a34b3ff6a3785a98a5abb2597aca87bfbb58632c173d585373a",
    "anonymous": false
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
    "type": "function",
    "signature": "0x0efe6a8b"
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
    "type": "function",
    "signature": "0xb5c5f672"
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
    "type": "function",
    "signature": "0xe3a94051"
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
    "type": "function",
    "signature": "0x379607f5"
  }
];