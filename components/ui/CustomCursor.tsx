'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        const onMouseMove = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
            });
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
            });
        };

        const onMouseDown = () => gsap.to([cursor, follower], { scale: 0.8, duration: 0.2 });
        const onMouseUp = () => gsap.to([cursor, follower], { scale: 1, duration: 0.2 });

        const onMouseEnterLink = () => setIsHovering(true);
        const onMouseLeaveLink = () => setIsHovering(false);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        // Add hover effect to all links and buttons
        const links = document.querySelectorAll('a, button');
        links.forEach(link => {
            link.addEventListener('mouseenter', onMouseEnterLink);
            link.addEventListener('mouseleave', onMouseLeaveLink);
        });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            links.forEach(link => {
                link.removeEventListener('mouseenter', onMouseEnterLink);
                link.removeEventListener('mouseleave', onMouseLeaveLink);
            });
        };
    }, []);

    useEffect(() => {
        if (isHovering) {
            gsap.to(followerRef.current, { scale: 2.5, backgroundColor: 'rgba(184,137,42,0.1)', duration: 0.3 });
            gsap.to(cursorRef.current, { scale: 0, duration: 0.3 });
        } else {
            gsap.to(followerRef.current, { scale: 1, backgroundColor: 'transparent', duration: 0.3 });
            gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
        }
    }, [isHovering]);

    return (
        <div className="hidden lg:block">
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2 h-2 bg-brass z-[9999] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
                style={{ mixBlendMode: 'difference' }}
            />
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-10 h-10 border border-brass/30 z-[9998] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
                style={{ mixBlendMode: 'difference' }}
            />
        </div>
    );
}
