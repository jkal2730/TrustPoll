export const trustPollAbi = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "entranceFee",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "voteDuration",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "registerDuration",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "calPollResult",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getEntranceFee",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getPollPhase",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint8",
                "internalType": "enum TrustPoll.PollPhase"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getPollResult",
        "inputs": [],
        "outputs": [
            {
                "name": "winner",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "votes",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getRegisterDuration",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "i_entranceFee",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "i_voteDuration",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "isAlreadyRegistered",
        "inputs": [
            {
                "name": "candidate",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "register",
        "inputs": [],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "s_isRegistered",
        "inputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "s_votes",
        "inputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "s_winner",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "vote",
        "inputs": [
            {
                "name": "candidate",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "error",
        "name": "AlreadyRegistered",
        "inputs": []
    },
    {
        "type": "error",
        "name": "AlreadyVoted",
        "inputs": []
    },
    {
        "type": "error",
        "name": "CountNotOpen",
        "inputs": []
    },
    {
        "type": "error",
        "name": "IsNotCandidate",
        "inputs": []
    },
    {
        "type": "error",
        "name": "RegisterNotOpen",
        "inputs": []
    },
    {
        "type": "error",
        "name": "SendMoreEth",
        "inputs": []
    },
    {
        "type": "error",
        "name": "VoteNotOpen",
        "inputs": []
    }
]
