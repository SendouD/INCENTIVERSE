"use client";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from "./client";
import { hardhat } from "thirdweb/chains";
import FileUpload from "./Component/FileUpload";
import Feed from "./Component/Feed";
import Header from "./Component/Header";


export default function Home() {
  const Account = useActiveAccount();

  return (
    <main >
          
          
            
            <Header />

              <FileUpload Account={Account} />

              {/* <Feed Account={Account} /> */}
    </main>
  );
}
