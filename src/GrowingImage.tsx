import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, staticFile, Easing } from "remotion";
import React from "react";

export const GrowingImage: React.FC<{ imageSrc?: string }> = ({
  imageSrc = staticFile("pata/carregando.png") 
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Progresso do tubinho de carregamento (0 a 100%)
  const progressWidth = interpolate(
    frame,
    [0, durationInFrames - 1],
    [0, 100],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <Img 
        src={imageSrc} 
        style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }} 
      />
      
      {/* Container sobreposto exatamente na posição do tubinho da imagem */}
      <div style={{
         position: 'absolute', 
         bottom: '25%',   // Posição baseada no PataVideo original
         left: '15%', 
         width: '70%', 
         height: 12,
         backgroundColor: 'rgba(255, 255, 255, 0.4)', 
         borderRadius: 6, 
         overflow: 'hidden',
         boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
         <div style={{ 
           height: '100%', 
           width: `${progressWidth}%`, 
           backgroundColor: '#4ade80',  // Cor verde do Pata
           boxShadow: '0 0 15px #4ade80', 
           borderRadius: 6
         }} />
      </div>
    </AbsoluteFill>
  );
};
