import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';

export const LogoScene: React.FC<{ bassIntensity: number }> = ({ bassIntensity }) => {
	const frame = useCurrentFrame();

	// Smoothly fade in the gradient over the black background from HookScene
	const gradientOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	const scale = 1 + bassIntensity * 0.3;

	const logoOpacity = interpolate(frame, [15, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const textOpacity = interpolate(frame, [45, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<AbsoluteFill style={{
				background: 'linear-gradient(to bottom right, #ff9a44, #fc6076)',
				opacity: gradientOpacity,
			}} />

			<Img
				src={staticFile('discdepot-logo.png')}
				style={{
					height: '250px',
					opacity: logoOpacity,
					transform: `scale(${scale})`,
				}}
			/>
			<h2
				style={{
					marginTop: '40px',
					color: 'white',
					fontFamily: 'Inter, sans-serif',
					fontSize: '50px',
					opacity: textOpacity,
					transform: `scale(${1 + bassIntensity * 0.1})`,
				}}
			>
				Music, delivered.
			</h2>
		</AbsoluteFill>
	);
};
