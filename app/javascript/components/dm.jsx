import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Api from '../services/api';
import consumer from '../channels/consumer';

const DM = () => {
    const { dm_id } = useParams();
    const [dm, setDm] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDmData = async () => {
            try {
                const dmResponse = await Api.get(`/api/v1/dms/${dm_id}`);
                setDm(dmResponse);
                setMessages(dmResponse.messages);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDmData();

        // Create a subscription specific to this DM
        const subscription = consumer.subscriptions.create({ channel: "DmChannel", dm_id: dm_id }, {
            connected() {
                console.log("Connected to DM channel", dm_id);
            },
            disconnected() {
                console.log("Disconnected from DM channel", dm_id);
            },
            received(data) {
                // Update component state with the new message
                console.log("Received message:", data);
                setMessages(prevMessages => [...prevMessages, data]);
            }
        });

        // Cleanup subscription on component unmount
        return () => {
            subscription.unsubscribe();
        };
    }, [dm_id]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            // Replace this with your API call to send a message
            // Assuming the API responds with the sent message including the nft_image_url, etc.
            const response = await Api.post(`/api/v1/dms/${dm_id}/messages`, { content: newMessage });
            setMessages([...messages, response]);
            setNewMessage('');
        } catch (err) {
            console.error("Error sending message:", err);
            // Handle error
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2 className="text-center font-bold my-4">{dm?.name || 'Convo'}</h2>
            <div className="flex flex-col space-y-2">
                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.message_type === 'received' ? 'justify-start' : 'justify-end'}`}>
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
                ))}
            </div>
            {/* Message Input */}
            <form onSubmit={sendMessage} className="mt-4 flex flex-col items-center">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full p-2 border rounded-md"
                    rows="3"
                ></textarea>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2">Send</button>
            </form>
        </div>
    );
};

export default DM;
