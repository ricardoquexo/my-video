import { AbsoluteFill, Series, useCurrentFrame, useVideoConfig, OffthreadVideo, staticFile, CalculateMetadataFunction } from "remotion";
import { getVideoMetadata } from "@remotion/media-utils";
import { loadFont } from "@remotion/google-fonts/Roboto";
import React from "react";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export type BeiraRioProps = {
  videoDurations: number[];
};

export const BeiraRioVideo: React.FC<BeiraRioProps> = ({ videoDurations }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  
  // Last 5 seconds text
  const last5SecFrames = 5 * fps;
  const showText = frame >= durationInFrames - last5SecFrames;

  const videoSrcs = Array.from({ length: 7 }, (_, i) => staticFile(`${i + 1}.mp4`));

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <Series>
        {videoSrcs.map((src, index) => {
          const duration = videoDurations[index];
          if (!duration) return null;
          return (
            <Series.Sequence key={src} durationInFrames={duration}>
              <OffthreadVideo src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Series.Sequence>
          );
        })}
      </Series>
      {showText && (
        <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: '100px', zIndex: 10 }}>
          <div style={{
            fontFamily,
            color: 'white',
            fontSize: '60px',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '2px 2px 10px rgba(0,0,0,0.8)',
            maxWidth: '80%'
          }}>
            Nunca dúvide de uma torcida que construiu um gigante sob às aguas.
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};


export const calculateBeiraRioMetadata: CalculateMetadataFunction<BeiraRioProps> = async ({ props }) => {
  const fps = 30; // standard fallback, will be overridden by Composition props if provided but we can recalculate
  const videoSrcs = Array.from({ length: 7 }, (_, i) => staticFile(`${i + 1}.mp4`));
  
  const metadataPromises = videoSrcs.map(src => getVideoMetadata(src));
  const metadatas = await Promise.all(metadataPromises);
  
  const videoDurations = metadatas.map(m => Math.ceil(m.durationInSeconds * fps));
  const totalDuration = videoDurations.reduce((a, b) => a + b, 0);
  
  const width = metadatas[0].width;
  const height = metadatas[0].height;

  return {
    durationInFrames: totalDuration,
    width,
    height,
    props: {
      ...props,
      videoDurations
    }
  };
};
