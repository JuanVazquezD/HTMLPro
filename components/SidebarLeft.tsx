
import React from 'react';
import { 
  Heading1, TextQuote, ImageIcon, Circle, Minus, 
  Table, List, Layout, Plus, MousePointer2, Share2, Columns, Smile
} from 'lucide-react';
import { ElementType } from '../types';

interface SidebarLeftProps {
  addElement: (type: ElementType) => void;
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({ addElement }) => {
  const elements = [
    { type: 'title', icon: <Heading1 size={20} />, label: 'Título / Encabezado' },
    { type: 'paragraph', icon: <TextQuote size={20} />, label: 'Párrafo' },
    { type: 'columns', icon: <Columns size={20} />, label: 'Columnas' },
    { type: 'icon', icon: <Smile size={20} />, label: 'Icono Individual' },
    { type: 'image', icon: <ImageIcon size={20} />, label: 'Imagen' },
    { type: 'button', icon: <MousePointer2 size={20} />, label: 'Botón de Acción' },
    { type: 'social', icon: <Share2 size={20} />, label: 'Iconos Sociales' },
    { type: 'table', icon: <Table size={20} />, label: 'Tabla' },
    { type: 'list', icon: <List size={20} />, label: 'Lista Dinámica' },
    { type: 'divider', icon: <Minus size={20} />, label: 'Separador' },
    { type: 'logo', icon: <Circle size={20} />, label: 'Logo / Círculo' },
    { type: 'spacer', icon: <Layout size={20} />, label: 'Espaciador' },
  ];

  return (
    <aside className="w-64 bg-white border-r flex flex-col shrink-0">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Paleta</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {elements.map((item) => (
          <button
            key={item.type}
            onClick={() => addElement(item.type as ElementType)}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-indigo-500 hover:bg-indigo-50 transition-all text-slate-600 hover:text-indigo-700 text-sm group"
          >
            <span className="text-slate-400 group-hover:text-indigo-500">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default SidebarLeft;
