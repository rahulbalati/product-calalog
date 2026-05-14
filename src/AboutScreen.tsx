/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Monitor, Printer } from 'lucide-react';

interface AboutScreenProps {
  onSelect: (type: 'color' | 'bw') => void;
}

export default function AboutScreen({ onSelect }: AboutScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-surface text-on-surface p-8">
      <div className="max-w-4xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-black tracking-tighter mb-6 leading-none">
            Empowering Your <br />
            <span className="text-primary">Precision Workspace</span>
          </h1>
          <p className="text-xl text-on-surface-variant font-light max-w-2xl mx-auto">
            Select your preferred MFP technology to explore our next-generation catalog.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ y: -8 }}
            className="group relative bg-surface-container-lowest p-10 cursor-pointer overflow-hidden transition-all duration-500"
            onClick={() => onSelect('color')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-primary-fixed rounded-lg flex items-center justify-center mb-8">
                <Monitor className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold tracking-tight mb-4">Color MFPs</h3>
              <p className="text-on-surface-variant leading-relaxed mb-8">
                Vibrant, high-accuracy color reproduction for professional production environments and marketing agencies.
              </p>
              <button className="text-sm font-bold uppercase tracking-widest text-primary flex items-center group-hover:translate-x-2 transition-transform">
                Explore Series <span className="ml-2">→</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -8 }}
            className="group relative bg-surface-container-lowest p-10 cursor-pointer overflow-hidden transition-all duration-500"
            onClick={() => onSelect('bw')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-secondary-fixed rounded-lg flex items-center justify-center mb-8">
                <Printer className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-3xl font-bold tracking-tight mb-4">Black & White</h3>
              <p className="text-on-surface-variant leading-relaxed mb-8">
                High-volume efficiency and laser-sharp precision for administrative centers and legal documentation.
              </p>
              <button className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center group-hover:translate-x-2 transition-transform">
                Explore Series <span className="ml-2">→</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
