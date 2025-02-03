"use client";

import { useEffect, useState } from "react";

const MODELS = [
  {
    path: "/modelos/hipo3d.glb",
    name: "Hipoclorito",
    productName: "Hipoclorito de Sódio, 12% - Clarilimp",
    price: "R$ 29,50",
    scale: "1 1 1",
    rotation: "90 180 90",
  },
  {
    path: "/modelos/tulimix3d.glb",
    name: "Tulimix",
    productName: "Alcool Perfumado Tulimix - 1L",
    price: "R$ 19,60",
    scale: "1 1 1",
    rotation: "90 180 0",
  },
  {
    path: "/modelos/aguasanit3d.glb",
    name: "Água Sanitária",
    productName: "Agua Sanitaria Clarilimp - 5L",
    price: "R$ 10,40",
    scale: "1 1 1",
    rotation: "0 90 270",
  },
];

export default function ARScene() {
  const [isClient, setIsClient] = useState(false);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [isMarkerVisible, setIsMarkerVisible] = useState(false);

  // Função para avançar ao próximo modelo
  const handleNextModel = () => {
    setCurrentModelIndex((prevIndex) => (prevIndex + 1) % MODELS.length);
  };

  // Função para voltar ao modelo anterior
  const handlePreviousModel = () => {
    setCurrentModelIndex((prevIndex) =>
      prevIndex === 0 ? MODELS.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    setIsClient(true);

    // Registra o componente personalizado após o carregamento do A-Frame
    if (window.AFRAME && !window.AFRAME.components["hide-on-enter-ar"]) {
      window.AFRAME.registerComponent("hide-on-enter-ar", {
        init: function () {
          var el = this.el;
          this.el.sceneEl.addEventListener("enter-vr", function () {
            el.object3D.visible = false;
          });
          this.el.sceneEl.addEventListener("exit-vr", function () {
            el.object3D.visible = true;
          });
        },
      });

      // Registra um componente personalizado para controlar a transparência
      window.AFRAME.registerComponent("model-opacity", {
        schema: {
          opacity: { type: "number", default: 1.0 },
        },
        init: function () {
          this.el.addEventListener("model-loaded", () => {
            const obj = this.el.getObject3D("mesh");
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
        update: function () {
          const obj = this.el.getObject3D("mesh");
          if (obj) {
            obj.traverse((node) => {
              if (node.isMesh) {
                node.material.transparent = true;
                node.material.opacity = this.data.opacity;
              }
            });
          }
        },
      });

      // Registra um componente para detectar a visibilidade do marcador
      window.AFRAME.registerComponent("marker-handler", {
        init: function () {
          this.el.addEventListener("markerFound", () => {
            setIsMarkerVisible(true);
          });

          this.el.addEventListener("markerLost", () => {
            setIsMarkerVisible(false);
          });
        },
      });
    }

    // Timer para alternar entre os modelos
    const interval = setInterval(() => {
      handleNextModel();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getModelPosition = (index: number) => {
    const isCurrent = index === currentModelIndex;
    return isCurrent ? "0 1 0" : "3 1 0";
  };

  if (!isClient) return null;

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false;"
        renderer="antialias: true; alpha: true"
        vr-mode-ui="enabled: false"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <a-marker preset="hiro" marker-handler>
          {MODELS.map((model, index) => (
            <a-entity
              key={index}
              position={getModelPosition(index)}
              scale={model.scale}
              rotation={model.rotation}
              gltf-model={model.path}
              animation__position={`
                property: position;
                from: ${index === currentModelIndex ? "3 1 0" : "0 1 0"};
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

      {/* Adicione estes estilos ao globals.css */}
      <style jsx global>{`
        .a-canvas {
          width: 100% !important;
          height: 100% !important;
          position: absolute !important;
          top: 0 !important;
          left: 50% !important;
          z-index: 1;
        }

        /* Estilo para o vídeo da câmera */
        .arjs-video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translateX(50%) !important;
          z-index: 0;
        }
      `}</style>

      <div className="quadrosAnimados quadro2"></div>
      <div className="quadrosAnimados quadro3"></div>
      <div className="quadrosAnimados quadro4"></div>

      <div className="areaBotoes">
        <div
          className="btnTroca botaoVoltar"
          onClick={handlePreviousModel}
          role="button"
          tabIndex={0}
          aria-label="Modelo anterior"
        >
          &lt;
        </div>
        <div
          className="btnTroca botaoAvancar"
          onClick={handleNextModel}
          role="button"
          tabIndex={0}
          aria-label="Próximo modelo"
        >
          &gt;
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "2%",
          left: "20%",
          right: 0,
          width: "250px",
          height: "250px",
          backgroundColor: "#fff",
          boxShadow: "0px 0px 100px inset #7E3F8F",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "min(15px, 3vh)",
          fontFamily: "Arial, sans-serif",
          boxSizing: "border-box",
          borderRadius: "30px",
          animation: "flutuaQuadrodos 3s 1s ease-in-out infinite alternate",
        }}
      >
        <div
          style={{
            fontSize: "clamp(1rem, 4vw, 1.5rem)",
            fontWeight: "bold",
            marginBottom: "min(8px, 2vh)",
            color: "#333",
            lineHeight: 1.2,
            padding: "0 10px",
          }}
        >
          {MODELS[currentModelIndex].productName}
        </div>
        <div
          style={{
            fontSize: "clamp(1.2rem, 5vw, 2rem)",
            fontWeight: "bold",
            color: "#e41e31",
            marginBottom: "min(8px, 2vh)",
            lineHeight: 1.2,
          }}
        >
          Por apenas {MODELS[currentModelIndex].price}
        </div>
        <div
          style={{
            fontSize: "clamp(0.9rem, 3.5vw, 1.2rem)",
            fontWeight: "bold",
            color: "#333",
            lineHeight: 1.2,
          }}
        >
          O MELHOR PREÇO DO LITORAL
        </div>
      </div>
    </div>
  );
}
