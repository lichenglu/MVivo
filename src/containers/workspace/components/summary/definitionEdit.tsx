import { Button, Input } from 'antd';
import React from 'react';
import styled from 'styled-components';

interface DefinitionState {
  edit: boolean;
  definition: string;
}

interface DefinitionProps {
  definition: string;
  codeID: string;
  onChangeDefinition: (data: { codeID: string; definition: string }) => void;
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

const DefinitionText = styled.p`
  cursor: pointer;
`;

export class Definition extends React.PureComponent<
  DefinitionProps,
  DefinitionState
> {
  public state = {
    edit: false,
    definition: this.props.definition,
  };

  public submitDefinition = () => {
    const { onChangeDefinition, codeID } = this.props;
    const { definition } = this.state;

    this.onToggleEdit();
    onChangeDefinition({ codeID, definition });
  };

  public onToggleEdit = () => this.setState({ edit: !this.state.edit });

  public render() {
    const { edit, definition } = this.state;
    return (
      <Container>
        {edit && (
          <EditAreaContainer onClick={this.onToggleEdit}>
            <TextArea
              value={definition}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                this.setState({ definition: e.target.value })
              }
              placeholder={'Input the code definition here'}
              onClick={e => e.stopPropagation()}
              onPressEnter={this.submitDefinition}
              autosize={{ minRows: 4, maxRows: 6 }}
            />
            <UpdateButton onClick={this.submitDefinition} type={'primary'}>
              Update
            </UpdateButton>
          </EditAreaContainer>
        )}
        {!edit && (
          <DefinitionText onClick={this.onToggleEdit}>
            {definition || 'Input the code definition here'}
          </DefinitionText>
        )}
      </Container>
    );
  }
}
