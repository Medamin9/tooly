'use client';

import dynamic from 'next/dynamic';

const StarfieldCanvas = dynamic(() => import('./StarfieldCanvas'), {
  ssr: false,
});

export function StarfieldBackground() {
  return <StarfieldCanvas />;
}

export default StarfieldBackground;
