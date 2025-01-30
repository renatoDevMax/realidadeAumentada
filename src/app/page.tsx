'use client'

import dynamic from 'next/dynamic';
import Script from 'next/script';

const ARScene = dynamic(() => import('@/components/ARScene'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      Carregando experiência AR...
    </div>
  )
});

export default function Home() {
  return (
    <>
      <Script src="https://aframe.io/releases/1.4.0/aframe.min.js" strategy="beforeInteractive" />
      <Script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js" strategy="beforeInteractive" />
      <ARScene />
    </>
  );
}
