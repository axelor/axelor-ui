/**
 * @title Multiple Sources
 */
import React from 'react';
import { Image } from '@axelor-ui/core';

export default () => {
  return (
    <Image
      srcSet={[
        'https://picsum.photos/768/300 768w',
        'https://picsum.photos/992/300 992w',
        'https://picsum.photos/1200/300 1200w',
      ]}
      sizes="100vw"
      src="https://picsum.photos/500/300"
      alt="Demo"
      responsive
    />
  );
};
