import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroSection from './HeroSection';
import ScannerSection from './ScannerSection';
import CursorLight from './CursorLight';
import TestOcrPage from './TestOcrPage';
import Footer from './Footer';

const HomePage = () => (
  <>
    <HeroSection />
    <ScannerSection />
  </>
);

const App = () => {
  return (
    <Router>
      <div className="bg-[#020617] min-h-screen font-sans cursor-none md:cursor-auto flex flex-col">
        <CursorLight />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/test-ocr" element={<TestOcrPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
