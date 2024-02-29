import React from 'react'
import { useAccount } from 'wagmi'
import { useAppContext } from '../services/context'

const HomePage = () => {
    const { address, isConnected} = useAccount()
    const { state, dispatch } = useAppContext();
    return (
        <div className="p-4 container mx-auto">
            <div className='text-center'>
                <h1 className='text-2xl font-semibold'>Send a message to any NFT</h1>
                <p>gmdm is the only nft-to-nft messaging protocol of its kind.</p>
            </div>
            {address && isConnected && (
                <div className='text-center'>
                    <p>(WAGMI) Connected to {address}</p>
                </div>
            )}
            {state && (
                <div className='text-center'>
                    <p>(State) Connected? {state.isConnected.toString()}</p>
                    <p>(State) Authenticated? {state.isAuthenticated.toString()}</p>
                    <p>(State) Connected user address: {state.user?.eth_address || 'N/A'}</p>
                </div>
            )}
        </div>
    )
}

export default HomePage