
import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CanvasElement, ElementStyles, ListItem, ElementType } from '../types';
import * as LucideIcons from 'lucide-react';
import { 
  GripVertical, Mic, ExternalLink, Facebook, Instagram, Music2, Globe, 
  MessageCircle, FileText, Download, Printer, Plus, ChevronRight, ChevronDown, Trash2
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

  useEffect(() => {
    if (isEditing && textInputRef.current) textInputRef.current.focus();
  }, [isEditing]);

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { action, link } = element;
    if (action === 'print' || action === 'pdf') window.print();
    else if (action === 'save') {
      const html = document.querySelector('.canvas-container')?.innerHTML || '';
      const blob = new Blob([`<html><head><script src="https://cdn.tailwindcss.com"></script></head><body>${html}</body></html>`], { type: 'text/html' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'pagina.html';
      a.click();
    } else if (link) window.open(link.startsWith('http') ? link : `https://${link}`, '_blank');
  };

  const renderContent = () => {
    switch (element.type) {
      case 'title':
        const Tag = (element.headingLevel || 'h1') as any;
        return (
          <div className="flex items-center gap-3 group/title">
            <button 
              onClick={(e) => { e.stopPropagation(); updateElement(element.id, { isCollapsed: !element.isCollapsed }); }}
              className={`p-1 rounded transition-colors ${element.isCollapsed ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-indigo-50 text-slate-300 hover:text-indigo-600'}`}
              title={element.isCollapsed ? "Expandir sección" : "Contraer sección"}
            >
              {element.isCollapsed ? <ChevronRight size={20}/> : <ChevronDown size={20}/>}
            </button>
            <Tag 
              onDoubleClick={() => setIsEditing(true)} 
              className="flex-1 outline-none cursor-text" 
              style={{ fontWeight: '800', lineHeight: '1.2' }}
            >
              {isEditing ? (
                <input 
                  ref={textInputRef as any} 
                  className="w-full bg-transparent border-b-2 border-indigo-400 focus:outline-none" 
                  value={element.content} 
                  onChange={e => updateElement(element.id, { content: e.target.value })} 
                  onBlur={() => setIsEditing(false)} 
                />
              ) : element.content}
            </Tag>
          </div>
        );

      case 'paragraph':
        return (
          <div onDoubleClick={() => setIsEditing(true)} className="leading-relaxed text-slate-600 cursor-text">
            {isEditing ? (
              <textarea 
                ref={textInputRef as any} 
                className="w-full bg-transparent outline-none border-b border-indigo-200 min-h-[60px]" 
                value={element.content} 
                onChange={e => updateElement(element.id, { content: e.target.value })} 
                onBlur={() => setIsEditing(false)} 
              />
            ) : <p className="whitespace-pre-wrap">{element.content}</p>}
          </div>
        );

      case 'icon':
        const Icon = (LucideIcons as any)[element.iconName || 'Star'] || LucideIcons.Star;
        return (
          <div className="flex justify-center p-2 cursor-pointer hover:scale-110 transition-transform" onClick={handleAction}>
            <Icon size={parseInt(element.styles.fontSize || '48')} color={element.styles.color || '#4f46e5'} strokeWidth={1.5} />
          </div>
        );

      case 'columns':
        return (
          <div className="flex w-full" style={{ gap: element.styles.gap || '24px' }}>
            {element.columnData?.map((col) => (
              <div key={col.id} className="flex-1 min-h-[60px] border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/20 relative group/col">
                <div className="flex flex-col gap-2">
                  {col.elements.map(subEl => (
                    <SortableItem 
                      key={subEl.id} 
                      element={subEl} 
                      isSelected={false} 
                      onClick={onClick} 
                      updateElement={updateElement} 
                      updateStyles={updateStyles} 
                    />
                  ))}
                </div>
                
                <div className="mt-2 flex justify-center">
                  <div className="relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowColMenu(showColMenu === col.id ? null : col.id); }}
                      className="p-1 bg-white border shadow-sm rounded-full text-indigo-500 opacity-0 group-hover/col:opacity-100 hover:bg-indigo-600 hover:text-white transition-all scale-75"
                    >
                      <Plus size={14} />
                    </button>
                    
                    {showColMenu === col.id && (
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white border shadow-xl rounded-lg p-2 flex flex-col gap-1 z-50 min-w-[120px]">
                        {['paragraph', 'image', 'icon', 'button'].map(type => (
                          <button 
                            key={type}
                            onClick={() => { addElementToColumn?.(col.id, type as ElementType); setShowColMenu(null); }}
                            className="text-[10px] uppercase font-bold text-slate-500 p-2 hover:bg-slate-100 rounded text-left"
                          >
                            + {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'button':
        return (
          <div className="flex justify-center">
            <button 
              className="flex items-center gap-3 font-bold transition-all active:scale-95 hover:brightness-110 shadow-sm" 
              style={{
                ...element.styles,
                backgroundColor: element.styles.backgroundColor || '#4f46e5',
                color: element.styles.color || '#ffffff',
                padding: element.styles.padding || '10px 20px',
                borderRadius: element.styles.borderRadius || '10px',
              }} 
              onClick={handleAction}
            >
              {element.action === 'save' && <Download size={16}/>}
              {element.action === 'print' && <Printer size={16}/>}
              {element.content}
            </button>
          </div>
        );

      case 'social':
        return (
          <div className="flex justify-center gap-4 py-2">
            {element.socialNetworks?.filter(n => n.enabled).map(net => (
              <a 
                key={net.type} 
                href={net.url} 
                target="_blank" 
                className="p-2.5 bg-white border border-slate-100 shadow-sm rounded-xl hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1"
                onClick={e => e.stopPropagation()}
              >
                {net.type === 'facebook' && <Facebook size={20}/>}
                {net.type === 'instagram' && <Instagram size={20}/>}
                {net.type === 'whatsapp' && <MessageCircle size={20}/>}
                {net.type === 'tiktok' && <Music2 size={20}/>}
                {net.type === 'web' && <Globe size={20}/>}
              </a>
            ))}
          </div>
        );

      case 'image':
        return (
          <div className="text-center group/img relative inline-block w-full">
            <img 
              src={element.content} 
              className="rounded-lg inline-block shadow-sm transition-transform hover:scale-[1.005]" 
              style={{ ...element.styles, width: element.styles.width || '100%' }} 
              onClick={handleAction} 
            />
          </div>
        );
      
      case 'divider': 
        return <div className="py-2"><div style={{ borderTop: `${element.styles.borderWidth || '1px'} solid ${element.styles.borderColor || '#e2e8f0'}`, opacity: element.styles.opacity }} /></div>;
      
      default: return <div className="p-4 border-2 border-dashed rounded-xl text-slate-300 text-center font-bold">Elemento {element.type}</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`relative group px-4 py-1.5 transition-all rounded-lg
        ${isSelected ? 'ring-2 ring-indigo-500 z-10 bg-indigo-50/10 shadow-md' : 'hover:bg-slate-50/30 hover:ring-1 hover:ring-slate-100'}
      `}
    >
      <div {...attributes} {...listeners} className="absolute -left-10 top-1/2 -translate-y-1/2 p-1.5 bg-white border shadow-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity element-drag-handle text-slate-400 hover:text-indigo-600 z-20">
        <GripVertical size={16} />
      </div>
      {renderContent()}
    </div>
  );
};

const Canvas: React.FC<{ elements: CanvasElement[], selectedId: string | null, setSelectedId: (id: string | null) => void, updateElement: any, updateStyles: any, addElementToColumn: any, globalGap: number }> = ({ 
  elements, selectedId, setSelectedId, updateElement, updateStyles, addElementToColumn, globalGap
}) => {
  const getVisibleElements = () => {
    const visible: string[] = [];
    let isHiding = false;
    let hideLevel = 99;

    elements.forEach((el) => {
      const currentLevel = el.headingLevel ? parseInt(el.headingLevel[1]) : 99;
      
      // Si estamos ocultando y encontramos un título de nivel igual o superior (número menor o igual), dejamos de ocultar
      if (isHiding && el.type === 'title' && currentLevel <= hideLevel) {
        isHiding = false;
        hideLevel = 99;
      }
      
      if (!isHiding) visible.push(el.id);
      
      // Si este elemento es un título y está colapsado, empezamos a ocultar los siguientes
      if (el.isCollapsed && el.type === 'title' && !isHiding) {
        isHiding = true;
        hideLevel = currentLevel;
      }
    });
    return visible;
  };

  const visibleIds = getVisibleElements();

  return (
    <div className="p-16 min-h-full w-full flex flex-col" style={{ gap: `${globalGap}px` }} onClick={() => setSelectedId(null)}>
      {elements.length === 0 && (
        <div className="h-96 border-4 border-dashed rounded-3xl flex flex-col items-center justify-center text-slate-300 gap-4">
          <Plus size={64} />
          <p className="text-xl font-bold uppercase tracking-widest">El lienzo está vacío</p>
        </div>
      )}
      {elements.map((el) => (
        <SortableItem 
          key={el.id} 
          element={el} 
          isSelected={selectedId === el.id} 
          onClick={() => setSelectedId(el.id)} 
          updateElement={updateElement} 
          updateStyles={updateStyles}
          isHidden={!visibleIds.includes(el.id)}
          addElementToColumn={addElementToColumn}
        />
      ))}
    </div>
  );
};

export default Canvas;
