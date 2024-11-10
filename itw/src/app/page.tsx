"use client";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from "./client";
import { hardhat } from "thirdweb/chains";
import FileUpload from "./Components/FileUpload";
import Feed from "./Components/Feed";
import Header from "./Components/Header";


export default function Home() {
  const Account = useActiveAccount();

  return (
    <main className="p-4 min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="container max-w-screen-lg mx-auto py-16">
        <div className="bg-white shadow-lg rounded-lg p-8">
          
          
          <div className="flex flex-col items-center space-y-8">
            
            <Header />

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
