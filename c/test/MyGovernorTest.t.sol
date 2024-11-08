// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {MyGovernor} from "../src/MyGovernor.sol";
import {GovToken} from "../src/GovToken.sol";
import {TimeLock} from "../src/TimeLock.sol";
import {Box} from "../src/Box.sol";
import {console} from "forge-std/console.sol";
import {Instadapp} from "../src/Instadapp.sol";
contract MyGovernorTest is Test {
    GovToken token;
    TimeLock timelock;
    MyGovernor governor;
    Box box;
    Instadapp instadapp;

    uint256 public constant MIN_DELAY = 3600; // 1 hour - after a vote passes, you have 1 hour before you can enact
    uint256 public constant QUORUM_PERCENTAGE = 4; // Need 4% of voters to pass
    uint256 public constant VOTING_PERIOD = 50400; // This is how long voting lasts
    uint256 public constant VOTING_DELAY = 1; // How many blocks till a proposal vote becomes active

    address[] proposers;
    address[] executors;

    bytes[] functionCalls;
    address[] addressesToCall;
    uint256[] values;

    address public constant VOTER = address(1);

    function setUp() public {
        token = new GovToken();
        token.mint(VOTER, 100e18);
        vm.prank(VOTER);
        token.delegate(VOTER);
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
        
    }

    function testCantUpdateBoxWithoutGovernance() public {
        vm.expectRevert();
        instadapp.setRewardRates(4, 5, 6);
    }

    function testGovernanceUpdatesBox() public {
    uint256  rewardPerLike = 4;   
   uint256  rewardPerComment = 5; 
    uint256  rewardPerShare = 6;

        string memory description = "I want more likes rewards" ;
        bytes memory encodedFunctionCall = abi.encodeWithSignature("setRewardRates(uint256,uint256,uint256)",rewardPerLike,rewardPerComment,rewardPerShare);
        addressesToCall.push(address(instadapp));
        values.push(0);
        functionCalls.push(encodedFunctionCall);
        // 1. Propose to the DAO
        uint256 proposalId = governor.propose(addressesToCall, values, functionCalls, description);

        console.log("Proposal State:", uint256(governor.state(proposalId)));
        // governor.proposalSnapshot(proposalId)
        // governor.proposalDeadline(proposalId)

        vm.warp(block.timestamp + VOTING_DELAY + 1);
        vm.roll(block.number + VOTING_DELAY + 1);

        console.log("Proposal State:", uint256(governor.state(proposalId)));

        // 2. Vote
        string memory reason = "I too want more rewards a do da cha cha";
        // 0 = Against, 1 = For, 2 = Abstain for this example
        uint8 voteWay = 1;
        vm.prank(VOTER);
        governor.castVoteWithReason(proposalId, voteWay, reason);

        vm.warp(block.timestamp + VOTING_PERIOD + 1);
        vm.roll(block.number + VOTING_PERIOD + 1);

        console.log("Proposal State:", uint256(governor.state(proposalId)));
        console.log("instadapp",address(instadapp));

        // 3. Queue
        bytes32 descriptionHash = keccak256(abi.encodePacked(description));
        governor.queue(addressesToCall, values, functionCalls, descriptionHash);
        vm.roll(block.number + MIN_DELAY + 1);
        vm.warp(block.timestamp + MIN_DELAY + 1);
        console.log("Proposal State:", uint256(governor.state(proposalId)));
        console.log("proposeId", proposalId);
    
        // 4. Execute
        governor.execute(addressesToCall, values, functionCalls, descriptionHash);
        console.log("Test setup completed");
        console.log(instadapp.rewardPerLike());
        console.log(instadapp.rewardPerComment());
        console.log(instadapp.rewardPerShare());

        assert(instadapp.rewardPerLike() == rewardPerLike);
    }
}