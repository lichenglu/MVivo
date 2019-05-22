import React from 'react';
import Scrollbar, { ScrollBarProps } from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import './style.less';

interface ScrollBarContainer extends ScrollBarProps {
  children: React.ReactNode;
}

export default ({ children, ...rest }: ScrollBarContainer) => (
  <Scrollbar className="mvivo-custom-scroll" {...rest}>
    {children}
  </Scrollbar>
);
