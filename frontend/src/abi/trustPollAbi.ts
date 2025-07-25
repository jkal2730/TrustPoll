export const trustPollAbi = [
    // ───── Constructor ─────
    {
        type: "constructor",
        stateMutability: "nonpayable",
        inputs: [
            { name: "entranceFee", type: "uint256", internalType: "uint256" },
            { name: "voteDuration", type: "uint256", internalType: "uint256" },
            { name: "registerDuration", type: "uint256", internalType: "uint256" }
        ]
    },

    // ───── Public Functions ─────
    {
        type: "function",
        name: "calPollResult",
        stateMutability: "nonpayable",
        inputs: [],
        outputs: []
    },
    {
        type: "function",
        name: "getEntranceFee",
        stateMutability: "view",
        inputs: [],
        outputs: [
            { name: "", type: "uint256", internalType: "uint256" }
        ]
    },
    {
        type: "function",
        name: "getPollPhase",
        stateMutability: "view",
        inputs: [],
        outputs: [
            { name: "", type: "uint8", internalType: "enum TrustPoll.PollPhase" }
        ]
    },
    {
        type: "function",
        name: "getPollResult",
        stateMutability: "view",
        inputs: [],
        outputs: [
            { name: "winner", type: "address", internalType: "address" },
            { name: "votes", type: "uint256[]", internalType: "uint256[]" }
        ]
    },
    {
        type: "function",
        name: "getRegisterDuration",
        stateMutability: "view",
        inputs: [],
        outputs: [
            { name: "", type: "uint256", internalType: "uint256" }
        ]
    },
    {
        type: "function",
        name: "i_entranceFee",
        stateMutability: "view",
        inputs: [],
        outputs: [
            { name: "", type: "uint256", internalType: "uint256" }
        ]
    },
    {
        type: "function",
        name: "i_voteDuration",
        stateMutability: "view",
        inputs: [],
        outputs: [
            { name: "", type: "uint256", internalType: "uint256" }
        ]
    },
    {
        type: "function",
        name: "register",
        stateMutability: "payable",
        inputs: [],
        outputs: []
    },
    {
        type: "function",
        name: "s_votes",
        stateMutability: "view",
        inputs: [
            { name: "", type: "address", internalType: "address" }
        ],
        outputs: [
            { name: "", type: "uint256", internalType: "uint256" }
        ]
    },
    {
        type: "function",
        name: "s_winner",
        stateMutability: "view",
        inputs: [],
        outputs: [
            { name: "", type: "address", internalType: "address" }
        ]
    },
    {
        type: "function",
        name: "vote",
        stateMutability: "nonpayable",
        inputs: [
            { name: "candidate", type: "address", internalType: "address" }
        ],
        outputs: []
    },

    // ───── Custom Errors ─────
    { type: "error", name: "AlreadyRegistered", inputs: [] },
    { type: "error", name: "AlreadyVoted", inputs: [] },
    { type: "error", name: "CountNotOpen", inputs: [] },
    { type: "error", name: "IsNotCandidate", inputs: [] },
    { type: "error", name: "RegisterNotOpen", inputs: [] },
    { type: "error", name: "SendMoreEth", inputs: [] },
    { type: "error", name: "VoteNotOpen", inputs: [] }
];

