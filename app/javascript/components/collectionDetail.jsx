import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import Api from '../services/api';
import { Loading } from 'react-daisyui';
import Pagination from './shared/pagination';

const CollectionDetail = () => {
    const { collection_slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [collection, setCollection] = useState(null);
    const [collectionNfts, setCollectionNfts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Include the current page in the API call
        const page = searchParams.get('page') || 1;
        const url = `/api/v1/collections/${collection_slug}?page=${page}`;
        
        Api.get(url)
            .then(response => {
                if (!response.data) {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }
                setCollection(response.data.collection);
                setCollectionNfts(response.data.nfts);
                setPagination(response.data.pagination); // Assuming your API includes pagination info in the response
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching collections:', error);
                setNotFound(true);
                setLoading(false);
            });
    }, [collection_slug, searchParams]);

    // Pagination handler
    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage });
    };

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
            <div className='flex justify-center'>
                <Pagination pagination={pagination} onPageChange={handlePageChange} collectionSlug={collection_slug} />
            </div>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Token ID</th>
                            <th></th>
                            <th>Fee</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {collectionNfts.map((nft) => {
                            return(
                                    <tr key={nft.id + '-' + nft.name}>
                                        <td>
                                            <Link to={`/collections/${collection.slug}/${nft.token_id}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-12 h-12">
                                                            <img src={nft.image_url} alt={nft.name + nft.id} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{nft.name}</div>
                                                        {/* if the nft.id divides by 2, DMs are open */}
                                                        {/* {nft.id % 2 === 0 && <span className="badge badge-ghost badge-sm">DMs open</span>} */}
                                                        {/* <div className="text-sm opacity-50">DMs open</div> */}
                                                    </div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td>
                                            {/* Zemlak, Daniel and Leannon
                                            <br/>
                                            <span className="badge badge-ghost badge-sm">Desktop Support Technician</span> */}
                                        </td>
                                        <td>
                                            0.012 ETH
                                        </td>
                                        <th>
                                            <button className="btn btn-ghost btn-xs">send dm</button>
                                        </th>
                                    </tr>
                            )
                        })}
                    </tbody> 
                </table>
                <div className='flex justify-center'>
                    <Pagination pagination={pagination} onPageChange={handlePageChange} collectionSlug={collection_slug} />
                </div>
            </div>
        </div>
    );
};

export default CollectionDetail;

