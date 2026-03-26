import React from 'react';
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { useWindowedAudioData, visualizeAudio } from '@remotion/media-utils';
import { Audio } from '@remotion/media';

import { HookScene } from './HookScene';
import { LogoScene } from './LogoScene';
import { CounterScene } from './CounterScene';
import { CarouselScene } from './CarouselScene';
import { OutroScene } from './OutroScene';

export const DiscDepotVideo: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const audioSrc = staticFile('music.mp3');
	
	const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
		src: audioSrc,
		frame,
		fps,
		windowInSeconds: 30,
	});

	let bassIntensity = 0;
	if (audioData) {
		const frequencies = visualizeAudio({
			fps,
			frame,
			audioData,
			numberOfSamples: 128,
			optimizeFor: 'speed',
			dataOffsetInSeconds,
		});

		const lowFrequencies = frequencies.slice(0, 32);
		bassIntensity =
			lowFrequencies.reduce((sum, v) => sum + v, 0) / lowFrequencies.length;
	}

	return (
		<AbsoluteFill style={{ backgroundColor: 'black' }}>
			{/* Audio playback */}
			<Audio src={audioSrc} />
			
			<Sequence from={0} durationInFrames={120}>
				<HookScene bassIntensity={bassIntensity} />
			</Sequence>
			
			<Sequence from={120} durationInFrames={180}>
				<LogoScene bassIntensity={bassIntensity} />
			</Sequence>
			
			<Sequence from={300} durationInFrames={240}>
				<CounterScene bassIntensity={bassIntensity} />
			</Sequence>

			<Sequence from={540} durationInFrames={240}>
				<CarouselScene bassIntensity={bassIntensity} />
			</Sequence>

			<Sequence from={780} durationInFrames={120}>
				<OutroScene bassIntensity={bassIntensity} />
			</Sequence>
		</AbsoluteFill>
	);
};
