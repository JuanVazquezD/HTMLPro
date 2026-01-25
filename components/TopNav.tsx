
import React from 'react';
import { 
  Smartphone, Monitor, Mail, Download, Printer, Save, FileCode, 
  Undo2, Redo2, ZoomIn, ZoomOut, Search, Share2 
} from 'lucide-react';
import { ViewMode, CanvasElement } from '../types';

interface TopNavProps {
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  setZoom: (z: number) => void;
  elements: CanvasElement[];
}

const TopNav: React.FC<TopNavProps> = ({ 
  viewMode, setViewMode, onUndo, onRedo, canUndo, canRedo, zoom, setZoom, elements 
}) => {
  const exportHTML = () => {
    const html = document.querySelector('.canvas-container')?.innerHTML || '';
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proyecto-visual.html';
    a.click();
  };

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-4 z-50 shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 mr-4">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <FileCode className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800 hidden md:block">Builder Pro</span>
        </div>

        <div className="flex items-center gap-1 border-r pr-4 mr-4">
          <button 
            disabled={!canUndo} 
            onClick={onUndo} 
            className={`p-1.5 rounded hover:bg-slate-100 ${!canUndo ? 'text-slate-300' : 'text-slate-600'}`}
          >
            <Undo2 size={18} />
          </button>
          <button 
            disabled={!canRedo} 
            onClick={onRedo} 
            className={`p-1.5 rounded hover:bg-slate-100 ${!canRedo ? 'text-slate-300' : 'text-slate-600'}`}
          >
            <Redo2 size={18} />
          </button>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button onClick={() => setViewMode('mobile')} className={`p-1.5 rounded-md ${viewMode === 'mobile' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}><Smartphone size={18} /></button>
          <button onClick={() => setViewMode('web')} className={`p-1.5 rounded-md ${viewMode === 'web' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}><Monitor size={18} /></button>
          <button onClick={() => setViewMode('email')} className={`p-1.5 rounded-md ${viewMode === 'email' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}><Mail size={18} /></button>
        </div>

        <div className="flex items-center gap-1 ml-4 border-l pl-4">
          <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="p-1.5 rounded hover:bg-slate-100 text-slate-600"><ZoomOut size={18} /></button>
          <span className="text-xs font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="p-1.5 rounded hover:bg-slate-100 text-slate-600"><ZoomIn size={18} /></button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => window.print()} className="p-2 text-slate-600 hover:bg-slate-100 rounded-md"><Printer size={18} /></button>
        <button onClick={exportHTML} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-800 text-white hover:bg-slate-900 rounded-md shadow-sm"><Download size={16} /> <span className="hidden sm:inline">Exportar</span></button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-md shadow-sm"><Save size={16} /> <span className="hidden sm:inline">Guardar</span></button>
      </div>
    </header>
  );
};

export default TopNav;
