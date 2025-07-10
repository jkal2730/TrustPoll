// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {TrustPoll} from "../../src/TrustPoll.sol";
import {DeployTrustPoll} from "../../script/DeployTrustPoll.s.sol";

contract TrustPollTest is Test {
    TrustPoll public trustPoll;

    uint256 entranceFee;
    uint256 registerDuration;

    address CANDIDATE = makeAddr("CANDIDATE");
    address VOTER = makeAddr("VOTER");
    address NON_CANDIDATE = makeAddr("NON_CANDIDATE");

    uint256 constant STARTING_BALANCE = 10 ether;

    function setUp() public {
        DeployTrustPoll deployer = new DeployTrustPoll();
        trustPoll = deployer.run();
        vm.deal(CANDIDATE, STARTING_BALANCE);

        entranceFee = trustPoll.getEntranceFee();
        registerDuration = trustPoll.getRegisterDuration();
    }

    function testInitialiedPollPhase() public view {
        assert(trustPoll.getPollPhase() == TrustPoll.PollPhase.REGISTER);
    }

    function testPollRevertsWhenYouDontPayEnoughEth() public {
        vm.prank(CANDIDATE);
        vm.expectRevert(TrustPoll.SendMoreEth.selector);
        trustPoll.participate();
    }

    function testPollRevertsAlreadyRegistered() public {
        vm.prank(CANDIDATE);
        trustPoll.participate{value: entranceFee}();

        vm.expectRevert(TrustPoll.AlreadyRegistered.selector);
        vm.prank(CANDIDATE);
        trustPoll.participate{value: entranceFee}();
    }

    function testPollRevertsWhenVoteStarted() public {
        vm.prank(CANDIDATE);
        trustPoll.participate{value: entranceFee}();

        vm.warp(block.timestamp + registerDuration + 1);

        vm.expectRevert(TrustPoll.RegisterNotOpen.selector);
        vm.prank(CANDIDATE);
        trustPoll.participate{value: entranceFee}();
    }

    function testPollRevertsWhenVoteNotOpen() public {
        vm.prank(CANDIDATE);
        trustPoll.participate{value: entranceFee}();

        vm.expectRevert(TrustPoll.VoteNotOpen.selector);
        vm.prank(VOTER);
        trustPoll.vote(CANDIDATE);
    }

    function testPollRevertsWhenVoteToNonCandidate() public {
        vm.prank(CANDIDATE);
        trustPoll.participate{value: entranceFee}();

        vm.warp(block.timestamp + registerDuration + 1);

        vm.expectRevert(TrustPoll.IsNotCandidate.selector);
        vm.prank(VOTER);
        trustPoll.vote(NON_CANDIDATE);
    }

    function testPollRevertsWhenAlreadyVoted() public {
        vm.prank(CANDIDATE);
        trustPoll.participate{value: entranceFee}();

        vm.warp(block.timestamp + registerDuration + 1);

        vm.prank(VOTER);
        trustPoll.vote(CANDIDATE);

        vm.expectRevert(TrustPoll.AlreadyVoted.selector);
        vm.prank(VOTER);
        trustPoll.vote(CANDIDATE);
    }

    function testPollRevertsWhenCountNotOpen() public {
        vm.prank(CANDIDATE);
        trustPoll.participate{value: entranceFee}();

        vm.warp(block.timestamp + registerDuration + 1);

        vm.prank(VOTER);
        trustPoll.vote(CANDIDATE);

        vm.expectRevert(TrustPoll.CountNotOpen.selector);
        trustPoll.calPollResult();
    }
}
