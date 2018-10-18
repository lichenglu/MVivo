import React from 'react';
import { HoverMenu } from '~/components/hoveringMenu';

export const renderHoverMenu = ({ menuRef }: { menuRef: any }) => {
  return {
    renderEditor: (props, next) => {
      const { editor } = props;
      const children = next();
      return (
        <React.Fragment>
          {children}
          <HoverMenu innerRef={menuRef} editor={editor} rootHTMLID="root" />
        </React.Fragment>
      );
    },
  };
};
