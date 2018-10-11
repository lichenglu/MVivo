import { AutoComplete as AntAutoComplete } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { ColorGrid } from '~/components/colorGrid';
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

const StyledAutoComplete = styled(AntAutoComplete)`
  width: 100%;
`;

type AutoCompletionProps = Omit<AntAutoCompleteProps, 'dataSource'> & {
  dataSource: CodeSnapshot[];
  onFocus?: (e: React.FocusEvent<any>) => void;
};

export const AutoComplete = ({
  onSelect,
  onSearch,
  dataSource,
  ...rest
}: AutoCompletionProps) => {
  return (
    <StyledAutoComplete
      onSelect={onSelect}
      onSearch={onSearch}
      optionLabelProp={'text'}
      dataSource={dataSource.map(({ bgColor, id, name }) => (
        <Option key={id} value={id} title={name}>
          <ContentContainer>
            {bgColor && <ColorGrid bgColor={bgColor} />}
            {!bgColor && <CreationHint>Create Code: </CreationHint>}
            <span>{name}</span>
          </ContentContainer>
        </Option>
      ))}
      {...rest}
    />
  );
};
