import { notification } from 'antd';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Editor } from 'slate-react';
import styled from 'styled-components';

import { RootStore, WorkSpaceSnapshot } from '~/stores/root-store';

// components

interface SummaryProps {
  workSpace: WorkSpaceSnapshot;
}

const Container = styled.div``;

export class Summary extends React.Component<SummaryProps, {}> {
  public render(): JSX.Element | null {
    return <Container>hello world</Container>;
  }
}
