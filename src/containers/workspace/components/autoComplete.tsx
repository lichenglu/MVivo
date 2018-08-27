import { AutoComplete as AntAutoComplete } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { CodeSnapshot } from '~/stores';

const Option = AntAutoComplete.Option;

export const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const CreationHint = styled.a`
  margin-right: 6px;
`;

export const ColorGrid = styled.div<{ bgColor: string }>`
  width: 1rem;
  height: 1rem;
  border-radius: 5px;
  margin-right: 6px;
  background-color: ${({ bgColor }) => bgColor};
`;

const StyledAutoComplete = styled(AntAutoComplete)`
  width: 100%;
`;

type AutoCompleteOptionProps = CodeSnapshot & {
  text: string;
  value: string;
};

export const AutoComplete = ({
  onSelect,
  onSearch,
  dataSource,
  ...rest
}: any) => {
  return (
    <StyledAutoComplete
      onSelect={onSelect}
      onSearch={onSearch}
      optionLabelProp={'text'}
      dataSource={dataSource.map(({ value, text, bgColor }) => (
        <Option key={value}>
          <ContentContainer>
            {bgColor && <ColorGrid bgColor={bgColor} />}
            {!bgColor && <CreationHint>Create Code: </CreationHint>}
            <span>{text}</span>
          </ContentContainer>
        </Option>
      ))}
      {...rest}
    />
  );
};
