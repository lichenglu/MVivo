import { Button, Dropdown, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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

export default ({ children, attributes, node, roster, onChangeRoster }) => {
  const [showRosterBtn, toggleRosterBtn] = useState(false);
  const [showRosterMenu, toggleRosterMenu] = useState(false);

  useEffect(() => {
    if (showRosterBtn === false && showRosterMenu) {
      toggleRosterMenu(false);
    }
  });

  const data = node.get('data');
  const tags = data.get('tags');
  const hasTags = tags && tags.length > 0;

  return (
    <Container
      {...attributes}
      onMouseEnter={() => toggleRosterBtn(true)}
      onMouseLeave={() => toggleRosterBtn(false)}
    >
      <RosterBtn
        overlay={
          <RosterMenu
            options={roster}
            selected={tags}
            handleChange={onChangeRoster}
          />
        }
        placement="bottomRight"
        trigger={['click']}
        visible={showRosterMenu}
        active={hasTags || showRosterBtn}
      >
        <Button onClick={() => toggleRosterMenu(!showRosterMenu)}>
          {hasTags
            ? tags
                .map(t => (t.charAt(0) + t.charAt(t.length - 1)).toUpperCase())
                .join(', ')
            : '+'}
        </Button>
      </RosterBtn>

      <TextContainer>{children}</TextContainer>
    </Container>
  );
};
