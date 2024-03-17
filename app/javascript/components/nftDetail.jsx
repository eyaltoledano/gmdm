import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Api from '../services/api';
import { Loading, Mask } from 'react-daisyui';
import Traits from './shared/traits';

const NftDetail = () => {
    const params = useParams();
    const { collection_slug, token_id } = params;
    const [nft, setNft] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let url = '/api/v1/collections/' + collection_slug + '/' + token_id;
        Api.get(url)
            .then(response => {
                if (response.data === null) {
                    setNotFound(true)
                    setLoading(false)
                    return
                }
                setNft(response.data)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching NFT:', error)
                setNotFound(true)
                setLoading(false)
            });
    }, [collection_slug, token_id]);

    if (loading) {
        return (
            <div className="p-4 container mx-auto">
                <div className='text-center'>
                    <Loading variant='ball' />
                </div>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="p-4 container mx-auto">
                <div className='text-center'>
                    <h1 className='text-2xl font-semibold'>NFT not found</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 container mx-auto">
            <div className='text-center space-y-4'>
                <div className="flex justify-center">
                    <img src={nft.image_url} alt={nft.name + nft.id} className='w-1/5 mask mask-squircle'/>
                </div>
                <h1 className='text-2xl font-semibold'>DM with {nft?.name}</h1>
            </div>
            <div className='flex justify-center py-4 w-full'>
                <Traits traits={nft.traits} collectionSlug={collection_slug} />
            </div>
        </div>
    );
};

export default NftDetail;