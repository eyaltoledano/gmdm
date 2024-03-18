import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

// Dummy data for DMs
const dms = [
  { id: '1', name: 'DM 1' },
  { id: '2', name: 'DM 2' },
  // Add more DMs here
];

const InboxPage = () => {
  return (
    <div className="inbox-page">
      <div className="dm-list">
        {dms.map((dm) => (
          <Link key={dm.id} to={`/inbox/${dm.id}`}>
            <div className="dm">{dm.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InboxPage;
