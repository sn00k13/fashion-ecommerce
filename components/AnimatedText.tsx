// components/AnimatedText.tsx
'use client';

import styles from './AnimatedText.module.css';

const AnimatedText = ({ text }: { text: string }) => {
	return (
		<div className={styles.animate}>
			{text.split('').map((char, index) => (
				<span key={index} style={{ '--index': index } as React.CSSProperties}>
					{char === ' ' ? '\u00A0' : char}
				</span>
			))}
		</div>
	);
};

export default AnimatedText;
