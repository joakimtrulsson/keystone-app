import React, { ComponentProps } from 'react';
import { DocumentRenderer } from '@keystone-6/document-renderer';

import { Carousel } from '../Carousel/Carousel';
import { Image } from '../Image/Image';
import styles from './CustomRenderer.module.css';

type CustomRendererProps = ComponentProps<typeof DocumentRenderer>;

const defaultElementRenderers: CustomRendererProps['renderers'] = {
  block: {
    // all custom components are block components
    // so they will be wrapped with a <div /> by default
    // we can override that to whatever wrapper we want
    // for eg. using React.Fragment wraps the component with nothing

    // block code ``` ```
    code({ children }) {
      return <pre className={styles.pre}>{children}</pre>;
    },
    // and more - check out the types to see all available block elements
  },
  inline: {
    bold: ({ children }) => {
      return <strong style={{ color: '#363945' }}>{children}</strong>;
    },
    // inline code ` `
    code: ({ children }) => {
      return <code className={styles.code}>{children}</code>;
    },
    // and more - check out the types to see all available inline elements
  },
};

const customComponentRenderers: CustomRendererProps['componentBlocks'] = {
  
  carousel: props => {
    return <Carousel {...props} />;
  },  
  image: props => {
    return <Image {...props} />;
  },


};

export function CustomRenderer({ document }: CustomRendererProps) {
  return (
    <DocumentRenderer
      renderers={defaultElementRenderers}
      componentBlocks={customComponentRenderers}
      document={document}
    />
  );
}
