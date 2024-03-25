import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Api from '../services/api';
import consumer from '../channels/consumer';
import renderAlert from './shared/renderAlert';
import { useAppContext } from '../services/context';

const DM = () => {
    const { dm_id } = useParams();
    const { state } = useAppContext()
    const { user } = state;
    const [dm, setDm] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!dm_id) return;
        const fetchDmData = async () => {
            try {
                const dmResponse = await Api.get(`/api/v1/dms/${dm_id}`);
                setDm(dmResponse);
                setMessages(dmResponse.messages);
                setNewMessage({
                    dm_id: dm_id,
                    content: '',
                    sender_nft_id: dmResponse.user_nft_id,
                });
            } catch (err) { setError(err.message); } 
            finally { setIsLoading(false) }
        };

        fetchDmData();

        const subscription = consumer.subscriptions.create({ channel: "DmChannel", dm_id: dm_id }, {
            disconnected() {
                setTimeout(() => {
                    consumer.connect();
                  }, 10000); // Reconnect after 10 seconds
            },
            received(data) { 
                console.log("Received DM:", data)
                setMessages(prevMessages => [...prevMessages, data]) 
            }
        });

        return () => { subscription.unsubscribe() };
    }, [dm_id]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.content || newMessage.content == '') return;
        try {
            const response = await Api.post(`/api/v1/dms/${dm_id}/messages`, newMessage);
            setMessages([...messages, response]);
            setNewMessage('');
        } catch (err) { console.error("Error sending message:", err) }
    };

    if (!user) return <div>Please log in to view your DMs.</div>;
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // use dm.nfts (nft has nft.name) to create a conversation name
    const conversationName = dm?.nfts.map((nft, index) => {
        if (index === dm.nfts.length - 1) { return `& ${nft.name}` } 
        else if (index === dm.nfts.length - 2) { return `${nft.name}` } 
        else { return `${nft.name},` }
    }).join(' ');

    return (
        <div className="flex flex-col h-[calc(100vh-3rem-48px)] md:h-[calc(100vh-4rem-72px)]">
            <h2 className="text-center font-bold my-4 border-b border-gray-300 p-4">{conversationName}</h2>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3 p-3">
                    <div className="text-gray-400 font-light text-sm text-center">{dm.created_at_pretty_with_time.toString()}</div>
                    {messages.map((message, index) => (
                        <React.Fragment key={index}>
                            <div className={`flex ${message.message_type === 'received' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`flex items-center space-x-2 p-2 rounded-md ${message.message_type === 'received' ? 'bg-blue-100' : 'bg-green-100'}`}>
                                    {/* Avatar */}
                                    <div className="avatar">
                                        <div className={`w-8 h-8 mask mask-squircle `}>
                                            <Link to={`/collections/${message.nft_collection_slug}/${message.nft_token_id}`}>
                                                <img 
                                                    src={message.nft_image_url} alt={`${message.nft_name}'s avatar`} 
                                                    className={message.message_type === 'received' ? 'float-left' : 'float-right'}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                    {/* Message */}
                                    <div className={`flex flex-col ${message.message_type === 'received' ? 'items-start' : 'items-end'}`}>
                                        <strong>{message.nft_name}</strong>
                                        <p>{message.content}</p>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                    <div ref={endOfMessagesRef}></div>
                </div>
            </div>
            <div className="sticky bottom-0 bg-white p-4">
                <form onSubmit={sendMessage} className="flex flex-col items-center">
                    <textarea
                        value={newMessage.content || ''}
                        onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                        placeholder="Type your message here..."
                        className="w-full p-2 border rounded-md"
                        rows="3"
                    ></textarea>
                    <button type="submit" className="btn btn-wide btn-primary mt-2 ml-auto">Send</button>
                </form>
            </div>
        </div>
    );
};

export default DM;

