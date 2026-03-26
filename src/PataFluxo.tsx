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
  const FADE = 15; // frames for transitions

  // === TIMELINE ===
  const ABERTURA_END = 2 * fps; // 60
  const PHONE_START = ABERTURA_END; // 60
  const UPLOAD_END = PHONE_START + 4 * fps; // 180
  const LOADING_START = UPLOAD_END; // 180
  const LOADING_END = LOADING_START + 3 * fps; // 270
  const RESULT_START = LOADING_END; // 270
  const RESULT_END = RESULT_START + 2.5 * fps; // 345
  const SLIDES_START = RESULT_END; // 345
  const SLIDE_DURATION = 2 * fps; // 60 frames each
  const SLIDE1_START = SLIDES_START; // 345
  const SLIDE2_START = SLIDE1_START + SLIDE_DURATION; // 405
  const SLIDE3_START = SLIDE2_START + SLIDE_DURATION; // 465
  const SLIDES_END = SLIDE3_START + SLIDE_DURATION; // 525
  const LOGO_START = SLIDES_END; // 525

  // === ABERTURA (0–60): Full screen ===
  const aberturaOpacity = interpolate(
    frame,
    [0, 0.5 * fps, ABERTURA_END - FADE, ABERTURA_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === PHONE SECTION (60–345) ===
  // Phone container fade in/out
  const phoneOpacity = interpolate(
    frame,
    [PHONE_START, PHONE_START + FADE, RESULT_END - FADE, RESULT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Upload screen (relative to PHONE_START)
  const uploadFadeIn = interpolate(
    frame,
    [PHONE_START, PHONE_START + FADE],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const uploadFadeOut = interpolate(
    frame,
    [UPLOAD_END - FADE, UPLOAD_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const uploadOpacity = Math.min(uploadFadeIn, uploadFadeOut);

  // Cursor: appears 1s after phone, arrives 1.5s later
  const cursorStartFrame = PHONE_START + fps;
  const cursorArriveFrame = PHONE_START + 2.5 * fps;
  const clickFrame = PHONE_START + 2.7 * fps;

  const cursorStartX = SCREEN_WIDTH * 0.85;
  const cursorStartY = SCREEN_HEIGHT * 0.85;
  const cursorTargetX = SCREEN_WIDTH * 0.5;
  const cursorTargetY = SCREEN_HEIGHT * 0.59;

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

  const cursorOpacity = interpolate(
    frame,
    [cursorStartFrame, cursorStartFrame + 8, UPLOAD_END - 20, UPLOAD_END - 5],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const clickProgress = spring({
    frame: frame - clickFrame,
    fps,
    config: { damping: 12, stiffness: 300, mass: 0.4 },
    durationInFrames: 15,
  });
  const buttonPressScale =
    frame >= clickFrame && frame <= clickFrame + 15
      ? interpolate(clickProgress, [0, 0.5, 1], [1, 0.95, 1])
      : 1;
  const buttonPressOpacity =
    frame >= clickFrame && frame <= clickFrame + 15
      ? interpolate(clickProgress, [0, 0.5, 1], [0, 0.25, 0])
      : 0;
  const cursorClickOffset =
    frame >= clickFrame && frame <= clickFrame + 10
      ? interpolate(
          frame,
          [clickFrame, clickFrame + 5, clickFrame + 10],
          [0, 3, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      : 0;

  // Loading screen
  const loadingFadeIn = interpolate(
    frame,
    [LOADING_START, LOADING_START + FADE],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const loadingFadeOut = interpolate(
    frame,
    [LOADING_END - FADE, LOADING_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const loadingOpacity = Math.min(loadingFadeIn, loadingFadeOut);

  const progressBarStart = LOADING_START + FADE;
  const progressBarEnd = LOADING_END - FADE;
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
  const progressGlow = 0.4 + 0.3 * Math.sin(frame * 0.2);

  // Result screen
  const resultFadeIn = interpolate(
    frame,
    [RESULT_START, RESULT_START + FADE],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const resultZoom = interpolate(
    frame,
    [RESULT_START, RESULT_END],
    [1, 1.03],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === SLIDES SECTION (345–525) ===
  const slideImages = [
    "pata/download digital.png",
    "pata/impresso.png",
    "pata/canvas.png",
  ];

  const getSlideTransform = (slideStart: number) => {
    const slideIn = spring({
      frame: frame - slideStart,
      fps,
      config: { damping: 200 },
      durationInFrames: fps * 0.8,
    });
    const slideOut = spring({
      frame: frame - (slideStart + SLIDE_DURATION - fps * 0.5),
      fps,
      config: { damping: 200 },
      durationInFrames: fps * 0.5,
    });

    const translateX = interpolate(slideIn, [0, 1], [1080, 0]);
    const translateXOut = interpolate(slideOut, [0, 1], [0, -1080]);
    const opacity = frame < slideStart + SLIDE_DURATION - fps * 0.5 ? 1 : 1 - slideOut;

    return {
      translateX: frame < slideStart + SLIDE_DURATION - fps * 0.5 ? translateX : translateXOut,
      opacity,
    };
  };

  // === LOGO (525+) ===
  const logoOpacity = interpolate(
    frame,
    [LOGO_START, LOGO_START + fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080808",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* === ABERTURA: Full screen === */}
      {frame < ABERTURA_END && (
        <AbsoluteFill style={{ opacity: aberturaOpacity }}>
          <Img
            src={staticFile("pata/abertura.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>
      )}

      {/* === PHONE SECTION === */}
      {frame >= PHONE_START && frame < RESULT_END && (
        <div
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            borderRadius: 40,
            overflow: "hidden",
            position: "relative",
            backgroundColor: "#111",
            opacity: phoneOpacity,
          }}
        >
          {/* Upload screen */}
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
                objectPosition: "top",
              }}
            />
            {/* Button press overlay */}
            <div
              style={{
                position: "absolute",
                top: "57%",
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

          {/* Loading screen */}
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
            {/* Dark cover to hide original bar */}
            <div
              style={{
                position: "absolute",
                top: "57.7%",
                left: "26%",
                width: "48%",
                height: 14,
                backgroundColor: "#141414",
                borderRadius: 6,
              }}
            />
            {/* Animated progress bar */}
            <div
              style={{
                position: "absolute",
                top: "58%",
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

          {/* Result screen */}
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
                objectPosition: "top",
              }}
            />
          </div>

          {/* Cursor */}
          {frame >= cursorStartFrame && frame < UPLOAD_END && (
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
      )}

      {/* === SLIDES SECTION: Full screen, no phone frame === */}
      {frame >= SLIDES_START && frame < SLIDES_END && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {slideImages.map((img, i) => {
            const slideStart = [SLIDE1_START, SLIDE2_START, SLIDE3_START][i];
            if (frame < slideStart || frame >= slideStart + SLIDE_DURATION + FADE) return null;
            const { translateX, opacity } = getSlideTransform(slideStart);
            return (
              <div
                key={img}
                style={{
                  position: "absolute",
                  transform: `translateX(${translateX}px)`,
                  opacity,
                }}
              >
                <Img
                  src={staticFile(img)}
                  style={{
                    width: 864,
                    objectFit: "contain",
                    borderRadius: 24,
                  }}
                />
              </div>
            );
          })}
        </AbsoluteFill>
      )}

      {/* === LOGO: Fade in to close === */}
      {frame >= LOGO_START && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: logoOpacity,
          }}
        >
          <Img
            src={staticFile("pata/logo.png")}
            style={{
              width: 300,
              height: 300,
              objectFit: "contain",
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
