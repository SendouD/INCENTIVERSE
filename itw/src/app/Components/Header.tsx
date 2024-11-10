import React, { useState, useEffect } from 'react';
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import {client,contract} from '../client';
import { hardhat } from "thirdweb/chains";
function Header() {
    
    return (<>
       
       <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800">IncentiVerse</h1>
            <p className="text-gray-600 mt-2">Connect your wallet to get started</p>
          </div>        <ConnectButton
          client={client}
          // accountAbstraction={{
          //   chain: sepolia, // the chain where your smart accounts will be or is deployed
          //   sponsorGas: true, // enable or disable sponsored transactions
          // }}
          chain={hardhat}
        />
        </>
    )
}
export default Header;