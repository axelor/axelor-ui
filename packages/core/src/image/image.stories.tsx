import React from 'react';
import { Image } from './image';

export default {
  component: Image,
  title: 'Components/Image',
};

export const Basic = () => {
  return <Image src="https://picsum.photos/400/300" alt="Demo" />;
};

export const Responsive = () => {
  return <Image src="https://picsum.photos/800/300" alt="Demo" responsive />;
};

export const Rounded = () => {
  return <Image src="https://picsum.photos/200/200" alt="Demo" rounded={2} />;
};

export const Sources = () => {
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

export const Thumbnail = () => {
  return <Image src="https://picsum.photos/200/200" alt="Demo" thumbnail />;
};
