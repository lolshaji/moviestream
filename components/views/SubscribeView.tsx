import React from 'react';

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

interface SubscribeViewProps {
    onSubscribe: () => void;
}

interface SubscriptionPlan {
    name: string;
    price: string;
    features: string[];
    highlight?: boolean;
}

const PLANS: SubscriptionPlan[] = [
    {
        name: 'Basic',
        price: '9.99',
        features: ['HD quality', 'Watch on 1 screen at a time', 'Ad-supported'],
    },
    {
        name: 'Standard',
        price: '15.49',
        features: ['Full HD quality', 'Watch on 2 screens at once', 'No ads', 'Download on 2 devices'],
        highlight: true,
    },
    {
        name: 'Premium',
        price: '22.99',
        features: ['4K + HDR quality', 'Watch on 4 screens at once', 'No ads', 'Download on 6 devices', 'Spatial audio'],
    },
];

const SubscribeView: React.FC<SubscribeViewProps> = ({ onSubscribe }) => {
    return (
        <div className="container mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white">Choose Your Plan</h1>
                <p className="text-zinc-400 mt-4 text-lg">Join Thelden and watch all you want. Cancel anytime.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {PLANS.map((plan) => (
                    <div 
                        key={plan.name}
                        className={`glass-card p-8 rounded-2xl flex flex-col border-2 transition-all duration-300 ${plan.highlight ? 'border-red-600 md:scale-105' : 'border-transparent hover:border-zinc-700'}`}
                    >
                        <h2 className={`text-2xl font-bold ${plan.highlight ? 'text-red-500' : 'text-white'}`}>{plan.name}</h2>
                        <p className="mt-4">
                            <span className="text-4xl font-extrabold">${plan.price}</span>
                            <span className="text-zinc-400">/month</span>
                        </p>

                        <ul className="space-y-4 mt-8 flex-grow text-zinc-300">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                    <CheckIcon className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={onSubscribe}
                            className={`w-full mt-8 font-bold py-3 rounded-md transition-all duration-200 hover:scale-105 ${plan.highlight ? 'bg-red-600 hover:bg-red-700' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                        >
                            Choose Plan
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubscribeView;