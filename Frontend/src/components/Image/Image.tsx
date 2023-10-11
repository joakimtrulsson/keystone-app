import React from 'react';
import styles from './Image.module.css';

type ImageProps = {
  imageSrc: string;
};

export function Image({ imageSrc }: ImageProps) {
  return (
    <div className={styles.hero}>
      <img src={imageSrc} alt='Image' />
      <div className={styles.backgroundImage} style={{ backgroundImage: `url(${imageSrc})` }} />
      {/* {caption.discriminant ? <div style={{ textAlign: 'center' }}>{caption.value}</div> : null} */}
    </div>
  );
}
