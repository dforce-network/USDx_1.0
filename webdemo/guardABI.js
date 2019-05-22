var guardABI = [{
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
        "name": "ANY",
        "outputs": [{
            "name": "",
            "type": "bytes32"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xa8542f66"
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
                "name": "src",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "name": "dst",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "name": "sig",
                "type": "bytes32"
            }
        ],
        "name": "LogPermit",
        "type": "event",
        "signature": "0x6f50375045128971c5469d343039ba7b8e30a5b190453737b28bda6f7a306771"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "name": "src",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "name": "dst",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "name": "sig",
                "type": "bytes32"
            }
        ],
        "name": "LogForbid",
        "type": "event",
        "signature": "0x95ba64c95d85e67ac83a0476c4a62ac2cf8ab2d0407545b8c9d79c3eefa62829"
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
                "name": "src_",
                "type": "address"
            },
            {
                "name": "dst_",
                "type": "address"
            },
            {
                "name": "sig",
                "type": "bytes4"
            }
        ],
        "name": "canCall",
        "outputs": [{
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xb7009613"
    },
    {
        "constant": false,
        "inputs": [{
                "name": "src",
                "type": "address"
            },
            {
                "name": "dst",
                "type": "address"
            },
            {
                "name": "sig",
                "type": "bytes32"
            }
        ],
        "name": "permit",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xcbeea68c"
    },
    {
        "constant": false,
        "inputs": [{
                "name": "src",
                "type": "address"
            },
            {
                "name": "dst",
                "type": "address"
            }
        ],
        "name": "permitx",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x20dcfd48"
    },
    {
        "constant": false,
        "inputs": [{
                "name": "src",
                "type": "address"
            },
            {
                "name": "dst",
                "type": "address"
            },
            {
                "name": "sig",
                "type": "bytes32"
            }
        ],
        "name": "forbid",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x2bc3217d"
    },
    {
        "constant": false,
        "inputs": [{
                "name": "src",
                "type": "address"
            },
            {
                "name": "dst",
                "type": "address"
            }
        ],
        "name": "forbidx",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xa7d238f1"
    }
];