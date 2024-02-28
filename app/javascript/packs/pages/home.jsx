import React from 'react'
import Collections from '../components/collections'

const Home = () => {
    return (
        <div className="bg-blue-500 text-white p-4">
            <h1>Send a message to any NFT</h1>
            <p>gmdm is the only nft-to-nft messaging protocol of its kind.</p>
            <Collections />
        </div>
    )
}

export default Home