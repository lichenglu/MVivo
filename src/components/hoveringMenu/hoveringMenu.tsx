import React from 'react';
import ReactDOM from 'react-dom';
import { Editor } from 'slate-react';
import styled from 'styled-components';

import { Button, Divider, Icon, Menu } from './components';

import { endSelection } from '~/lib/slate-plugins';
import { INLINES, MARKS } from '~/lib/slate-plugins/utils/constants';

import { Colors } from '~/themes';

const StyledMenu = styled(Menu)`
  padding: 8px 7px 6px;
  position: absolute;
  z-index: 1;
  top: -10000px;
  left: -10000px;
  margin-top: -6px;
  opacity: 0;
  background-color: #222;
  border-radius: 4px;
  transition: opacity 0.75s;
`;

interface HoverMenuItem {
  dataType: 'mark' | 'inline' | 'divider';
  type: MARKS | INLINES;
  icon: string;
  data?: object;
}

interface HoverMenuProps {
  rootHTMLID: string;
  innerRef: string & ((instance: HTMLDivElement | null) => any);
  editor: Editor;
  className?: string;
  items?: HoverMenuItem[];
}

export class HoverMenu extends React.Component<HoverMenuProps> {
  public static defaultProps = {
    innerRef: (instance: HTMLDivElement) =>
      console.log('No menu innerRef passed'),
    items: [
      { dataType: 'mark', type: MARKS.Bold, icon: 'bold' },
      { dataType: 'mark', type: MARKS.Italic, icon: 'italic' },
      { dataType: 'mark', type: MARKS.Underlined, icon: 'underline' },
      { dataType: 'divider', type: MARKS.Underlined, icon: 'underline' },
      {
        dataType: 'inline',
        type: INLINES.BufferedText,
        icon: 'fire',
        data: { bgColor: Colors.bufferedText },
      },
    ],
  };
  public root: HTMLElement | null;

  constructor(props: HoverMenuProps) {
    super(props);
    this.root = window.document.getElementById(this.props.rootHTMLID);
  }
  public renderMenuItem(item: HoverMenuItem) {
    if (item.dataType === 'mark') return this.renderMarkButton(item);

    if (item.dataType === 'inline') return this.renderInlineButton(item);

    if (item.dataType === 'divider') return <Divider />;
  }

  public renderMarkButton(item: HoverMenuItem) {
    const { type, icon } = item;
    const { editor } = this.props;
    const { value } = editor;
    const isActive = value.activeMarks.some(
      mark => !!mark && mark.type === type
    );
    return (
      <Button
        reversed
        active={isActive}
        onMouseDown={event => this.onClickMark(event, item)}
      >
        <Icon type={icon} />
      </Button>
    );
  }

  public onClickMark(event: React.MouseEvent<any>, { type }: HoverMenuItem) {
    const { editor } = this.props;
    event.preventDefault();
    editor.change(change => change.toggleMark(type));
  }

  public renderInlineButton(item: HoverMenuItem) {
    const { type, icon } = item;
    const { editor } = this.props;
    const { value } = editor;
    const isActive = value.inlines.some(
      inline => !!inline && inline.type === type
    );
    return (
      <Button
        reversed
        active={isActive}
        onMouseDown={event => this.onClickInline(event, item)}
      >
        <Icon type={icon} />
      </Button>
    );
  }

  public onClickInline(
    event: React.MouseEvent<any>,
    { type, data }: HoverMenuItem
  ) {
    const { editor } = this.props;
    event.preventDefault();

    editor.change(change => {
      const targetInlines = change.value.inlines
        .toArray()
        .filter(inline => !!inline && inline.type === type);
      targetInlines.length > 0
        ? targetInlines.forEach(inline => change.unwrapInline(inline))
        : change.wrapInline({ type, data }).call(endSelection);
    });
  }

  public render() {
    const { className, innerRef, rootHTMLID, items } = this.props;

    if (!this.root) {
      throw new Error(
        `Cannot find dom element with id ${rootHTMLID}. Please make sure this is the right id`
      );
    }

    return this.root
      ? ReactDOM.createPortal(
          <StyledMenu className={className} ref={innerRef}>
            {items &&
              items.map((item, idx) => (
                <React.Fragment key={idx}>
                  {this.renderMenuItem(item)}
                </React.Fragment>
              ))}
          </StyledMenu>,
          this.root
        )
      : null;
  }
}
