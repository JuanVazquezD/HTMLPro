
import React, { useState, useEffect } from 'react';
import { Palette, Layers, Shapes, Save, X } from 'lucide-react';
import { ElementStyles } from '../types';

interface BottomBarProps {
  selectedId: string | null;
  updateStyles: (id: string, styles: Partial<ElementStyles>) => void;
  savedSvgs: { name: string; content: string }[];
  onSaveSvg: (svg: { name: string; content: string }) => void;
  onInsertSvg: (content: string) => void;
}

const BottomBar: React.FC<BottomBarProps> = ({ 
  selectedId, updateStyles, savedSvgs, onSaveSvg, onInsertSvg
}) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'gradients' | 'svgs'>('colors');
  const [showAdvancedPicker, setShowAdvancedPicker] = useState(false);
  const [hex, setHex] = useState('#4f46e5');
  const [alpha, setAlpha] = useState(1);

  const applyColor = (color: string) => {
    if (selectedId) updateStyles(selectedId, { backgroundColor: color, backgroundGradient: '', opacity: alpha });
  };

  const hexToRgb = (h: string) => {
    let r = 0, g = 0, b = 0;
    if (h.length === 4) {
      r = parseInt(h[1] + h[1], 16); g = parseInt(h[2] + h[2], 16); b = parseInt(h[3] + h[3], 16);
    } else if (h.length === 7) {
      r = parseInt(h[1] + h[2], 16); g = parseInt(h[3] + h[4], 16); b = parseInt(h[5] + h[6], 16);
    }
    return `${r}, ${g}, ${b}`;
  };

  return (
    <footer className="h-16 bg-white border-t flex items-center px-4 shrink-0 shadow-lg z-50 relative">
      <div className="flex border rounded-xl overflow-hidden mr-6 bg-slate-50 p-1">
        {(['colors', 'gradients', 'svgs'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-2 transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
            {tab === 'colors' && <Palette size={14}/>}
            {tab === 'gradients' && <Layers size={14}/>}
            {tab === 'svgs' && <Shapes size={14}/>}
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 flex items-center gap-4">
        {activeTab === 'colors' && (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAdvancedPicker(!showAdvancedPicker)}
              className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              <Palette size={14}/> Selector Avanzado
            </button>
            <div className="flex gap-1">
              {['#ffffff', '#f1f5f9', '#94a3b8', '#1e293b', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#6366f1'].map(c => (
                <button key={c} onClick={() => { setHex(c); applyColor(c); }} style={{backgroundColor: c}} className="w-6 h-6 rounded-full border border-slate-200 hover:scale-110 transition-transform shadow-sm"/>
              ))}
            </div>
          </div>
        )}
      </div>

      {showAdvancedPicker && (
        <div className="absolute bottom-20 left-4 bg-white border shadow-2xl rounded-2xl p-5 w-80 z-[100] animate-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold uppercase text-slate-400">Mapa de Colores</h4>
            <button onClick={() => setShowAdvancedPicker(false)}><X size={16} className="text-slate-400"/></button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input type="color" value={hex} onChange={e => { setHex(e.target.value); applyColor(e.target.value); }} className="w-16 h-16 rounded-lg border-none cursor-pointer overflow-hidden p-0" />
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Hexadecimal</label>
                <input type="text" value={hex} onChange={e => setHex(e.target.value)} className="w-full text-sm font-mono border rounded p-1" />
              </div>
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-slate-500 uppercase">RGB: <span className="text-slate-400 font-normal">{hexToRgb(hex)}</span></label>
               <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">Opacidad <span>{Math.round(alpha * 100)}%</span></label>
               <input type="range" min="0" max="1" step="0.01" value={alpha} onChange={e => { setAlpha(parseFloat(e.target.value)); applyColor(hex); }} className="w-full accent-indigo-600" />
            </div>
            <button onClick={() => applyColor(hex)} className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all">APLICAR COLOR</button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default BottomBar;
