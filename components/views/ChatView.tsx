import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../../types';

interface ChatViewProps {
    currentUser: User | null;
    messages: Message[];
    onSendMessage: (text: string) => void;
    onSendAttachment: (imageUrl: string) => void;
}

const supportUser = {
    id: 999,
    name: 'Thelden Support',
    avatarUrl: 'https://picsum.photos/seed/support/64/64',
    isOnline: true,
};

const stickers = Array.from({ length: 12 }, (_, i) => `https://picsum.photos/seed/sticker${i}/100/100`);
const gifs = Array.from({ length: 12 }, (_, i) => `https://picsum.photos/seed/gif${i}/150/100`);

const ChatView: React.FC<ChatViewProps> = ({ currentUser, messages, onSendMessage, onSendAttachment }) => {
    const [newMessage, setNewMessage] = useState('');
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const [activeAttachmentTab, setActiveAttachmentTab] = useState<'stickers' | 'gifs'>('stickers');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const attachmentMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target as Node)) {
                setShowAttachmentMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [attachmentMenuRef]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        onSendMessage(newMessage);
        setNewMessage('');
    };
    
    const handleSendAttachmentClick = (imageUrl: string) => {
        onSendAttachment(imageUrl);
        setShowAttachmentMenu(false);
    }
    
    return (
        <div className="md:container md:mx-auto md:px-4 md:py-8 h-[calc(100vh-128px)] md:h-[calc(100vh-10rem)]">
            <div className="glass-card h-full flex overflow-hidden rounded-none md:rounded-2xl">
                <div className="w-full flex flex-col bg-zinc-900/50">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-white/10 flex items-center space-x-3 md:space-x-4 bg-black/20">
                         <div className="relative">
                            <img src={supportUser.avatarUrl} alt={supportUser.name} className="w-10 h-10 rounded-full"/>
                             {supportUser.isOnline && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-zinc-800"></span>}
                         </div>
                         <div>
                             <h3 className="text-lg font-bold">{supportUser.name}</h3>
                             <p className="text-sm text-green-400">{supportUser.isOnline ? 'Online' : 'Offline'}</p>
                         </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-grow p-6 overflow-y-auto hide-scrollbar space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex items-end gap-3 message-bubble ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'them' && <img src={supportUser.avatarUrl} className="w-8 h-8 rounded-full flex-shrink-0" alt="avatar" />}
                                <div className={`max-w-xs md:max-w-md rounded-2xl ${msg.text ? (msg.sender === 'me' ? 'bg-red-600 rounded-br-lg px-4 py-2' : 'bg-zinc-700 rounded-bl-lg px-4 py-2') : 'p-1 bg-black/20'}`}>
                                    {msg.text && <p>{msg.text}</p>}
                                    {msg.imageUrl && <img src={msg.imageUrl} alt="sent content" className="rounded-xl max-w-[150px] object-cover" />}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="relative p-4 bg-black/20 border-t border-white/10">
                        {showAttachmentMenu && (
                            <div ref={attachmentMenuRef} className="absolute bottom-full left-4 right-4 mb-2 w-auto max-w-sm h-64 glass-card p-3 rounded-xl fade-in-fast">
                                <div className="flex items-center border-b border-white/10 mb-2">
                                    <button onClick={() => setActiveAttachmentTab('stickers')} className={`py-2 px-4 text-sm font-semibold transition-colors ${activeAttachmentTab === 'stickers' ? 'text-white border-b-2 border-red-500' : 'text-zinc-400 hover:text-white'}`}>Stickers</button>
                                    <button onClick={() => setActiveAttachmentTab('gifs')} className={`py-2 px-4 text-sm font-semibold transition-colors ${activeAttachmentTab === 'gifs' ? 'text-white border-b-2 border-red-500' : 'text-zinc-400 hover:text-white'}`}>GIFs</button>
                                </div>
                                <div className="h-[calc(100%-40px)] overflow-y-auto hide-scrollbar">
                                    {activeAttachmentTab === 'stickers' && (
                                        <div className="grid grid-cols-4 gap-3 p-1">
                                            {stickers.map(url => <img key={url} src={url} onClick={() => handleSendAttachmentClick(url)} alt="sticker" className="w-full h-full object-cover rounded-md cursor-pointer hover:scale-110 transition-transform" />)}
                                        </div>
                                    )}
                                    {activeAttachmentTab === 'gifs' && (
                                         <div className="grid grid-cols-3 gap-2 p-1">
                                            {gifs.map(url => <img key={url} src={url} onClick={() => handleSendAttachmentClick(url)} alt="gif" className="w-full h-full object-cover rounded-md cursor-pointer hover:scale-110 transition-transform" />)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSendMessageSubmit} className="flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 p-2 shadow-lg">
                            <button type="button" onClick={() => setShowAttachmentMenu(!showAttachmentMenu)} className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-white/20 rounded-full text-white text-xl hover:bg-white/30 transition-colors">
                                +
                            </button>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder="Type anything..."
                                className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-white placeholder:text-gray-300/80 px-2"
                            />
                            <button type="submit" className="flex-shrink-0 bg-cyan-400 text-white font-bold py-2 px-6 rounded-full hover:bg-cyan-500 transition-colors shadow-md text-sm">
                                SEND
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatView;