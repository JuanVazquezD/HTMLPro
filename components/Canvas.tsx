
import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CanvasElement, ElementStyles, ElementType } from '../types';
import * as LucideIcons from 'lucide-react';
import { 
  GripVertical, Plus, ChevronRight, ChevronDown, Download, Printer, Facebook, Instagram, MessageCircle, Music2, Globe 
} from 'lucide-react';

interface SortableItemProps {
  element: CanvasElement;
  isSelected: boolean;
  onClick: () => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  updateStyles: (id: string, styles: Partial<ElementStyles>) => void;
  isHidden?: boolean;
  addElementToColumn?: (colId: string, type: ElementType) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ 
  element, isSelected, onClick, updateElement, updateStyles, isHidden, addElementToColumn
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showColMenu, setShowColMenu] = useState<string | null>(null);
  const textInputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : (element.styles.opacity ?? 1),
    display: isHidden ? 'none' : 'block',
    ...element.styles
  };

  const renderContent = () => {
    switch (element.type) {
      case 'title':
        const Tag = (element.headingLevel || 'h1') as any;
        return (
          <div className="flex items-center gap-3">
            <button 
              onClick={(e) => { e.stopPropagation(); updateElement(element.id, { isCollapsed: !element.isCollapsed }); }}
              className={`p-1 rounded ${element.isCollapsed ? 'bg-indigo-100 text-indigo-700' : 'text-slate-300'}`}
            >
              {element.isCollapsed ? <ChevronRight size={18}/> : <ChevronDown size={18}/>}
            </button>
            <Tag onDoubleClick={() => setIsEditing(true)} className="flex-1 outline-none font-bold">
              {isEditing ? (
                <input ref={textInputRef as any} className="w-full bg-transparent border-b border-indigo-400" value={element.content} onChange={e => updateElement(element.id, { content: e.target.value })} onBlur={() => setIsEditing(false)} />
              ) : element.content}
            </Tag>
          </div>
        );
      case 'paragraph':
        return (
          <div onDoubleClick={() => setIsEditing(true)} className="text-slate-600 leading-relaxed">
            {isEditing ? (
              <textarea ref={textInputRef as any} className="w-full bg-transparent border-b border-indigo-200 outline-none" value={element.content} onChange={e => updateElement(element.id, { content: e.target.value })} onBlur={() => setIsEditing(false)} />
            ) : <p>{element.content}</p>}
          </div>
        );
      case 'columns':
        return (
          <div className="flex w-full" style={{ gap: element.styles.gap || '20px' }}>
            {element.columnData?.map(col => (
              <div key={col.id} className="flex-1 min-h-[40px] border border-dashed border-slate-200 rounded-lg p-3 relative group/col">
                <div className="flex flex-col gap-2">
                  {col.elements.map(sub => <SortableItem key={sub.id} element={sub} isSelected={false} onClick={onClick} updateElement={updateElement} updateStyles={updateStyles} />)}
                </div>
                <button onClick={() => addElementToColumn?.(col.id, 'paragraph')} className="absolute bottom-1 right-1 p-1 bg-white border rounded-full opacity-0 group-hover/col:opacity-100"><Plus size={12}/></button>
              </div>
            ))}
          </div>
        );
      case 'button':
        return (
          <div className="flex justify-center">
            <button className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-sm" style={element.styles}>{element.content}</button>
          </div>
        );
      case 'icon':
        const Icon = (LucideIcons as any)[element.iconName || 'Star'] || LucideIcons.Star;
        return <div className="flex justify-center py-2"><Icon size={element.styles.fontSize || 40} color={element.styles.color || '#6366f1'} /></div>;
      case 'divider':
        return <div className="py-2 border-t border-slate-200" style={{ opacity: element.styles.opacity }} />;
      case 'social':
        return (
          <div className="flex justify-center gap-4 py-2">
            <Facebook size={20} className="text-slate-400" /> <Instagram size={20} className="text-slate-400" /> <Globe size={20} className="text-slate-400" />
          </div>
        );
      case 'image':
        return <img src={element.content} className="w-full rounded-lg shadow-sm" style={element.styles} />;
      default: return <div className="p-4 border rounded text-center text-slate-300 uppercase text-xs font-bold">{element.type}</div>;
    }
  };

  return (
    <div ref={setNodeRef} style={style} onClick={(e) => { e.stopPropagation(); onClick(); }} className={`relative group px-4 py-1 rounded-lg transition-all ${isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50/10' : 'hover:bg-slate-50/50'}`}>
      <div {...attributes} {...listeners} className="absolute -left-8 top-1/2 -translate-y-1/2 p-1 text-slate-300 opacity-0 group-hover:opacity-100 cursor-move"><GripVertical size={16}/></div>
      {renderContent()}
    </div>
  );
};

const Canvas: React.FC<{ elements: CanvasElement[], selectedId: string | null, setSelectedId: (id: string | null) => void, updateElement: any, updateStyles: any, addElementToColumn: any, globalGap: number }> = ({ 
  elements, selectedId, setSelectedId, updateElement, updateStyles, addElementToColumn, globalGap
}) => {
  const getVisibleIds = () => {
    const ids: string[] = [];
    let hiding = false;
    let hideLevel = 99;
    elements.forEach(el => {
      const level = el.headingLevel ? parseInt(el.headingLevel[1]) : 99;
      if (hiding && el.type === 'title' && level <= hideLevel) hiding = false;
      if (!hiding) ids.push(el.id);
      if (el.isCollapsed && el.type === 'title' && !hiding) { hiding = true; hideLevel = level; }
    });
    return ids;
  };
  const visible = getVisibleIds();

  return (
    <div className="p-16 min-h-full w-full flex flex-col" style={{ gap: `${globalGap}px` }} onClick={() => setSelectedId(null)}>
      {elements.map(el => <SortableItem key={el.id} element={el} isSelected={selectedId === el.id} onClick={() => setSelectedId(el.id)} updateElement={updateElement} updateStyles={updateStyles} isHidden={!visible.includes(el.id)} addElementToColumn={addElementToColumn} />)}
    </div>
  );
};

export default Canvas;
