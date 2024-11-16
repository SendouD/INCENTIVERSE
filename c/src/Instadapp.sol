// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Instken.sol";
import {console} from "forge-std/console.sol";

contract Instadapp is Ownable {
    uint256 public count = 0;
    Instken private tokenContract;
   
    constructor() {
        tokenContract = new Instken();
    }

    struct Content {
        uint256 contentID;
        address account;
        string contentHash;
        uint256 likes;
        uint256 dislikes;
        uint256 comments;
        uint256 shares;
    }

    mapping(uint256 => Content) public contentdetails;
    mapping (uint256=>mapping(address=>bool)) private checklikes;
    mapping (uint256=>mapping(address=>bool)) private checkdislikes;
    // Reward rates (in tokens) for each engagement
    uint256 public rewardPerLike = 1;    
    uint256 public rewardPerComment = 2; 

    // Events for content and engagement
    event ContentAdded(uint256 indexed contentId, address indexed account, string contentHash);
    event ContentLiked(uint256 indexed contentId, uint256 totalLikes);
    event ContentDisliked(uint256 indexed contentId, uint256 totalDislikes);
    event ContentCommented(uint256 indexed contentId, uint256 totalComments);
    event ContentShared(uint256 indexed contentId, uint256 totalShares);
    event RewardRatesSet(uint256 likeReward, uint256 commentReward);


    modifier checkrewardsprovided(uint256 contentId){
        require(checklikes[contentId][msg.sender]==false,"you already liked");
        require(checkdislikes[contentId][msg.sender]==false,"you already disliked");
        _;
    }

    // Add new content
    function addContent(string memory contentHash) public {
          Content memory newcontent = Content({
            contentID: count,
            contentHash: contentHash,
            account: msg.sender,
            likes: 0,
            dislikes: 0,
            comments: 0,
            shares: 0
        });
		contentdetails[count] = newcontent;

        // Emit the event for new content
        emit ContentAdded(count, msg.sender, contentHash);

        count++; // Increment the count for the next content
    }
      function tokenbalance() public view  returns(uint256){
        console.log(msg.sender);
        console.log("token balance",tokenContract.balanceOf(msg.sender));
        return tokenContract.balanceOf(msg.sender);

    }

    // Function to like content and reward the creator
    function likeContent(uint256 contentId) checkrewardsprovided(contentId) public {
        checklikes[contentId][msg.sender]=true;
        Content storage content = contentdetails[contentId];
        content.likes+=1;

        // Reward the content creator
        console.log(content.account);
        _rewardCreator(content.account, rewardPerLike);

        // Emit the event for likes update
        emit ContentLiked(contentId, content.likes);
    }

    function dislikeContent(uint256 contentId) checkrewardsprovided(contentId) public {
        checkdislikes[contentId][msg.sender]=true;
        Content storage content = contentdetails[contentId];
        content.dislikes+=1;

        emit ContentDisliked(contentId, content.dislikes);
    }

    // Function to comment on content and reward the creator
    function commentContent(uint256 contentId) public {
        Content storage content = contentdetails[contentId];
        content.comments += 1;

        // Reward the content creator
        _rewardCreator(content.account, rewardPerComment);

        // Emit the event for comments update
        emit ContentCommented(contentId, content.comments);
    }

    function getAllContent() public view returns (Content[] memory) {
        Content[] memory allContent = new Content[](count);
        for (uint256 i = 0; i < count; i++) {
            allContent[i] = contentdetails[i];
        }
        return allContent;
    }


    // Internal function to reward the creator with tokens
    function _rewardCreator(address creator, uint256 rewardAmount) internal {
       tokenContract.mint(creator, rewardAmount);
    }

    // This function now allows the governor contract to set reward rates
    function setRewardRates(uint256 _likeReward, uint256 _commentReward) public onlyOwner {
        rewardPerLike = _likeReward;
        rewardPerComment = _commentReward;
        emit RewardRatesSet(_likeReward, _commentReward);
    }
        function getrewardPerLike() external view returns (uint256) {
        return rewardPerLike;
    }
}

