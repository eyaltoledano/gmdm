import React, { useEffect, useState } from 'react'
import Api from '../services/api';
import { Card, Loading, Mask } from 'react-daisyui';
import { Link } from 'react-router-dom';

function CollectionsPage() {
    const [collection, setCollection] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let url = '/api/v1/collections/'
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
    }, []);

    return (
        <div className="p-4 container mx-auto">
            <div className='text-center'>
                <h1 className='text-2xl font-semibold'>Collections</h1>

                {loading && <Loading variant='ball' />}

                {/* Grid with 3 columns */}
                <div className="grid grid-cols-3 gap-4 h-1/2 md:h-1/3">
                    {collection && collection.map((c) => {
                        return (
                            <Link to={`/collections/${c.slug}`} key={c.id + '-' + c.contract_address}>
                                <div className="card bg-base-100 shadow-md hover:shadow-2xl">
                                    <div className="card-body">
                                        <h2 className="card-title">{c.name}</h2>
                                    </div>
                                    <figure><img src={c.featured_image_url} alt={c.name} /></figure>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default CollectionsPage