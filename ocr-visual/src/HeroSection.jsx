import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center">

            {/* BACKGROUND LAYER */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: "url('/hud_bg.png')" }} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/90" />
            </div>


            {/* HERO CONTENT */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 text-center px-4 max-w-5xl"
            >
                <motion.div className="mb-8">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.1]">
                        <div className="flex justify-center flex-wrap">
                            {"PERMISOS DE".split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    transition={{ duration: 0.4, delay: i * 0.03 }}
                                    className="inline-block"
                                >
                                    {char === " " ? "\u00A0" : char}
                                </motion.span>
                            ))}
                        </div>
                        <motion.span
                            className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-500 to-emerald-400 bg-[length:200%_auto]"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                backgroundPosition: ["0% center", "200% center"]
                            }}
                            transition={{
                                opacity: { duration: 0.8, delay: 0.5 },
                                scale: { duration: 0.8, delay: 0.5 },
                                backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
                            }}
                        >
                            CIRCULACIÓN OCR
                        </motion.span>
                    </h1>
                </motion.div>

                {/* Scroll Indicator */}
                {/* CTA Button */}
                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="mt-12 flex justify-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            backgroundSize: "200% 100%",
                            backgroundImage: "linear-gradient(to right, #10b981, #06b6d4, #10b981)" // emerald-500, cyan-500, emerald-500
                        }}
                        animate={{
                            backgroundPosition: ["0% center", "200% center"],
                            boxShadow: ["0 0 20px rgba(16,185,129,0.4)", "0 0 35px rgba(6,182,212,0.6)", "0 0 20px rgba(16,185,129,0.4)"] // Sync shadow color too
                        }}
                        transition={{
                            backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" },
                            boxShadow: { duration: 3, repeat: Infinity, ease: "linear" }
                        }}
                        onClick={() => navigate('/test-ocr')}
                        className="group relative px-8 py-4 text-black font-bold text-lg rounded-full transition-transform cursor-pointer"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            PROBAR
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                        </span>
                    </motion.button>
                </motion.div>
            </motion.div>

        </section>
    );
};

export default HeroSection;
