import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Api from '../services/api';
import { Loading } from 'react-daisyui';

const CollectionDetail = () => {
    const { collection_slug } = useParams();
    const [collection, setCollection] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let url = '/api/v1/collections/' + collection_slug
        Api.get(url)
            .then(response => {
                if (response.data === null) {
                    setNotFound(true)
                    setLoading(false)
                    return
                }
                setCollection(response.data)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching collections:', error)
                setNotFound(true)
                setLoading(false)
            });
    }, [collection_slug]);

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
                    <h1 className='text-2xl font-semibold'>Collection not found</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 container mx-auto">
            <div className='text-center'>
                <h1 className='text-2xl font-semibold'>DM with {collection?.name}</h1>
                <p>Contract: {collection?.contract_address}</p>
            </div>
        </div>
    );
};

export default CollectionDetail;
