/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import GlbViewer from './GlbViewer';
import type { GlbAttachment } from './GlbViewer';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  basePrice: number;
}

export default function ProductDetail({
  product,
  onBack,
  onConfigure,
  onSelectFinisher,
  onSelectTray,
  selectedFinisher,
  selectedTray,
  extraTray,
  onToggleExtraTray
}: {
  product: Product | null;
  onBack: () => void;
  onConfigure: () => void;
  onSelectFinisher: (id: string) => void;
  onSelectTray: (id: string) => void;
  selectedFinisher: string;
  selectedTray: string;
  extraTray?: boolean;
  onToggleExtraTray?: () => void;
}) {
  if (!product) return null;

  type ViewMode = 'image' | '3d';

  const FINISHERS = [
    { id: 'finisher01', name: 'Finisher 01', image: '/assets/finisher/Finisher_01.png' },
    { id: 'finisher02', name: 'Finisher 02', image: '/assets/finisher/Finisher_02.png' },
    { id: 'finisher03', name: 'Finisher 03', image: '/assets/finisher/Finisher_03.png' },
    { id: 'finisher04', name: 'Finisher 04', image: '/assets/finisher/Finisher_04.png' }
  ];

  const TRAYS = [
    { id: 'tray01', name: 'Large Tray 01', image: '/assets/tray/Tray_01.png' },
    { id: 'tray02', name: 'Large Tray 02', image: '/assets/tray/Tray_02.png' },
    { id: 'tray03', name: 'Large Tray 03', image: '/assets/tray/Tray_03.png' },
    { id: 'tray04', name: 'Large Tray 04', image: '/assets/tray/Tray_04.png' }
  ];

  const [previewImage, setPreviewImage] = useState(product.image);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('image');
  const draggingRef = useRef<{ active: boolean; startX: number; startRotation: number }>({ active: false, startX: 0, startRotation: 0 });
  const canSelectAddons = selectedTray !== 'none';
  const TRAY_GLB_MAP: Record<string, string> = {
    tray01: '/assets/BP-DE12.glb',
    tray02: '/assets/BP-DE12.glb',
    tray03: '/assets/BP-DE12.glb',
    tray04: '/assets/BP-DE12.glb'
  };
  const selectedTrayGlb = TRAY_GLB_MAP[selectedTray] ?? '/assets/BP-DE12.glb';
  const glbAttachments = useMemo<GlbAttachment[]>(() => [
    {
      id: 'baseLower',
      path: selectedTrayGlb,
      enabled: selectedTray !== 'none',
      position: { x: -0.01, y: -0.23, z: 0 },
      scale: 0.55,
      rotation: { x: 0, y: 0, z: 0 }
    },
    {
      id: 'paperBox',
      path: '/assets/paper_box.glb',
      enabled: !!extraTray,
      position: { x: 0.3, y: -0.23, z: 0 },
      scale: 0.4,
      rotation: { x: 0, y: 0, z: 0 }
    },
    {
      id: 'finisher1',
      path: '/assets/finisher_1.glb',
      enabled: selectedFinisher !== 'none',
      position: { x: -0.38, y: -0.23, z: 0 },
      scale: 0.7,
      rotation: { x: 0, y: 0, z: 0 }
    }
  ], [selectedFinisher, extraTray, selectedTray]);

  function onPointerDown(e: React.PointerEvent) {
    if (viewMode === '3d') return;
    (e.target as Element).setPointerCapture(e.pointerId);
    draggingRef.current = { active: true, startX: e.clientX, startRotation: rotation };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (viewMode === '3d') return;
    // If dragging (orbit), update rotation
    if (draggingRef.current.active) {
      const dx = e.clientX - draggingRef.current.startX;
      const newRot = draggingRef.current.startRotation + dx * 0.2;
      setRotation(newRot);
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    try { (e.target as Element).releasePointerCapture(e.pointerId); } catch {}
    draggingRef.current.active = false;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-black selection:text-white">
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm flex justify-between items-center px-8 h-16">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-900 hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs uppercase tracking-widest font-bold">Back</span>
        </button>
        <h1 className="text-lg font-black uppercase tracking-widest text-slate-900">{product.name}</h1>
        <button onClick={onConfigure} className="bg-primary text-white px-4 py-2 rounded">Configure</button>
      </header>

      <main className="pt-16 flex-grow flex flex-col md:flex-row gap-6 p-8">
        <section className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-3xl bg-white p-6 rounded shadow">
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="w-full h-96 flex items-center justify-center overflow-hidden rounded"
              style={{ touchAction: viewMode === '3d' ? 'auto' : 'none', cursor: viewMode === '3d' ? 'grab' : 'grab' }}
            >
              {viewMode === '3d' ? (
                <GlbViewer attachments={glbAttachments} className="min-h-96" />
              ) : (
                <motion.img
                  src={previewImage}
                  alt={product.name}
                  className="w-full h-full object-contain select-none"
                  style={{ transform: `perspective(1000px) rotateY(${rotation}deg) scale(${zoom})`, transition: 'transform 0.08s linear' }}
                />
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setViewMode('image')}
                className={`px-3 py-1 border rounded text-sm ${viewMode === 'image' ? 'border-primary text-primary' : 'border-slate-200'}`}
              >
                Image View
              </button>
              <button
                onClick={() => setViewMode('3d')}
                className={`px-3 py-1 border rounded text-sm ${viewMode === '3d' ? 'border-primary text-primary' : 'border-slate-200'}`}
              >
                3D View
              </button>
              <button onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.1).toFixed(2)))} className="px-3 py-1 border rounded">-</button>
              <div className="text-sm font-mono">Zoom: {Math.round(zoom * 100)}%</div>
              <button onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.1).toFixed(2)))} className="px-3 py-1 border rounded">+</button>
              {viewMode === '3d' && (
                <div className="text-xs text-slate-500">Drag to rotate, scroll to zoom</div>
              )}
            </div>
          </div>

          <div className={`mt-4 grid grid-cols-5 gap-2 w-full max-w-3xl ${!canSelectAddons ? 'opacity-55' : ''}`}>
            <button
              key="none-finisher"
              disabled={!canSelectAddons}
              onClick={() => {
                if (!canSelectAddons) return;
                setPreviewImage(product.image);
                onSelectFinisher('none');
              }}
              className={`p-1 border rounded ${selectedFinisher==='none'? 'border-primary' : 'border-slate-200'} ${!canSelectAddons ? 'cursor-not-allowed' : ''}`}
            >
              <div className="w-full h-16 flex items-center justify-center border-dashed rounded bg-slate-50">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">None</span>
              </div>
              <div className="text-xs text-slate-700 mt-1 text-center">None</div>
            </button>
            {FINISHERS.map(f => (
              <button
                key={f.id}
                disabled={!canSelectAddons}
                onClick={() => {
                  if (!canSelectAddons) return;
                  setPreviewImage(f.image);
                  onSelectFinisher(f.id);
                }}
                className={`p-1 border rounded ${selectedFinisher===f.id? 'border-primary' : 'border-slate-200'} ${!canSelectAddons ? 'cursor-not-allowed' : ''}`}
              >
                <img src={f.image} alt={f.name} className="w-full h-16 object-contain" />
                <div className="text-xs text-slate-700 mt-1 text-center">{f.name}</div>
              </button>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-5 gap-2 w-full max-w-3xl">
            <button key="none-tray" onClick={() => { setPreviewImage(product.image); onSelectTray('none'); }} className={`p-1 border rounded ${selectedTray==='none'? 'border-primary' : 'border-slate-200'}`}>
              <div className="w-full h-16 flex items-center justify-center border-dashed rounded bg-slate-50">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">None</span>
              </div>
              <div className="text-xs text-slate-700 mt-1 text-center">None</div>
            </button>
            {TRAYS.map(t => (
              <button key={t.id} onClick={() => { setPreviewImage(t.image); onSelectTray(t.id); }} className={`p-1 border rounded ${selectedTray===t.id? 'border-primary' : 'border-slate-200'}`}>
                <img src={t.image} alt={t.name} className="w-full h-16 object-contain" />
                <div className="text-xs text-slate-700 mt-1 text-center">{t.name}</div>
              </button>
            ))}
          </div>
        </section>

        <aside className="w-full md:w-96">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Overview</h2>
            <p className="text-sm text-slate-600 mb-4">{product.description}</p>
            <p className="text-sm text-slate-500 mb-2">Base Price: <strong className="text-lg text-primary">${product.basePrice.toLocaleString()}</strong></p>

            <div className="mt-4">
              <h3 className="text-sm font-bold mb-2">Selected Finisher</h3>
              <p className="text-sm text-slate-600">{(selectedFinisher && selectedFinisher !== 'none') ? FINISHERS.find(f=>f.id===selectedFinisher)?.name ?? 'None' : 'None'}</p>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-bold mb-2">Selected Tray</h3>
              <p className="text-sm text-slate-600">{(selectedTray && selectedTray !== 'none') ? TRAYS.find(t=>t.id===selectedTray)?.name ?? 'None' : 'None'}</p>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-bold mb-2">Extra Paper Tray1</h3>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={!canSelectAddons}
                  onClick={() => {
                    if (!canSelectAddons) return;
                    onToggleExtraTray && onToggleExtraTray();
                  }}
                  className={`w-10 h-5 rounded-full relative transition-colors duration-150 ${extraTray ? 'bg-primary' : 'bg-slate-200'} ${!canSelectAddons ? 'opacity-55 cursor-not-allowed' : ''}`}
                >
                  <span
                    className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform"
                    style={{ transform: extraTray ? 'translateX(20px)' : 'translateX(4px)' }}
                  />
                </button>
                <div className="text-sm">{extraTray ? 'Attached' : 'Not attached'}</div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button onClick={onConfigure} className="flex-1 bg-primary text-white px-4 py-2 rounded">Configure</button>
              <button onClick={onBack} className="flex-1 border border-slate-200 px-4 py-2 rounded">Back</button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
