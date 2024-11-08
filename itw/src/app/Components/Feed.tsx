'use client';

import React, { useEffect, useState } from 'react';
import { prepareContractCall,sendTransaction } from "thirdweb";
import axios from 'axios'; // Import axios
import {contract} from "../client"
import { useReadContract } from "thirdweb/react";

const Feed = ({ Account }: any) => {
  const [contentList, setContentList] = useState<any[]>([]);
  const [comment, setComment] = useState<string>(''); // State to hold the comment
  const handleLike = async (contentID: number) => {
    console.log(contentID)
  
    const transaction = prepareContractCall({
      contract,
      method: "function likeContent(uint256 contentId)",
      params: [BigInt(contentID)],
    });
    const account=Account;
    const { transactionHash } = await sendTransaction({
      account,
      transaction,
    });
  };

  const handleSubmit = async (tokenId: number, userAddress: string) => {
    try {
      const response = await axios.post('http://localhost:3000/api/', {
        tokenId,
        userAddress,
        comment,
      });
      console.log(response.data.message); // Success message from the server
      setComment('');

      const handleComment = async (contentID: number) => {
        const transaction = prepareContractCall({
          contract,
          method: "function commentContent(uint256 contentId)",
          params: [BigInt(contentID)],
        });
        const account=Account;
        const { transactionHash } = await sendTransaction({
          account,
          transaction,
        });
      
      }; // Reset the comment after submission
      handleComment(tokenId);
    } catch (error: any) {
      console.error('Error adding comment:', error.response?.data || error.message);
    }
  };
  const {data,error, isLoading } = useReadContract({
    contract,
    method: "function getAllContent() view returns((address,string,uint256,uint256,uint256)[])",
    params: [],
  });
  useEffect(() => {
    if (data) {
      console.log(data);
      setContentList(data);
    }
  }, [data]);
  

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">All Content</h2>

      {/* Display content if available */}
      {contentList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contentList.map((content, index) => (   
             
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-xl font-semibold text-gray-700 mb-4">Content #{index + 1}</h4>
              <p className="text-gray-600 mb-2"><span className="font-bold">Account:</span> {content[0]}</p>
              <p className="text-gray-600 mb-2"><span className="font-bold">Likes:</span> {Number(content[2])}</p>
              <p className="text-gray-600 mb-2"><span className="font-bold">Comments:</span> {Number(content[3])}</p>
              <p className="text-gray-600 mb-2"><span className="font-bold">Shares:</span> {Number(content[4])}</p>

              {/* Display the image from IPFS using the content hash */}
              <img
                src={`https://gateway.pinata.cloud/ipfs/${content[1]}`}
                alt={`Content from IPFS ${index}`}
                className="w-full h-auto rounded-lg mb-4"
              />
             

              <div className="flex space-x-4">
                <button 
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
                  onClick={() => handleLike(index)}
                >
                  Like
                </button>

                {/* Submit a comment */}
                <input 
                  type="text" 
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment"
                  className="px-2 py-1 border rounded-md"
                />
                <button 
                  className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition"
                  onClick={() => handleSubmit(index, content[0])}
                >
                  Comment
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No content available.</p>
      )}

    
    </div>
  );
};

export default Feed;
