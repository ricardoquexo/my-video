import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import React from "react";

const CHART_PATH =
  "M 50 480 C 150 490, 200 485, 280 470 C 360 450, 400 400, 450 250 C 480 150, 500 60, 530 30 C 560 60, 580 150, 620 280 C 680 450, 750 480, 850 485 C 920 488, 980 485, 1030 480";

export const ValorizacaoChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Line drawing progress (0 to 1) over 3 seconds
  const lineProgress = interpolate(frame, [0, fps * 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Get stroke dash values from evolvePath
  const { strokeDasharray, strokeDashoffset } = evolvePath(
    lineProgress,
    CHART_PATH
  );

  // Ball position following the path
  const pathLength = getLength(CHART_PATH);
  const currentLength = lineProgress * pathLength;
  const ballPoint = getPointAtLength(CHART_PATH, currentLength);

  // Counter animation: 0 to 300, starts at frame 30
  const counterSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 200 },
    durationInFrames: fps * 2.5,
  });
  const count = Math.floor(counterSpring * 300);

  // Text fade-ins
  const labelOpacity = interpolate(frame, [fps * 2, fps * 2.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [fps * 2.5, fps * 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Counter opacity
  const counterOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ball glow pulse
  const glowPulse = 0.5 + 0.5 * Math.sin(frame * 0.15);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#020617",
        backgroundImage:
          "radial-gradient(circle at 50% 85%, rgba(56, 130, 248, 0.25) 0%, rgba(2, 6, 23, 1) 60%)",
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background Grid */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 60,
          right: 60,
          height: 550,
        }}
      >
        {/* Horizontal grid lines */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            style={{
              position: "absolute",
              top: `${(i / 7) * 100}%`,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: "rgba(100, 116, 139, 0.15)",
            }}
          />
        ))}
        {/* Vertical grid lines */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`v-${i}`}
            style={{
              position: "absolute",
              left: `${(i / 9) * 100}%`,
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: "rgba(100, 116, 139, 0.15)",
            }}
          />
        ))}
      </div>

      {/* SVG Chart */}
      <svg
        style={{
          position: "absolute",
          top: 150,
          left: 60,
          right: 60,
          width: "calc(100% - 120px)",
          height: 550,
          overflow: "visible",
        }}
        viewBox="0 0 1080 520"
      >
        <defs>
          {/* Glow filter for the line */}
          <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Stronger glow for the ball */}
          <filter id="ballGlow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient for the area under the curve */}
          <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Main chart line */}
        <path
          d={CHART_PATH}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          filter="url(#lineGlow)"
        />

        {/* Glowing ball following the curve */}
        {lineProgress > 0.01 && (
          <g
            transform={`translate(${ballPoint.x}, ${ballPoint.y})`}
            style={{ opacity: Math.min(1, lineProgress * 10) }}
          >
            {/* Outer glow */}
            <circle
              r="25"
              fill="#60a5fa"
              style={{
                opacity: 0.3 + glowPulse * 0.2,
                filter: "blur(15px)",
              }}
            />
            {/* Mid glow */}
            <circle
              r="12"
              fill="#93c5fd"
              style={{ opacity: 0.7 }}
            />
            {/* Inner bright dot */}
            <circle r="6" fill="#ffffff" />
          </g>
        )}
      </svg>

      {/* Bottom text section */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Label */}
        <span
          style={{
            fontSize: 36,
            color: "rgba(203, 213, 225, 0.9)",
            fontWeight: 300,
            letterSpacing: 1,
            opacity: labelOpacity,
          }}
        >
          Taxa de conversão
        </span>

        {/* Big number */}
        <div
          style={{
            fontSize: 160,
            fontWeight: 700,
            lineHeight: 1,
            marginTop: 8,
            opacity: counterOpacity,
            letterSpacing: -4,
            position: "relative",
          }}
        >
          {count}%
          <span
            style={{
              position: "absolute",
              top: 8,
              right: -50,
              fontSize: 44,
              color: "#4ade80",
              fontWeight: 700,
            }}
          >
            ↗
          </span>
        </div>

        {/* Subtitle */}
        <span
          style={{
            fontSize: 24,
            color: "rgba(148, 163, 184, 0.8)",
            fontWeight: 300,
            marginTop: 12,
            opacity: subtitleOpacity,
          }}
        >
          Aumento em relação ao mês passado
        </span>
      </div>
    </AbsoluteFill>
  );
};
