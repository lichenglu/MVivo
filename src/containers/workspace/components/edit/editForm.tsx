import { Select } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { EditableText } from '~/components/editableText';
import { Colors } from '~/themes';

import { CodeBookSnapshot, WorkSpaceSnapshot } from '~/stores';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  width: 70%;
  margin: auto;
`;

const NameContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.h3`
  margin-bottom: 1rem;
`;

const Description = styled.p`
  margin-bottom: 1rem;
  color: ${Colors.textLightGray};
`;

interface EditFormProps extends WorkSpaceSnapshot {
  codeBooks: CodeBookSnapshot[];
  handleNameChange: (data: { text: string }) => void;
  handleDescChange: (data: { text: string }) => void;
  handleSelectCodeBook: (value: string) => void;
}

export const EditForm = ({
  name,
  handleNameChange,
  description,
  handleDescChange,
  codeBooks,
  codeBook,
  documents: textDocuments,
  handleSelectCodeBook,
}: EditFormProps) => (
  <Container>
    <NameContainer>
      <EditableText
        placeholder="Change your workspace name here"
        text={name}
        onChangeText={handleNameChange}
        Text={Name}
        textAreaProps={{
          autosize: { minRows: 1, maxRows: 1 },
        }}
      />

      <EditableText
        placeholder="Change your workspace description here"
        text={description}
        onChangeText={handleDescChange}
        Text={Description}
        textAreaProps={{
          autosize: { minRows: 1, maxRows: 1 },
        }}
      />
    </NameContainer>

    <Select
      style={{ width: '50%' }}
      placeholder="Select existing code books"
      value={codeBook && codeBook.name}
      onSelect={handleSelectCodeBook}
      disabled={!!textDocuments}
    >
      {codeBooks.map(({ name: codeName, id }: { name: string; id: string }) => (
        <Select.Option key={id} value={id}>
          {codeName}
        </Select.Option>
      ))}
    </Select>
  </Container>
);
