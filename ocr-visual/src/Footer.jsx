import React from 'react';

const Footer = () => {
    return (
        <footer className="relative bg-[#020617] border-t border-slate-800/50">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-900/40 to-transparent" />

            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">

                    {/* Brand Section (Compact) */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400/10 to-blue-600/10 border border-cyan-500/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-slate-100 tracking-tight">
                                OCR Visual
                            </span>
                        </div>
                        <p className="text-slate-500 text-xs max-w-xs">
                            Visión artificial avanzada para documentos.
                        </p>

                        {/* Socials Inline */}
                        <div className="flex gap-3 mt-1">
                            {[
                                { name: 'Github', path: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
                                { name: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z' }
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="text-slate-500 hover:text-cyan-400 transition-colors"
                                    aria-label={social.name}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d={social.path} />
                                        {social.name === 'LinkedIn' && <circle cx="4" cy="4" r="2" />}
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact Section (Right aligned) */}
                    <div className="flex flex-col items-center md:items-end gap-2 text-sm">
                        <h4 className="text-slate-200 font-medium text-xs uppercase tracking-wider mb-1">Contacto</h4>
                        <a href="mailto:info@ocrvisual.com" className="text-slate-400 hover:text-cyan-400 transition-colors">
                            info@ocrvisual.com
                        </a>
                        <span className="text-slate-500 text-xs">Madrid, España</span>

                        <div className="mt-4 md:mt-6 text-slate-600 text-xs flex gap-4">
                            <span>&copy; {new Date().getFullYear()} OCR Visual</span>
                            <span className="cursor-pointer hover:text-slate-400 transition-colors">Privacidad</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
