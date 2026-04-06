'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { Modal } from 'antd';
import confetti from 'canvas-confetti';
import { MessageSquare, Sparkles, Shield, PartyPopper, ArrowRight, Check } from 'lucide-react';
import { useFetchProfile, useUpdateFirstTime } from '@/hooks/auth/useGoogle';

interface TourContextType {
    startTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function useTour() {
    const context = useContext(TourContext);
    if (!context) {
        throw new Error('useTour must be used within a TourProvider');
    }
    return context;
}

const fireConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors: ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#22d3ee'],
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors: ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#22d3ee'],
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    };
    frame();
};

export function TourProvider({ children }: { children: React.ReactNode }) {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);
    const { data: profile } = useFetchProfile();
    const { mutate: updateFirstTime } = useUpdateFirstTime();

    useEffect(() => {
        if (profile?.isFirstTime) {
            const timer = setTimeout(() => setShowOnboarding(true), 0);
            return () => clearTimeout(timer);
        }
    }, [profile]);

    const startTour = () => {
        setShowOnboarding(false);
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

        const driverObj = driver({
            showProgress: true,
            animate: true,
            allowClose: true,
            popoverClass: 'app-tour-theme',
            onDestroyed: () => {
                fireConfetti();
                setShowCongrats(true);
                if (profile?.isFirstTime) {
                    updateFirstTime(false);
                }
            },
            steps: [
                {
                    element: isMobile ? '#tour-mobile-menu' : '#tour-chat-history',
                    popover: {
                        title: isMobile ? 'Menu & History' : 'Sidebar & History',
                        description: isMobile
                            ? 'Tap here to see your chat history, manage your sessions, or adjust your settings.'
                            : 'Access all your previous conversations quickly and manage your history from here.',
                        side: isMobile ? 'bottom' : 'right',
                        align: 'start'
                    }

                },
                {
                    element: isMobile ? '#tour-mobile-menu' : '#tour-chat-history #tour-user-profile',
                    popover: {
                        title: 'Profile & Settings',
                        description: 'Click here to switch between Dark/Light modes, manage your connections, or redo this tutorial anytime.',
                        side: isMobile ? 'bottom' : 'right',
                        align: 'start'
                    }

                },
                {
                    element: '#tour-select-context',
                    popover: {
                        title: 'Strategy Context',
                        description: 'Select a client to enable the Strategy Context Engine. This allows you to generate tailored business questions or chat directly.',
                        side: 'bottom',
                        align: 'center',
                        onNextClick: () => {
                            const card = document.querySelector('#tour-company-card');
                            const isSelected = card?.classList.contains('border-accent-1');
                            if (card && !isSelected) {
                                (card as HTMLElement).click();
                                setTimeout(() => driverObj.moveNext(), 100);
                            } else {
                                driverObj.moveNext();
                            }
                        }
                    }

                },
                {
                    element: '#tour-generate-questions',
                    popover: {
                        title: 'Generate Questions',
                        description: 'Once a client is selected, use this to frame specific strategy questions based on industry keywords.',
                        side: 'top',
                        align: 'center'
                    }

                },
                {
                    element: '#tour-client-chips',
                    popover: {
                        title: 'Active Context',
                        description: 'Your selected clients appear here. The AI uses this context for its response.',
                        side: 'top',
                        align: 'center'
                    }

                },
                {
                    element: '#tour-add-context',
                    popover: {
                        title: 'Expand Context',
                        description: 'Need more data? Use the plus button to add more clients or generate specialized strategy questions for your current conversation.',
                        side: 'top',
                        align: 'center'
                    }

                },
                {
                    element: '#tour-ask-ai',
                    popover: {
                        title: 'Start Chatting',
                        description: 'You\'re ready to go! Ask the AI anything about your project standards or client context.',
                        side: 'top',
                        align: 'center'
                    }
                }
            ]

        });

        driverObj.drive();
    };

    const skipTour = () => {
        setShowOnboarding(false);
        localStorage.setItem('isFirstTime', 'true');
        if (profile?.isFirstTime) {
            updateFirstTime(false);
        }
    };

    const features = [
        {
            icon: <MessageSquare size={18} className="text-accent-1" />,
            title: 'Smart Conversations',
            desc: 'Chat with AI that understands your business context.',
        },
        {
            icon: <Sparkles size={18} className="text-accent-1" />,
            title: 'Strategy Engine',
            desc: 'Generate tailored questions from client data.',
        },
        {
            icon: <Shield size={18} className="text-accent-1" />,
            title: 'Context-Aware',
            desc: 'Select clients to get hyper-relevant answers.',
        },
    ];

    return (
        <TourContext.Provider value={{ startTour }}>
            {children}

            {/* Welcome / Onboarding Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-lg font-bold text-foreground">
                        <div className="w-8 h-8 rounded-full bg-accent-1/10 flex items-center justify-center">
                            <Sparkles size={18} className="text-accent-1" />
                        </div>
                        <span>Welcome to AppDev</span>
                    </div>
                }
                open={showOnboarding}
                onCancel={skipTour}
                centered
                width={540}
                className="onboarding-modal"
                styles={{
                    mask: { backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0,0,0,0.5)' },
                    body: { padding: '8px 0' }
                }}
                footer={
                    <div className="flex flex-col gap-3 p-4 pt-4">
                        <button
                            onClick={startTour}
                            className="flex items-center justify-center gap-2 w-full py-2 bg-accent-1 hover:opacity-90 text-white transition-all rounded-full text-[15px] font-bold shadow-lg active:scale-[0.98]"
                        >
                            Take the Tour <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={skipTour}
                            className="w-full text-gray-400 hover:text-foreground text-sm font-medium transition-colors"
                        >
                            Skip for now
                        </button>
                    </div>
                }
            >
                <div className="flex flex-col gap-4 py-2">
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Your AI-powered workspace for strategy and project insights. Here is what you can do:
                    </p>

                    <div className="flex flex-col gap-2.5">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3.5 px-4 py-3.5 bg-neutral/50 border border-border/50 rounded-2xl text-left transition-all hover:bg-neutral"
                            >
                                <div className="w-9 h-9 rounded-full bg-accent-1/10 flex items-center justify-center shrink-0">
                                    {f.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground leading-tight">{f.title}</p>
                                    <p className="text-xs text-gray-500 leading-snug mt-0.5">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* Congrats Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-lg font-bold text-foreground">
                        <div className="w-8 h-8 rounded-full bg-accent-1/10 flex items-center justify-center">
                            <PartyPopper size={18} className="text-accent-1" />
                        </div>
                        <span>You&apos;re All Set</span>
                    </div>
                }
                open={showCongrats}
                onCancel={() => setShowCongrats(false)}
                centered
                width={420}
                className="onboarding-modal"
                styles={{
                    mask: { backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0,0,0,0.5)' },
                    body: { padding: '8px 0' }
                }}
                footer={
                    <div className="flex flex-col gap-3 p-4 pt-4">
                        <button
                            onClick={() => setShowCongrats(false)}
                            className="flex items-center justify-center gap-2 w-full py-2 bg-accent-1 hover:opacity-90 text-white transition-all rounded-full text-[15px] font-bold shadow-lg active:scale-[0.98]"
                        >
                            Start Chatting
                        </button>
                    </div>
                }
            >
                <div className="flex flex-col items-center text-center gap-4 py-4">
                    <div className="w-14 h-14 rounded-full bg-accent-1/10 flex items-center justify-center">
                        <Check size={28} className="text-accent-1" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-foreground mb-1">
                            Tour Complete
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-[300px] mx-auto">
                            You&apos;ve completed the tour. Start chatting with the AI or explore the Strategy Context Engine to unlock powerful insights.
                        </p>
                    </div>
                </div>
            </Modal>
        </TourContext.Provider>
    );
}

