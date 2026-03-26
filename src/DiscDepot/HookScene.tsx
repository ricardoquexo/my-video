import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

export const HookScene: React.FC<{ bassIntensity: number }> = ({ bassIntensity }) => {
	const frame = useCurrentFrame();

	const opacity = interpolate(
		frame,
		[0, 30, 90, 120],
		[0, 1, 1, 0],
		{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
	);

	const scale = 1 + bassIntensity * 0.1;

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'black',
			}}
		>
			<h1
				style={{
					color: 'white',
					fontSize: '80px',
					fontFamily: 'Inter, sans-serif',
					textAlign: 'center',
					opacity,
					transform: `scale(${scale})`,
				}}
			>
				Where do you even buy<br />music anymore?
			</h1>
		</AbsoluteFill>
	);
};
