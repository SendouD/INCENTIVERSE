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
import { HeartCrackIcon, HeartIcon, MessageCircleIcon, ShareIcon } from 'lucide-react'

interface Content {
  contentID: number,
  address: string
  ipfsHash: string
  likes: number
  dislikes: number
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
  const [dispComments, setDispComments] = useState<any[]>([])
  const [commentatorAddress, setCommentatorAddress] = useState<string[]>([])
  const [activeContentId, setActiveContentId] = useState<number | null>(null);
  const [description, setDescription] = useState<any[]>([]);

  const { data } = useReadContract({
    contract,
    method: 'function getAllContent() view returns((uint256,address,string,uint256,uint256,uint256,uint256)[])',
    params: [],
  })

  useEffect(() => {
    if (data) {
      let formattedData = data.map((content: any) => ({
        contentID: Number(content[0]),
        address: content[1],
        ipfsHash: content[2],
        likes: Number(content[3]),
        dislikes: Number(content[4]),
        comments: Number(content[5]),
        shares: Number(content[6]),
      }));
  
      const sortedData = formattedData.sort((a, b) => (b.likes - numToDecimal(b.dislikes)) - (a.likes - numToDecimal(a.dislikes)))
  
      setContentList(sortedData);
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    fetchDescription();  
  },[]);

  const fetchDescription = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/description/`)
      const desc = response.data.description;
      let temp = [];
      for(let i=0; i<desc.length; i++) {
        temp[desc[i].tokenId] = desc[i].description; 
      }
      setDescription(temp);
    } catch (error) {
      console.error('Error fetching description:', error)
      setError('Failed to load description. Please try again later.')
    }
  }

  const fetchComments = async (contentId: number) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/comments/${contentId}`)
      console.log(response.data);
      setDispComments(response.data.comments);
      setCommentatorAddress(response.data.commentersAddress);
      setActiveContentId(contentId);  // Set the current content ID for comment display
    } catch (error) {
      console.error('Error fetching comments:', error)
      setError('Failed to load comments. Please try again later.')
    }
  }

  function numToDecimal(num: number): number {
    let temp: number = 0;

    while(num > 0) {
      temp += (num%10);
      temp *= 0.1;
      num = Math.floor(num / 10);
    }
    
    return temp;
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
        prev.map((content) =>
          content.contentID === contentID ? { ...content, likes: content.likes + 1 } : content
        )
      )
    } catch (error) {
      console.error('Error liking content:', error)
      setError('Failed to like content. Please try again.')
    }
  }

  const handleDislike = async (contentID: number) => {
    try {
      const transaction = prepareContractCall({
        contract,
        method: 'function dislikeContent(uint256 contentId)',
        params: [BigInt(contentID)],
      })

      const wallet = createWallet('io.metamask')
      const account = await wallet.connect({ client });
      await sendTransaction({ account, transaction })

      setContentList((prev) =>
        prev.map((content) =>
          content.contentID === contentID ? { ...content, dislikes: content.dislikes + 1 } : content
        )
      )
    } catch (error) {
      console.error('Error disliking content:', error)
      setError('Failed to dislike content. Please try again.')
    }
  }

  const handleComment = async (contentID: number) => {
    try {
      await axios.patch(`http://localhost:3000/api/comments/${contentID}`, {
        text: newComment,
        author: address,
      })
      // Optimistically update the UI
      const transaction = prepareContractCall({
        contract,
        method: 'function commentContent(uint256 contentId)',
        params: [BigInt(contentID)],
      })

      const wallet = createWallet('io.metamask')
      const account = await wallet.connect({ client });
      await sendTransaction({ account, transaction })
  
      setNewComment('')
      // Update the comment count in the content list
      setContentList((prev) =>
        prev.map((content) =>
          content.contentID === contentID ? { ...content, comments: content.comments + 1 } : content
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
    <div className="min-h-screen relative">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/background.avif')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'grayscale(100%) brightness(40%)'
        }}
      />
      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Social Feed</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {contentList.map((content, index) => (
            <Card key={index} className="w-full bg-white bg-opacity-10 backdrop-blur-md">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`https://avatar.vercel.sh/${content.address}`} />
                    <AvatarFallback>{content.address.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-sm font-medium text-white">{content.address}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <img
                  src={`https://gateway.pinata.cloud/ipfs/${content.ipfsHash}`}
                  alt={`Content from IPFS ${index}`}
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
                <p className="text-white mb-2">{description[content.contentID]}</p>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>{content.likes} likes</span>
                  <span>{content.comments} comments</span>
                  <span>{content.dislikes} dislikes</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="flex justify-between w-full">
                  <Button variant="ghost" size="sm" onClick={() => handleLike(content.contentID)} className="text-white hover:text-gray-200">
                    <HeartIcon className="w-5 h-5 mr-2" />
                    Like
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => fetchComments(content.contentID)} className="text-white hover:text-gray-200">
                    <MessageCircleIcon className="w-5 h-5 mr-2" />
                    Comment
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDislike(content.contentID)} className="text-white hover:text-gray-200">
                    <HeartCrackIcon className="w-5 h-5 mr-2" />
                    Dislike
                  </Button>
                </div>

                {activeContentId === content.contentID && (
                  <div className="space-y-4">
                    {dispComments.map((comment, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <Avatar>
                          <AvatarImage src={`https://avatar.vercel.sh/${commentatorAddress[idx]}`} />
                          <AvatarFallback>{commentatorAddress[idx].slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-white">{commentatorAddress[idx]}</p>
                          <p className="text-sm text-gray-300">{comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             
                <div className="flex w-full space-x-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-white bg-opacity-10 text-white placeholder-gray-400"
                  />
                  <Button onClick={() => handleComment(content.contentID)} className="bg-white text-black hover:bg-gray-200">Post</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}