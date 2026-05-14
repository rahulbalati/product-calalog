import React, { useEffect, useRef, useState } from 'react';

type ARModalProps = {
  modelUrl: string | null;
  iosSrc?: string;
  onClose: () => void;
  note?: string;
};

export default function ARModal({ modelUrl, iosSrc, onClose, note }: ARModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const modelViewerRef = useRef<(HTMLElement & { canActivateAR?: boolean; activateAR?: () => Promise<void> }) | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unsupported'>('loading');
  const [launchStatus, setLaunchStatus] = useState<'idle' | 'launching' | 'failed'>('idle');

  useEffect(() => {
    if (!containerRef.current || !modelUrl) return;
    let disposed = false;

    const mountModelViewer = () => {
      if (disposed || !containerRef.current) return;

      // Create model-viewer programmatically to avoid TSX custom-element typing.
      const mv = document.createElement('model-viewer') as HTMLElement & {
        canActivateAR?: boolean;
        activateAR?: () => Promise<void>;
      };
      mv.setAttribute('src', modelUrl);
      if (iosSrc) mv.setAttribute('ios-src', iosSrc);
      mv.setAttribute('alt', 'AR model');
      mv.setAttribute('ar', '');
      mv.setAttribute('ar-modes', 'quick-look scene-viewer webxr');
      mv.setAttribute('ar-scale', 'fixed');
      mv.setAttribute('camera-controls', '');
      mv.setAttribute('auto-rotate', '');
      mv.setAttribute('reveal', 'auto');
      mv.setAttribute('quick-look-browsers', 'safari chrome');
      mv.setAttribute('style', 'width:100%;height:100%;background:transparent;');

      const onLoad = () => {
        if (disposed) return;
        setStatus(mv.canActivateAR === false ? 'unsupported' : 'ready');
      };
      const onError = () => {
        if (!disposed) setStatus('unsupported');
      };
      const onArStatus = (event: Event) => {
        const detail = (event as CustomEvent<{ status?: string }>).detail;
        if (detail?.status === 'failed') setLaunchStatus('failed');
        if (detail?.status === 'session-started') setLaunchStatus('idle');
      };

      mv.addEventListener('load', onLoad);
      mv.addEventListener('error', onError);
      mv.addEventListener('ar-status', onArStatus);
      containerRef.current.appendChild(mv);
      modelViewerRef.current = mv;

      return () => {
        mv.removeEventListener('load', onLoad);
        mv.removeEventListener('error', onError);
        mv.removeEventListener('ar-status', onArStatus);
        if (modelViewerRef.current === mv) modelViewerRef.current = null;
        try { containerRef.current?.removeChild(mv); } catch (e) {}
      };
    };

    let cleanupViewer: (() => void) | undefined;
    const modelViewerDefinition = customElements.get('model-viewer');
    if (modelViewerDefinition) {
      cleanupViewer = mountModelViewer();
    } else {
      customElements.whenDefined('model-viewer').then(() => {
        cleanupViewer = mountModelViewer();
      }).catch(() => {
        if (!disposed) setStatus('unsupported');
      });
    }

    return () => {
      disposed = true;
      cleanupViewer?.();
      if (modelUrl.startsWith('blob:')) {
        setTimeout(() => { try { URL.revokeObjectURL(modelUrl); } catch (e) {} }, 5000);
      }
    };
  }, [modelUrl]);

  if (!modelUrl) return null;

  const launchAR = async () => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer?.activateAR) {
      setLaunchStatus('failed');
      return;
    }

    try {
      setLaunchStatus('launching');
      await modelViewer.activateAR();
      setLaunchStatus('idle');
    } catch (e) {
      setLaunchStatus('failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div className="relative w-full max-w-2xl h-[80vh] bg-white rounded-md overflow-hidden">
        <button onClick={onClose} className="absolute top-3 right-3 z-40 bg-white/80 px-3 py-1 rounded">Close</button>
        <div className="absolute left-3 top-3 z-30 max-w-[calc(100%-6rem)] rounded bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-slate-600">
          {status === 'loading' && 'Loading AR model'}
          {status === 'ready' && 'Ready for mobile AR'}
          {status === 'unsupported' && 'AR is not available in this browser'}
          {note && <span className="block normal-case tracking-normal font-semibold text-slate-500">{note}</span>}
          {launchStatus === 'failed' && (
            <span className="block normal-case tracking-normal font-semibold text-amber-600">
              On iPhone, open this page in Safari and tap Launch AR again.
            </span>
          )}
        </div>
        <button
          type="button"
          disabled={status !== 'ready' || launchStatus === 'launching'}
          onClick={launchAR}
          className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded bg-primary px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {launchStatus === 'launching' ? 'Launching' : 'Launch AR'}
        </button>
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
