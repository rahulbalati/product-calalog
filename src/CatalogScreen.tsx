/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Layers, Rocket, ShieldCheck, Settings } from 'lucide-react';
import { PRINTERS } from '../constants';
import { Printer } from '../types';

interface CatalogScreenProps {
  onSelectProduct: (product: Printer) => void;
}

export default function CatalogScreen({ onSelectProduct }: CatalogScreenProps) {
  return (
    <div className="flex bg-surface min-h-screen">
      {/* SideNavBar / Filters */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 p-6 bg-surface-container-low space-y-8 overflow-y-auto no-scrollbar">
        <div>
          <h2 className="text-lg font-bold text-on-surface tracking-tight">Configuration</h2>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Precision Series</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Output Type</span>
            <div className="flex flex-col space-y-1">
              <label className="flex items-center space-x-3 p-2 bg-surface-container-lowest text-primary font-bold shadow-sm rounded-sm cursor-pointer transition-all">
                <input type="checkbox" defaultChecked className="rounded-sm text-primary focus:ring-primary w-4 h-4" />
                <span className="text-sm">Color MFPs</span>
              </label>
              <label className="flex items-center space-x-3 p-2 text-on-surface-variant hover:bg-surface-container-high transition-all rounded-sm cursor-pointer">
                <input type="checkbox" className="rounded-sm text-primary focus:ring-primary w-4 h-4" />
                <span className="text-sm">Black & White</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Speed Range</span>
            <div className="grid grid-cols-2 gap-2">
              {['20-40 PPM', '41-65 PPM', '66-90 PPM', '90+ PPM'].map((range) => (
                <button 
                  key={range}
                  className={`px-2 py-3 text-xs rounded-sm transition-all ${range === '41-65 PPM' ? 'bg-surface-container-lowest border border-primary/20 text-primary font-bold shadow-sm' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Paper Capacity</span>
            <input 
              type="range" 
              className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" 
            />
            <div className="flex justify-between text-[10px] text-on-surface-variant font-medium">
              <span>500 sheets</span>
              <span>6,000+ sheets</span>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-auto">
          <button className="w-full bg-primary text-white py-3 px-4 text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95">
            Request Quote
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-8">
        <header className="max-w-7xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-on-surface leading-none">
                Precision Series <span className="text-on-surface/10">/</span> Catalog
              </h1>
              <p className="mt-4 text-on-surface-variant max-w-xl text-lg font-light leading-relaxed">
                Discover the next generation of industrial high-performance multifunction printers. Engineered for accuracy, built for scale.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm font-medium">
              <span className="text-on-surface-variant">Showing</span>
              <span className="text-primary font-bold">{PRINTERS.length} of {PRINTERS.length}</span>
              <span className="text-on-surface-variant">Architect Systems</span>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
          {PRINTERS.map((printer, idx) => (
            <motion.div
              key={printer.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col h-full hover:-translate-y-2 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-surface-container-lowest overflow-hidden relative mb-6">
                <img 
                  src={printer.image} 
                  alt={printer.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                />
                {printer.tag && (
                  <div className="absolute top-4 left-0 bg-primary py-1 px-4 text-[10px] font-bold text-white uppercase tracking-tighter shadow-sm">
                    {printer.tag}
                  </div>
                )}
              </div>
              
              <div className="px-2 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-on-surface uppercase">{printer.name}</h3>
                    <p className="text-xs font-medium text-on-surface-variant uppercase tracking-widest mt-0.5">{printer.series}</p>
                  </div>
                  <span className="text-3xl font-black text-on-surface/10 tracking-tighter group-hover:text-primary transition-colors duration-300">
                    {printer.ppm}PPM
                  </span>
                </div>

                <div className="grid grid-cols-2 bg-surface-container-low overflow-hidden">
                  <div className="p-3">
                    <span className="block text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Resolution</span>
                    <span className="text-sm font-medium text-on-surface">{printer.resolution}</span>
                  </div>
                  <div className="p-3 border-l border-outline-variant/10">
                    <span className="block text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Capacity</span>
                    <span className="text-sm font-medium text-on-surface">{printer.capacity}</span>
                  </div>
                </div>

                <button 
                  onClick={() => onSelectProduct(printer)}
                  className="w-full border border-outline/20 py-3 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all active:opacity-80"
                >
                  Configure & View
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
