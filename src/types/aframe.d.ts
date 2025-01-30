declare namespace JSX {
  interface IntrinsicElements {
    'a-scene': any;
    'a-entity': any;
    'a-marker': any;
    'a-box': any;
  }
}

interface Window {
  AFRAME: {
    registerComponent: (name: string, component: any) => void;
  }
} 