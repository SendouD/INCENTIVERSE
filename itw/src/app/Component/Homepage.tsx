'use client'

import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link';

import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Target, Users } from 'lucide-react'

export default function HomePage() {
    const { scrollYProgress } = useScroll()
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2])

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 text-white overflow-hidden">
            <motion.header
                className="container mx-auto py-6 px-4"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.h1
                    className="text-4xl font-bold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Incentiverse
                </motion.h1>
            </motion.header>

            <main className="container mx-auto px-4 py-12">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.h2
                        className="text-5xl md:text-7xl font-extrabold mb-4"
                        style={{ scale }}
                    >
                        Welcome to Incentiverse
                    </motion.h2>
                    <motion.p
                        className="text-xl md:text-2xl mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Revolutionizing incentives in the digital realm
                    </motion.p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link href="/pages/fileupload">



                            <Button size="lg" className="bg-red-600 text-white hover:bg-red-700">
                                Start Posting              <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                >

                                    <ArrowRight className="ml-2" />
                                </motion.span>
                            </Button>
                        </Link>

                        <Link href="/pages/feed">


                            <Button size="lg" className="bg-red-600 text-white hover:bg-red-700">
                                See the Feed      <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                >

                                    <ArrowRight className="ml-2" />
                                </motion.span>
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mt-16">
                    {[
                        { icon: Zap, title: "Lightning Fast", description: "Experience instant rewards and recognition" },
                        { icon: Target, title: "Manupulate the feed", description: "Upvote and downvote to increase a posts visibility" },
                        { icon: Users, title: "Community Driven", description: "Decide How things work through voting" },
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-black bg-opacity-50 p-6 rounded-lg backdrop-blur-lg border border-red-800"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)' }}
                        >
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <feature.icon className="w-12 h-12 mb-4 text-red-500" />
                            </motion.div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p>{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="mt-20 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                >
                    <motion.h3
                        className="text-3xl font-bold mb-4"
                        animate={{
                            textShadow: ['0 0 5px #ff0000', '0 0 20px #ff0000', '0 0 5px #ff0000']
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Ready to transform your incentive strategy?
                    </motion.h3>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900">
                            Take part in community decisions            </Button>
                    </motion.div>
                </motion.div>
            </main>

            <motion.footer
                className="container mx-auto py-6 px-4 mt-12 border-t border-red-800"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <p className="text-center text-sm">
                    © 2023 Incentiverse. All rights reserved.
                </p>
            </motion.footer>
        </div>
    )
}