'use client';

import { useState, useEffect } from 'react';
import { IoCopyOutline } from 'react-icons/io5';
import dynamic from 'next/dynamic';
import animationData from '@/data/confetti.json';
import Button from './Button';

// Dynamic import to disable SSR
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function EmailCopySection() {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 3500);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleCopy = () => {
        navigator.clipboard.writeText('rpancholi522@gmail.com');
        setCopied(true);
    };

    return (
        <div className="mt-5 relative">
            <div
                className={`absolute -bottom-5 right-0 transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <Lottie
                    animationData={animationData}
                    loop={copied}
                    autoplay={copied}
                    style={{ width: 400, height: 200 }}
                />
            </div>

            <Button
                title={copied ? 'Email is Copied!' : 'Copy my email address'}
                icon={<IoCopyOutline />}
                position="left"
                handleClick={handleCopy}
                otherClasses="!bg-[#161A31]"
            />
        </div>
    );
}
