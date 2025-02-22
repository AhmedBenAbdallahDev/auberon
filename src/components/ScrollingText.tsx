'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ScrollingText.module.css';

export default function ScrollingText() {
    const firstText = useRef<HTMLParagraphElement>(null);
    const secondText = useRef<HTMLParagraphElement>(null);
    const slider = useRef<HTMLDivElement>(null);
    let xPercent = 0;
    let direction = -1;

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.to(slider.current, {
            scrollTrigger: {
                trigger: document.documentElement,
                scrub: 0.25,
                start: 0,
                end: window.innerHeight,
                onUpdate: e => direction = e.direction * -1
            },
            x: "-500px",
        });

        requestAnimationFrame(animate);
    }, []);

    const animate = () => {
        if (xPercent < -100) {
            xPercent = 0;
        }
        else if (xPercent > 0) {
            xPercent = -100;
        }
        if (firstText.current && secondText.current) {
            gsap.set(firstText.current, { xPercent: xPercent });
            gsap.set(secondText.current, { xPercent: xPercent });
        }
        requestAnimationFrame(animate);
        xPercent += 0.1 * direction;
    };

    return (
        <div className={styles.sliderContainer}>
            <div ref={slider} className={styles.slider}>
                <p ref={firstText}>Transforming Ideas into Digital Excellence • </p>
                <p ref={secondText}>Transforming Ideas into Digital Excellence • </p>
            </div>
        </div>
    );
} 