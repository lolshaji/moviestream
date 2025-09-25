import React from 'react';
import GhostBackground from './GhostBackground';
import { User } from '../types';

interface SplashScreenProps {
    phase: 'initialSplash' | 'auth';
    user: User | null;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ phase, user }) => {

    return (
        <div className="fixed inset-0 z-[80] overflow-hidden bg-black flex items-center justify-center">
            <style>{`
              .thelden-splash-title {
                font-family: 'Abril Fatface', cursive;
                font-size: clamp(2.5rem, 18vw, 15rem);
                background: linear-gradient(145deg, #c0c0c0, #ffffff, #ff9933, #d4af37, #ff8c00, #c0c0c0);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-fill-color: transparent;
                background-size: 400% 400%;
                animation: gradient-animation 8s ease infinite;
                transform: perspective(500px) rotateX(25deg);
                filter: drop-shadow(0px 10px 15px rgba(0,0,0,0.5));
                z-index: 10;
              }
              .welcome-title {
                font-family: 'Abril Fatface', cursive;
                font-size: clamp(2rem, 12vw, 8rem);
                text-align: center;
                background: linear-gradient(145deg, #ff9933, #ffffff, #c0c0c0);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-fill-color: transparent;
                background-size: 200% 200%;
                animation: gradient-animation 6s ease infinite, fade-in 1.5s ease-out forwards;
              }
            `}</style>
            
            <GhostBackground />

            <h1 className="thelden-splash-title">
                THELDEN
            </h1>
        </div>
    );
};

export default SplashScreen;