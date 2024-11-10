'use client'

import React from 'react'
import { ConnectButton } from "thirdweb/react"
import { client } from '../client'
import { hardhat } from "thirdweb/chains"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Header() {
  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-bold text-primary">IncentiVerse</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <p className="text-muted-foreground text-lg">Connect your wallet to get started</p>
        <ConnectButton
          client={client}
          chain={hardhat}
        />
      </CardContent>
    </Card>
  )
}




























    // accountAbstraction={{
          //   chain: sepolia, // the chain where your smart accounts will be or is deployed
          //   sponsorGas: true, // enable or disable sponsored transactions
          // }}