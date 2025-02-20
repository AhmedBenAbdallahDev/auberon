'use client'
import { useEffect } from "react";
import { gsap } from "gsap";

export default function HeroContent() {
    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(".hero-button", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.3, delay: 0.15, ease: "power1.out", });
    }, []);

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <div className="absolute h-full pointer-events-none inset-0 flex items-center justify-center bg-slate-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            <button
                type="button"
                className="hero-button text-sm relative z-20 px-4 py-2 bg-white text-black rounded-full text-center creativeBtn"
            >
                <span>Get Started</span>
            </button>
        </div>
    )
}
