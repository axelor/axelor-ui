import { useState } from "react";
import { Box } from "../box";
import { Button } from "../button";
import { Input } from "../input";
import { InputLabel } from "../input-label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

const config = {
  component: Dialog,
  title: "Components/Dialog",
};

export const Basic = (props: any) => {
  const [open, setOpen] = useState<boolean>(false);
  const [scrollable, setScrollable] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const handleClose = () => setOpen(false);
  const handleShow = () => setOpen(true);
  return (
    <div>
      <Box g={2} display="flex" alignItems="center">
        <Button variant="primary" onClick={handleShow}>
          Show Dialog
        </Button>
        <InputLabel m={0}>
          <Input
            type="checkbox"
            checked={scrollable}
            onChange={(e) => setScrollable(!scrollable)}
          />{" "}
          Scrollable
        </InputLabel>
        <InputLabel m={0}>
          <Input
            type="checkbox"
            checked={fullScreen}
            onChange={(e) => setFullScreen(!fullScreen)}
          />{" "}
          Fullscreen
        </InputLabel>
      </Box>
      <Dialog
        open={open}
        backdrop
        scrollable={scrollable}
        fullscreen={fullScreen}
      >
        <DialogHeader onCloseClick={handleClose}>
          <DialogTitle>Information</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p>
            This is some placeholder content to show the scrolling behavior for
            modals. Instead of repeating the text the modal, we use an inline
            style set a minimum height, thereby extending the length of the
            overall modal and demonstrating the overflow scrolling. When content
            becomes longer than the height of the viewport, scrolling will move
            the modal as needed.
          </p>
          <p style={{ height: 500 }}></p>
        </DialogContent>
        <DialogFooter>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">OK</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default config;
