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
        
        instadapp=new Instadapp();

        vm.stopBroadcast();
    }
}
