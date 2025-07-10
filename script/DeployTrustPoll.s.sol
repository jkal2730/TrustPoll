// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {TrustPoll} from "../src/TrustPoll.sol";

contract DeployTrustPoll is Script {
    uint256 entranceFee = 0.01 ether;
    uint256 registerDuration = 2 days;
    uint256 voteDuration = 1 days;

    function run() external returns (TrustPoll) {
        vm.startBroadcast();
        TrustPoll trustPoll = new TrustPoll(entranceFee, voteDuration, registerDuration);
        vm.stopBroadcast();
        return trustPoll;
    }
}
