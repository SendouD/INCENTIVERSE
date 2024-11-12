'use client'

import React from 'react'
import { ConnectButton } from "thirdweb/react"
import { client } from '../client'
import { hardhat } from "thirdweb/chains"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Header() {
  return (
    <div className="w-full max-w-full mt-8 mb-8"> {/* Added margin-bottom */}
      {/* Flex container for header title and connect card */}
      <div className="flex items-center justify-between w-full">
        {/* Left-aligned title with added margin-left */}
        <h1 className="text-4xl font-bold text-primary ml-8">IncentiVerse</h1>  {/* Increased margin-left to 8 */}

        {/* Connect Wallet Card with added margin on the right */}
        <Card className="mr-8">  {/* Increased margin-right to 8 */}
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-muted-foreground text-center">
              Connect your wallet to get started
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ConnectButton client={client} chain={hardhat} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}






























    // accountAbstraction={{
          //   chain: sepolia, // the chain where your smart accounts will be or is deployed
          //   sponsorGas: true, // enable or disable sponsored transactions
          // }}