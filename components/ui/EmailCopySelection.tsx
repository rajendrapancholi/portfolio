"use client";

import { useState, useEffect } from 'react';
import { IoCopyOutline } from 'react-icons/io5';
import dynamic from 'next/dynamic';

import animationData from '@/data/confetti.json'; // keep your path
import Button from './Button'; // your Button component

const Lottie = dynamic(() => import('react-lottie'), { ssr: false });

export default function EmailCopySection() {
    const [copied, setCopied] = useState(false);

    // Optional: auto-reset after ~3-5 seconds (better UX)
    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 3500);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const defaultOptions = {
        loop: copied,
        autoplay: copied,
        animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

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
                <Lottie options={defaultOptions} height={200} width={400} />
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