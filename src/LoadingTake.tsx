import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, staticFile, Easing } from "remotion";
import React from "react";

export const LoadingTake: React.FC<{ imageSrc?: string }> = ({
  imageSrc = staticFile("image.png")
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Progress from 0 to 100% over the full clip (4 seconds / 120 frames)
  const progressWidth = interpolate(
    frame,
    [0, durationInFrames],
    [0, 100],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateRight: "clamp",
    }
  );

  // Efeito de brilho pulsante idêntico ao carregamento
  const glowPulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Imagem de fundo enviada pelo usuário (contém o layout todo) */}
      <Img 
        src={imageSrc} 
        style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }} 
      />

      {/* 
        Container sobreposto exatamente na posição do tubinho original da imagem.
        Ele serve para cobrir qualquer estado estático da barra na imagem 
        e desenhar a animação por cima. (Os valores top/left/width são aproximados 
        para se encaixar na imagem enviada)
      */}
      <div style={{
         position: 'absolute', 
         top: '54.5%',    // Ajuste fino da posição vertical
         left: '27.4%',   // Ajuste fino da posição horizontal
         width: '45.1%',  // Ajuste fino da largura
         height: 12,      // Altura do tubinho
         backgroundColor: '#1E1E1E', // Cor de fundo do trilho (para cobrir o existente)
         borderRadius: 6, 
         overflow: 'hidden',
         boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)'
      }}>
         {/* A barra roxa crescendo (O "tubinho") */}
         <div style={{ 
           height: '100%', 
           width: `${progressWidth}%`, 
           backgroundColor: '#A855F7', // Roxo principal
           opacity: glowPulse, 
           boxShadow: '0 0 12px #A855F7', // Brilho
           borderRadius: 6
         }} />
      </div>
    </AbsoluteFill>
  );
};
