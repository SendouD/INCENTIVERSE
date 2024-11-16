'use client'

import React from 'react'
import { ConnectButton } from "thirdweb/react"
import { client, contract } from '../client'
import { useReadContract } from "thirdweb/react";
import { useActiveAccount } from 'thirdweb/react';
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from 'next/image'
import { arbitrumSepolia, hardhat } from 'thirdweb/chains';

export default function Header() {
  const address = String(useActiveAccount()?.address);
  const { data, isLoading } = useReadContract({
    contract,
    method: "function tokenbalance() returns(uint256)",
    params: [],
    from: address
  });

  return (
    <Card className="flex flex-col md:flex-row justify-between items-center">
      <CardHeader className="text-center md:text-left">
        {/* Replace the title with the logo image */}
        <Image 
          src="/logo.png" 
          alt="IncentiVerse Logo" 
          width={150} // Adjust width as per your needs
          height={50}  // Adjust height as per your needs
          className="mx-auto md:mx-0" // Center the image on smaller screens
        />
      </CardHeader>
      
      <CardContent>
        {
          address ? (
            <ConnectButton
              client={client} 
              chain={arbitrumSepolia}
              // accountAbstraction={{
              //   chain: arbitrumSepolia, // the chain where your smart accounts will be or is deployed
              //   sponsorGas: true, // enable or disable sponsored transactions
              //   }}
            />
          ) : (
            <p className="text-muted-foreground text-lg">Connect your wallet to get started</p>
          )
        }
      </CardContent>

      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-black text-white p-4 rounded-lg flex flex-col items-center">
          <p className="text-lg">TOKEN BALANCE:</p>
          <p className="text-2xl font-bold">{String(Number(data))}</p>
        </div>
      </CardContent>
    </Card>
  )
}
