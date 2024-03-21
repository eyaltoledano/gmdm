import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Api from '../services/api';
import consumer from '../channels/consumer';

const InboxPage = () => {
  const [dms, setDms] = useState([]);

  useEffect(() => {
    const fetchDms = async () => {
      try {
        const response = await Api.get('/api/v1/dms');
        setDms(response);
      } catch (error) {
        console.error("Error fetching DMs:", error);
      }
    };

    fetchDms();
    // Subscribe to Action Cable for real-time updates
    const dmSubscription = consumer.subscriptions.create("DmChannel", {
        received(data) {
            console.log("Received DM:", data);
          // Assuming 'data' contains the updated list of DMs or a new DM
            setDms(prevDms => [...prevDms, data]);
        }
    });
  
    // Cleanup subscription on component unmount
    return () => {
        dmSubscription.unsubscribe();
    };
  }, []);

  const findSenderNftName = (messages) => {
    const receivedMessage = messages.find(message => message.message_type === 'received');
    return receivedMessage ? receivedMessage.nft_name : 'Unknown NFT';
  };

  return (
    <div className="flex">
      <div className="w-1/4 bg-white border-r border-t border-gray-300 overflow-y-auto h-screen">
        <header className="p-4 border-b border-gray-300 bg-indigo-600 text-white">
          <h1 className="text-2xl font-semibold">Inbox</h1>
        </header>
        <div className="p-3 mb-9 pb-20">
            {dms?.map((dm) => {
                return(
                    <Link key={dm.id} to={`/inbox/${dm.id}`} className="block hover:bg-gray-100 p-2 rounded-md">
                        <div className="flex items-center mb-4">
                            <span>{findSenderNftName(dm.messages)}</span>
                        </div>
                    </Link>
                )
            })}
        </div>
      </div>
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  )
};

export default InboxPage;