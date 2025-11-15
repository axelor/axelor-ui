import styled from "../styled";

export const MenuDivider = styled.hr(
  () => ["dropdown-divider"],
  () => ({
    role: "separator",
    "aria-disabled": true,
    tabIndex: -1,
  }),
);
