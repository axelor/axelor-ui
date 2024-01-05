import styled from "../styled";

export interface ImageProps {
  alt: string;
  src: string;
  srcSet?: string | string[];
  sizes?: string | string[];
  responsive?: boolean;
  thumbnail?: boolean;
}

const join = (values: Array<string> | string | undefined) =>
  Array.isArray(values) ? values.join(",") : values;

export const Image = styled.img<ImageProps>(
  ({ responsive, thumbnail }) => [
    { "img-fluid": responsive, "img-thumbnail": thumbnail },
  ],
  ({ srcSet, sizes }) => ({
    srcSet: join(srcSet),
    sizes: join(sizes),
  }),
);
