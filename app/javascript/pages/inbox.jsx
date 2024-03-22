import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Api from '../services/api';
import consumer from '../channels/consumer';
import renderAlert from '../components/shared/renderAlert';

const InboxPage = () => {
  const [dms, setDms] = useState([]);

  useEffect(() => {
    const fetchDms = async () => {
      try {
        const response = await Api.get('/api/v1/dms');
        console.log("Fetched DMs:", response)
        setDms(response);
      } catch (error) {
        console.error("Error fetching DMs:", error);
      }
    };

    fetchDms();
    // Subscribe to Action Cable for real-time updates
    const dmSubscription = consumer.subscriptions.create("DmChannel", {
        received(data) {
            setDms(prevDms => [...prevDms, data]);
        }
    });

    renderAlert('dark', 'DMs are tied to your NFT. Avoid sharing personal information.', 5000);
  
    return () => { dmSubscription.unsubscribe(); };
  }, []);

  const findSenderNftName = (messages) => {
    const receivedMessage = messages.find(message => message.message_type === 'received');
    return receivedMessage ? receivedMessage.nft_name : 'Unknown NFT';
  }

  return (
    <div className="flex">
      <div className="w-1/4 bg-white border-r border-t border-gray-300 overflow-y-auto">
        <header className="p-4 border-b border-gray-300 bg-indigo-600 text-white">
          <h1 className="text-2xl font-semibold">Inbox</h1>
        </header>
        <div className="p-3 mb-9 pb-20">
            {dms?.map((dm) => {
                const userNftId = dm.user_nft_id
                const DmNfts = dm.nfts

                const otherNfts = DmNfts.filter(nft => nft.id !== userNftId);

                const conversationName = otherNfts.map((nft, index) => {
                    if (index === dm.nfts.length - 1) { return `& ${nft.name}` } 
                    else if (index === dm.nfts.length - 2) { return `${nft.name}` } 
                    else { return `${nft.name},` }
                }).join(' ');

                const otherNftAvatars = otherNfts.map(nft => {
                    return(
                      <div className="avatar">
                        <div className="w-12">
                          <img key={nft.id} src={nft.image_url} alt={nft.name} />
                        </div>
                      </div>
                    )
                })

                const avatars = <div className="avatar-group -space-x-6 rtl:space-x-reverse">{otherNftAvatars}</div>


                return(
                    <Link key={dm.id} to={`/inbox/${dm.id}`} className="block hover:bg-gray-100 p-2 rounded-md">
                        <div className="flex items-center align-middle space-x-2">
                            <span>{avatars}</span>
                            <span>{conversationName}</span>
                        </div>
                    </Link>
                )
            })}
        </div>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
};

export default InboxPage;