'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './AnimatedButton.module.css';

interface AnimatedButtonProps {
	href: string;
	defaultText: string;
	hoverText: string;
	className?: string;
	children?: ReactNode;
}

const AnimatedButton = ({
	href,
	defaultText,
	hoverText,
	className = '',
	children,
}: AnimatedButtonProps) => {
	return (
		<Link href={href} className={`${styles.button} ${className}`}>
			<div className={styles.content}>
				<div className={styles.default}>
					<span className={styles.text}>{defaultText}</span>
					<span className={styles.icon}>{children}</span>
				</div>
				<div className={styles.hover}>
					<div className={styles.letters}>
						{hoverText.split('').map((letter, i) => (
							<span key={i} className={styles.letter}>
								{letter === ' ' ? '\u00A0' : letter}
							</span>
						))}
					</div>
					<span className={styles.icon}>{children}</span>
				</div>
			</div>
		</Link>
	);
};

export default AnimatedButton;
