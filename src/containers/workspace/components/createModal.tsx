import { Button, Form, Input, Modal, Select } from 'antd';
import { InputProps, TextAreaProps } from 'antd/lib/input';
import React from 'react';
import styled from 'styled-components';

import { CodeBookSnapshot } from '../../../stores';

interface CreateWSModalProps {
  visible: boolean;
  codeBooks: CodeBookSnapshot[];
  onClose: () => void;
  onSubmit: (
    data: { name: string; description: string; codeBookID?: string }
  ) => void;
}

interface CreateWSModalState {
  name: string;
  valid: boolean;
  description: string;
  codeBookID?: string;
}

const Option = Select.Option;
const TextArea = Input.TextArea;

// @ts-ignore
const StyledFormItem = styled(Form.Item)`
  &&&& {
    margin-bottom: 0.5rem;
  }
`;

// TODO: better way to type
const NameInput = styled((p: InputProps) => <Input {...p} />)``;

// TODO: better way to type
const DescText = styled((p: TextAreaProps) => <TextArea {...p} />)``;

export default class CreateWSModal extends React.Component<
  CreateWSModalProps,
  CreateWSModalState
> {
  public state = {
    codeBookID: undefined,
    description: '',
    name: '',
    valid: false,
  };

  public handleSubmit = () => {
    const { name, description, codeBookID } = this.state;
    this.props.onSubmit({ name, description, codeBookID });
  };

  public handleSelectCodeBook = (value: string) =>
    this.setState({ codeBookID: value });

  public handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ name: e.target.value, valid: !!e.target.value });

  public handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    this.setState({ description: e.target.value });

  public render() {
    const { visible, codeBooks, onClose } = this.props;
    const { codeBookID, valid } = this.state;
    return (
      <Modal
        visible={visible}
        title="Create a new workspace"
        onOk={this.handleSubmit}
        onCancel={onClose}
        footer={[
          <Button key="back" type="danger" onClick={onClose}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={this.handleSubmit}
            disabled={!valid}
          >
            Submit
          </Button>,
        ]}
      >
        <Form>
          <StyledFormItem required={true} label="Name:">
            <NameInput
              placeholder="Input the new workspace name here"
              onChange={this.handleNameChange}
            />
          </StyledFormItem>
          <StyledFormItem label="Description:">
            <DescText
              placeholder="What is this workspace for?"
              autosize={{ minRows: 3, maxRows: 6 }}
              onChange={this.handleDescChange}
            />
          </StyledFormItem>

          <StyledFormItem label="Existing Code Book:">
            <Select
              style={{ width: '50%' }}
              placeholder="Select existing code books"
              value={codeBookID}
              onSelect={this.handleSelectCodeBook}
            >
              {codeBooks.map(({ name, id }) => (
                <Option key={id} value={id}>
                  {name}
                </Option>
              ))}
            </Select>
          </StyledFormItem>
        </Form>
      </Modal>
    );
  }
}
