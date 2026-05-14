/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface AboutProps {
  onNavigateToCatalog: () => void;
}

export default function About({ onNavigateToCatalog }: AboutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,_#fff1f2_0%,_#f6f4f3_42%,_#efe8e5_100%)] selection:bg-primary selection:text-white">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm flex justify-between items-center px-8 h-16">
        <div className="flex items-center">
          <h1 className="text-2xl font-black uppercase tracking-[0.28em] text-primary">SHARP</h1>
        </div>
      </header>

      <main className="pt-16 flex-grow flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl text-center"
        >
          <span className="inline-flex items-center rounded-full border border-primary/15 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-primary shadow-sm">
            SHARP
          </span>

          <h2 className="mt-6 text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Precision Printing For Modern Workflows
          </h2>

          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            The Sharp MFP is a state-of-the-art multifunction printer designed for high-volume production environments. With advanced color technology and exceptional reliability, it delivers professional results every time.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white border border-slate-200 rounded-lg p-8 shadow-lg shadow-black/5"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Advanced Features</h3>
              <ul className="text-slate-600 space-y-2 text-left">
                <li>✓ 51 Color pages per minute</li>
                <li>✓ 4-color CMYK technology</li>
                <li>✓ Network printing & scanning</li>
                <li>✓ Modular expandability</li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white border border-slate-200 rounded-lg p-8 shadow-lg shadow-black/5"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Specifications</h3>
              <ul className="text-slate-600 space-y-2 text-left">
                <li>✓ Print Speed: 51 ppm</li>
                <li>✓ Resolution: 1200 x 1200 dpi</li>
                <li>✓ Paper Capacity: Up to 2500 sheets</li>
                <li>✓ Network Ready</li>
              </ul>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNavigateToCatalog}
            className="bg-primary hover:bg-[#ab0f1d] text-white px-8 py-4 text-lg uppercase tracking-widest font-bold rounded-lg shadow-lg shadow-primary/20 flex items-center gap-3 mx-auto transition-all"
          >
            Explore Catalog
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </main>

      <footer className="bg-white/60 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center px-12 py-8 gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-[0.1em] font-bold text-slate-400">SHARP Printers © 1912</p>
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-800">Color Precision For Every Workflow</p>
        </div>
      </footer>
    </div>
  );
}
