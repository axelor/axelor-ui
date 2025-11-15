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
        data-testid="dialog"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogHeader onCloseClick={handleClose} data-testid="dialog:header">
          <DialogTitle id="dialog-title" data-testid="dialog:title">
            Information
          </DialogTitle>
        </DialogHeader>
        <DialogContent id="dialog-description" data-testid="dialog:content">
          <p>
            This is some placeholder content to show the scrolling behavior for
            modals. Instead of repeating the text the modal, we use an inline
            style set a minimum height, thereby extending the length of the
            overall modal and demonstrating the overflow scrolling. When content
            becomes longer than the height of the viewport, scrolling will move
            the modal as needed.
          </p>
          <p>
            <input type="text" autoFocus />
          </p>
          <p style={{ height: 500 }}></p>
        </DialogContent>
        <DialogFooter data-testid="dialog:footer">
          <Button
            variant="secondary"
            onClick={handleClose}
            data-testid="dialog:footer:close"
          >
            Close
          </Button>
          <Button variant="primary" data-testid="dialog:footer:ok">
            OK
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default config;
