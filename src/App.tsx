/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Printer, 
  Rotate3d, 
  FileText, 
  Check, 
  Plus,
  ChevronRight,
  Monitor,
  Cpu,
  Layers,
  LayoutGrid,
  Settings,
  ArrowLeft
} from 'lucide-react';
import About from './About';
import Catalog from './Catalog';
import ProductDetail from './ProductDetail';
import GlbViewer from './GlbViewer';
import type { GlbAttachment } from './GlbViewer';

const BP51_FINISHER_OPTIONS = [
  { id: 'none', name: 'No Finisher', image: '', tags: [] },
  { id: 'finisher01', name: 'Finisher 01', image: '/assets/finisher/Finisher_01.png', tags: ['Staple', 'Sort'] },
  { id: 'finisher02', name: 'Finisher 02', image: '/assets/finisher/Finisher_02.png', tags: ['Saddle Stitch', 'Punch'] },
  { id: 'finisher03', name: 'Finisher 03', image: '/assets/finisher/Finisher_03.png', tags: ['Booklet', 'Fold'] },
  { id: 'finisher04', name: 'Finisher 04', image: '/assets/finisher/Finisher_04.png', tags: ['Offset', 'Sort'] }
];

const BP51_TRAY_OPTIONS = [
  { id: 'none', name: 'No Large Tray', image: '', tags: [] },
  { id: 'tray01', name: 'Large Tray 01', image: '/assets/tray/Tray_01.png', tags: ['2500 Sheets', 'Heavy Duty'] },
  { id: 'tray02', name: 'Large Tray 02', image: '/assets/tray/Tray_02.png', tags: ['Side Access', 'High Capacity'] },
  { id: 'tray03', name: 'Large Tray 03', image: '/assets/tray/Tray_03.png', tags: ['Quick Feed', 'Low Noise'] },
  { id: 'tray04', name: 'Large Tray 04', image: '/assets/tray/Tray_04.png', tags: ['Extended Base', 'Fast Reload'] }
];

const BP71_FINISHER_OPTIONS = [
  { id: 'none', name: 'No Finisher', image: '', tags: [] },
  { id: 'finisher01', name: 'Finisher 01', image: '/assets/BP_71/BP_71_finisher/03-PROImg_BP-71C-61C-56C-51C-Series_EPS-Option-BP-FN13 copy.png', tags: ['Staple', 'Sort'] },
  { id: 'finisher02', name: 'Finisher 02', image: '/assets/BP_71/BP_71_finisher/03-PROImg_BP-71C-61C-56C-51C-Series_EPS-Option-BP-FN14 copy.png', tags: ['Saddle Stitch', 'Punch'] },
  { id: 'finisher03', name: 'Finisher 03', image: '/assets/BP_71/BP_71_finisher/03-PROImg_BP-71C-61C-56C-51C-Series_EPS-Option-BP-FN15 copy.png', tags: ['Booklet', 'Fold'] },
  { id: 'finisher04', name: 'Finisher 04', image: '/assets/BP_71/BP_71_finisher/03-PROImg_BP-71C-61C-56C-51C-Series_EPS-Option-BP-FN16 copy.png', tags: ['Offset', 'Sort'] }
];

const BP71_TRAY_OPTIONS = [
  { id: 'none', name: 'No Large Tray', image: '', tags: [] },
  { id: 'tray01', name: 'Large Tray 01', image: '/assets/BP_71/BP_71_tray/03-PROImg_BP-71C-61C-56C-51C-Series_EPS-Option-BP-DE12.png', tags: ['2500 Sheets', 'Heavy Duty'] },
  { id: 'tray02', name: 'Large Tray 02', image: '/assets/BP_71/BP_71_tray/03-PROImg_BP-71C-61C-56C-51C-Series_EPS-Option-BP-DE13.png', tags: ['Side Access', 'High Capacity'] },
  { id: 'tray03', name: 'Large Tray 03', image: '/assets/BP_71/BP_71_tray/03-PROImg_BP-71C-61C-56C-51C-Series_EPS-Option-BP-DE14.png', tags: ['Quick Feed', 'Low Noise'] },
  { id: 'tray04', name: 'Large Tray 04', image: '/assets/BP_71/BP_71_tray/03-PROImg_BP-71C-61C-56C-51C-Series_EPS-Option-BP-DE15.png', tags: ['Extended Base', 'Fast Reload'] }
];

