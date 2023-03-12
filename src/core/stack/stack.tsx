import styled from "../styled";

export interface StackProps {
  gap?: 0 | 1 | 2 | 3 | 4 | 5;
  horizontal?: boolean;
}

export const Stack = styled.div<StackProps>(
  ({ gap = 0, horizontal }) => [
    `gap-${gap}`,
    {
      vstack: !horizontal,
      hstack: !!horizontal,
    },
  ],
  () => ({
    display: "flex",
  })
);
