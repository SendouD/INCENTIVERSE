// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Instadapp} from "../src/Instadapp.sol";
import {Instken} from "../src/Instken.sol";
import {MyGovernor} from "../src/MyGovernor.sol";
import {GovToken} from "../src/GovToken.sol";
import {TimeLock} from "../src/TimeLock.sol";

contract Counter is Script {
    Instadapp instadapp;
    Instken instken;
    GovToken token;
    TimeLock timelock;
    MyGovernor governor;

    uint256 public constant MIN_DELAY = 3600; // 1 hour - after a vote passes, you have 1 hour before you can enact
    uint256 public constant QUORUM_PERCENTAGE = 4; // Need 4% of voters to pass
    uint256 public constant VOTING_PERIOD = 50400; // This is how long voting lasts
    uint256 public constant VOTING_DELAY = 1;

    address[] proposers;
    address[] executors;

    bytes[] functionCalls;
    address[] addressesToCall;
    uint256[] values;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        instadapp = new Instadapp();
        token = new GovToken();
        timelock = new TimeLock(MIN_DELAY, proposers, executors);
        governor = new MyGovernor(token, timelock);
        bytes32 proposerRole = timelock.PROPOSER_ROLE();
        bytes32 executorRole = timelock.EXECUTOR_ROLE();
        bytes32 adminRole = timelock.TIMELOCK_ADMIN_ROLE();
        timelock.grantRole(proposerRole, address(governor));
        timelock.grantRole(executorRole, address(0));
        timelock.grantRole(executorRole, address(governor));
        timelock.revokeRole(adminRole, msg.sender);
        instadapp=new Instadapp();
        instadapp.transferOwnership(address(timelock));

        vm.stopBroadcast();
    }
}
