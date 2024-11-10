"use client";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from "./client";
import { hardhat } from "thirdweb/chains";
import Feed from "./pages/feed/page";
import Header from "./Component/Header";


export default function Home() {

  return (
    <main >
          
          

              <Header />    


              {/* <Feed Account={Account} /> */}
    </main>
  );
}
