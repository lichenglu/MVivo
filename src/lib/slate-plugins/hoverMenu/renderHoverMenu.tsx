import React from 'react';
import { HoverMenu } from '../components';

import { SlatePlugin } from '~/lib/slate-plugins';

export const RenderHoverMenu = ({
  menuRef,
}: {
  menuRef: React.RefObject<HTMLDivElement>;
}): SlatePlugin => {
  return {
    renderEditor: (props, next) => {
      const { editor } = props;
      const children = next();
      return (
        <React.Fragment>
          {children}
          <HoverMenu menuRef={menuRef} editor={editor} />
        </React.Fragment>
      );
    },
  };
};
