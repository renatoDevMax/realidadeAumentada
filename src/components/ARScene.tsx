'use client'

import { useEffect, useState } from 'react';

const MODELS = [
  {
    path: '/modelos/hipo3d.glb',
    name: 'Hipopótamo',
    productName: 'Hipoclorito de Sódio, 12% - Clarilimp',
    price: 'R$ 29,50',
    scale: '1 1 1',
    rotation: '90 180 0'
  },
  {
    path: '/modelos/tulimix3d.glb',
    name: 'Tulimix',
    productName: 'Alcool Perfumado Tulimix - 1L',
    price: 'R$ 19,60',
    scale: '1 1 1',
    rotation: '90 180 0'
  },
  {
    path: '/modelos/aguasanit3d.glb',
    name: 'Água Sanitária',
    productName: 'Agua Sanitaria Clarilimp - 5L',
    price: 'R$ 10,40',
    scale: '1 1 1',
    rotation: '0 90 270'
  }
];

export default function ARScene() {
  const [isClient, setIsClient] = useState(false);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [isMarkerVisible, setIsMarkerVisible] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Registra o componente personalizado após o carregamento do A-Frame
    if (window.AFRAME && !window.AFRAME.components['hide-on-enter-ar']) {
      window.AFRAME.registerComponent('hide-on-enter-ar', {
        init: function() {
          var el = this.el;
          this.el.sceneEl.addEventListener('enter-vr', function() {
            el.object3D.visible = false;
          });
          this.el.sceneEl.addEventListener('exit-vr', function() {
            el.object3D.visible = true;
          });
        }
      });

      // Registra um componente personalizado para controlar a transparência
      window.AFRAME.registerComponent('model-opacity', {
        schema: {
          opacity: {type: 'number', default: 1.0}
        },
        init: function() {
          this.el.addEventListener('model-loaded', () => {
            const obj = this.el.getObject3D('mesh');
            if (obj) {
              obj.traverse((node) => {
                if (node.isMesh) {
                  node.material.transparent = true;
                  node.material.opacity = this.data.opacity;
                }
              });
            }
          });
        },
        update: function() {
          const obj = this.el.getObject3D('mesh');
          if (obj) {
            obj.traverse((node) => {
              if (node.isMesh) {
                node.material.transparent = true;
                node.material.opacity = this.data.opacity;
              }
            });
          }
        }
      });

      // Registra um componente para detectar a visibilidade do marcador
      window.AFRAME.registerComponent('marker-handler', {
        init: function() {
          this.el.addEventListener('markerFound', () => {
            setIsMarkerVisible(true);
          });
          
          this.el.addEventListener('markerLost', () => {
            setIsMarkerVisible(false);
          });
        }
      });
    }

    // Timer para alternar entre os modelos
    const interval = setInterval(() => {
      setCurrentModelIndex((prevIndex) => (prevIndex + 1) % MODELS.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getModelPosition = (index: number) => {
    const isCurrent = index === currentModelIndex;
    return isCurrent ? '0 1 0' : '3 1 0';
  };

  if (!isClient) return null;

  return (
    <>
      <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;">
        <a-marker 
          preset="hiro" 
          marker-handler
        >
          {MODELS.map((model, index) => (
            <a-entity
              key={index}
              position={getModelPosition(index)}
              scale={model.scale}
              rotation={model.rotation}
              gltf-model={model.path}
              animation__position={`
                property: position;
                from: ${index === currentModelIndex ? '3 1 0' : '0 1 0'};
                to: ${getModelPosition(index)};
                dur: 1000;
                easing: easeInOutQuad;
                loop: false
              `}
            ></a-entity>
          ))}
        </a-marker>
        <a-entity camera></a-entity>
      </a-scene>

      {!isMarkerVisible && (
        <div 
          style={{
            position: 'fixed',
            bottom: '170px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '8px 15px',
            borderRadius: '5px',
            zIndex: 1000,
            fontSize: 'clamp(0.8rem, 4vw, 1rem)',
            textAlign: 'center',
            width: '90%',
            maxWidth: '400px',
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          Aponte a câmera para o marcador HIRO para ver os modelos
        </div>
      )}

      <div
        style={{
          width: "100%",
          height: "clamp(120px, 25vh, 150px)",
          backgroundColor: "white",
          position: 'absolute',
          right: 0,
          bottom: 0,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: 'clamp(10px, 3vh, 15px)',
          fontFamily: 'Arial, sans-serif',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ 
          fontSize: 'clamp(1rem, 5vw, 1.5rem)',
          fontWeight: 'bold',
          marginBottom: 'clamp(4px, 2vh, 8px)',
          color: '#333',
          lineHeight: 1.2,
          padding: '0 10px'
        }}>
          {MODELS[currentModelIndex].productName}
        </div>
        <div style={{ 
          fontSize: 'clamp(1.2rem, 6vw, 2rem)',
          fontWeight: 'bold',
          color: '#e41e31',
          marginBottom: 'clamp(4px, 2vh, 8px)',
          lineHeight: 1.2
        }}>
          Por apenas {MODELS[currentModelIndex].price}
        </div>
        <div style={{ 
          fontSize: 'clamp(0.9rem, 4vw, 1.2rem)',
          fontWeight: 'bold',
          color: '#333',
          lineHeight: 1.2
        }}>
          O MELHOR PREÇO DO LITORAL
        </div>
      </div>
    </>
  );
} 