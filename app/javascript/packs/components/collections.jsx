import React, { useState, useEffect } from 'react';
import Api from '../services/api'

function Collections() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    Api.get('/api/v1/collections')
      .then(response => setCollections(response.data))
      .catch(error => console.error('Error fetching collections:', error));
  }, []);

  return (
    <div>
      <h1>Collections</h1>
      <ul>
        {collections.map(collection => (
          <li key={collection.id}>{collection.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Collections;
