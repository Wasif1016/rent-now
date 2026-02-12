import React from 'react';
import { cn } from '@/lib/utils';

interface SVGIconProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
}

/**
 * A component that renders an SVG as a mask, allowing it to be colored
 * using the current text color (or any background color).
 */
export function SVGIcon({ src, className, ...props }: SVGIconProps) {
  return (
    <div
      className={cn('bg-current inline-block shrink-0', className)}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
      }}
      {...props}
    />
  );
}
