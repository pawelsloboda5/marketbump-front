"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface StockData {
    symbol: string;
    currentPrice: string | number;
    high?: number;
    low?: number;
    open?: number;
    volume?: number;
}

const StockDetails = ({ stocks }: { stocks: string[] }) => {
    const [stockData, setStockData] = useState<StockData[]>([]);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    useEffect(() => {
        const fetchStockData = async () => {
            const fetchedData = await Promise.all(stocks.map(async (ticker) => {
                const response = await fetch(`${BASE_URL}/api/stocks/${ticker}`);
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    const latestData = data.results[0];
                    return { 
                        symbol: ticker, 
                        currentPrice: latestData.c,
                        high: latestData.h,
                        low: latestData.l,
                        open: latestData.o,
                        volume: latestData.v,
                    };
                }
                return { symbol: ticker, currentPrice: 'N/A' };
            }));
            setStockData(fetchedData);
        };
        
        fetchStockData();
    }, [stocks, BASE_URL]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen text-white"
        >
            <h2 className="text-3xl font-bold mb-8 text-center">Selected Stocks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stockData.map((stock, index) => (
                    <div key={index} className="p-4 bg-gray-700 rounded-lg shadow-md w-full">
                        <h3 className="text-xl font-bold mb-2">{stock.symbol}</h3>
                        <p>Current Price: ${stock.currentPrice}</p>
                        {stock.high !== undefined && <p>High: ${stock.high}</p>}
                        {stock.low !== undefined && <p>Low: ${stock.low}</p>}
                        {stock.open !== undefined && <p>Open: ${stock.open}</p>}
                        {stock.volume !== undefined && <p>Volume: {stock.volume}</p>}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default StockDetails;
