import React, { useState, useEffect } from 'react';
import GhostBackground from './GhostBackground';

// --- ICONS ---
const GoogleIcon = () => <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="#EA4335" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.386-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.85l3.44-3.44C18.254 2.189 15.5 1 12.24 1 5.47 1 0 6.48 0 13.25s5.47 12.25 12.24 12.25c7.03 0 11.95-4.838 11.95-12.034 0-.785-.073-1.564-.21-2.321H12.24z"></path></svg>;
const AppleIcon = () => <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M15.226 1.455C14.013.91 12.423.5 10.95.5c-2.22 0-4.59.813-5.992 2.458-1.583 1.83-2.61 4.36-2.61 6.877 0 2.852 1.22 5.56 2.85 7.378 1.43 1.58 3.53 2.586 5.61 2.586 2.22 0 3.326-.78 4.997-2.334 1.62-1.527 2.637-3.924 2.637-6.522 0-2.88-1.22-5.59-2.85-7.378a5.132 5.132 0 00-3.166-1.514zM11.604 22.5c.338 0 .68-.027 1.02-.082-1.5-.405-2.915-1.35-3.864-2.585-1.32-1.675-2.213-4.02-2.213-6.238 0-2.388.945-4.943 2.36-6.69.945-1.16 2.304-1.996 3.81-2.292-.338 0-.68.028-1.02.082-2.13.35-3.92.996-5.024 2.106C3.47 8.01 2.5 10.514 2.5 12.97c0 2.29.78 4.79 2.05 6.09 1.48 1.5 3.59 2.44 5.054 2.44z"></path></svg>;

interface AuthViewProps {
    onAuthSuccess: (email: string) => void;
}

const ADMIN_EMAILS = ['ayahakuttyv@gmail.com', 'ktmuhammedrayyan@gmail.com'];

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [mode, setMode] = useState<'signup' | 'signin'>('signup');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            alert('Please enter an email address.');
            return;
        }

        if (mode === 'signin') {
            if (ADMIN_EMAILS.includes(email.toLowerCase())) {
                if (password === 'password@!123') {
                    onAuthSuccess(email);
                } else {
                    alert('Invalid password for admin account.');
                }
            } else {
                // For demo purposes, any other user is valid.
                // In a real app, you would check against a database.
                onAuthSuccess(email);
            }
        } else { // 'signup' mode
            // For demo purposes, signup is successful with any email.
            // In a real app, you would check if the email is already registered, etc.
            onAuthSuccess(email);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-end md:items-center justify-center p-4">
            <GhostBackground />
            <div 
                className={`bg-black/70 backdrop-blur-2xl border border-white/10 rounded-t-3xl md:rounded-3xl p-6 md:p-8 w-full max-w-md relative transition-transform duration-700 ease-out transform ${isMounted ? 'translate-y-0' : 'translate-y-full'}`}
                style={{backgroundImage: 'radial-gradient(circle at top, rgba(255,255,255,0.05), transparent 60%)'}}
            >
                <div className="flex justify-center mb-6">
                    <div className="bg-zinc-800/80 p-1 rounded-full flex items-center space-x-1">
                        <button onClick={() => setMode('signup')} className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${mode === 'signup' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}>Sign up</button>
                        <button onClick={() => setMode('signin')} className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${mode === 'signin' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}>Sign in</button>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center mb-6 text-white">{mode === 'signup' ? 'Create an account' : 'Sign in to Thelden'}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} required className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50" />
                            <input type="text" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} required className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50" />
                        </div>
                    )}

                    <div className="relative">
                        <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50" />
                    </div>

                    <div className="relative">
                         <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50" />
                    </div>
                    
                    <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors duration-300">
                        {mode === 'signup' ? 'Create an account' : 'Sign In'}
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <hr className="flex-grow border-zinc-700" />
                    <span className="px-4 text-xs text-zinc-500">OR SIGN IN WITH</span>
                    <hr className="flex-grow border-zinc-700" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center space-x-2 bg-white/5 border border-white/10 rounded-lg py-3 text-white hover:bg-white/10 transition-colors"><GoogleIcon/> <span>Google</span></button>
                    <button className="flex items-center justify-center space-x-2 bg-white/5 border border-white/10 rounded-lg py-3 text-white hover:bg-white/10 transition-colors"><AppleIcon/> <span>Apple</span></button>
                </div>
                
                {mode === 'signup' && (
                    <p className="text-center text-xs text-zinc-500 mt-6">By creating an account, you agree to our Terms & Service</p>
                )}

            </div>
        </div>
    );
};

export default AuthView;
