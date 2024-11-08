import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  sendTransaction,
  prepareContractCall,
} from "thirdweb";
import { createWallet } from "thirdweb/wallets";
import {client,contract} from '../client';
import { prepareEvent ,getContractEvents} from "thirdweb";

const FileUpload = ({Account}: any) => {
  const [file, setFile] = useState<any>(null);
  const [fileName, setFileName] = useState("No image selected");
//   const fetchEvents = async () => {

//   const myEvent = prepareEvent({
//     signature: "event ContentAdded(uint256 indexed contentId, address indexed account, string contentHash)",
//   });
//   const latestBlock = await getBlockNumber(
//     {
//       network:""
//     }
//   )

// const events = await getContractEvents({
//   contract: contract,
//   fromBlock: latestBlock-10n,
//   toBlock: latestBlock,
//   events: [myEvent],
// });}
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `19f1bbf42a0d752714df`,
            pinata_secret_api_key: `2bedd564990e87e6d46fedfb8261b27a3d1de197aba5b44e83c6d7699aa87a88`,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = resFile.data.IpfsHash;
        console.log(ImgHash);

        const addimagehash = async() => {
          const wallet = createWallet("io.metamask");
          const account = Account;
          const transaction = prepareContractCall({
            contract,
            method: "function addContent(string memory contentHash)",
            params: [ImgHash],
          });
           
          const { transactionHash } = await sendTransaction({
            account,
            transaction,
          });
        };

        addimagehash();
        alert("Successfully uploaded image!");
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        console.error("Error uploading image to Pinata:", e);
        alert("Unable to upload image to Pinata");
      }
    }
  };

  const retrieveFile = (e: any) => {
    const data = e.target.files[0];
    if (data) {
      setFile(data);
      setFileName(data.name);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Upload Image to IPFS</h2>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600 transition">
            Choose Image
          </label>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={retrieveFile}
          />
          <span className="text-gray-600 text-center">{fileName}</span>
          
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition disabled:opacity-50"
            disabled={!file}
          >
            Upload File
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileUpload;
