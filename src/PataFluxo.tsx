import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import React from "react";

// Phone screen dimensions (75% of 1080x1920)
const SCREEN_WIDTH = 810;
const SCREEN_HEIGHT = 1620;

// Cursor SVG component
const Cursor: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    width="32"
    height="40"
    viewBox="0 0 24 30"
    fill="none"
    style={{
      filter: "drop-shadow(2px 3px 4px rgba(0,0,0,0.5))",
      ...style,
    }}
  >
    <path
      d="M5 2L5 22L10 17L15 26L18 24.5L13 16L20 16L5 2Z"
      fill="white"
      stroke="#333"
      strokeWidth="1"
    />
  </svg>
);

export const PataFluxo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === PHASE TIMING ===
  const PHASE1_END = 4 * fps; // 120
  const PHASE2_START = PHASE1_END; // 120
  const PHASE2_END = 7 * fps; // 210
  const PHASE3_START = PHASE2_END; // 210
  const FADE_DURATION = 15; // frames for transitions

  // === PHASE 1: Upload screen (0–120) ===

  // Image fade in
  const uploadFadeIn = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Upload fade out (transition to phase 2)
  const uploadFadeOut = interpolate(
    frame,
    [PHASE1_END - FADE_DURATION, PHASE1_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const uploadOpacity = Math.min(uploadFadeIn, uploadFadeOut);

  // Cursor movement: appears at frame 30, arrives at button at frame 75
  const cursorStartFrame = 30;
  const cursorArriveFrame = 75;

  // Cursor start position (bottom-right, outside visible area)
  const cursorStartX = SCREEN_WIDTH * 0.85;
  const cursorStartY = SCREEN_HEIGHT * 0.85;
  // Cursor target: center of the purple button
  const cursorTargetX = SCREEN_WIDTH * 0.5;
  const cursorTargetY = SCREEN_HEIGHT * 0.545;

  const cursorMoveProgress = interpolate(
    frame,
    [cursorStartFrame, cursorArriveFrame],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    }
  );

  const cursorX = interpolate(cursorMoveProgress, [0, 1], [cursorStartX, cursorTargetX]);
  const cursorY = interpolate(cursorMoveProgress, [0, 1], [cursorStartY, cursorTargetY]);

  // Cursor opacity: fade in at frame 30, fade out at phase transition
  const cursorOpacity = interpolate(
    frame,
    [cursorStartFrame, cursorStartFrame + 8, PHASE1_END - 20, PHASE1_END - 5],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Click effect: frame 80-95
  const clickFrame = 80;
  const clickProgress = spring({
    frame: frame - clickFrame,
    fps,
    config: { damping: 12, stiffness: 300, mass: 0.4 },
    durationInFrames: 15,
  });

  // Button press: darkens and scales down slightly, only the button area
  const buttonPressScale = frame >= clickFrame && frame <= clickFrame + 15
    ? interpolate(clickProgress, [0, 0.5, 1], [1, 0.95, 1])
    : 1;
  const buttonPressOpacity = frame >= clickFrame && frame <= clickFrame + 15
    ? interpolate(clickProgress, [0, 0.5, 1], [0, 0.25, 0])
    : 0;

  // Cursor slight press down on click
  const cursorClickOffset = frame >= clickFrame && frame <= clickFrame + 10
    ? interpolate(
        frame,
        [clickFrame, clickFrame + 5, clickFrame + 10],
        [0, 3, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  // === PHASE 2: Loading screen (120–210) ===

  const loadingFadeIn = interpolate(
    frame,
    [PHASE2_START, PHASE2_START + FADE_DURATION],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const loadingFadeOut = interpolate(
    frame,
    [PHASE2_END - FADE_DURATION, PHASE2_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const loadingOpacity = Math.min(loadingFadeIn, loadingFadeOut);

  // Progress bar: animates from 0% to 100% during phase 2
  const progressBarStart = PHASE2_START + FADE_DURATION;
  const progressBarEnd = PHASE2_END - FADE_DURATION;
  const progressWidth = interpolate(
    frame,
    [progressBarStart, progressBarEnd],
    [0, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    }
  );

  // Progress bar glow pulse
  const progressGlow = 0.4 + 0.3 * Math.sin(frame * 0.2);

  // === PHASE 3: Result screen (210–300) ===

  const resultFadeIn = interpolate(
    frame,
    [PHASE3_START, PHASE3_START + FADE_DURATION],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const resultZoom = interpolate(
    frame,
    [PHASE3_START, 10 * fps],
    [1, 1.03],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Phone screen container */}
      <div
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          borderRadius: 40,
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#111",
        }}
      >
        {/* Phase 1: Upload screen */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: uploadOpacity,
          }}
        >
          <Img
            src={staticFile("pata/upload.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Button press overlay — only affects the button area */}
          <div
            style={{
              position: "absolute",
              top: "52.5%",
              left: "10%",
              width: "80%",
              height: "6.5%",
              borderRadius: 30,
              transform: `scale(${buttonPressScale})`,
              backgroundColor: `rgba(0, 0, 0, ${buttonPressOpacity})`,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Phase 2: Loading screen */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: loadingOpacity,
          }}
        >
          <Img
            src={staticFile("pata/carregando.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />

          {/* Dark cover to hide the original static progress bar in the image */}
          <div
            style={{
              position: "absolute",
              top: "54.5%",
              left: "26%",
              width: "48%",
              height: 14,
              backgroundColor: "#141414",
              borderRadius: 6,
            }}
          />

          {/* Animated progress bar drawn on top, same position as the original */}
          <div
            style={{
              position: "absolute",
              top: "54.8%",
              left: "27%",
              width: "46%",
              height: 8,
              borderRadius: 4,
              overflow: "hidden",
              backgroundColor: "#2a2a2a",
            }}
          >
            <div
              style={{
                width: `${progressWidth}%`,
                height: "100%",
                borderRadius: 4,
                backgroundColor: "#7c3aed",
                boxShadow: `0 0 ${12 + progressGlow * 8}px rgba(124, 58, 237, ${progressGlow})`,
              }}
            />
          </div>
        </div>

        {/* Phase 3: Result screen */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: resultFadeIn,
            transform: `scale(${resultZoom})`,
          }}
        >
          <Img
            src={staticFile("pata/resultado.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Cursor (only during phase 1) */}
        {frame >= cursorStartFrame && frame < PHASE1_END && (
          <div
            style={{
              position: "absolute",
              left: cursorX,
              top: cursorY + cursorClickOffset,
              opacity: cursorOpacity,
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <Cursor />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
