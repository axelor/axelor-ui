import styled from "../styled";

export const MenuHeader = styled.div(
  () => ["dropdown-header"],
  () => ({
    role: "presentation",
    "aria-disabled": true,
    tabIndex: -1,
  }),
);
