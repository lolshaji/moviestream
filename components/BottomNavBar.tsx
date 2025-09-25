import React, { useMemo } from 'react';
import { Tab, User } from '../types';
import { HomeIcon, ChartIcon, BookmarkIcon, SearchIcon, DownloadIcon } from './icons';

interface BottomNavBarProps {
    user: User | null;
    activeTab: Tab;
    onTabClick: (tab: Tab) => void;
    onSearchClick: () => void;
}

type NavItemData = {
    tab: Tab | 'Search';
    label: string;
    icon: React.FC<{ className?: string }>;
    action: () => void;
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({ user, activeTab, onTabClick, onSearchClick }) => {
    const navItems: NavItemData[] = useMemo(() => [
        { tab: 'Home', label: 'Home', icon: HomeIcon, action: () => onTabClick('Home') },
        { tab: 'Movies', label: 'Browse', icon: ChartIcon, action: () => onTabClick('Movies') },
        { tab: 'My List', label: 'My List', icon: BookmarkIcon, action: () => onTabClick('My List')},
        { tab: 'Downloads', label: 'Downloads', icon: DownloadIcon, action: () => onTabClick('Downloads')},
        { tab: 'Search', label: 'Search', icon: SearchIcon, action: onSearchClick },
    ], [onTabClick, onSearchClick]);

    const activeIndex = navItems.findIndex(item => item.tab === activeTab);

    const itemWidthPercent = 100 / navItems.length;
    const indicatorCenterPercent = activeIndex * itemWidthPercent + itemWidthPercent / 2;
    
    const indicatorStyle = {
        left: `${indicatorCenterPercent}%`,
        transform: `translateX(-50%) translateY(-50%)`,
    };

    return (
        <div className="bottom-nav-container">
            <div className="bottom-nav-bar">
                {activeIndex !== -1 && (
                    <div className="nav-item-indicator" style={indicatorStyle}></div>
                )}
                
                {navItems.map((item) => {
                    const isActive = activeTab === item.tab;
                    return (
                        <button 
                            key={item.tab}
                            onClick={item.action}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            aria-label={item.label}
                        >
                            <item.icon className="w-7 h-7" />
                            <span className="nav-item-label">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNavBar;