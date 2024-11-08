// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Instadapp} from "../src/Instadapp.sol";
import {Instken} from "../src/Instken.sol";


contract Counter is Script {
    Instadapp instadapp;
    Instken instken;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        instadapp = new Instadapp();

        vm.stopBroadcast();
    }
}
