import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

export const OutroScene: React.FC<{ bassIntensity: number }> = ({ bassIntensity }) => {
	const frame = useCurrentFrame();

	const opacity = interpolate(
		frame,
		[0, 30],
		[0, 1],
		{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
	);

	// Fade to black at the end (from 90 to 120)
	const fadeOutOpacity = interpolate(
		frame,
		[90, 120],
		[0, 1],
		{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
	);

	const scale = 1 + bassIntensity * 0.15;

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				background: 'linear-gradient(to bottom right, #ff9a44, #fc6076)',
			}}
		>
			<div style={{
				opacity,
				transform: `scale(${scale})`,
				textAlign: 'center',
				color: 'white',
				fontFamily: 'Inter, sans-serif',
			}}>
				<h1 style={{ fontSize: '90px', margin: 0, fontWeight: '900' }}>
					Find your sound.
				</h1>
				<h2 style={{ fontSize: '40px', fontWeight: '400', marginTop: '20px', opacity: 0.9 }}>
					discdepot.com
				</h2>
			</div>
			
			{/* Fade to black overlay */}
			<AbsoluteFill style={{ backgroundColor: 'black', opacity: fadeOutOpacity }} />
		</AbsoluteFill>
	);
};
