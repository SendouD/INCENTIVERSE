'use client'

import React, { useEffect, useState } from 'react'
import { prepareContractCall, sendTransaction } from 'thirdweb'
import axios from 'axios'
import { createWallet } from 'thirdweb/wallets'
import { client, contract } from '../../client'
import { useReadContract, useActiveAccount } from 'thirdweb/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HeartIcon, MessageCircleIcon, ShareIcon } from 'lucide-react'

interface Content {
  address: string
  ipfsHash: string
  likes: number
  comments: number
  shares: number
}

interface Comment {
  id: number
  text: string
  author: string
}

export default function Feed() {
  const [contentList, setContentList] = useState<Content[]>([])
  const [newComment, setNewComment] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const address = useActiveAccount()?.address
  const [dispcomments,setDispComments]=useState<any>([])
  const[commentatoraddress,setCommentatorAddress]=useState<any>([]);
  

  const { data } = useReadContract({
    contract,
    method: 'function getAllContent() view returns((address,string,uint256,uint256,uint256)[])',
    params: [],
  })

  useEffect(() => {
    if (data) {
      setContentList(
        data.map((content: any) => ({
          address: content[0],
          ipfsHash: content[1],
          likes: Number(content[2]),
          comments: Number(content[3]),
          shares: Number(content[4]),
        }))
      )
      setLoading(false)
    }
  }, [data])

  // useEffect(() => {
  //   fetchComments()
  // }, [])

  const fetchComments = async (contentId: number) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/comments/${contentId}`)
      console.log(response.data);
      setDispComments(response.data.comments);
      setCommentatorAddress(response.data.commentersAddress);
    } catch (error) {
      console.error('Error fetching comments:', error)
      setError('Failed to load comments. Please try again later.')
    }
  }

  const handleLike = async (contentID: number) => {
    try {
      const transaction = prepareContractCall({
        contract,
        method: 'function likeContent(uint256 contentId)',
        params: [BigInt(contentID)],
      })

      const wallet = createWallet('io.metamask')
      const account = await wallet.connect({ client });
      await sendTransaction({ account, transaction })
      // Optimistically update the UI
      setContentList((prev) =>
        prev.map((content, index) =>
          index === contentID ? { ...content, likes: content.likes + 1 } : content
        )
      )
    } catch (error) {
      console.error('Error liking content:', error)
      setError('Failed to like content. Please try again.')
    }
  }

  const handleComment = async (contentID: number) => {
    try {
      await axios.patch(`http://localhost:3000/api/comments/${contentID}`, {
        text: newComment,
        author: address,
      })
      // Optimistically update the UI
      setComments((prev) => ({
        ...prev,
        [contentID]: [
          ...(prev[contentID] || []),
          { id: Date.now(), text: newComment, author: address || 'Anonymous' },
        ],
      }))
      setNewComment('')
      // Update the comment count in the content list
      setContentList((prev) =>
        prev.map((content, index) =>
          index === contentID ? { ...content, comments: content.comments + 1 } : content
        )
      )
    } catch (error) {
      console.error('Error adding comment:', error)
      setError('Failed to add comment. Please try again.')
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Social Feed</h2>
      <div className="max-w-3xl mx-auto space-y-6">
        {contentList.map((content, index) => (
          <Card key={index} className="w-full">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`https://avatar.vercel.sh/${content.address}`} />
                  <AvatarFallback>{content.address.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-sm font-medium">{content.address}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <img
                src={`https://gateway.pinata.cloud/ipfs/${content.ipfsHash}`}
                alt={`Content from IPFS ${index}`}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{content.likes} likes</span>
                <span>{content.comments} comments</span>
                <span>{content.shares} shares</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex justify-between w-full">
                <Button variant="ghost" size="sm" onClick={() => handleLike(index)}>
                  <HeartIcon className="w-5 h-5 mr-2" />
                  Like
                </Button>
                <Button variant="ghost" size="sm" onClick={() => fetchComments(index)}>
                  <MessageCircleIcon className="w-5 h-5 mr-2" />
                  Comment
                </Button>
                <Button variant="ghost" size="sm">
                  <ShareIcon className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>
           
              <div className="flex w-full space-x-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={() => handleComment(index)}>Post</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}