/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Settings, ArrowLeft, Printer } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  basePrice: number;
}

interface CatalogProps {
  onNavigateToAbout: () => void;
  onSelectProduct: (product: Product) => void;
}

const PRODUCTS: Product[] = [
  {
    id: 'bp-51c',
    name: 'Sharp BP-51C',
    description: 'Advanced multifunction printer with 51 color ppm and modular expandability',
    image: '/assets/BP-51C_MFP.png',
    basePrice: 8900
  },
  {
    id: 'bp-61c',
    name: 'Sharp BP-61C',
    description: 'High-performance model with enhanced color accuracy and finishing options',
    image: '/assets/bp-61c.png',
    basePrice: 10500
  },
  {
    id: 'bp-71c',
    name: 'Sharp BP-71C',
    description: 'Premium edition with advanced security features and network capabilities',
    image: '/assets/BP_71/BP-71_catalog.png',
    basePrice: 12800
  }
];

export default function Catalog({ onNavigateToAbout, onSelectProduct }: CatalogProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-black selection:text-white">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm flex justify-between items-center px-8 h-16">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-slate-900" />
          <h1 className="text-lg font-black uppercase tracking-widest text-slate-900">Product Catalog</h1>
        </div>
        <button
          onClick={onNavigateToAbout}
          className="flex items-center gap-2 bg-slate-100 text-slate-900 px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-slate-200 transition-all rounded-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          About
        </button>
      </header>

      <main className="pt-16 flex-grow flex flex-col px-8 py-12">
        <div className="max-w-6xl mx-auto w-full">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-slate-900 mb-4 tracking-tight"
          >
            Sharp Multifunction Printers
          </motion.h2>
          <p className="text-slate-600 mb-12 text-lg">
            Explore our range of professional-grade printers designed for your business
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {PRODUCTS.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-100 hover:border-slate-300 transition-all cursor-pointer group"
                onClick={() => onSelectProduct(product)}
              >
                {/* Image Container */}
                <div className="relative w-full h-64 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                  <Printer className="absolute top-4 right-4 w-6 h-6 text-primary opacity-20" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Starting Price</p>
                      <p className="text-2xl font-black text-primary">
                        ${product.basePrice.toLocaleString()}
                      </p>
                    </div>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="bg-primary text-white p-3 rounded-lg"
                    >
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center px-12 py-8 gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-[0.1em] font-bold text-slate-400">SHARP Printers © 1912</p>
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-800">Color Precision For Every Workflow</p>
        </div>
      </footer>
    </div>
  );
}
