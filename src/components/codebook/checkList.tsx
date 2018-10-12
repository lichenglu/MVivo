import { Checkbox, Switch } from 'antd';
import { CheckboxChangeEvent, CheckboxOptionType } from 'antd/lib/checkbox';
import React from 'react';
import styled from 'styled-components';

import { CodeBookRow } from './index';

const CheckboxGroup = Checkbox.Group;

interface CheckListState {
  checkedList: CheckboxOptionType[];
  checkedValue: string[];
  indeterminate: boolean;
  checkAll: boolean;
}

interface CheckListProps {
  codes: CodeBookRow[];
  onChangeAPASwitch: (checked: boolean) => void;
  onCheckCode: (checked: string[]) => void;
}

const Container = styled.div`
  margin-bottom: 1rem;
`;

const CheckAllContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
`;

export class CheckList extends React.Component<CheckListProps, CheckListState> {
  public state = {
    checkedList: this.allOptions,
    checkedValue: this.allOptions.map(opt => opt.value),
    indeterminate: false,
    checkAll: true,
  };

  public onChange = (checkedValue: string[]) => {
    this.props.onCheckCode(checkedValue);
    this.setState({
      checkedValue,
      indeterminate:
        !!checkedValue.length && checkedValue.length < this.allOptions.length,
      checkAll: checkedValue.length === this.allOptions.length,
    });
  };

  public onCheckAllChange = (e: CheckboxChangeEvent) => {
    const allCodeIDs = this.allOptions.map(opt => opt.value);
    this.props.onCheckCode(e.target.checked ? allCodeIDs : []);
    this.setState({
      checkedValue: e.target.checked ? allCodeIDs : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  get allOptions() {
    return this.props.codes.map(code => ({
      label: code.name,
      value: code.id,
    }));
  }

  public render() {
    const { indeterminate, checkedList, checkedValue } = this.state;
    const { onChangeAPASwitch } = this.props;
    return (
      <Container>
        <CheckAllContainer style={{ borderBottom: '1px solid #E9E9E9' }}>
          <Checkbox
            indeterminate={indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            Check all
          </Checkbox>
          <Switch
            unCheckedChildren="APA"
            checkedChildren="Edit"
            onChange={onChangeAPASwitch}
          />
        </CheckAllContainer>
        <br />
        <CheckboxGroup
          options={checkedList}
          onChange={this.onChange}
          value={checkedValue}
        />
      </Container>
    );
  }
}
