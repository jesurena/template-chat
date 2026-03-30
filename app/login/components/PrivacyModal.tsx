'use client';

import React from 'react';
import { Modal } from 'antd';
import { X, Shield } from 'lucide-react';

interface PrivacyModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function PrivacyModal({ visible, onClose }: PrivacyModalProps) {
    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            width={{
                xs: '90%',
                sm: '80%',
                md: '70%',
                lg: '60%',
                xl: '50%',
                xxl: '40%',
            }}
            classNames={{
                body: 'p-6 md:p-10'
            }}
        >
            <div className="flex flex-col items-center text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">Privacy Policy</h2>
                <p className="text-sm text-foreground/50 max-w-md">
                    How we handle and protect your data to ensure a secure AI experience.
                </p>
            </div>

            <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <section className="animate-in fade-in duration-300">
                    <h3 className="text-sm font-bold text-foreground/90 uppercase tracking-widest mb-3 flex items-center gap-2">
                        1. Information We Collect
                    </h3>
                    <p className="text-sm text-foreground/70 leading-relaxed pl-3.5">
                        When you use our services, we may collect information regarding your Google account (such as email, name, and profile picture) through Google OAuth. We also collect usage data to improve our services and understand how users interact with our AI platform.
                    </p>
                </section>

                <section className="animate-in fade-in duration-300 delay-75">
                    <h3 className="text-sm font-bold text-foreground/90 uppercase tracking-widest mb-3 flex items-center gap-2">
                        2. How We Use Information
                    </h3>
                    <p className="text-sm text-foreground/70 leading-relaxed pl-3.5">
                        We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our users. Your data helps train and improve our AI models to provide more accurate and relevant responses.
                    </p>
                </section>

                <section className="animate-in fade-in duration-300 delay-150">
                    <h3 className="text-sm font-bold text-foreground/90 uppercase tracking-widest mb-3 flex items-center gap-2">
                        3. Data Sharing
                    </h3>
                    <div className="p-4 rounded-xl border border-border bg-neutral/30 mb-3 ml-3.5">
                        <p className="text-sm font-bold text-text">
                            We do not sell your personal data to third parties.
                        </p>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed pl-3.5">
                        We may share information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
                    </p>
                </section>

                <section className="animate-in fade-in duration-300 delay-200">
                    <h3 className="text-sm font-bold text-foreground/90 uppercase tracking-widest mb-3 flex items-center gap-2">
                        4. Data Security
                    </h3>
                    <p className="text-sm text-foreground/70 leading-relaxed pl-3.5">
                        We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                    </p>
                </section>

                <section className="animate-in fade-in duration-300 delay-300 pb-4">
                    <h3 className="text-sm font-bold text-foreground/90 uppercase tracking-widest mb-3 flex items-center gap-2">
                        5. Updates
                    </h3>
                    <p className="text-sm text-foreground/70 leading-relaxed pl-3.5">
                        We reserve the right to change this policy from time to time by updating this page. Your continued use of the services agrees to the revised policy.
                    </p>
                </section>
            </div>

            <div className="pt-6 flex justify-center">
                <button
                    onClick={onClose}
                    className="px-8 py-2.5 bg-primary hover:opacity-90 text-white rounded-full font-bold shadow-md transition-all text-sm"
                >
                    I Understand
                </button>
            </div>
        </Modal>
    );
}
