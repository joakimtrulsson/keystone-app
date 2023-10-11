import React from 'react';
import styles from './Hero.module.css';

type ImageProps = {
  imageSrc: string;
  caption:
    | {
        discriminant: false;
      }
    | {
        discriminant: true;
        value: React.ReactNode;
      };
};

export function Image({ imageSrc, caption }: ImageProps) {
  return (
    <div className={styles.hero}>
      <div className={styles.backgroundImage} style={{ backgroundImage: `url(${imageSrc})` }} />
      {caption.discriminant ? <div style={{ textAlign: 'center' }}>{caption.value}</div> : null}
    </div>
  );
}
