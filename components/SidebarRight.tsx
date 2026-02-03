
import React, { useState } from 'react';
import { 
  Trash2, AlignLeft, AlignCenter, AlignRight,
  Link, Mail, Phone, MapPin, Printer, Download, Facebook, Instagram, Globe, FileText, Save,
  ChevronUp, ChevronDown, ArrowUpToLine, ArrowDownToLine, Search, Settings2, Sliders, Image as ImageIcon
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { CanvasElement, ElementStyles, ButtonAction, HeadingLevel, Column } from '../types';

interface SidebarRightProps {
  selectedElement?: CanvasElement;
  globalGap: number;
  setGlobalGap: (g: number) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  updateStyles: (id: string, styles: Partial<ElementStyles>) => void;
  deleteElement: (id: string) => void;
  moveElement?: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
}

const SidebarRight: React.FC<SidebarRightProps> = ({ 
  selectedElement, globalGap, setGlobalGap, updateElement, updateStyles, deleteElement, moveElement 
}) => {
  const [iconSearch, setIconSearch] = useState('');

  if (!selectedElement) {
    return (
      <aside className="w-72 bg-white border-l flex flex-col p-6 shadow-2xl z-40">
        <div className="mb-8">
           <div className="flex items-center gap-2 mb-4 border-b pb-2">
             <Settings2 size={18} className="text-indigo-600" />
             <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800">Ajustes de Página</h3>
           </div>
           <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Espaciado Global</label>
                  <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{globalGap}px</span>
                </div>
                <input type="range" min="0" max="100" value={globalGap} onChange={e => setGlobalGap(parseInt(e.target.value))} className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
              </div>
           </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-300">
           <Sliders size={32} className="mb-3 opacity-20" />
           <p className="text-xs font-medium px-4">Selecciona un elemento para editar sus propiedades</p>
        </div>
      </aside>
    );
  }

  const s = selectedElement.styles;

  return (
    <aside className="w-72 bg-white border-l flex flex-col shrink-0 overflow-y-auto pb-10 shadow-2xl z-40">
      <div className="p-4 border-b flex justify-between items-center bg-slate-50 sticky top-0 z-10 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600">Configuración</h3>
        <button 
          onClick={() => {
            if(confirm("¿Estás seguro de que quieres borrar este elemento?")) {
              deleteElement(selectedElement.id);
            }
          }} 
          className="p-2 text-slate-400 hover:text-white hover:bg-red-500 rounded-lg transition-all" 
          title="Eliminar elemento"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="p-5 space-y-8">
        {/* INPUT URL PARA IMÁGENES */}
        {selectedElement.type === 'image' && (
          <div className="space-y-3 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-2 text-indigo-700">
              <ImageIcon size={14} />
              <label className="text-[11px] font-bold uppercase">URL de la Imagen</label>
            </div>
            <input 
              type="text" 
              className="w-full text-xs border border-indigo-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="https://ejemplo.com/foto.jpg"
              value={selectedElement.content || ''}
              onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
            />
          </div>
        )}

        {/* ORDEN DE CAPAS */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mover Capa</label>
          <div className="grid grid-cols-4 gap-1">
            <button onClick={() => moveElement?.(selectedElement.id, 'top')} className="p-2 border rounded-lg hover:bg-indigo-50 text-slate-600"><ArrowUpToLine size={14}/></button>
            <button onClick={() => moveElement?.(selectedElement.id, 'up')} className="p-2 border rounded-lg hover:bg-indigo-50 text-slate-600"><ChevronUp size={14}/></button>
            <button onClick={() => moveElement?.(selectedElement.id, 'down')} className="p-2 border rounded-lg hover:bg-indigo-50 text-slate-600"><ChevronDown size={14}/></button>
            <button onClick={() => moveElement?.(selectedElement.id, 'bottom')} className="p-2 border rounded-lg hover:bg-indigo-50 text-slate-600"><ArrowDownToLine size={14}/></button>
          </div>
        </div>

        {/* ESTILOS VISUALES */}
        <div className="space-y-4 border-t pt-6">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estilo</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Tamaño</label>
              <input type="text" className="w-full text-xs border rounded-lg p-2 focus:ring-1 focus:ring-indigo-400 outline-none" placeholder="24px" value={s.fontSize || ''} onChange={(e) => updateStyles(selectedElement.id, { fontSize: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Alineación</label>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {(['left', 'center', 'right'] as const).map(align => (
                  <button key={align} onClick={() => updateStyles(selectedElement.id, { textAlign: align })} className={`flex-1 p-1 rounded ${s.textAlign === align ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}>
                    {align === 'left' && <AlignLeft size={14}/>}
                    {align === 'center' && <AlignCenter size={14}/>}
                    {align === 'right' && <AlignRight size={14}/>}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex-1 space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase">Color</label>
                <input type="color" className="w-full h-8 rounded-lg border p-1 cursor-pointer" value={s.color || '#000000'} onChange={e => updateStyles(selectedElement.id, { color: e.target.value })} />
             </div>
             <div className="flex-1 space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase">Redondeo</label>
                <input type="text" className="w-full text-xs border rounded-lg p-2 outline-none" placeholder="8px" value={s.borderRadius || ''} onChange={(e) => updateStyles(selectedElement.id, { borderRadius: e.target.value })} />
             </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarRight;
