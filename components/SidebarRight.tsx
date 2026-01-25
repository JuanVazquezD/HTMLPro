
import React, { useState } from 'react';
import { 
  Trash2, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link, Mail, Phone, MapPin, Printer, Download, Mic, List, Hash, CheckSquare,
  ArrowLeft, ArrowRight, Facebook, Instagram, MessageCircle, Music2, Globe, FileText, Save,
  ChevronUp, ChevronDown, ArrowUpToLine, ArrowDownToLine, Columns, Smile, Search, Settings2, Sliders
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { CanvasElement, ElementStyles, ButtonAction, ListType, ListItem, HeadingLevel, Column } from '../types';

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
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="1"
                  value={globalGap} 
                  onChange={e => setGlobalGap(parseInt(e.target.value))} 
                  className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-[10px] text-slate-400">Controla la distancia vertical entre todos los bloques del visor.</p>
              </div>
           </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-300">
           <Sliders size={32} className="mb-3 opacity-20" />
           <p className="text-xs font-medium px-4">Selecciona un elemento en el visor para editar sus estilos específicos</p>
        </div>
      </aside>
    );
  }

  const s = selectedElement.styles;

  const popularIcons = [
    'Star', 'Heart', 'Smile', 'Check', 'X', 'Info', 'AlertCircle', 
    'Home', 'Settings', 'User', 'Mail', 'Phone', 'Search', 'ExternalLink',
    'Smartphone', 'Monitor', 'Tablet', 'Music', 'Play', 'Pause', 'Github', 'Twitter', 'Linkedin'
  ].filter(i => i.toLowerCase().includes(iconSearch.toLowerCase()));

  const handleColumnCountChange = (count: number) => {
    const currentCols = selectedElement.columnData || [];
    let newCols: Column[] = [];
    if (count > currentCols.length) {
      newCols = [...currentCols];
      for (let i = currentCols.length; i < count; i++) {
        newCols.push({ id: `col-${selectedElement.id}-${i + 1}`, elements: [] });
      }
    } else {
      newCols = currentCols.slice(0, count);
    }
    updateElement(selectedElement.id, { columnData: newCols });
  };

  return (
    <aside className="w-72 bg-white border-l flex flex-col shrink-0 overflow-y-auto pb-10 shadow-2xl z-40">
      <div className="p-4 border-b flex justify-between items-center bg-slate-50 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
           <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
             <Sliders size={14} />
           </div>
           <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600">Configuración</h3>
        </div>
        <button onClick={() => deleteElement(selectedElement.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Eliminar elemento">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="p-5 space-y-8">
        {/* LAYER ORDERING */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Orden de Capas</label>
          <div className="grid grid-cols-4 gap-1">
            <button onClick={() => moveElement?.(selectedElement.id, 'top')} className="p-2 border rounded-lg hover:bg-indigo-50 hover:text-indigo-600 text-slate-600" title="Traer al frente"><ArrowUpToLine size={14}/></button>
            <button onClick={() => moveElement?.(selectedElement.id, 'up')} className="p-2 border rounded-lg hover:bg-indigo-50 hover:text-indigo-600 text-slate-600" title="Subir nivel"><ChevronUp size={14}/></button>
            <button onClick={() => moveElement?.(selectedElement.id, 'down')} className="p-2 border rounded-lg hover:bg-indigo-50 hover:text-indigo-600 text-slate-600" title="Bajar nivel"><ChevronDown size={14}/></button>
            <button onClick={() => moveElement?.(selectedElement.id, 'bottom')} className="p-2 border rounded-lg hover:bg-indigo-50 hover:text-indigo-600 text-slate-600" title="Enviar al fondo"><ArrowDownToLine size={14}/></button>
          </div>
        </div>

        {/* COLUMNS SPECIFIC */}
        {selectedElement.type === 'columns' && (
          <div className="space-y-3">
             <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Diseño de Columnas</label>
             <div className="flex gap-2">
                {[1, 2, 3, 4].map(num => (
                  <button 
                    key={num} 
                    onClick={() => handleColumnCountChange(num)}
                    className={`flex-1 py-2 border rounded-lg text-xs font-bold transition-all ${selectedElement.columnData?.length === num ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'hover:bg-slate-50 text-slate-400'}`}
                  >
                    {num}
                  </button>
                ))}
             </div>
             <div className="space-y-1 pt-2">
                <label className="text-[10px] text-slate-500 font-bold uppercase">Espaciado Interior (Gap)</label>
                <input type="text" className="w-full text-xs border rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="20px" value={s.gap || ''} onChange={(e) => updateStyles(selectedElement.id, { gap: e.target.value })} />
             </div>
          </div>
        )}

        {/* ICON SELECTOR */}
        {selectedElement.type === 'icon' && (
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Seleccionar Icono</label>
            <div className="relative mb-2">
               <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
               <input 
                type="text" 
                placeholder="Buscar icono..." 
                className="w-full pl-8 pr-2 py-2 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500" 
                value={iconSearch}
                onChange={e => setIconSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-5 gap-2 max-h-44 overflow-y-auto p-2 border rounded-xl bg-slate-50">
              {popularIcons.map(name => {
                const Icon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
                return (
                  <button 
                    key={name}
                    onClick={() => updateElement(selectedElement.id, { iconName: name })}
                    className={`p-2 rounded-lg border flex items-center justify-center transition-all ${selectedElement.iconName === name ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600'}`}
                    title={name}
                  >
                    <Icon size={16} />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* HEADING LEVEL */}
        {selectedElement.type === 'title' && (
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nivel de Encabezado</label>
            <div className="grid grid-cols-5 gap-1">
              {(['h1', 'h2', 'h3', 'h4', 'h5'] as HeadingLevel[]).map(level => (
                <button 
                  key={level}
                  onClick={() => updateElement(selectedElement.id, { headingLevel: level })}
                  className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${selectedElement.headingLevel === level ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'text-slate-400 border-slate-100 hover:bg-slate-50'}`}
                >
                  {level.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-2">
               <input 
                type="checkbox" 
                id="collapsed-check"
                checked={selectedElement.isCollapsed || false}
                onChange={e => updateElement(selectedElement.id, { isCollapsed: e.target.checked })}
                className="w-4 h-4 accent-indigo-600"
               />
               <label htmlFor="collapsed-check" className="text-[11px] font-bold text-slate-500 uppercase">Sección Contraída</label>
            </div>
          </div>
        )}

        {/* ACTION / LINK SECTION */}
        {(['button', 'image', 'icon'].includes(selectedElement.type)) && (
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Acción Interactiva</label>
            <div className="grid grid-cols-4 gap-1">
              {(['link', 'email', 'tel', 'maps', 'print', 'pdf', 'save'] as ButtonAction[]).map(a => (
                <button 
                  key={a}
                  onClick={() => updateElement(selectedElement.id, { action: a })}
                  className={`p-2 rounded-lg border flex items-center justify-center transition-all ${selectedElement.action === a ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                  title={a.toUpperCase()}
                >
                  {a === 'link' && <Link size={14}/>}
                  {a === 'email' && <Mail size={14}/>}
                  {a === 'tel' && <Phone size={14}/>}
                  {a === 'maps' && <MapPin size={14}/>}
                  {a === 'print' && <Printer size={14}/>}
                  {a === 'pdf' && <FileText size={14}/>}
                  {a === 'save' && <Save size={14}/>}
                </button>
              ))}
            </div>
            <input 
              type="text" 
              className="w-full text-xs border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="Valor de acción (URL, Email, etc.)"
              value={selectedElement.link || ''}
              onChange={(e) => updateElement(selectedElement.id, { link: e.target.value })}
            />
          </div>
        )}

        {/* VISUAL STYLE */}
        <div className="space-y-4 border-t pt-6">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estilo Visual</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Tamaño</label>
              <input type="text" className="w-full text-xs border rounded-lg p-2 focus:ring-1 focus:ring-indigo-400 outline-none" placeholder="e.g. 24px" value={s.fontSize || ''} onChange={(e) => updateStyles(selectedElement.id, { fontSize: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Alineación</label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {(['left', 'center', 'right'] as const).map(align => (
                  <button key={align} onClick={() => updateStyles(selectedElement.id, { textAlign: align })} className={`flex-1 p-1 rounded-lg transition-all ${s.textAlign === align ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    {align === 'left' && <AlignLeft size={14}/>}
                    {align === 'center' && <AlignCenter size={14}/>}
                    {align === 'right' && <AlignRight size={14}/>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase">Color</label>
                <div className="flex items-center gap-2 p-1 border rounded-lg bg-white">
                   <input type="color" className="w-6 h-6 rounded-md border-none p-0 cursor-pointer" value={s.color || '#000000'} onChange={e => updateStyles(selectedElement.id, { color: e.target.value })} />
                   <span className="text-[10px] font-mono text-slate-400 uppercase">{s.color || '#000'}</span>
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase">Opacidad</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={s.opacity ?? 1} 
                  onChange={e => updateStyles(selectedElement.id, { opacity: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-600 h-1 mt-3 appearance-none bg-slate-100 rounded-lg cursor-pointer"
                />
             </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarRight;
