'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { sendTransaction, prepareContractCall } from 'thirdweb'
import { createWallet } from 'thirdweb/wallets'
import { client, contract } from '../client'
import { prepareEvent, getContractEvents } from 'thirdweb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Upload } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function FileUpload({ Account }: { Account: any }) {
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('No image selected')
  const [isLoading, setIsLoading] = useState(false)
  const [description, setDescription] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    const myEvent = prepareEvent({
      signature: 'event ContentAdded(uint256 indexed contentId, address indexed account, string contentHash)',
    })
    const events = await getContractEvents({
      contract: contract,
      events: [myEvent],
    })
    return events
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (file) {
      try {
        setIsLoading(true)
        setError(null)

        const formData = new FormData()
        formData.append('file', file)

        const resFile = await axios({
          method: 'post',
          url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
          data: formData,
          headers: {
            pinata_api_key: `19f1bbf42a0d752714df`,
            pinata_secret_api_key: `2bedd564990e87e6d46fedfb8261b27a3d1de197aba5b44e83c6d7699aa87a88`,
            'Content-Type': 'multipart/form-data',
          },
        })

        const ImgHash = resFile.data.IpfsHash
        console.log(ImgHash)

        const wallet = createWallet('io.metamask')
        const account = Account
        const transaction = prepareContractCall({
          contract,
          method: 'function addContent(string memory contentHash)',
          params: [ImgHash],
        })

        const { transactionHash } = await sendTransaction({
          account,
          transaction,
        })

        let events = await fetchEvents()
        let n = events.length
        let tokenId = Number(events[n - 1].args.contentId)
        let contentHash = events[n - 1].args.contentHash
        let userAddress = events[n - 1].args.account

        await axios.post('http://localhost:3000/api/', {
          tokenId,
          userAddress,
          description,
        })

        console.log('Transaction Hash:', transactionHash)
        alert('Successfully uploaded image!')
        setFileName('No image selected')
        setFile(null)
        setPreviewUrl(null)
        setDescription('')
      } catch (e) {
        console.error('Error uploading image:', e)
        setError('Unable to upload image. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const retrieveFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Share Your Moment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                Choose an image
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">{fileName}</p>
                      </>
                    )}
                  </div>
                  <Input id="file-upload" type="file" className="hidden" onChange={retrieveFile} accept="image/*" />
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Write a caption for your image..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={!file || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? 'Uploading...' : 'Share'}
          </Button>
        </CardFooter>
      </Card>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}