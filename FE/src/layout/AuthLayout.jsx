    import React from 'react';

    const AuthLayout = ({ children }) => {
        return (
            <div className="flex bg-pattern-1 h-screen">
                <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12 flex flex-col items-center justify-center">
                    <div className="w-full max-w">
                        <h2 className="flex justify-center text-3xl font-semibold text-gray-800">Spend Wise</h2>
                        {children}
                    </div>
                </div>
                <div className="hidden md:block shadow-lg shadow-blue-100 w-[40vw] h-screen bg-blue-50 overflow-hidden p-12 relative">
                    <div className="w-48 h-48 rounded-[40px] bg-purple-600/10 absolute -top-10 -left-10 transform rotate-45" />
                    <div className="w-64 h-64 rounded-[40px] border-[20px] border-purple-500/10 absolute top-[25%] -right-16 transform rotate-12" />
                    <div className="w-56 h-56 rounded-[40px] bg-violet-500/10 absolute -bottom-12 -left-8 transform -rotate-12" />
                    <div className="relative z-10 flex flex-col justify-center h-full text-center text-slate-800">
                        <div className="flex justify-center mb-8">
                            <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                                <rect x="20" y="70" width="40" height="60" rx="8" fill="#A78BFA" />
                                <rect x="80" y="40" width="40" height="90" rx="8" fill="#8B5CF6" />
                                <rect x="140" y="20" width="40" height="110" rx="8" fill="#7C3AED" />
                                <circle cx="160" cy="40" r="25" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="4" />
                                <text x="160" y="45" textAnchor="middle" fontSize="24" fill="#7C3AED" fontWeight="bold">$</text>
                            </svg>
                        </div>

                        <h3 className="text-3xl font-bold mb-4 text-slate-900">
                            Unlock Financial Clarity
                        </h3>

                        <p className="text-slate-600 max-w-sm mx-auto mb-12">
                            Spend Wise helps you visualize your spending, manage your budget, and achieve your financial goals with ease.
                        </p>

                        <div className="absolute bottom-16 left-0 right-0 px-8">
                            <blockquote className="text-slate-500 italic">
                                “Beware of little expenses. A small leak will sink a great ship.”
                                <cite className="block not-italic mt-2 font-semibold text-slate-600">― Benjamin Franklin</cite>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    export default AuthLayout;
