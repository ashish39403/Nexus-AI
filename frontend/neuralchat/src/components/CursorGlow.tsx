import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export const CursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div
      ref={glowRef}
      className="cursor-glow"
      style={{
        background: isDark
          ? 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)',
      }}
    />
  );
};
