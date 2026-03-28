'use client';

import { useRef, useEffect, useCallback, useState } from 'react';

type BottomSheetProps = {
  children: React.ReactNode;
  peekHeight?: number;
};

export function BottomSheet({ children, peekHeight = 280 }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startY: 0, startTranslate: 0, dragging: false });
  const [translateY, setTranslateY] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [sheetMaxTranslate, setSheetMaxTranslate] = useState(0);

  useEffect(() => {
    if (sheetRef.current) {
      const fullHeight = sheetRef.current.scrollHeight;
      setSheetMaxTranslate(Math.max(0, fullHeight - peekHeight));
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
    // スナップ: 半分以上引き上げたら展開、そうでなければpeek
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

  return (
    <div
      ref={sheetRef}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-glass backdrop-blur-glass border-t border-glass-border shadow-glass rounded-t-3xl transition-transform duration-300 ease-out"
      style={{
        height: `calc(100dvh - 80px)`,
        transform: `translateY(calc(100% - ${peekHeight + translateY}px))`,
      }}
    >
      {/* ドラッグハンドル */}
      <div
        className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onClick={toggleExpand}
      >
        <div className="w-10 h-1 bg-sub/30 rounded-full" />
      </div>

      {/* コンテンツ */}
      <div className={`px-5 pb-6 ${expanded ? 'overflow-y-auto' : 'overflow-hidden'}`} style={{ height: 'calc(100% - 28px)' }}>
        {children}
      </div>
    </div>
  );
}
