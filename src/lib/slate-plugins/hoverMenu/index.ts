import React from 'react';
import { Change } from 'slate';
import { RenderHoverMenu } from './renderHoverMenu';

interface HoverMenuOptions {
  menuDebounceTime?: 100;
}

const updateMenu = ({
  menu,
  change,
}: {
  menu: HTMLDivElement | null;
  change: Change;
}) => {
  if (!menu) return;

  const { fragment, selection } = change.value;

  if (selection.isBlurred || selection.isCollapsed || fragment.text === '') {
    menu.removeAttribute('style');
    return;
  }

  const native = window.getSelection();
  const range = native.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  menu.style.opacity = '1';
  menu.style.top = `${rect.top + window.pageYOffset - menu.offsetHeight}px`;

  menu.style.left = `${rect.left +
    window.pageXOffset -
    menu.offsetWidth / 2 +
    rect.width / 2}px`;
};

export default function HoverMenu({
  menuDebounceTime = 100,
}: HoverMenuOptions) {
  const menu: React.RefObject<HTMLDivElement> = React.createRef();
  let timer: NodeJS.Timeout;

  return {
    ...RenderHoverMenu({ menuRef: menu }),
    onChange(change: Change, next: Function) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        updateMenu({ menu: menu.current, change });
        next();
      }, menuDebounceTime);
    },
  };
}
