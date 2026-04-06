'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useGoogle } from '@/hooks/auth/useGoogle';
import { useTheme } from '@/components/Providers/theme-provider';
import PrivacyModal from './PrivacyModal';

export default function LoginClient() {
    const [isClient, setIsClient] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    const { login } = useGoogle();
    const { isDark } = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsClient(true);
            if (window.location.hostname === "ics-ai") {
                const redirectUrl = process.env.NEXT_PUBLIC_ICS_LOGIN_URL || "http://localhost:3000/login?from=ics";
                window.location.replace(redirectUrl);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const result = await login(credentialResponse);
            console.log("Logged in:", result);
        } catch (err: unknown) {
            console.error("Login failed:", err);
            const errorResponse = err as { response?: { data?: { error?: string } } };
            alert(errorResponse?.response?.data?.error || "Login failed");
        }
    };

    const handleError = () => {
        console.error("Google login error event triggered");
    };

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

    if (!isClient) {
        return null;
    }

    return (
        <GoogleOAuthProvider clientId={clientId}>
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
                        <p className="text-gray-500 dark:text-gray-400 mb-6 text-[15px]">
                            Welcome back! Please login with your Google account to access the system.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-4">
                            <GoogleLogin
                                onSuccess={handleSuccess}
                                onError={handleError}
                                theme={isDark ? "filled_black" : "filled_blue"}
                                size="large"
                                shape="rectangular"
                                width="380"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-[13px] text-gray-500 dark:text-gray-400 font-medium">
                        <span>Copyright © {new Date().getFullYear()} AppDev Central</span>
                        <Link 
                            href="#" 
                            onClick={(e) => {
                                e.preventDefault();
                                setIsPrivacyModalOpen(true);
                            }}
                            className="text-text hover:text-foreground transition-colors"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                </div>

                <div className="hidden md:flex w-1/2 lg:w-[55%] bg-primary relative overflow-hidden flex-col justify-center px-12 lg:px-24 text-white">
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <Image
                            src="/bg.jpg"
                            alt="Background"
                            fill
                            className="object-cover mix-blend-overlay"
                            priority
                        />
                        <div className="absolute inset-0 bg-primary/95" />
                    </div>

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

            <PrivacyModal 
                visible={isPrivacyModalOpen}
                onClose={() => setIsPrivacyModalOpen(false)}
            />
        </GoogleOAuthProvider>
    );
}
