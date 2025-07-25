// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

contract TrustPoll {
    error SendMoreEth();
    error RegisterNotOpen();
    error VoteNotOpen();
    error CountNotOpen();
    error IsNotCandidate();
    error AlreadyVoted();
    error AlreadyRegistered();

    enum PollPhase {
        REGISTER,
        VOTING,
        ENDED
    }

    uint256 private s_startTime;
    uint256 private immutable i_registerDuration;
    uint256 public immutable i_entranceFee;
    uint256 public immutable i_voteDuration;
    uint256[] private results;
    address public s_winner;
    address payable[] private s_candidates;
    bool private resultCalculated;
    PollPhase private s_pollPhase;

    mapping(address => uint256) public s_votes;
    mapping(address => bool) private s_isCandidate;
    mapping(address => bool) private s_hasVoted;

    constructor(
        uint256 entranceFee,
        uint256 voteDuration,
        uint256 registerDuration
    ) {
        i_entranceFee = entranceFee;
        i_voteDuration = voteDuration;
        i_registerDuration = registerDuration;
        s_startTime = block.timestamp;
        s_pollPhase = PollPhase.REGISTER;
    }

    function updatePhase() internal {
        if (
            s_pollPhase == PollPhase.REGISTER &&
            block.timestamp > s_startTime + i_registerDuration
        ) {
            s_pollPhase = PollPhase.VOTING;
        } else if (
            s_pollPhase == PollPhase.VOTING &&
            block.timestamp > s_startTime + i_registerDuration + i_voteDuration
        ) {
            s_pollPhase = PollPhase.ENDED;
        }
    }

    function register() external payable {
        updatePhase();

        if (s_pollPhase != PollPhase.REGISTER) revert RegisterNotOpen();

        if (msg.value < i_entranceFee) revert SendMoreEth();

        if (s_isCandidate[msg.sender]) revert AlreadyRegistered();

        s_isCandidate[msg.sender] = true;
        s_candidates.push(payable(msg.sender));
    }

    function vote(address candidate) external {
        updatePhase();

        if (s_pollPhase != PollPhase.VOTING) revert VoteNotOpen();

        if (!s_isCandidate[candidate]) revert IsNotCandidate();

        if (s_hasVoted[msg.sender]) revert AlreadyVoted();

        s_hasVoted[msg.sender] = true;
        s_votes[candidate]++;
    }

    function calPollResult() external {
        updatePhase();

        if (s_pollPhase != PollPhase.ENDED) revert CountNotOpen();

        uint256 winnerIndex = 0;
        results = new uint256[](s_candidates.length);
        for (uint256 i = 0; i < s_candidates.length; i++) {
            results[i] = s_votes[s_candidates[i]];
            if (results[i] > results[winnerIndex]) winnerIndex = i;
        }
        s_winner = s_candidates[winnerIndex];
        resultCalculated = true;
    }

    function getPollResult()
        external
        view
        returns (address winner, uint256[] memory votes)
    {
        return (s_winner, results);
    }

    function getPollPhase() external view returns (PollPhase) {
        return s_pollPhase;
    }

    function getEntranceFee() external view returns (uint256) {
        return i_entranceFee;
    }

    function getRegisterDuration() external view returns (uint256) {
        return i_registerDuration;
    }
}
