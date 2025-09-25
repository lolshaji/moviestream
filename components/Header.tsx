import React from 'react';
import { User } from '../types';

interface HeaderProps {
    user: User | null;
    onSearchClick: () => void;
    onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSearchClick, onProfileClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-md">
      <div className="px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
            <h1 className="logo-silver-orange cursor-pointer">THELDEN</h1>
        </div>
        
        <div className="flex items-center space-x-4 md:space-x-6">
            <button onClick={onSearchClick} className="text-gray-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
            <button onClick={onProfileClick} className="w-9 h-9 bg-gray-700 rounded-full overflow-hidden cursor-pointer border-2 border-transparent hover:border-red-500 transition-colors">
                {user && <img src={user.profilePicUrl} alt="profile" className="w-full h-full object-cover" />}
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;