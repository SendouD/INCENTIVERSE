import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Target, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'


export default function HomePage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-black text-white relative">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('/background.avif?height=1080&width=1920')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(100%) brightness(30%)'
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                <header className="container mx-auto py-6 px-4 border-b border-gray-700">
                    <h1 className="text-4xl font-bold">Incentiverse</h1>
                </header>

                <main className="container mx-auto px-4 py-12">
                    <div className="text-center mb-12">
                        <h2 className="text-5xl md:text-7xl font-extrabold mb-4">
                            Welcome to Incentiverse
                        </h2>
                        <p className="text-xl md:text-2xl mb-8 text-gray-300">
                            Revolutionizing incentives in the digital realm
                        </p>
                        <div className='flex flex-row gap-4 justify-center'>
                        <Button size="lg" className="bg-white text-black hover:bg-gray-200" onClick={() => router.push('/pages/fileupload')} >
                            Upload Content
                            <ArrowRight className="ml-2" />



                        </Button>
                        <Button size="lg" className="bg-white text-black hover:bg-gray-200" onClick={() => router.push('/pages/feed')} >
                            Feed              <ArrowRight className="ml-2" />



                        </Button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        {[
                            { icon: Zap, title: "Lightning Fast", description: "Experience instant rewards and recognition" },
                            { icon: Target, title: "Precision Targeting", description: "Tailor-made incentives for maximum impact" },
                            { icon: Users, title: "Community Driven", description: "Harness the power of collective motivation" },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-black bg-opacity-50 p-6 rounded-lg border border-gray-700 backdrop-blur-sm"
                            >
                                <feature.icon className="w-12 h-12 mb-4 text-gray-300" />
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <h3 className="text-3xl font-bold mb-4">
                            Ready to transform your incentive strategy?
                        </h3>
                        <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                            Join Incentiverse Now
                        </Button>
                    </div>
                </main>

                <footer className="container mx-auto py-6 px-4 mt-12 border-t border-gray-700">
                    <p className="text-center text-sm text-gray-400">
                        © 2023 Incentiverse. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    )
}