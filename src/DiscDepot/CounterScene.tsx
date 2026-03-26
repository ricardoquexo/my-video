import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

export const CounterScene: React.FC<{ bassIntensity: number }> = ({ bassIntensity }) => {
	const frame = useCurrentFrame();

	const count = Math.floor(
		interpolate(frame, [0, 90], [0, 12000], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		})
	);
	const formattedCount = count.toLocaleString('en-US');

	const titleScale = 1 + bassIntensity * 0.15;
	const numberScale = 1 + bassIntensity * 0.25;

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				background: 'linear-gradient(to bottom right, #ff9a44, #fc6076)',
			}}
		>
			<h1
				style={{
					color: 'white',
					fontSize: '180px',
					fontFamily: 'Inter, sans-serif',
					fontWeight: 'bold',
					margin: 0,
					transform: `scale(${numberScale})`,
				}}
			>
				{formattedCount}+
			</h1>
			<h2
				style={{
					color: '#ffe5e5',
					fontSize: '60px',
					fontFamily: 'Inter, sans-serif',
					margin: '20px 0 0',
					transform: `scale(${titleScale})`,
				}}
			>
				Happy customers
			</h2>
		</AbsoluteFill>
	);
};
