import { Change } from 'slate';
import { renderHoverMenu } from './renderHoverMenu';

interface HoverMenuOptions {}

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

export default function HoverMenu({  }: HoverMenuOptions) {
  let menu: HTMLDivElement | null = null;
  let timer: NodeJS.Timeout;

  return {
    ...renderHoverMenu({ menuRef: (ref: HTMLDivElement) => (menu = ref) }),
    onChange(change: Change, next: Function) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        updateMenu({ menu, change });
        next();
      }, 100);
    },
  };
}
