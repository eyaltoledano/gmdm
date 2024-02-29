import React from 'react'
import { useAccount } from 'wagmi'

const HomePage = () => {
    const { address, isConnected} = useAccount()
    return (
        <div className="p-4 container mx-auto">
            <div className='text-center'>
                <h1 className='text-2xl font-semibold'>Send a message to any NFT</h1>
                <p>gmdm is the only nft-to-nft messaging protocol of its kind.</p>
            </div>
            {address && isConnected && (
                <div className='text-center'>
                    <p>Connected to {address}</p>
                </div>
            )}
        </div>
    )
}

export default HomePage