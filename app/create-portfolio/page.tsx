"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import QuickTemplate from '../components/QuickTemplate';

const CreatePortfolio = () => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
    };
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen text-white">
            <div className="absolute inset-0 animated-gradient"></div>
            <div className="relative z-10 p-8 rounded-3xl w-full max-w-md">
                {selectedOption === 'quick-template' ? (
                    <QuickTemplate />
                ) : (
                    <>
                        <h2 className="text-3xl font-bold mb-6 text-center text-white">Create Your Portfolio</h2>
                        <div className="space-y-4">
                            <Link href="/import-robinhood" className="block w-full text-center bg-blue-500 text-white py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300">
                                Import from Robinhood
                            </Link>
                            <Link href="/custom-portfolio" className="block w-full text-center bg-blue-500 text-white py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300">
                                Custom Portfolio
                            </Link>
                            <button onClick={() => handleOptionClick('quick-template')} className="block w-full text-center bg-blue-500 text-white py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300">
                                Quick Template
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreatePortfolio;
