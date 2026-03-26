import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Img,
  useCurrentFrame,
  spring,
  useVideoConfig,
  interpolate,
  staticFile,
  Easing,
} from "remotion";

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, 100], [2.5, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp"
  });

  const blur = interpolate(frame, [0, 80], [30, 0], { extrapolateRight: "clamp" });
  const floatY = Math.sin(frame * 0.05) * 10;

  return (
    <AbsoluteFill style={{ backgroundColor: "#fff" }}>
      <Img 
        src={staticFile("pata/resultado.png")} 
        style={{ 
          width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${scale}) translateY(${floatY}px)`,
          filter: `blur(${blur}px)`
        }} 
      />
    </AbsoluteFill>
  );
};

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  
  const y = interpolate(frame, [0, 40], [1000, 0], {
    easing: Easing.out(Easing.back(1.5)),
    extrapolateRight: "clamp"
  });

  const scale = interpolate(frame, [0, 40], [0.8, 1], {
    easing: Easing.out(Easing.back(1.5)),
    extrapolateRight: "clamp"
  });

  const floatY = Math.sin(frame * 0.05) * 15;
  const floatX = Math.cos(frame * 0.03) * 5;

  return (
    <AbsoluteFill>
      <Img 
        src={staticFile("pata/home.png")} 
        style={{ 
          width: "100%", height: "100%", objectFit: "cover",
          transform: `translateY(${y + floatY}px) translateX(${floatX}px) scale(${scale})`,
          boxShadow: '0 -10px 30px rgba(0,0,0,0.5)' 
        }} 
      />
    </AbsoluteFill>
  );
};

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const floatY = Math.sin(frame * 0.05) * 10;

  const tapScale = interpolate(frame, [35, 40, 45, 60], [1, 0.95, 1.05, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5))
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#fff", opacity: fadeIn }}>
      <Img 
        src={staticFile("pata/upload.png")} 
        style={{ 
          width: "100%", height: "100%", objectFit: "cover",
          transform: `translateY(${floatY}px) scale(${tapScale})`
        }} 
      />
    </AbsoluteFill>
  );
};

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  
  const imagePulse = interpolate(Math.sin(frame * 0.2), [-1, 1], [0, 1]);
  const floatY = Math.sin(frame * 0.05) * 10;
  
  const progressWidth = interpolate(frame, [20, 150], [0, 100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad)
  });

  const glowPulse = interpolate(Math.sin(frame * 0.3), [-1, 1], [0.6, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#fff", opacity: fadeIn, transform: `translateY(${floatY}px)` }}>
      <Img 
        src={staticFile("pata/carregando.png")} 
        style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }} 
      />
      <Img 
        src={staticFile("pata/carregando (2).png")} 
        style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", opacity: imagePulse }} 
      />
      <div style={{
         position: 'absolute', bottom: '25%', left: '15%', width: '70%', height: 12,
         backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 6, overflow: 'hidden',
         boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
         <div style={{ 
           height: '100%', width: `${progressWidth}%`, backgroundColor: '#4ade80', 
           opacity: glowPulse, boxShadow: '0 0 15px #4ade80' 
         }} />
      </div>
    </AbsoluteFill>
  );
};

const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  
  const scale = interpolate(frame, [0, 30], [1.3, 1], {
    easing: Easing.out(Easing.back(1.2)), extrapolateRight: "clamp"
  });
  
  const blur = interpolate(frame, [0, 20], [15, 0], { extrapolateRight: "clamp" });
  const floatY = Math.sin(frame * 0.05) * 10;

  return (
    <AbsoluteFill style={{ backgroundColor: "#fff", opacity: fadeIn }}>
      <Img 
        src={staticFile("pata/resultado.png")} 
        style={{ 
          width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${scale}) translateY(${floatY}px)`,
          filter: `blur(${blur}px)`
        }} 
      />
    </AbsoluteFill>
  );
};

const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const getStyle = (start: number, fromX: number, fromY: number, floatOffset: number) => {
    const progress = spring({
      frame: frame - start,
      fps,
      config: { damping: 12 }
    });
    
    const floatY = Math.sin((frame - start) * 0.05 + floatOffset) * 10;

    return {
      position: "absolute" as const,
      width: "100%", height: "100%", objectFit: "cover" as const,
      transform: `translate(${fromX * (1 - progress)}px, ${fromY * (1 - progress) + floatY}px) scale(${progress})`,
      opacity: progress,
      boxShadow: progress > 0.1 ? '0 10px 30px rgba(0,0,0,0.2)' : 'none'
    };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#fff", opacity: fadeIn }}>
      <Img src={staticFile("pata/download digital.png")} style={getStyle(10, -1000, -500, 0)} />
      <Img src={staticFile("pata/impresso.png")} style={getStyle(25, 1000, -500, Math.PI / 2)} />
      <Img src={staticFile("pata/canvas.png")} style={getStyle(40, 0, 1000, Math.PI)} />
    </AbsoluteFill>
  );
};

const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const bgOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  
  const logoScale = interpolate(frame, [0, 60], [0.8, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp"
  });
  
  const logoOpacity = spring({ frame: frame - 15, fps, config: { damping: 15 } });
  
  const glow = interpolate(frame, [0, 60], [0, 20], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: `rgba(0, 0, 0, ${bgOpacity})`, justifyContent: "center", alignItems: "center" }}>
      <Img 
        src={staticFile("pata/logo.png")} 
        style={{ 
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          width: "50%",
          objectFit: "contain",
          filter: `drop-shadow(0 0 ${glow}px rgba(255,255,255,0.3))`
        }} 
      />
    </AbsoluteFill>
  );
};

export const PataVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={0} durationInFrames={150}>
        <Scene1 />
      </Sequence>
      <Sequence from={120} durationInFrames={150}>
        <Scene2 />
      </Sequence>
      <Sequence from={240} durationInFrames={150}>
        <Scene3 />
      </Sequence>
      <Sequence from={360} durationInFrames={210}>
        <Scene4 />
      </Sequence>
      <Sequence from={540} durationInFrames={150}>
        <Scene5 />
      </Sequence>
      <Sequence from={660} durationInFrames={240}>
        <Scene6 />
      </Sequence>
      <Sequence from={840} durationInFrames={60}>
        <Scene7 />
      </Sequence>
    </AbsoluteFill>
  );
};
