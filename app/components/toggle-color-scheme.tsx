import { Box, IconButton, useTheme } from '@mui/material';
import { useToggleColorMode } from '~/theme-context';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export function ToggleColorScheme() {
  const theme = useTheme();
  const colorMode = useToggleColorMode();

  return (
    <Box>
      {theme.palette.mode} mode
      <IconButton
        sx={{ ml: 1 }}
        onClick={colorMode.toggleColorMode}
        color="inherit"
      >
        {theme.palette.mode === 'dark' ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Box>
  );
}
