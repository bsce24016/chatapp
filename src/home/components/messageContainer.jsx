import React, { useEffect, useState, useRef } from 'react';
import userConversation from '../../Zustans/useConversation';
import { useAuth } from '../../context/AuthContext';
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from 'react-icons/io5';
import axios from 'axios';



const MessageContainer = ({ onBackUser }) => {
    const { messages, selectedConversation, setMessage } = userConversation();
    const { authUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [sendData, setSendData] = useState("");
    const lastMessageRef = useRef();


    const [bgIndex, setBgIndex] = useState(0);
    const backgrounds = [
        {
            name: "Emoji 💬",
            style: {
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Ctext x='0' y='40' font-size='40'%3E💬%3C/text%3E%3C/svg%3E")`,
                backgroundSize: '50px 50px',
                backgroundColor: '#f0f9ff'
            }
        },
        {
            name: "Gradient 😊",
            style: {
                backgroundImage: `linear-gradient(135deg, #dbeafe 0%, #f0f9ff 100%), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ctext x='0' y='45' font-size='40'%3E😊%3C/text%3E%3C/svg%3E")`,
                backgroundSize: 'auto, 60px 60px'
            }
        },
        {
            name: "Multi 💬😎",
            style: {
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ctext x='0' y='35' font-size='35'%3E💬%3C/text%3E%3Ctext x='40' y='70' font-size='35'%3E😎%3C/text%3E%3C/svg%3E")`,
                backgroundSize: '80px 80px',
                backgroundColor: '#f0f9ff'
            }
        },
        {
            name: "Soft Gradient",
            style: {
                backgroundImage: 'linear-gradient(to right, #fdfbfb, #ebedee)'
            }
        },
        {
            name: "Dark ✨",
            style: {
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Ctext x='0' y='40' font-size='40'%3E✨%3C/text%3E%3C/svg%3E")`,
                backgroundSize: '50px 50px',
                backgroundColor: '#111827'
            }
        }
    ];


    // Scroll to last message
    useEffect(() => {
        setTimeout(() => {
            lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    // Fetch all messages
    const getMessages = async (showSpinner = true) => {
        if (!selectedConversation?._id) return;
        if (showSpinner) setLoading(true);
        try {
            const res = await axios.get(`/api/message/${selectedConversation._id}`);
            setMessage(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.log(error);
        } finally {
            if (showSpinner) setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedConversation?._id) getMessages();
    }, [selectedConversation?._id]);

    // Input change
    const handelMessages = (e) => setSendData(e.target.value);

    // Send message
    const handelSubmit = async (e) => {
        e.preventDefault();
        if (!sendData.trim()) return;
        setSending(true);
        try {
            await axios.post(`/api/message/send/${selectedConversation._id}`, { message: sendData.trim() });
            setSendData('');
            await getMessages(false);
        } catch (error) {
            console.log(error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className='md:min-w-[500px] h-[99%] flex flex-col py-2'>
            {selectedConversation === null ? (
                <div className='flex items-center justify-center w-full h-full'>
                    <div className='px-4 text-center text-2xl text-gray-950 font-semibold flex flex-col items-center gap-2'>
                        <p className='text-2xl'>Welcome!!👋 {authUser.username}😉</p>
                        <p className="text-lg">Select a chat to start your Conversation</p>
                        <TiMessages className='text-6xl text-center' />
                    </div>
                </div>
            ) : (
                <>
    
                    <div className='flex justify-between gap-1 bg-sky-600 md:px-2 rounded-lg h-10 md:h-12'>
                        <div className='flex gap-2 md:justify-between items-center w-full'>
                            <div className='md:hidden ml-1 self-center'>
                                <button onClick={() => onBackUser(true)} className='bg-white rounded-full px-2 py-1 self-center'>
                                    <IoArrowBackSharp size={25} />
                                </button>
                            </div>
                            <div className='flex justify-between mr-2 gap-2'>
                                <div className='self-center'>
                                    <span className="text-2xl">😀</span>
                                </div>
                                <span className='text-gray-950 self-center text-sm md:text-xl font-bold'>
                                    {selectedConversation?.username}
                                </span>
                            </div>
                        </div>
                    </div>

        
                    <div className='flex-1 overflow-auto bg-cover bg-repeat relative'
                        style={backgrounds[bgIndex].style}>
                    
                        <div className="sticky top-0 z-10 flex justify-end p-1">
                            <button
                                type="button"
                                onClick={() => setBgIndex((bgIndex + 1) % backgrounds.length)}
                                className="px-2 py-1 bg-gray-200 text-[10px] md:text-xs rounded hover:bg-gray-300 shadow"
                                title="Change chat background"
                            >
                                {backgrounds[bgIndex].name}
                            </button>
                        </div>

                        {loading && (
                            <div className="flex w-full h-full flex-col items-center justify-center gap-4 bg-transparent">
                                <div className="loading loading-spinner"></div>
                            </div>
                        )}
                        {!loading && messages?.length === 0 && (
                            <p className='text-center text-black items-center'>Send a message to start Conversation</p>
                        )}
                        

                       {!loading && Array.isArray(messages) && messages.length > 0 && messages.map((message, idx) => {
  
  const myId        = String(authUser?._id ?? authUser?.id ?? "");
  const senderId    = String(message?.senderId?._id ?? message?.senderId ?? "");
  
  const reciverId   = String(message?.reciverId?._id ?? message?.reciverId ?? message?.receiverId ?? "");

  
  const isSender = myId && senderId === myId;


  const sideClass   = isSender ? 'chat-end' : 'chat-start';
  const bubbleClass = isSender ? 'bg-sky-600 text-white' : 'bg-gray-300 text-black';

  const refProp = (idx === messages.length - 1) ? { ref: lastMessageRef } : {};

  return (
    <div key={message?._id ?? idx} {...refProp} className={`chat ${sideClass}`}>
      <div className={`chat-bubble ${bubbleClass}`}>
        {message?.message}
      </div>
      <div className="chat-footer text-[10px] opacity-80">
        {new Date(message?.createdAt).toLocaleDateString('en-PK')}{" "}
        {new Date(message?.createdAt).toLocaleTimeString('en-PK', { hour: 'numeric', minute: 'numeric' })}
      </div>
    </div>
  );
})}


                    </div>

                    {/* Input Box */}
                    <form onSubmit={handelSubmit} className='rounded-full text-black'>
                        <div className='w-full rounded-full flex items-center bg-white'>
                            <input
                                value={sendData}
                                onChange={handelMessages}
                                required
                                id='message'
                                type='text'
                                className='w-full bg-transparent outline-none px-4 rounded-full'
                                placeholder='Type a message...'
                            />
                            <button type='submit'>
                                {sending ? (
                                    <div className='loading loading-spinner'></div>
                                ) : (
                                    <IoSend size={25} className='text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1' />
                                )}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default MessageContainer;
