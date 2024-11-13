'use client'

import React from 'react'
import { ConnectButton } from "thirdweb/react"
import { client, contract } from '../client'
import { useReadContract } from "thirdweb/react";
import { hardhat } from "thirdweb/chains"
import { useActiveAccount } from 'thirdweb/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Header() {
  const address = String(useActiveAccount()?.address);
  const { data, isLoading } = useReadContract({
    contract,
    method: "function tokenbalance() returns(uint256)",
    params: [],
    from: address
  });
  return (
    <Card className="flex justify-between">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-bold text-primary">IncentiVerse</CardTitle>
      </CardHeader>
      <CardContent >
        {
          address ? <ConnectButton
            client={client} 
            chain={hardhat}
          /> : <p className="text-muted-foreground text-lg">Connect your wallet to get started</p>

        }


      </CardContent>
      <CardContent className="flex flex-col items-center space-y-4">
        <p className="text-muted-foreground text-lg">TOKEN BALANCE: {Number(data)}</p>


      </CardContent>
    </Card>
  )
}




























// accountAbstraction={{
//   chain: sepolia, // the chain where your smart accounts will be or is deployed
//   sponsorGas: true, // enable or disable sponsored transactions
// }}