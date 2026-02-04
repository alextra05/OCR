import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

// --- DATA DEFINITION ---
const DATA_POINTS = [
    { id: 'matricula', label: 'Número de Matrícula', value: '7189-HXZ', top: '8%', topNum: 0.08, left: '10%', width: '18%' },
    { id: 'vin', label: 'Bastidor (VIN)', value: 'V391AB45C2300X819', top: '8%', topNum: 0.08, left: '55%', width: '40%' },
    { id: 'fecha', label: 'Fecha de Matriculación', value: '12-05-2023', top: '24%', topNum: 0.24, left: '12%', width: '15%' },
    { id: 'combustible', label: 'Tipo Combustible (P.3)', value: 'GASOLINA - Híbrido (PHEV)', top: '44%', topNum: 0.44, left: '53%', width: '35%' },
    { id: 'marca', label: 'Marca (D.1)', value: 'TOYOTA', top: '70%', topNum: 0.70, left: '10%', width: '25%', height: '5%' },
    { id: 'modelo', label: 'Modelo (D.3)', value: 'TOYOTA COROLLA', top: '78%', topNum: 0.78, left: '10%', width: '30%' },
];

const ScannerSection = () => {
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const laserTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Reset if at top
        if (latest < 0.05) {
            setActiveIndex(-1);
            return;
        }

        // Check if we are at the very bottom (completed setup)
        if (latest > 0.9) {
            setActiveIndex(DATA_POINTS.length);
            return;
        }

        // Find the points that the laser (latest) has passed
        // We use a small offset (0.05) to represent the laser position better or just strict compare
        const passedPoints = DATA_POINTS.map((p, i) => ({ ...p, index: i }))
            .filter(p => latest >= p.topNum);

        if (passedPoints.length > 0) {
            // Set the last passed point as active
            setActiveIndex(passedPoints[passedPoints.length - 1].index);
        } else {
            setActiveIndex(-1);
        }
    });

    return (
        <section ref={containerRef} className="relative min-h-[200vh] bg-[#020617] text-white">
            <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
                <div className="hidden md:block w-1/2 h-screen sticky top-0 p-10 flex items-center justify-center">
                    <div className="relative w-full aspect-[1.4/1] bg-[#1e293b] rounded-2xl border border-cyan-400/30 overflow-hidden shadow-[0_0_40px_rgba(0,242,255,0.1)]">
                        <motion.div
                            className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_15px_#00f2ff] z-20"
                            style={{ top: laserTop }}
                        />
                        <img
                            src="/permiso_circulacion.png"
                            alt="Documento"
                            className="absolute inset-0 w-full h-full object-contain p-6 opacity-80"
                        />
                        {DATA_POINTS.map((point, index) => (
                            <HighlightRing
                                key={point.id}
                                point={point}
                                isVisible={index <= activeIndex}
                                isCurrent={index === activeIndex}
                            />
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-1/2 pt-[30vh] pb-32 px-6 md:px-20 space-y-24">
                    <div className="h-[10vh] flex items-end pb-10">
                        <h2 className="text-4xl font-bold text-cyan-400 font-mono tracking-tighter">
                            EXTRACCIÓN<br />DE DATOS
                        </h2>
                    </div>

                    {DATA_POINTS.map((item, index) => (
                        <DataCard
                            key={item.id}
                            item={item}
                            isActive={index <= activeIndex}
                        />
                    ))}

                    <div className="h-[20vh] flex items-center">
                    </div>
                </div>
            </div>
        </section>
    );
};

const HighlightRing = ({ point, isVisible, isCurrent }) => {
    return (
        <motion.div
            className="absolute border-2 rounded z-10 box-content"
            style={{
                top: point.top,
                left: point.left,
                width: point.width,
                height: point.height || '8%',
            }}
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 1.5,
                borderColor: isCurrent ? '#00f2ff' : '#ff00ff',
                boxShadow: isCurrent ? '0 0 20px #00f2ff' : '0 0 10px rgba(255,0,255,0.5)'
            }}
            transition={{ duration: 0.5 }}
        />
    );
};

const DataCard = ({ item, isActive }) => {
    return (
        <motion.div
            className={`p-8 rounded-2xl border transition-all duration-500 ${isActive ? 'bg-slate-900/90 border-cyan-400 opacity-100 translate-x-0' : 'bg-slate-900/40 border-slate-700 opacity-30 translate-x-10'}`}
        >
            <h3 className="text-cyan-400 font-mono text-sm tracking-widest uppercase mb-2">{item.label}</h3>
            <p className="text-3xl font-bold text-white tracking-tight">{item.value}</p>
            <div className={`mt-4 h-1 bg-cyan-400 transition-all duration-700 ${isActive ? 'w-full' : 'w-0'}`} />
        </motion.div>
    );
}

export default ScannerSection;
