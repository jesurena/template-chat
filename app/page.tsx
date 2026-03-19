'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from "@/components/Sidebars/Sidebar";
import LoginPage from "./login/page";
import Chat from "./chat/page";

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        setIsAuthenticated(!!token);
    }, []);

    if (isAuthenticated === null) {
        return <div className="min-h-screen bg-background flex items-center justify-center"></div>;
    }

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-white">
            <Sidebar />
            <main className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
                <Chat />
            </main>
        </div>
    );
}
