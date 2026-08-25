import { useEffect, useState } from 'react';
import { Fab, Zoom, useScrollTrigger } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function ScrollToTop() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 300,
  });

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(trigger);
  }, [trigger]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Zoom in={visible}>
      <Fab
        color="primary"
        size="medium"
        onClick={handleClick}
        aria-label="Scroll to top"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: (theme) => theme.zIndex.speedDial,
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
}
