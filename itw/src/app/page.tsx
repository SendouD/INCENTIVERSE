"use client";
import { ConnectButton ,useActiveAccount} from "thirdweb/react";
import { client } from "./client";
import { hardhat } from "thirdweb/chains";
import FileUpload from "./Components/FileUpload"
import Feed from "./Components/Feed";
export default function Home() {
  const Account = useActiveAccount(); 
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">

        <div className="flex justify-center mb-20">
          <ConnectButton
            client={client}
            // accountAbstraction={{
            //   chain: sepolia, // the chain where your smart accounts will be or is deployed
            //   sponsorGas: true, // enable or disable sponsored transactions
            // }}
            chain={hardhat}
          />
          <FileUpload Account={Account}/>
          <Feed Account={Account}/>
        </div>

      </div>
    </main>
  );
}
