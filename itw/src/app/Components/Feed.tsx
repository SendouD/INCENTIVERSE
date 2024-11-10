'use client';

import React, { useEffect, useState } from 'react';
import { prepareContractCall, sendTransaction } from "thirdweb";
import axios from 'axios'; // Import axios
import { contract } from "../client";
import { useReadContract ,useActiveAccount} from "thirdweb/react";

const Feed = ({ Account }: any) => {
  const [contentList, setContentList] = useState<any[]>([]);
  const [comment, setComment] = useState<string>(''); // State to hold the comment
  const address = useActiveAccount()?.address;
  
  const handleLike = async (contentID: number) => {
    const transaction = prepareContractCall({
      contract,
      method: "function likeContent(uint256 contentId)",
      params: [BigInt(contentID)],
    });
    const account = Account;
    await sendTransaction({ account, transaction });
  };

  const handleSubmit = async (tokenId: number, userAddress: string) => {
   
    try {
      await axios.post('http://localhost:3000/api/', {
        tokenId,
        userAddress,
        comment,
      });
      setComment(''); // Reset the comment field after submission

      const handleComment = async (contentID: number) => {
        const transaction = prepareContractCall({
          contract,
          method: "function commentContent(uint256 contentId)",
          params: [BigInt(contentID)],
        });
        await sendTransaction({ account: Account, transaction });
      };
      handleComment(tokenId);
    } catch (error: any) {
      console.error('Error adding comment:', error.response?.data || error.message);
    }
  };

  const { data } = useReadContract({
    contract,
    method: "function getAllContent() view returns((address,string,uint256,uint256,uint256)[])",
    params: [],
  });

  useEffect(() => {
    if (data) setContentList(data);
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">All Content</h2>

      {contentList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentList.map((content, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
              style={{ maxWidth: '320px', margin: 'auto' }}
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Content #{index + 1}</h4>
              <p className="text-gray-600 mb-2"><span className="font-bold">Account:</span> {content[0]}</p>
              <p className="text-gray-600 mb-2"><span className="font-bold">Likes:</span> {Number(content[2])}</p>
              <p className="text-gray-600 mb-2"><span className="font-bold">Comments:</span> {Number(content[3])}</p>
              <p className="text-gray-600 mb-2"><span className="font-bold">Shares:</span> {Number(content[4])}</p>

              <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
                <img
                  src={`https://gateway.pinata.cloud/ipfs/${content[1]}`}
                  alt={`Content from IPFS ${index}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <button 
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                  onClick={() => handleLike(index)}
                >
                  Like
                </button>

                <input
                  type="text"
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment"
                  className="px-4 py-2 border rounded-lg w-full"
                />

                <button 
                  className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
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
