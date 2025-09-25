import React, { useState, useRef, useEffect } from 'react';
import { User } from '../../types';

interface ProfileViewProps {
    user: User;
    onUpdateProfile: (name: string, picUrl: string) => void;
    onLogout: () => void;
    onRequestClick: () => void;
    onRateUsClick: () => void;
    onAdminClick: () => void;
    onChatClick: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateProfile, onLogout, onRequestClick, onRateUsClick, onAdminClick, onChatClick }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [profilePicPreview, setProfilePicPreview] = useState(user.profilePicUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset form if user changes
    useEffect(() => {
        setName(user.name);
        setProfilePicPreview(user.profilePicUrl);
        setProfilePic(null);
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfilePic(file);
            setProfilePicPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = () => {
        onUpdateProfile(name, profilePicPreview);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setName(user.name);
        setProfilePic(null);
        setProfilePicPreview(user.profilePicUrl);
        setIsEditing(false);
    }

    return (
        <div className="container mx-auto px-6 py-8 flex justify-center fade-in">
            <div className="w-full max-w-md my-list-glass-card p-8 text-center space-y-8">
                <div>
                    <div className="relative w-32 h-32 mx-auto">
                        <img 
                            src={profilePicPreview} 
                            alt="profile" 
                            className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-zinc-700"
                        />
                         {isEditing && (
                             <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center border-2 border-zinc-800 hover:bg-red-500 transition-colors"
                                aria-label="Change profile picture"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                            </button>
                         )}
                    </div>
                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    {isEditing ? (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full text-center bg-zinc-700/50 border-b-2 border-red-500 rounded-t-lg text-2xl font-bold mt-4 py-1 focus:outline-none"
                        />
                    ) : (
                        <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
                    )}
                    <p className="text-zinc-400">{user.email}</p>
                </div>

                {isEditing ? (
                    <div className="flex space-x-4">
                        <button onClick={handleSave} className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors">
                            Save Changes
                        </button>
                         <button onClick={handleCancel} className="w-full bg-zinc-600 text-white font-bold py-3 rounded-lg hover:bg-zinc-500 transition-colors">
                            Cancel
                        </button>
                    </div>
                ) : (
                     <button onClick={() => setIsEditing(true)} className="w-full bg-zinc-700 text-white font-bold py-3 rounded-lg hover:bg-zinc-600 transition-colors">
                        Edit Profile
                    </button>
                )}
                
                <div className="space-y-4 text-left border-t border-zinc-700 pt-8">
                    <button onClick={onChatClick} className="w-full glass-glow-button text-white font-semibold py-3 px-4 rounded-lg text-left">
                        Chat with Support
                    </button>
                    <button onClick={onRequestClick} className="w-full glass-glow-button text-white font-semibold py-3 px-4 rounded-lg text-left">
                        Request a Movie
                    </button>
                    <button onClick={onRateUsClick} className="w-full glass-glow-button text-white font-semibold py-3 px-4 rounded-lg text-left">
                        Rate Us
                    </button>
                    {user.role === 'admin' && (
                        <button onClick={onAdminClick} className="w-full glass-glow-button text-white font-semibold py-3 px-4 rounded-lg text-left">
                            Admin Panel
                        </button>
                    )}
                </div>

                <button
                    onClick={onLogout}
                    className="w-full bg-red-600/30 border border-red-600/50 text-red-400 font-bold py-3 rounded-lg hover:bg-red-600/50 hover:text-red-300 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ProfileView;