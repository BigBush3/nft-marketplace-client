import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import cyan from '@material-ui/core/colors/cyan';
import s from '../styles/App.module.scss';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: cyan[500],
      light: cyan[300],
    },
  },
});

interface ThemeProps {
  children: React.ReactElement | React.ReactElement[];
}

/**
 * Обертка страниц,
 * для плавного перехода и
 * внедрения других глобальных стилей
 * @param props
 * @returns
 */
export default function Theme(props: ThemeProps): React.ReactElement {
  const { children } = props;
  const [active, setActive] = useState<boolean>(false);
  useEffect(() => {
    setActive(true);
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <div className={clsx(s.body, active && s.active)}>{children}</div>
    </ThemeProvider>
  );
}
