import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';



const GuidelinesModal = ({ onDismiss }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
    >
        <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="max-w-xl w-full bg-[#0a0f1e] border border-emerald-500/30 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.1)] max-h-[90vh] flex flex-col"
        >
            {/* Header */}
            <div className="bg-emerald-500/10 p-5 border-b border-emerald-500/20 flex items-center gap-4 shrink-0">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40 text-emerald-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                    <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">AVISO DE SISTEMA</h2>
                    <p className="text-emerald-500/70 text-[10px] md:text-xs font-mono uppercase tracking-widest">Protocolo de Optimización OCR</p>
                </div>
            </div>

            {/* Content - Scrollable */}
            <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                <p className="text-gray-300 text-sm leading-relaxed">
                    Para asegurar una precisión del <span className="text-emerald-400 font-bold">100% en la extracción de datos</span>, por favor siga las siguientes recomendaciones antes de subir sus documentos:
                </p>

                <div className="space-y-3">
                    <div className="flex gap-3 items-start p-3 rounded-lg bg-white/5 border border-white/5">
                        <svg className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <div>
                            <h3 className="text-white font-bold text-sm">Use PDFs Originales</h3>
                            <p className="text-gray-500 text-xs mt-1">Los documentos digitales originales garantizan la lectura perfecta. Evite fotocopias oscuras.</p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-start p-3 rounded-lg bg-white/5 border border-white/5">
                        <svg className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        <div>
                            <h3 className="text-white font-bold text-sm">Cuidado con los Escaneos</h3>
                            <p className="text-gray-500 text-xs mt-1">Si escanea un documento, asegúrese de que esté recto, bien iluminado y sin dobleces.</p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-start p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                        <svg className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                        <div>
                            <h3 className="text-white font-bold text-sm">Orden de Páginas Vital</h3>
                            <p className="text-gray-400 text-xs mt-1">
                                <span className="text-emerald-400 font-bold">1º Página:</span> Hoja de DATOS (tabla verde).<br />
                                <span className="text-gray-600">2º Página:</span> Portada al final o no incluir.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-xs text-gray-500 italic border-l-2 border-emerald-500/20 pl-3">
                    Nota: La fiabilidad depende de la calidad de entrada.
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end shrink-0">
                <button
                    onClick={onDismiss}
                    className="px-6 py-3 bg-emerald-500 text-black font-bold uppercase text-xs md:text-sm tracking-widest rounded hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] w-full md:w-auto"
                >
                    Entendido / Iniciar
                </button>
            </div>
        </motion.div>
    </motion.div>
);