const BASE_PRICE = 8900;
const PRICES = {
  finisher: 1250,
  extraTray: 450,
  largeTray: 1800
};

interface ToggleProps {
  label: string;
  sublabel: string;
  active: boolean;
  onToggle: () => void;
  tags: string[];
  disabled?: boolean;
}

interface SelectableOption {
  id: string;
  name: string;
  image: string;
  tags: string[];
}

const ConfigToggle = ({ label, sublabel, active, onToggle, tags, disabled }: ToggleProps) => (
  <motion.div 
    id={`toggle-${label.toLowerCase().replace(/\s+/g, '-')}`}
    whileHover={{ borderColor: 'var(--color-on-surface-variant)' }}
    className={`p-4 bg-white border ${active ? 'border-primary border-2' : 'border-slate-200'} rounded-lg tonal-shadow transition-all select-none ${
      disabled ? 'opacity-55 cursor-not-allowed' : 'cursor-pointer'
    }`}
    onClick={() => {
      if (disabled) return;
      onToggle();
    }}
  >
    <div className="flex justify-between items-center mb-3">
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-slate-900">{label}</span>
        <span className="text-xs text-slate-500 uppercase tracking-tight">{sublabel}</span>
      </div>
      <div className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${active ? 'bg-primary' : 'bg-slate-200'}`}>
        <motion.div 
          animate={{ x: active ? 20 : 4 }}
          className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
        />
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span 
          key={tag} 
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}
        >
          {tag}
        </span>
      ))}
    </div>
  </motion.div>
);

function OptionList({
  title,
  subtitle,
  options,
  selectedId,
  onSelect,
  expanded,
  onToggle,
  disabled
}: {
  title: string;
  subtitle: string;
  options: SelectableOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  expanded: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  const selectedOption = options.find((option) => option.id === selectedId) ?? options[0];

  return (
    <div className={`p-4 bg-white border border-slate-200 rounded-lg tonal-shadow ${disabled ? 'opacity-55' : ''}`}>
      <div className="flex justify-end mb-2">
        <button
          type="button"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (disabled) return;
            onSelect('none');
          }}
          className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
        >
          Deselect
        </button>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          onToggle();
        }}
        className={`flex w-full items-center justify-between gap-4 text-left ${disabled ? 'cursor-not-allowed' : ''}`}
      >
        <div className="min-w-0">
          <span className="block text-lg font-semibold text-slate-900">{title}</span>
          <span className="block text-xs text-slate-500 uppercase tracking-tight">{subtitle}</span>
          <span className="mt-2 block text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Selected: <span className="font-bold text-slate-900">{selectedOption.name}</span>
          </span>
        </div>
        <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight className="h-5 w-5 text-slate-500" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && !disabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={() => onSelect('none')}
                className={`w-full rounded-lg border text-left transition-all border-slate-200 bg-white hover:border-slate-300`}
              >
                <div className="flex items-center gap-4 p-3">
                  <div className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-slate-300 bg-slate-50`}>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">None</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-slate-900">None</span>
                    </div>
                  </div>
                </div>
              </button>
              {options.filter(o => o.id !== 'none').map((option) => {
                const active = option.id === selectedId;
                const isNone = option.id === 'none';

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onSelect(option.id)}
                    className={`w-full rounded-lg border text-left transition-all ${
                      active
                        ? 'border-primary bg-slate-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-4 p-3">
                      <div className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border ${isNone ? 'border-dashed border-slate-300 bg-slate-50' : 'border-slate-200 bg-white'}`}>
                        {isNone ? (
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">None</span>
                        ) : (
                          <img src={option.image} alt={option.name} className="h-full w-full object-contain" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-slate-900">{option.name}</span>
                          {active && <Check className="h-4 w-4 text-primary" />}
                        </div>

                        {option.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {option.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`px-2 py-1 rounded text-[10px] uppercase tracking-[0.2em] font-bold ${
                                  active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  basePrice: number;
}

type ProductConfig = {
  modelName: string;
  assets: {
    base: string;
    finisher: string;
    extraTray: string;
    largeTray: string;
  };
  finisherOptions: SelectableOption[];
  trayOptions: SelectableOption[];
};

const PRODUCT_CONFIGS: Record<string, ProductConfig> = {
  'bp-51c': {
    modelName: 'Sharp BP-51C65',
    assets: {
      base: '/assets/BP-51C_MFP.png',
      finisher: '/assets/BP-51C_Finisher.png',
      extraTray: '/assets/BP-51C_-LargeCapacity.png',
      largeTray: '/assets/BP-51C_2_tray.png'
    },
    finisherOptions: BP51_FINISHER_OPTIONS,
    trayOptions: BP51_TRAY_OPTIONS
  },
  'bp-61c': {
    modelName: 'Sharp BP-61C',
    assets: {
      base: '/assets/bp-61c.png',
      finisher: '/assets/BP-51C_Finisher.png',
      extraTray: '/assets/BP-51C_-LargeCapacity.png',
      largeTray: '/assets/BP-51C_2_tray.png'
    },
    finisherOptions: BP51_FINISHER_OPTIONS,
    trayOptions: BP51_TRAY_OPTIONS
  },
  'bp-71c': {
    modelName: 'Sharp BP-71C',
    assets: {
      base: '/assets/BP_71/BP-71_catalog.png',
      finisher: '/assets/BP_71/BP_71_finisher/03-PROImg_BP-71C-61C-56C-51C-Series_EPS-Option-BP-FN13 copy.png',
      extraTray: '/assets/BP_71/BP_71_Large capacity/03-PROImg_BP-71C-61C-56C-51C-Series_EPS-Option-BP-LC10.png',
      largeTray: '/assets/BP_71/BP_71_tray/03-PROImg_BP-71C-61C-56C-51C-Series_EPS-Option-BP-DE12.png'
    },
    finisherOptions: BP71_FINISHER_OPTIONS,
    trayOptions: BP71_TRAY_OPTIONS
  }
};

type Screen = 'about' | 'catalog' | 'detail' | 'config';

function ConfigScreen({
  onNavigateToAbout,
  onNavigateToCatalog,
  product,
  initialSelectedFinisher,
  initialSelectedTray,
  onUpdateFinisher,
  onUpdateTray,
  initialExtraTray,
  onUpdateExtraTray
}: {
  onNavigateToAbout: () => void;
  onNavigateToCatalog: () => void;
  product: Product;
  initialSelectedFinisher?: string;
  initialSelectedTray?: string;
  onUpdateFinisher?: (id: string) => void;
  onUpdateTray?: (id: string) => void;
  initialExtraTray?: boolean;
  onUpdateExtraTray?: (v: boolean) => void;
}) {
  const [selectedFinisher, setSelectedFinisher] = useState(initialSelectedFinisher ?? 'none');
  const [extraTray, setExtraTray] = useState(initialExtraTray ?? false);
  React.useEffect(() => {
    setExtraTray(initialExtraTray ?? false);
  }, [initialExtraTray]);
  const [selectedTray, setSelectedTray] = useState(initialSelectedTray ?? 'none');
  const [trayExpanded, setTrayExpanded] = useState(false);
  const [finisherExpanded, setFinisherExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'assembly' | '3d'>('assembly');

  const productConfig = PRODUCT_CONFIGS[product.id] ?? PRODUCT_CONFIGS['bp-51c'];
  const selectedFinisherOption = productConfig.finisherOptions.find(option => option.id === selectedFinisher) ?? productConfig.finisherOptions[0];
  const finisherActive = selectedFinisher !== 'none';
  const selectedFinisherAsset = finisherActive ? selectedFinisherOption.image : productConfig.assets.finisher;

  const selectedTrayOption = productConfig.trayOptions.find(option => option.id === selectedTray) ?? productConfig.trayOptions[0];
  const trayActive = selectedTray !== 'none';
  const selectedTrayAsset = trayActive ? selectedTrayOption.image : productConfig.assets.largeTray;

  const TRAY_GLB_MAP: Record<string, string> = {
    tray01: '/assets/BP-DE12.glb',
    tray02: '/assets/BP-DE12.glb',
    tray03: '/assets/BP-DE12.glb',
    tray04: '/assets/BP-DE12.glb'
  };
  const selectedTrayGlb = TRAY_GLB_MAP[selectedTray] ?? '/assets/BP-DE12.glb';

  React.useEffect(() => {
    if (trayActive) return;
    if (selectedFinisher !== 'none') {
      setSelectedFinisher('none');
      if (onUpdateFinisher) onUpdateFinisher('none');
    }
    if (extraTray) {
      setExtraTray(false);
      if (onUpdateExtraTray) onUpdateExtraTray(false);
    }
  }, [trayActive, selectedFinisher, extraTray, onUpdateExtraTray, onUpdateFinisher]);

  const totalPrice = useMemo(() => {
    let total = product.basePrice;
    if (finisherActive) total += PRICES.finisher;
    if (extraTray) total += PRICES.extraTray;
    if (trayActive) total += PRICES.largeTray;
    return total;
  }, [product.basePrice, finisherActive, extraTray, trayActive]);

  const glbAttachments = useMemo<GlbAttachment[]>(() => [
    {
      id: 'baseLower',
      path: selectedTrayGlb,
      enabled: trayActive,
      position: { x: -0.01, y: -0.23, z: 0 },
      scale: 0.55,
      rotation: { x: 0, y: 0, z: 0 }
    },
    {
      id: 'paperBox',
      path: '/assets/paper_box.glb',
      enabled: extraTray,
      position: { x: 0.3, y: -0.23, z: 0 },
      scale: 0.4,
      rotation: { x: 0, y: 0, z: 0 }
    },
    {
      id: 'finisher1',
      path: '/assets/finisher_1.glb',
      enabled: finisherActive,
      position: { x: -0.38, y: -0.23, z: 0 },
      scale: 0.7,
      rotation: { x: 0, y: 0, z: 0 }
    }
  ], [finisherActive, extraTray, trayActive, selectedTray]);

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-background selection:bg-black selection:text-white">
      {/* TopAppBar */}
      <header id="main-header" className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm flex justify-between items-center px-8 h-16">
        <button
          onClick={onNavigateToCatalog}
          className="flex items-center gap-2 text-slate-900 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs uppercase tracking-widest font-bold">Back</span>
        </button>
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-slate-900" />
          <h1 className="text-lg font-black uppercase tracking-widest text-slate-900">{productConfig.modelName}</h1>
        </div>
        <button id="btn-export" className="bg-primary text-white px-6 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-[#ab0f1d] transition-all active:scale-95 rounded-sm">
          Export CAD
        </button>
      </header>

      <main className="pt-16 flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
        {/* Showroom Floor (Main Visual) */}
        <section
          id="showroom-floor"
          className="relative flex-1 min-h-[442px] md:min-h-0 bg-white px-6 pt-6 pb-10 md:px-12 md:pt-12 md:pb-16 flex items-center justify-center overflow-visible"
        >
          {/* Lighting effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(241,245,249,1)_0%,_rgba(255,255,255,1)_70%)] opacity-50 pointer-events-none"></div>

            <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center [container-type:inline-size]">
            <div className="absolute top-4 right-4 z-40 flex items-center gap-2 rounded bg-white/90 border border-slate-200 px-2 py-1 shadow-sm">
              <button
                type="button"
                data-view-toggle="true"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMode('assembly');
                }}
                className={`px-2 py-1 text-xs rounded border ${viewMode === 'assembly' ? 'border-primary text-primary' : 'border-slate-200 text-slate-600'}`}
              >
                Assembly
              </button>
              <button
                type="button"
                data-view-toggle="true"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMode('3d');
                }}
                className={`px-2 py-1 text-xs rounded border ${viewMode === '3d' ? 'border-primary text-primary' : 'border-slate-200 text-slate-600'}`}
              >
                3D View
              </button>
            </div>
            {/* Measurement Hairlines */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] border-t border-slate-200 flex justify-between px-2 pt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none">
              <span>DIM_X: 1240mm</span>
              <span>PRECISION_TOLERANCE: +/- 0.1mm</span>
            </div>

            {/* 3D Model Assembly */}
            {viewMode === '3d' ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <GlbViewer attachments={glbAttachments} className="h-full w-full" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded bg-black/55 text-white text-[10px] uppercase tracking-[0.15em] px-3 py-1">
                  Drag to rotate, scroll to zoom
                </div>
              </div>
            ) : (
            <div className="relative w-full h-full flex items-center justify-center perspective-lg">
              {/* Accessory: Finisher (Left) */}
              <AnimatePresence>
                <motion.div 
                  id="asset-finisher"
                  initial={{ opacity: 0, x: -100, filter: 'grayscale(100%)' }}
                  animate={{ 
                    opacity: finisherActive ? 1 : 0,
                    x: finisherActive ? 0 : -40,
                    y: finisherActive ? '23%' : '0%',
                    scale: finisherActive ? 1 : 0.1,
                    filter: finisherActive ? 'grayscale(0%)' : 'grayscale(100%)'
                  }}
                  transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                  className="absolute left-0 z-10 w-[40%] left-[6.5%] -translate-x-2/5"
                >
                  <img src={selectedFinisherAsset} alt={selectedFinisherOption.name} className="w-full h-auto object-contain" />
                  <div className="absolute top-0 left-0 bg-primary text-white text-[8px] px-2 py-0.5 rounded-sm font-mono tracking-tighter">{selectedFinisherOption.name}</div>
                </motion.div>
              </AnimatePresence>

              {/* Base Model */}
              <motion.div 
                id="asset-base"
                className="relative z-20 w-[45%] drop-shadow-2xl"
              >
                <img src={productConfig.assets.base} alt={product.name} className="w-full h-auto object-contain" />
              </motion.div>

              {/* Accessory: Extra Tray (Right) */}
              <AnimatePresence>
                <motion.div 
                  id="asset-extra-tray"
                  initial={{ opacity: 0.1, x: 100, filter: 'grayscale(100%)' }}
                  animate={{ 
                    opacity: extraTray ? 1 : 0.2,
                    x: extraTray ? 0 : 40,
                    y: extraTray ? '34.2cqw' : '0cqw',
                    scale: extraTray ? 1 : 0,
                    filter: extraTray ? 'grayscale(0%)' : 'grayscale(100%)'
                  }}
                  transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                  className="absolute right-0 z-10 w-[28%] right-[-9%] -translate-x-2/5"
                  //className="absolute right-0 z-10 w-1/4"
                >
                  <img src={productConfig.assets.extraTray} alt="Extra Tray" className="w-full h-auto object-contain" />
                  <div className="absolute top-0 right-0 bg-primary text-white text-[8px] px-2 py-0.5 rounded-sm font-mono tracking-tighter">OPT_TRAY_R</div>
                </motion.div>
              </AnimatePresence>

              {/* Accessory: Large Capacity Tray (Bottom) */}
              <AnimatePresence>
                <motion.div 
                  id="asset-large-tray"
                  initial={{ opacity: 0, y: 100, filter: 'grayscale(100%)' }}
                  animate={{ 
                    opacity: trayActive ? 1 : 0.2,
                    y: trayActive ? '7.5%' : '0%',
                    scale: trayActive ? 1 : 0,
                    filter: trayActive ? 'grayscale(0%)' : 'grayscale(100%)'
                  }}
                  transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                  className="absolute bottom-0 z-0 w-[44%] left-[48.3%] -translate-x-1/2"
                >
                  <img src={selectedTrayAsset} alt={selectedTrayOption.name} className="w-full h-auto object-contain" />
                  <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 bg-primary text-white text-[8px] px-2 py-0.5 rounded-sm font-mono tracking-tighter">{trayActive ? selectedTrayOption.name : 'BASE_UNIT_LCT'}</div>
                </motion.div>
              </AnimatePresence>
            </div>
            )}

            {/* 3D Orbit Controller (Decorative) */}
            {/* <motion.div 
              whileHover={{ rotate: 180 }}
              className="absolute bottom-8 right-8 w-16 h-16 border border-slate-200 rounded-full flex items-center justify-center bg-white/50 backdrop-blur shadow-sm cursor-pointer group"
            >
              <Rotate3d className="text-slate-400 group-hover:text-primary transition-colors" />
            </motion.div> */}
          </div>
        </section>

        {/* Customize Panel */}
        <aside id="config-panel" className="w-full md:w-[400px] min-h-0 bg-slate-50 border-l border-slate-200 flex flex-col p-8 gap-8 overflow-y-auto overscroll-contain">
          <header>
            <span className="text-xs text-on-tertiary-container font-black uppercase tracking-[0.2em] block mb-2">Configuration Mode</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Customization Hub</h2>
          </header>

          {/* Toggles */}
          <div className="space-y-4">
              <OptionList
              title="Large Capacity Tray"
              subtitle="Choose a tray option"
              options={productConfig.trayOptions}
              selectedId={selectedTray}
	              onSelect={(id: string) => {
	                setSelectedTray(id);
	                if (id === 'none') {
	                  setSelectedFinisher('none');
	                  if (onUpdateFinisher) onUpdateFinisher('none');
	                  setExtraTray(false);
	                  if (onUpdateExtraTray) onUpdateExtraTray(false);
	                }
	                if (onUpdateTray) onUpdateTray(id);
	              }}
	              expanded={trayExpanded}
	              onToggle={() => setTrayExpanded((current) => !current)}
	            />
            <OptionList
              title="Finisher"
              subtitle="Choose a finisher option"
              options={productConfig.finisherOptions}
              selectedId={selectedFinisher}
	              onSelect={(id: string) => {
	                setSelectedFinisher(id);
	                if (onUpdateFinisher) onUpdateFinisher(id);
	              }}
	              expanded={finisherExpanded}
	              onToggle={() => setFinisherExpanded((current) => !current)}
	              disabled={!trayActive}
	            />
	            <ConfigToggle 
	              label="Extra Paper Tray"
	              sublabel="Right-side High Capacity"
	              active={extraTray}
	              onToggle={() => {
	                const next = !extraTray;
	                setExtraTray(next);
	                if (onUpdateExtraTray) onUpdateExtraTray(next);
	              }}
	              tags={['Active', 'SRA3 Compatible']}
	              disabled={!trayActive}
	            />
          </div>

          {/* Configuration Summary */}
          <div className="mt-auto border-t border-slate-200 pt-8">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest text-sm">
              <FileText className="w-4 h-4 text-slate-400" />
              Configuration Summary
            </h3>
            
            <div className="bg-gradient-to-br from-[#2a1214] via-[#180b0d] to-[#120708] text-white p-8 rounded-lg space-y-4 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -rotate-45 translate-x-16 -translate-y-16 pointer-events-none" />
              
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest border-b border-white/10 pb-3">
                <span className="text-slate-500">Base Model</span>
                <span className="text-white">{product.name}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest border-b border-white/10 pb-3">
                <span className="text-slate-500">Side Tray</span>
                <span className={extraTray ? "text-white" : "text-slate-700 italic"}>{extraTray ? "Included" : "Not Selected"}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest border-b border-white/10 pb-3">
                <span className="text-slate-500">Finisher</span>
                <span className={finisherActive ? "text-white" : "text-slate-700 italic"}>{finisherActive ? selectedFinisherOption.name : "Not Selected"}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest border-b border-white/10 pb-3">
                <span className="text-slate-500">Large Tray</span>
                <span className={trayActive ? "text-white" : "text-slate-700 italic"}>{trayActive ? selectedTrayOption.name : "Not Selected"}</span>
              </div>

              <div className="pt-6 flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">Est. Production Cost</span>
                <motion.span 
                  key={totalPrice}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-black font-mono tracking-tighter"
                >
                  ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </motion.span>
              </div>
            </div>
          </div>
        </aside>
      </main>
      {/* Footer */}
      <footer id="main-footer" className="shrink-0 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center px-12 py-8 gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-[0.1em] font-bold text-slate-400">SHARP Printers © 1912</p>
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-800">Color Precision For Every Workflow</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-12 gap-y-4">
          <a href="#" className="text-[10px] uppercase tracking-[0.1em] font-black text-slate-900 border-b-2 border-primary pb-0.5 hover:opacity-70 transition-opacity">Configuration Summary</a>
          <a href="#" className="text-[10px] uppercase tracking-[0.1em] font-bold text-slate-500 hover:text-slate-900 transition-colors">Download Specs</a>
          <a href="#" className="text-[10px] uppercase tracking-[0.1em] font-bold text-slate-500 hover:text-slate-900 transition-colors">Contact Technician</a>
        </nav>
      </footer>
    </div>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('about');
  const [selectedProduct, setSelectedProduct] = useState<Product>({
    id: 'bp-51c',
    name: 'Sharp BP-51C',
    description: 'Advanced multifunction printer with 51 color ppm and modular expandability',
    image: '/assets/BP-51C_MFP.png',
    basePrice: 8900
  });
  const [appSelectedFinisher, setAppSelectedFinisher] = useState<string>('none');
  const [appSelectedTray, setAppSelectedTray] = useState<string>('none');
  const [appExtraTray, setAppExtraTray] = useState<boolean>(false);

  const handleNavigateToAbout = () => {
    setCurrentScreen('about');
  };

  const handleNavigateToCatalog = () => {
    setCurrentScreen('catalog');
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('detail');
  };

  const handleConfigureFromDetail = () => {
    setCurrentScreen('config');
  };

  const handleUpdateTray = (id: string) => {
    setAppSelectedTray(id);
    if (id === 'none') {
      setAppSelectedFinisher('none');
      setAppExtraTray(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {currentScreen === 'about' && (
        <motion.div
          key="about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <About onNavigateToCatalog={handleNavigateToCatalog} />
        </motion.div>
      )}
      {currentScreen === 'catalog' && (
        <motion.div
          key="catalog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Catalog 
            onNavigateToAbout={handleNavigateToAbout}
            onSelectProduct={handleSelectProduct}
          />
        </motion.div>
      )}
      {currentScreen === 'detail' && (
        <motion.div
          key="detail"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ProductDetail
            product={selectedProduct}
            onBack={handleNavigateToCatalog}
            onConfigure={handleConfigureFromDetail}
            onSelectFinisher={(id: string) => setAppSelectedFinisher(id)}
            onSelectTray={handleUpdateTray}
            selectedFinisher={appSelectedFinisher}
            selectedTray={appSelectedTray}
            extraTray={appExtraTray}
            onToggleExtraTray={() => {
              if (appSelectedTray === 'none') return;
              setAppExtraTray((v) => !v);
            }}
          />
        </motion.div>
      )}
      {currentScreen === 'config' && (
        <motion.div
          key="config"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ConfigScreen 
            onNavigateToAbout={handleNavigateToAbout}
            onNavigateToCatalog={handleNavigateToCatalog}
            product={selectedProduct}
            initialSelectedFinisher={appSelectedFinisher}
            initialSelectedTray={appSelectedTray}
            initialExtraTray={appExtraTray}
            onUpdateExtraTray={(v: boolean) => {
              if (appSelectedTray === 'none') return;
              setAppExtraTray(v);
            }}
            onUpdateFinisher={(id: string) => setAppSelectedFinisher(id)}
            onUpdateTray={handleUpdateTray}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
