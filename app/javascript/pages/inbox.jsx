import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Api from '../services/api';
import consumer from '../channels/consumer';
import renderAlert from '../components/shared/renderAlert';
import { useAppContext } from '../services/context';
import { Loading } from 'react-daisyui';
import truncateEthAddress from 'truncate-eth-address';

const InboxPage = () => {
  const [dms, setDms] = useState([]);
  const { state } = useAppContext();
  const { user, isUserLoading } = state;
  const [modalOpen, setModalOpen] = useState(false);
  const [userNfts, setUserNfts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [newDm, setNewDm] = useState({
    sender_nft_id: '',
    receiver_nft_contract: '',
    receiver_nft_token_id: '',
    content: ''
  });

  useEffect(() => {
    const fetchDms = async () => {
      try {
        const response = await Api.get('/api/v1/dms');
        setDms(response);
      } catch (error) {
        console.error("Error fetching DMs:", error);
      }
    };

    const fetchUserNfts = async () => {
      try {
        const response = await Api.get('/api/v1/nfts');
        setUserNfts(response);
        handleInputChange({ target: { name: 'sender_nft_id', value: response[0].id } });
      } catch (error) {
        console.error("Error fetching User NFTs:", error);
      }
    }

    const fethCollections = async () => {
      try {
        const response = await Api.get('/api/v1/collections');
        setCollections(response);
        handleInputChange({ target: { name: 'receiver_nft_contract', value: response[0].contract_address } });
      } catch (error) {
        console.error("Error fetching Collections:", error);
      }
    }

    fetchDms();
    fetchUserNfts();
    fethCollections();
    // Subscribe to Action Cable for real-time updates
    const dmSubscription = consumer.subscriptions.create("DmChannel", {
        received(data) {
            setDms(prevDms => [...prevDms, data]);
        }
    });

    renderAlert('dark', 'DMs are tied to your NFT. Avoid sharing personal information.', 5000);
  
    return () => { dmSubscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (modalOpen) {
      const modal = document.getElementById('new_dm_modal');
      modal.showModal();
    }
  }, [modalOpen]);

  const handleNewDmSubmit = async (e) => {
      e.preventDefault();
      if (!!user) {
        // loop through the user's nft's and ensure the receiver_nft is not owned by the user
        const targetTokenId = newDm.receiver_nft_token_id
        const targetContract = newDm.receiver_nft_contract
        const isUserSendingMessageToSelf = userNfts.some(nft => nft.token_id === targetTokenId && nft.collection.contract_address === targetContract)
        if (isUserSendingMessageToSelf) { return renderAlert('error', 'Why would you need to DM yourself?', 2000) }
      } else {
        return renderAlert('error', 'You must be logged in to send a DM', 2000);
      }
      try {
        console.log("Sending DM:", newDm);
        const response = await Api.post('/api/v1/dms', newDm);
        setDms([...dms, response]);
        setModalOpen(false);
        renderAlert('success', `DM sent!`, 2000);
      } catch (error) {
        console.error("Error sending DM:", error);
        renderAlert('error', 'Error sending DM. Please try again.', 2000);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  }

  if (isUserLoading) return <div>Loading...</div>;

  return !!user
  ? (

    <div className="flex">
      <div className="w-1/4 bg-white border-r border-t border-gray-300 overflow-y-auto">
        <header className="p-4 border-b border-gray-300 bg-indigo-600 text-white">
          <div className="flex flex-row">
            <h1 className="text-xl font-semibold">{truncateEthAddress(state.user.eth_address)}</h1>
            <button className="btn btn-accent btn-xs ml-auto" onClick={handleModalOpen}>New DM</button>  
          </div>
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
                      <div className="avatar" key={nft.id+'-avatar'}>
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
        {modalOpen && (
          <dialog id="new_dm_modal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Create a new DM</h3>
              <form onSubmit={handleNewDmSubmit} method="dialog">
                <div className="form-control">
                  <label htmlFor="sender_nft" className="label">Sending as</label>
                  <select id="sender_nft" className="select select-bordered" required onChange={handleInputChange} name="sender_nft_id" placeholder="Select one of your NFTs">
                    {userNfts?.map(nft => (
                      <option key={nft.id} value={nft.id}>{nft.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <div className="grid grid-cols-2 space-x-2 align-bottom">
                    <div className=''>
                      <label htmlFor="receiver_nft_contract_address" className="label">Sending to</label>
                      <select id="receiver_nft_contract_address" className="select select-bordered w-full" required onChange={handleInputChange} name="receiver_nft_contract" placeholder="Select a collection">
                        {collections?.map(collection => (
                          <option key={collection.id} value={collection.contract_address}>{collection.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="receiver_nft_contract_address" className="label">Token ID</label>
                      <input type="text" id="receiver_nft_token_id" className="input input-bordered w-full" placeholder="Enter NFT ID" required onChange={handleInputChange} name="receiver_nft_token_id" />
                    </div>
                  </div>
                </div>
                <div className="form-control">
                  <label htmlFor="message_content" className="label">Message</label>
                  <textarea id="message_content" className="textarea textarea-bordered" placeholder="Your message..." required onChange={handleInputChange} name="content"></textarea>
                </div>
                <div className="modal-action">
                  <button type="submit" className="btn">Send</button>
                  <button className="btn" onClick={() => setModalOpen(false)}>Cancel</button>
                </div>
              </form>
            </div>
        </dialog>
        )}
      </div>
    </div>
  )
  : <Loading variant='ball' />
};

export default InboxPage;