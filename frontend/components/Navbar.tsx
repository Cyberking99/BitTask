'use client';

import { useAuth } from './Providers';
import { Wallet, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAppKit } from '@reown/appkit/react';

export function Navbar() {
    const { isConnected, walletInfo, bnsName, connectWallet, disconnectWallet } = useAuth();
    const { open } = useAppKit();

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const displayAddress = bnsName || formatAddress(walletInfo?.addresses?.[2]?.address || walletInfo?.addresses?.[0]?.address || '');

    return (
        <nav className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800 text-white sticky top-0 z-50">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-300 hover:opacity-80 transition-opacity">
                BitTask
            </Link>

            <div className="flex items-center gap-6">
                {isConnected && (
                    <div className="flex items-center gap-4">
                        <Link href="/create" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors">
                            Post Task
                        </Link>
                        <Link href="/marketplace" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                            Marketplace
                        </Link>
                    </div>
                )}

                <div>
                    {isConnected ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
                                <Wallet size={16} className="text-indigo-400" />
                                <span className="text-sm font-mono text-gray-300">{displayAddress}</span>
                            </div>
                            <button
                                onClick={disconnectWallet}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors border border-red-600/30"
                            >
                                <LogOut size={16} />
                                Disconnect
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={connectWallet}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
                        >
                            <Wallet size={18} />
                            Connect Wallet
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
