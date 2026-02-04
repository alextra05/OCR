import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const IntroSection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Circle Reveal: Starts at 0% (invisible/small) -> Expands to 150% (full screen)
    const clipPathSize = useTransform(scrollYProgress, [0, 0.4], ["0%", "150%"]);

    // Create the actual clip-path string
    const clipPath = useTransform(clipPathSize, size => `circle(${size} at 50% 50%)`);

    // Title Fade Out
    const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const titleY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

    return (
        <section ref={containerRef} className="relative h-[200vh] bg-black">
            <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">

                {/* TITULO */}
                <motion.div
                    style={{ opacity: titleOpacity, y: titleY }}
                    className="absolute z-20 text-center pointer-events-none"
                >
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">
                        ANÁLISIS DE<br />DOCUMENTACIÓN
                    </h1>
                    <p className="text-cyan-400 font-mono tracking-widest uppercase">Haz scroll para iniciar</p>
                </motion.div>

                {/* --- LAYER 1: BLURRED BACKGROUND (Base) --- */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[80%] max-w-4xl aspect-[1.4/1] bg-cover bg-center rounded-xl overflow-hidden opacity-30 blur-sm grayscale"
                        style={{ backgroundImage: "url('/permiso_circulacion.png')" }}
                    />
                </div>

                {/* --- LAYER 2: REVEAL (The "Lupa") --- */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center z-10"
                    style={{ clipPath }}
                >
                    {/* Same image, but clear and full color */}
                    <div className="w-[80%] max-w-4xl aspect-[1.4/1] bg-cover bg-center rounded-xl shadow-2xl"
                        style={{ backgroundImage: "url('/permiso_circulacion.png')" }}
                    />
                </motion.div>

            </div>
        </section>
    );
};

export default IntroSection;
