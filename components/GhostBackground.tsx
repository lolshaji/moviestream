import React from 'react';

const Ghost: React.FC = () => (
    <>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </>
);

const GhostBackground: React.FC = () => {
    return (
        <>
            <style>{`
                .ghost-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    z-index: 1;
                    pointer-events: none;
                }

                @keyframes ghostMove {
                    0% {
                        transform: translateX(110vw) rotateZ(-90deg);
                    }
                    100% {
                        transform: translateX(-15vw) rotateZ(-90deg);
                    }
                }

                .ghost {
                    --ghost-white: #e7e6e6;
                    position: absolute;
                    background-color: var(--ghost-white);
                    background-image: radial-gradient(ellipse at 35% 40%, #000 8%, transparent 0%),
                        radial-gradient(ellipse at 65% 40%, #000 8%, transparent 0%),
                        radial-gradient(ellipse at 50% 60%, #000 8%, transparent 0%);
                    border-radius: 100% / 70% 70% 0% 0%;
                    opacity: 0.9;
                    mix-blend-mode: exclusion;
                    animation: ghostMove linear infinite;
                }

                .ghost div {
                    position: absolute;
                    width: 20%;
                    background-color: var(--ghost-white);
                }

                .ghost div:nth-of-type(1) {
                    left: 0;
                    border-radius: 100% / 0% 0% 50% 50%;
                }

                .ghost div:nth-of-type(2),
                .ghost div:nth-of-type(4) {
                    left: 20%;
                    border-radius: 100% / 50% 50% 0% 0%;
                    background-color: transparent;
                }

                .ghost div:nth-of-type(3) {
                    left: 40%;
                    border-radius: 100% / 0% 0% 60% 60%;
                }

                .ghost div:nth-of-type(4) {
                    left: 60%;
                }

                .ghost div:nth-of-type(5) {
                    left: 80%;
                    border-radius: 100% / 0% 0% 70% 70%;
                }

                /* Specific Ghost Styles */
                .ghost-1 {
                    width: 8vmin;
                    height: 12vmin;
                    top: 20vh;
                    animation-duration: 15s;
                    animation-delay: -2s;
                }
                .ghost-1 div:nth-of-type(1) { height: 7vmin; bottom: -6vmin; }
                .ghost-1 div:nth-of-type(2), .ghost-1 div:nth-of-type(4) { height: 4vmin; bottom: -3vmin; }
                .ghost-1 div:nth-of-type(3) { height: 4vmin; bottom: -3.95vmin; }
                .ghost-1 div:nth-of-type(5) { height: 3vmin; bottom: -2.9vmin; }
                
                .ghost-2 {
                    width: 6vmin;
                    height: 9vmin;
                    top: 50vh;
                    animation-duration: 20s;
                    animation-delay: -8s;
                }
                .ghost-2 div:nth-of-type(1) { height: 5vmin; bottom: -4.5vmin; }
                .ghost-2 div:nth-of-type(2), .ghost-2 div:nth-of-type(4) { height: 3vmin; bottom: -2.25vmin; }
                .ghost-2 div:nth-of-type(3) { height: 3vmin; bottom: -3vmin; }
                .ghost-2 div:nth-of-type(5) { height: 2.25vmin; bottom: -2.2vmin; }
                
                .ghost-3 {
                    width: 10vmin;
                    height: 15vmin;
                    top: 70vh;
                    animation-duration: 12s;
                    animation-delay: -12s;
                }
                .ghost-3 div:nth-of-type(1) { height: 9vmin; bottom: -8vmin; }
                .ghost-3 div:nth-of-type(2), .ghost-3 div:nth-of-type(4) { height: 5vmin; bottom: -4vmin; }
                .ghost-3 div:nth-of-type(3) { height: 5vmin; bottom: -5vmin; }
                .ghost-3 div:nth-of-type(5) { height: 4vmin; bottom: -3.8vmin; }

            `}</style>
            <div className="ghost-container">
                <div className="ghost ghost-1">
                    <Ghost />
                </div>
                 <div className="ghost ghost-2">
                    <Ghost />
                </div>
                <div className="ghost ghost-3">
                    <Ghost />
                </div>
            </div>
        </>
    );
};

export default GhostBackground;
