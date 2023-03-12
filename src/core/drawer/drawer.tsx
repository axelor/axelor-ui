import { Fade } from "../fade";
import { Portal } from "../portal";
import { Slide } from "../slide";
import styled, { withStyled } from "../styled";
import { useTheme } from "../styles";
import styles from "./drawer.module.css";

export type DrawerPlacement = "start" | "end" | "top" | "bottom";

export interface DrawerProps {
  placement?: DrawerPlacement;
  backdrop?: boolean;
  open?: boolean;
  onClose?: () => void;
}

const mapDrawerPlacement = (placement: DrawerPlacement) => {
  if (placement === "top") return "down";
  if (placement === "bottom") return "up";
  if (placement === "start") return "end";
  return "start";
};

const DrawerBackdrop = styled.div((props) => [styles.backdrop]);

const DrawerRoot = styled.div<DrawerProps>(({ placement }) => [
  styles.drawer,
  placement && styles[placement],
]);

const DrawerContent = styled.div<DrawerProps>((props) => [styles.content]);

export const Drawer = withStyled(DrawerContent)(
  ({ placement = "start", backdrop, open, onClose, ...props }, ref) => {
    const { dir } = useTheme();
    return (
      <Portal>
        {backdrop && (
          <Fade in={open}>
            <DrawerBackdrop onClick={onClose} />
          </Fade>
        )}
        <Slide
          in={open}
          direction={mapDrawerPlacement(placement)}
          unmountOnExit
        >
          <DrawerRoot dir={dir} placement={placement}>
            <DrawerContent ref={ref} {...props} />
          </DrawerRoot>
        </Slide>
      </Portal>
    );
  }
);
