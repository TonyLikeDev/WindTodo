import { CSSProperties, ReactNode } from 'react';

export default function GlassCard({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`glass p-6 rounded-2xl ${className}`} style={style}>
      {children}
    </div>
  );
}
