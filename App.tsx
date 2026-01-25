
import React, { useState, useCallback } from 'react';
import { 
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { DEFAULT_SVGS } from './utils/constants';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import BottomBar from './components/BottomBar';
import Canvas from './components/Canvas';
import TopNav from './components/TopNav';
import { AppState, CanvasElement, ViewMode, ElementType, Column } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    elements: [
      {
        id: '1',
        type: 'title',
        headingLevel: 'h1',
        content: 'Mi Proyecto Estructurado',
        styles: { fontSize: '42px', textAlign: 'center', margin: '0', fontWeight: '800', color: '#1e293b' }
      }
    ],
    selectedId: null,
    viewMode: 'web',
    savedSvgs: [...DEFAULT_SVGS],
    zoom: 1,
    globalGap: 16
  });

  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = useCallback((elements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(elements)));
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setState(s => ({ ...s, elements: history[historyIndex - 1] }));
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setState(s => ({ ...s, elements: history[historyIndex + 1] }));
      setHistoryIndex(historyIndex + 1);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const createNewElement = (type: ElementType): CanvasElement => {
    const id = Math.random().toString(36).substr(2, 9);
    return {
      id, type,
      content: type === 'social' ? 'Redes' : type === 'columns' ? '' : 'Texto de ejemplo',
      styles: { margin: '0', padding: '15px', textAlign: 'left' },
      headingLevel: type === 'title' ? 'h1' : undefined,
      socialNetworks: type === 'social' ? [
        { type: 'facebook', url: '#', enabled: true },
        { type: 'instagram', url: '#', enabled: true },
        { type: 'whatsapp', url: '#', enabled: true },
        { type: 'web', url: '#', enabled: true },
      ] : undefined,
      iconName: type === 'icon' ? 'Star' : undefined,
      columnData: type === 'columns' ? [
        { id: `col-${id}-1`, elements: [] },
        { id: `col-${id}-2`, elements: [] }
      ] : undefined
    };
  };

  const addElement = (type: ElementType) => {
    const newEl = createNewElement(type);
    const newElements = [...state.elements, newEl];
    setState(prev => ({ ...prev, elements: newElements, selectedId: newEl.id }));
    saveToHistory(newElements);
  };

  const addElementToColumn = (columnId: string, type: ElementType) => {
    const newEl = createNewElement(type);
    const updateCols = (elements: CanvasElement[]): CanvasElement[] => {
      return elements.map(el => {
        if (el.columnData) {
          return {
            ...el,
            columnData: el.columnData.map(col => 
              col.id === columnId 
                ? { ...col, elements: [...col.elements, newEl] }
                : { ...col, elements: updateCols(col.elements) }
            )
          };
        }
        return el;
      });
    };
    const newElements = updateCols(state.elements);
    setState(prev => ({ ...prev, elements: newElements, selectedId: newEl.id }));
    saveToHistory(newElements);
  };

  const updateNested = (elements: CanvasElement[], id: string, updates: Partial<CanvasElement>): CanvasElement[] => {
    return elements.map(el => {
      if (el.id === id) return { ...el, ...updates };
      if (el.columnData) {
        return {
          ...el,
          columnData: el.columnData.map(col => ({
            ...col,
            elements: updateNested(col.elements, id, updates)
          }))
        };
      }
      return el;
    });
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    const newElements = updateNested(state.elements, id, updates);
    setState(prev => ({ ...prev, elements: newElements }));
    saveToHistory(newElements);
  };

  const updateStyles = (id: string, styleUpdates: any) => {
    const updateRecursive = (elements: CanvasElement[]): CanvasElement[] => {
      return elements.map(el => {
        if (el.id === id) return { ...el, styles: { ...el.styles, ...styleUpdates } };
        if (el.columnData) {
          return {
            ...el,
            columnData: el.columnData.map(col => ({ ...col, elements: updateRecursive(col.elements) }))
          };
        }
        return el;
      });
    };
    const newElements = updateRecursive(state.elements);
    setState(prev => ({ ...prev, elements: newElements }));
    saveToHistory(newElements);
  };

  const moveElement = (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    const moveInList = (list: CanvasElement[]): CanvasElement[] => {
      const idx = list.findIndex(e => e.id === id);
      if (idx !== -1) {
        let newList = [...list];
        if (direction === 'up' && idx > 0) [newList[idx], newList[idx-1]] = [newList[idx-1], newList[idx]];
        if (direction === 'down' && idx < newList.length - 1) [newList[idx], newList[idx+1]] = [newList[idx+1], newList[idx]];
        if (direction === 'top') newList.unshift(newList.splice(idx, 1)[0]);
        if (direction === 'bottom') newList.push(newList.splice(idx, 1)[0]);
        return newList;
      }
      return list.map(el => el.columnData ? {
        ...el,
        columnData: el.columnData.map(col => ({ ...col, elements: moveInList(col.elements) }))
      } : el);
    };
    const newElements = moveInList(state.elements);
    setState(prev => ({ ...prev, elements: newElements }));
    saveToHistory(newElements);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = state.elements.findIndex(e => e.id === active.id);
      const newIdx = state.elements.findIndex(e => e.id === over.id);
      if (oldIdx !== -1 && newIdx !== -1) {
        const newElements = arrayMove(state.elements, oldIdx, newIdx);
        setState(prev => ({ ...prev, elements: newElements }));
        saveToHistory(newElements);
      }
    }
  };

  const findSelected = (elements: CanvasElement[]): CanvasElement | undefined => {
    for (const el of elements) {
      if (el.id === state.selectedId) return el;
      if (el.columnData) {
        for (const col of el.columnData) {
          const res = findSelected(col.elements);
          if (res) return res;
        }
      }
    }
    return undefined;
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden">
      <TopNav 
        viewMode={state.viewMode} 
        setViewMode={m => setState(s => ({...s, viewMode: m}))} 
        onUndo={undo} onRedo={redo} 
        canUndo={historyIndex > 0} 
        canRedo={historyIndex < history.length - 1} 
        zoom={state.zoom} 
        setZoom={z => setState(s => ({...s, zoom: z}))} 
        elements={state.elements} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        <SidebarLeft addElement={addElement} />
        
        <main className="flex-1 overflow-auto bg-slate-200/40 p-12 flex justify-center items-start">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div 
              style={{ transform: `scale(${state.zoom})`, transformOrigin: 'top center' }}
              className={`canvas-container shadow-2xl bg-white min-h-[11in] transition-all duration-300 relative ${
                state.viewMode === 'mobile' ? 'w-[375px]' : state.viewMode === 'email' ? 'w-[600px]' : 'w-full max-w-[900px]'
              }`}
            >
              <SortableContext items={state.elements.map(e => e.id)} strategy={verticalListSortingStrategy}>
                <Canvas 
                  elements={state.elements} 
                  selectedId={state.selectedId} 
                  setSelectedId={id => setState(s => ({...s, selectedId: id}))} 
                  updateElement={updateElement} 
                  updateStyles={updateStyles}
                  addElementToColumn={addElementToColumn}
                  globalGap={state.globalGap}
                />
              </SortableContext>
            </div>
          </DndContext>
        </main>

        <SidebarRight 
          selectedElement={findSelected(state.elements)} 
          globalGap={state.globalGap}
          setGlobalGap={g => setState(s => ({...s, globalGap: g}))}
          updateElement={updateElement} 
          updateStyles={updateStyles} 
          deleteElement={id => {
            const del = (list: CanvasElement[]): CanvasElement[] => list.filter(e => e.id !== id).map(e => e.columnData ? {...e, columnData: e.columnData.map(c => ({...c, elements: del(c.elements)}))} : e);
            const next = del(state.elements);
            setState(s => ({...s, elements: next, selectedId: null}));
            saveToHistory(next);
          }} 
          moveElement={moveElement} 
        />
      </div>

      <BottomBar 
        selectedId={state.selectedId} 
        updateStyles={updateStyles} 
        savedSvgs={state.savedSvgs} 
        onSaveSvg={s => setState(p => ({...p, savedSvgs: [...p.savedSvgs, s]}))} 
        onInsertSvg={() => addElement('svg')} 
      />
    </div>
  );
};

export default App;
