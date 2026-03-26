import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const ALBUMS = [
	{ artist: 'Neon Lights', song: 'Midnight Drive', colors: ['#00c6ff', '#0072ff'] },
	{ artist: 'The Synth', song: 'Retro Wave', colors: ['#f857a6', '#ff5858'] },
	{ artist: 'Lo-Fi Chill', song: 'Coffee Beats', colors: ['#fceabb', '#f8b500'] },
	{ artist: 'Urban Sound', song: 'City Echoes', colors: ['#141e30', '#243b55'] },
	{ artist: 'Solar Flare', song: 'Sunspots', colors: ['#ff9966', '#ff5e62'] },
];

export const CarouselScene: React.FC<{ bassIntensity: number }> = ({ bassIntensity }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				background: 'linear-gradient(to bottom right, #ff9a44, #fc6076)',
				flexDirection: 'row',
				gap: '40px',
				padding: '0 50px',
			}}
		>
			{ALBUMS.map((album, index) => {
				const slideIn = spring({
					fps,
					frame: frame - index * 10,
					config: { damping: 12 },
				});

				const translateY = interpolate(slideIn, [0, 1], [500, 0]);
				const cardScale = slideIn * (1 + bassIntensity * 0.2);

				return (
					<div
						key={index}
						style={{
							width: '300px',
							height: '400px',
							background: `linear-gradient(135deg, ${album.colors[0]}, ${album.colors[1]})`,
							borderRadius: '20px',
							boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
							transform: `translateY(${translateY}px) scale(${cardScale})`,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'flex-end',
							padding: '30px',
							color: 'white',
							fontFamily: 'Inter, sans-serif'
						}}
					>
						<h3 style={{ fontSize: '30px', margin: 0, fontWeight: 'bold' }}>{album.song}</h3>
						<p style={{ fontSize: '20px', margin: '10px 0 0', opacity: 0.8 }}>{album.artist}</p>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
