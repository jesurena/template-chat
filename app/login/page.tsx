'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from 'antd';
import StackIcon from 'tech-stack-icons';

export default function LoginPage() {
    const handleGoogleLogin = () => {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        window.location.href = `${backendUrl}/auth/google/redirect`;
    };

    return (
        <div className="flex min-h-screen bg-background">
            <div className="flex w-full md:w-1/2 lg:w-[45%] flex-col justify-between p-8 sm:p-12 relative z-10">
                <div>
                    <Link href="/" className="flex items-center gap-2 group w-max">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                            <span className="text-white font-bold text-xs">AC</span>
                        </div>
                        <span className="text-xl font-bold text-text tracking-tight">
                            appdev central
                        </span>
                    </Link>
                </div>

                <div className="flex-1 flex flex-col justify-center w-full max-w-[420px] mx-auto text-center">
                    <h1 className="text-[34px] font-bold text-foreground mb-2.5 tracking-tight">Login your account</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-10 text-[15px]">
                        Welcome back! Please login with your Google account to access the system.
                    </p>

                    <div className="flex flex-col gap-4">
                        <Button
                            onClick={handleGoogleLogin}
                            size="large"
                            className="flex items-center justify-center w-full gap-3 px-4 py-6 border border-border rounded-xl hover:bg-neutral transition-all font-semibold text-foreground hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-transparent"
                        >
                            <StackIcon name="google" className="w-5 h-5" />
                            Continue with Google
                        </Button>
                    </div>
                </div>

                <div className="flex justify-between items-center text-[13px] text-gray-500 dark:text-gray-400 font-medium">
                    <span>Copyright © {new Date().getFullYear()} AppDev Central</span>
                    <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                </div>
            </div>

            <div className="hidden md:flex w-1/2 lg:w-[55%] bg-linear-to-br from-accent-1 to-primary relative overflow-hidden flex-col justify-center px-12 lg:px-24 text-white">
                <div className="relative z-10 w-full max-w-xl">
                    <h2 className="text-[40px] lg:text-[46px] font-bold mb-6 leading-[1.15] tracking-tight">
                        Experience the power of intelligence.
                    </h2>
                    <p className="text-blue-100 text-[18px] lg:text-[19px] leading-relaxed mb-12 opacity-90">
                        Log in to interact with our advanced AI. As your versatile companion for answering questions, generating ideas, and problems.
                    </p>
                </div>
            </div>
        </div>
    );
}
