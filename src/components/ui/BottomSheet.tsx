'use client';

import { createContext, useContext, useRef, useEffect, useCallback, useState } from 'react';

type BottomSheetContextValue = { expand: () => void; collapse: () => void; isExpanded: boolean };
const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

// PC では BottomSheet に包まれていないため null を返す。呼び出し側は ?. で無視する。
export function useBottomSheet() {
  return useContext(BottomSheetContext);
}

type BottomSheetProps = {
  children: React.ReactNode;
  peekHeight?: number;
};

export function BottomSheet({ children, peekHeight = 280 }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startY: 0, startTranslate: 0, dragging: false });
  const [translateY, setTranslateY] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [sheetMaxTranslate, setSheetMaxTranslate] = useState(0);

  useEffect(() => {
    if (sheetRef.current) {
      const fullHeight = sheetRef.current.scrollHeight;
      const viewportExpand = typeof window !== 'undefined' ? window.innerHeight * 0.7 - peekHeight : 0;
      const contentExpand = fullHeight - peekHeight;
      setSheetMaxTranslate(Math.max(0, Math.max(contentExpand, viewportExpand)));
    }
  }, [peekHeight, children]);

  const handleDragStart = useCallback((clientY: number) => {
    dragRef.current = {
      startY: clientY,
      startTranslate: translateY,
      dragging: true,
    };
  }, [translateY]);

  const handleDragMove = useCallback((clientY: number) => {
    if (!dragRef.current.dragging) return;
    const delta = dragRef.current.startY - clientY;
    const newTranslate = Math.max(0, Math.min(sheetMaxTranslate, dragRef.current.startTranslate + delta));
    setTranslateY(newTranslate);
  }, [sheetMaxTranslate]);

  const handleDragEnd = useCallback(() => {
    dragRef.current.dragging = false;
    if (translateY > sheetMaxTranslate / 2) {
      setTranslateY(sheetMaxTranslate);
      setExpanded(true);
    } else {
      setTranslateY(0);
      setExpanded(false);
    }
  }, [translateY, sheetMaxTranslate]);

  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientY);
  const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientY);
  const onTouchEnd = () => handleDragEnd();

  const onMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientY);
    const onMouseMove = (ev: MouseEvent) => handleDragMove(ev.clientY);
    const onMouseUp = () => {
      handleDragEnd();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const toggleExpand = () => {
    if (expanded) {
      setTranslateY(0);
      setExpanded(false);
    } else {
      setTranslateY(sheetMaxTranslate);
      setExpanded(true);
    }
  };

  const expand = useCallback(() => {
    setTranslateY(sheetMaxTranslate);
    setExpanded(true);
  }, [sheetMaxTranslate]);

  const collapse = useCallback(() => {
    setTranslateY(0);
    setExpanded(false);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, []);

  return (
    <BottomSheetContext.Provider value={{ expand, collapse, isExpanded: expanded }}>
    <div
      ref={sheetRef}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-glass backdrop-blur-glass border-t border-glass-border shadow-glass rounded-t-3xl transition-transform duration-300 ease-out"
      style={{
        transform: `translateY(calc(100% - ${peekHeight + translateY}px))`,
      }}
    >
      {/* ドラッグハンドル */}
      <div
        className="flex justify-center pt-4 pb-4 cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onClick={toggleExpand}
      >
        <div className="w-10 h-1 bg-sub/30 rounded-full" />
      </div>

      {/* コンテンツ */}
      <div
        ref={contentRef}
        className={`px-5 ${expanded ? 'overflow-y-auto' : 'overflow-hidden'}`}
        style={{
          height: `calc(100dvh - 120px)`,
          paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 32px)`,
        }}
      >
        {children}
      </div>
    </div>
    </BottomSheetContext.Provider>
  );
}
