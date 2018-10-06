import { Button, Input } from 'antd';
import { TextAreaProps } from 'antd/lib/input';
import React from 'react';
import styled from 'styled-components';

interface EditableTextState {
  editing: boolean;
  text: string;
}

interface EditableTextProps {
  text: string;
  onChangeText: (data: EditableTextProps) => void;
  placeholder: string;
  [key: string]: any;
  textAreaProps?: TextAreaProps;
  Text?: React.ComponentType<EditableTextProps>;
}

const TextArea = Input.TextArea;

const Container = styled.div``;

const EditAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const UpdateButton = styled(Button)`
  margin-top: 0.5rem;
`;

const EditableTextText = styled.p`
  cursor: pointer;
`;

export class EditableText extends React.PureComponent<
  EditableTextProps,
  EditableTextState
> {
  public state = {
    editing: false,
    text: this.props.text,
  };

  public submit = () => {
    const { onChangeText } = this.props;
    const { text } = this.state;

    this.onToggleEdit();
    onChangeText({ ...this.props, text });
  };

  public onToggleEdit = () => this.setState({ editing: !this.state.editing });

  public render() {
    const { editing, text } = this.state;
    const { Text, placeholder, textAreaProps } = this.props;
    return (
      <Container>
        {editing && (
          <EditAreaContainer onClick={this.onToggleEdit}>
            <TextArea
              value={text}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                this.setState({ text: e.target.value })
              }
              placeholder={placeholder}
              onClick={e => e.stopPropagation()}
              onPressEnter={this.submit}
              autosize={{ minRows: 4, maxRows: 6 }}
              {...textAreaProps}
            />
            <UpdateButton onClick={this.submit} type={'primary'}>
              Update
            </UpdateButton>
          </EditAreaContainer>
        )}
        {!editing &&
          (Text ? (
            <Text {...this.props} onClick={this.onToggleEdit}>
              {text || placeholder}
            </Text>
          ) : (
            <EditableTextText onClick={this.onToggleEdit}>
              {text || placeholder}
            </EditableTextText>
          ))}
      </Container>
    );
  }
}
