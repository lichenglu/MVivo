import { Button, Dropdown, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ViewableMonitor } from './viewableMonitor';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const TextContainer = styled.div`
  flex: 1;
`;

const RosterBtn = styled(Dropdown)<{ active: boolean }>`
  width: 3rem;
  opacity: ${({ active }) => (active ? 1 : 0)};
  margin-right: 1rem;
  margin-top: 0.3rem;
`;

export const RosterMenu = ({ options = [], selected, handleChange }) => (
  <Select
    mode="tags"
    onChange={handleChange}
    style={{ width: 200 }}
    value={selected}
  >
    {options.map(opt => (
      <Select.Option key={opt} value={opt}>
        {opt}
      </Select.Option>
    ))}
  </Select>
);

export default ({
  children,
  attributes,
  node,
  editor,
  roster,
  onChangeRoster,
}) => {
  const [showRosterBtn, toggleRosterBtn] = useState(false);
  const [showRosterMenu, toggleRosterMenu] = useState(false);
  const [intersected, toggleIntersection] = useState(false);

  // useEffect(() => {
  //   if (showRosterBtn === false && showRosterMenu) {
  //     toggleRosterMenu(false);
  //   }
  // });

  const data = node.get('data');
  const tags = data.get('tags');
  const hasTags = tags && tags.length > 0;
  return (
    <ViewableMonitor>
      {({ isIntersecting }) => {
        // we don't want to render the block if it has not been scrolled to
        if (!intersected && !isIntersecting) return null;
        // set intersected to true so that we won't re-render it when scrolling around
        if (!intersected && isIntersecting) toggleIntersection(true);

        return (
          <Container
            {...attributes}
            onMouseEnter={() => toggleRosterBtn(true)}
            onMouseLeave={() => !showRosterMenu && toggleRosterBtn(false)}
            className="transcribe-block"
          >
            <RosterBtn
              // @ts-ignore
              overlay={
                <RosterMenu
                  options={roster}
                  selected={tags}
                  handleChange={vals => {
                    if (vals.length > 0) {
                      toggleRosterMenu(false);
                      toggleRosterBtn(false);
                    }
                    onChangeRoster(vals);
                  }}
                />
              }
              placement="bottomRight"
              trigger={['click']}
              visible={showRosterMenu}
              active={hasTags || showRosterBtn}
            >
              <Button
                onClick={() => {
                  editor.change(change => {
                    change.moveToRangeOfNode(node);
                  });
                  toggleRosterMenu(!showRosterMenu);
                }}
                data-speakers={hasTags ? tags.join(', ') : ''}
              >
                {hasTags
                  ? tags
                      .map((t: string) =>
                        (t.charAt(0) + t.charAt(t.length - 1)).toUpperCase()
                      )
                      .join(', ')
                  : '+'}
              </Button>
            </RosterBtn>

            <TextContainer className="transcribe-block-text">
              {children}
            </TextContainer>
          </Container>
        );
      }}
    </ViewableMonitor>
  );
};
