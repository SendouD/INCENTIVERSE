"use client";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from "./client";
import { hardhat } from "thirdweb/chains";
import FileUpload from "./Components/FileUpload";
import Feed from "./Components/Feed";

export default function Home() {
  const Account = useActiveAccount();

  return (
    <main className="p-4 min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="container max-w-screen-lg mx-auto py-16">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800">Welcome to DApp</h1>
            <p className="text-gray-600 mt-2">Connect your wallet to get started</p>
          </div>
          
          <div className="flex flex-col items-center space-y-8">
            <ConnectButton
              client={client}
              // accountAbstraction={{
              //   chain: sepolia, // the chain where your smart accounts will be or is deployed
              //   sponsorGas: true, // enable or disable sponsored transactions
              // }}
              chain={hardhat}
            />

            <div className="w-full max-w-md">
              <FileUpload Account={Account} />
            </div>

            <div className="w-full max-w-lg">
              <Feed Account={Account} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
