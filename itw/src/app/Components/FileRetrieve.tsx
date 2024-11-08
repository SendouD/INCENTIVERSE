'use client'

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import instadappAbi from '../../artifacts/contracts/Instadapp.sol/Instadapp.json'; 
import { useReadContract } from 'wagmi';

const FileRetrieve = ({Instadappaddress}:any) => {
  const [tokenId, setTokenId] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const { address } = useAccount();

  const { data, isError, error, isLoading } = useReadContract({
    abi:instadappAbi.abi,
    address: Instadappaddress,
    account:address,
    functionName: 'contentdetails',
    args: [tokenId],
    query: {
      enabled: Boolean(tokenId),
    }
  });
  useEffect(()=>{

    setTokenId("");


  },[imgUrl])
 
  
  const handleRetrieve = () => {
    console.log(data)
    const imgUrl = `https://gateway.pinata.cloud/ipfs/${data[1]}`;
    console.log(imgUrl);
    setImgUrl(imgUrl);   
  };
  return (
    <div className="retrieve-container">
      <input
        type="text"
        placeholder="Enter Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        className="token-input"
      />
      <button onClick={handleRetrieve} className="retrieve-button" disabled={isLoading}>
        {isLoading ? 'Retrieving...' : 'Retrieve File'}
      </button>

      {isError && (
        <div className="error-message">
          Error: {error?.message || "An unexpected error occurred."}
        </div>
      )}

      {imgUrl && (
        <div className="image-container">
          <img
            src={imgUrl}
            alt="Retrieved from IPFS"
            className="retrieved-image"
          />
        </div>
      )}
    </div>
    
  );
};

export default FileRetrieve;