const TestOcrPage = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [showGuide, setShowGuide] = useState(true);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
            setError(null);
        }
    };

    const handleSubmit = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('permiso', file);

        try {
            // DEBUG: Alert eliminado

            console.log("--> CLICK DETECTADO. Enviando archivo:", file.name);

            console.log("Enviando petición a http://localhost:3001/api/process-pdf...");
            const response = await fetch('http://localhost:3001/api/process-pdf', {
                method: 'POST',
                body: formData,
            });

            console.log("Respuesta status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error del servidor (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            console.log("Datos recibidos:", data);

            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.error || 'Error al procesar el archivo');
            }
        } catch (err) {
            console.error("Error al procesar:", err);
            setError(err.message || 'Error de conexión con el servidor. ¿Está encendido?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 flex flex-col items-center">
            <AnimatePresence>
                {showGuide && <GuidelinesModal onDismiss={() => setShowGuide(false)} />}
            </AnimatePresence>


            {/* Header */}
            <header className="w-full max-w-6xl flex justify-between items-center mb-12 border-b border-emerald-500/20 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                    <h1 className="text-xl md:text-2xl font-bold tracking-widest">
                        OCR <span className="text-emerald-400">TEST LAB</span>
                    </h1>
                </div>
                <a href="/" className="text-sm font-mono text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-wider">
                    [ Volver ]
                </a>
            </header>

            <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* UPload Section */}
                <section className="flex flex-col gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <h2 className="text-lg font-mono text-emerald-400 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                            INPUT_SOURCE
                        </h2>

                        <div className="border-2 border-dashed border-emerald-500/30 rounded-xl min-h-[180px] flex items-center justify-center p-4 text-center hover:border-emerald-500/60 transition-all bg-black/20 relative group-hover:bg-emerald-900/5">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*,application/pdf"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />

                            {file ? (
                                <div className="w-full h-full flex flex-col items-center justify-center">
                                    {file.type.startsWith('image/') ? (
                                        <div className="relative w-full h-40 flex items-center justify-center p-1">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="max-h-full max-w-full rounded-lg shadow-xl border border-emerald-500/20"
                                            />
                                            <div className="absolute bottom-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[10px] font-mono text-emerald-400">
                                                {file.name}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-lg border border-white/10 animate-pulse-slow">
                                            <svg className="w-10 h-10 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                            </svg>
                                            <span className="text-base font-bold text-white mb-0.5">ARCHIVO PDF</span>
                                            <span className="text-xs font-mono text-gray-400">{file.name}</span>
                                            <span className="text-[10px] text-emerald-500 mt-2 border border-emerald-500/30 px-1.5 py-0.5 rounded bg-emerald-500/10">LISTO</span>
                                        </div>
                                    )}
                                    <p className="mt-2 text-[10px] text-gray-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">
                                        Clic para cambiar
                                    </p>
                                </div>
                            ) : (
                                <div className="py-8 flex flex-col items-center transition-transform group-hover:scale-105">
                                    <div className="w-12 h-12 mb-3 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-500 group-hover:bg-emerald-500/20 text-emerald-500 transition-all">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                    </div>
                                    <p className="text-gray-300 font-bold text-base mb-1">SUBIR DOCUMENTO</p>
                                    <p className="text-xs text-gray-500 font-mono">Arrastra o haz clic</p>
                                    <div className="flex gap-2 mt-3">
                                        <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-gray-400">PDF</span>
                                        <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-gray-400">JPG</span>
                                        <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-gray-400">PNG</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!file || loading}
                            className={`w-full py-4 rounded-lg font-bold tracking-widest uppercase transition-all relative z-20 overflow-hidden group/btn font-mono text-lg
                                ${!file || loading
                                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-white/5'
                                    : 'bg-emerald-500 text-black hover:bg-emerald-400 hover:scale-[1.02] border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Procesando...
                                </span>
                            ) : 'Iniciar Análisis'}
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm font-mono">
                            ERROR: {error}
                        </div>
                    )}
                </section>

                {/* Results Section */}
                <section className="relative">
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md min-h-[500px]">
                        <h2 className="text-lg font-mono text-emerald-400 mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
                            DATA_EXTRACTION_LOG
                        </h2>

                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    {[
                                        { key: 'A', label: 'Matrícula', icon: 'M' },
                                        { key: 'D.1', label: 'Marca', icon: 'B' },
                                        { key: 'D.3', label: 'Modelo', icon: 'C' },
                                        { key: 'I', label: 'Fecha Matriculación', icon: 'D' },
                                        { key: 'P.3', label: 'Combustible', icon: 'F' },
                                        { key: 'E', label: 'Bastidor (VIN)', icon: 'V', fullWidth: true },
                                    ].map((field, i) => {
                                        const value = result[field.key];
                                        if (!value) return null;

                                        return (
                                            <motion.div
                                                key={field.key}
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className={`p-4 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-all group ${field.fullWidth ? 'md:col-span-2' : ''}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                        {field.label}
                                                    </span>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30 group-hover:bg-emerald-400 transition-colors" />
                                                </div>
                                                <div className="font-mono text-white text-lg md:text-xl truncate" title={value}>
                                                    {value}
                                                </div>
                                            </motion.div>
                                        );
                                    })}

                                    {/* Mostrar otros campos no mapeados si existen */}
                                    {Object.entries(result).filter(([k]) => !['A', 'D.1', 'D.3', 'I', 'P.3', 'E'].includes(k)).map(([key, value], i) => (
                                        <motion.div
                                            key={key}
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.5 + (i * 0.1) }}
                                            className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-all"
                                        >
                                            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                                                {key}
                                            </div>
                                            <div className="font-mono text-gray-300 text-base truncate">
                                                {value}
                                            </div>
                                        </motion.div>
                                    ))}

                                    <div className="md:col-span-2 mt-4 pt-4 border-t border-dashed border-white/10 text-xs text-gray-500 font-mono text-right flex justify-between items-center">
                                        <span className="text-emerald-500/50">CONFIDENCE_SCORE: 98%</span>
                                        <span>SCAN_COMPLETE // {new Date().toLocaleTimeString()}</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700 font-mono pointer-events-none">
                                    <div className="w-16 h-16 border-2 border-dashed border-gray-800 rounded-full animate-spin-slow mb-4" />
                                    <p>ESPERANDO DATOS...</p>
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Decor elements */}
                        <div className="absolute top-0 right-0 p-2">
                            <div className="w-20 h-[1px] bg-emerald-500/20" />
                        </div>
                        <div className="absolute bottom-0 left-0 p-2">
                            <div className="w-20 h-[1px] bg-emerald-500/20" />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default TestOcrPage;
