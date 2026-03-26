import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const ORIGINAL_PHOTO =
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1080&auto=format&fit=crop";
const RESULT_ART =
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1080&auto=format&fit=crop"; // Another dog as "art"

export const PassoAPassoPata: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sequence Timings
  const UPLOAD_START = 2 * fps; // 60
  const PROCESSING_START = 4 * fps; // 120
  const REVEAL_START = 6 * fps; // 180

  // 1. Upload Animation (2s to 4s)
  // Photo slides from bottom to center.
  const uploadProgress = spring({
    frame: frame - UPLOAD_START,
    fps,
    config: {
      damping: 14,
      mass: 0.8,
    },
  });

  const photoTranslateY = interpolate(uploadProgress, [0, 1], [2000, 0]);

  // 2. Processing Animation (4s to 6s)
  const isProcessing = frame >= PROCESSING_START && frame < REVEAL_START;

  // Blur effect gradually increases
  const blurProgress = spring({
    frame: frame - PROCESSING_START,
    fps,
    config: {
      damping: 20,
    },
  });
  const blurAmount = interpolate(blurProgress, [0, 1], [0, 12]);

  // Progress Bar Width
  const progressBarWidth = interpolate(
    frame - PROCESSING_START,
    [0, 2 * fps],
    [0, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Blinking Text Opacity (Math.sin or simple modulo sequence)
  const blinkingOpacity = Math.sin((frame - PROCESSING_START) / 5) * 0.5 + 0.5;

  // 3. Reveal Animation (6s to 10s)
  // Final image fades in
  const revealOpacity = spring({
    frame: frame - REVEAL_START,
    fps,
    config: {
      damping: 20,
    },
  });

  // Slow continuous zoom on the final image over 4 seconds
  const zoomScale = interpolate(
    frame - REVEAL_START,
    [0, 4 * fps], // 6s to 10s
    [1, 1.1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill className="bg-zinc-950 items-center justify-center">
      {/* Phone Mockup Frame */}
      <div
        className="relative overflow-hidden bg-zinc-900 shadow-2xl"
        style={{
          width: 800,
          height: 1422, // 16:9 aspect ratio roughly
          borderRadius: 60,
          border: "16px solid #27272a", // zinc-800
        }}
      >
        <Sequence from={UPLOAD_START}>
          {/* Photo sliding up */}
          <AbsoluteFill
            style={{
              transform: `translateY(${Math.max(0, photoTranslateY)}px)`,
            }}
          >
            {/* The Original Photo with potential blur */}
            <AbsoluteFill
              style={{
                filter: `blur(${Math.max(0, blurAmount)}px)`,
                transform: "scale(1.01)", // Prevent blur edges
              }}
            >
              <Img
                src={ORIGINAL_PHOTO}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </AbsoluteFill>
          </AbsoluteFill>
        </Sequence>

        <Sequence from={PROCESSING_START} durationInFrames={2 * fps}>
          {/* Progress Bar and Blinking Text */}
          <AbsoluteFill className="items-center justify-center flex-col">
            <div
              className="w-1/2 h-4 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700 shadow-lg"
              style={{ opacity: 1 }}
            >
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${progressBarWidth}%` }}
              />
            </div>
            <h1
              className="text-white mt-6 text-3xl font-bold font-serif tracking-wide"
              style={{ opacity: blinkingOpacity }}
            >
              Criando obra de arte...
            </h1>
          </AbsoluteFill>
        </Sequence>

        <Sequence from={REVEAL_START}>
          {/* Final Art Reveal */}
          <AbsoluteFill
            style={{
              opacity: revealOpacity,
              transform: `scale(${zoomScale})`,
            }}
          >
            <Img
              src={RESULT_ART}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </AbsoluteFill>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
