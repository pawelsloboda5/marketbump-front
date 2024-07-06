"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import StockDetails from './StockDetails'; // Assume this component will show the stock details for the selected template

type StockCategories = 'highGrowth' | 'overallEconomy' | 'politicianPicks';

const QuickTemplate = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<StockCategories | null>(null);
    const controls = useAnimation();

    const stocks: Record<StockCategories, string[]> = {
        highGrowth: ['AAPL', 'TSLA', 'AMZN', 'NFLX', 'GOOGL', 'NVDA', 'AMD', 'SQ', 'SHOP', 'ZM'],
        overallEconomy: ['SPY', 'VOO', 'VTI', 'DIA', 'QQQ', 'IWM', 'EFA', 'TLT', 'GLD', 'SLV'],
        politicianPicks: ['MSFT', 'FB', 'JNJ', 'V', 'UNH', 'PG', 'JPM', 'MA', 'HD', 'DIS'],
    };

    useEffect(() => {
        const handleResize = () => {
            const containerElems = document.querySelectorAll('.bubble-container');
            containerElems.forEach((container) => {
                const bubbles = (container as HTMLElement).querySelectorAll('.stock-bubble');
                const containerRect = (container as HTMLElement).getBoundingClientRect();
        
                bubbles.forEach((bubble) => {
                    const bubbleRect = (bubble as HTMLElement).getBoundingClientRect();
                    const maxX = containerRect.width - bubbleRect.width;
                    const maxY = containerRect.height - bubbleRect.height;
        
                    (bubble as HTMLElement).style.setProperty('--max-x', `${maxX}px`);
                    (bubble as HTMLElement).style.setProperty('--max-y', `${maxY}px`);
        
                    (bubble as HTMLElement).animate([
                        { transform: `translate(${Math.random() * maxX}px, ${Math.random() * maxY}px)` },
                        { transform: `translate(${Math.random() * maxX}px, ${Math.random() * maxY}px)` }
                    ], {
                        duration: 5000 + Math.random() * 5000,
                        iterations: Infinity,
                        direction: 'alternate',
                        easing: 'ease-in-out'
                    });
                });
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSelectTemplate = async (template: StockCategories) => {
        setSelectedTemplate(template);
        await controls.start({
            opacity: 0,
            y: -200,
            transition: { duration: 1, staggerChildren: 0.1 }
        });
        setTimeout(() => {
            setSelectedTemplate(template);
        }, 1000);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white space-y-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Select Your Quick Template</h2>
            <AnimatePresence>
                {!selectedTemplate ? (
                    <motion.div className="flex flex-wrap justify-center gap-8 w-full max-w-4xl">
                        {(Object.keys(stocks) as StockCategories[]).map((key) => (
                            <motion.div
                                key={key}
                                className="relative flex items-center justify-center w-56 h-56 bg-gray-700 rounded-full shadow-lg bubble-container"
                                onClick={() => handleSelectTemplate(key)}
                                whileHover={{ scale: 1.1 }}
                                initial={{ y: 0 }}
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
                                exit={{ opacity: 0, y: -200, transition: { duration: 1 } }}
                            >
                                <div className="relative w-full h-full flex items-center justify-center">
                                    {stocks[key].map((ticker) => (
                                        <div
                                            key={ticker}
                                            className="absolute stock-bubble w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-sm text-white"
                                        >
                                            {ticker}
                                        </div>
                                    ))}
                                </div>
                                <span className="absolute bottom-12 z-50 text-lg font-bold capitalize bg-gray-900 rounded-lg p-2">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <StockDetails stocks={stocks[selectedTemplate]} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default QuickTemplate;
