import { message, notification } from 'antd';
import { inject, observer } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Value as SlateValue } from 'slate';
import styled from 'styled-components';

import { CodeModel, RootStore } from '~/stores/root-store';

// components
import { WorkStation } from './components/workStation';

interface WorkStationProps
  extends RouteCompProps<{ wsID: string; docID: string }> {
  rootStore: RootStore;
}

interface WorkStationState {
  manualInputDocument: boolean;
}

// TODO:
// 1. Asked to upload text file if not available
// 2. Add more text file, unlink text file
// 3. Link/unlink more code book
// 4. Update workSpace info
@inject('rootStore')
@observer
export class WorkStationContainer extends React.Component<
  WorkStationProps,
  WorkStationState
> {
  public state = {
    manualInputDocument: false,
  };

  public onCreateCode = (data: {
    name: string;
    definition?: string;
    bgColor?: string;
    tint?: string;
  }) => {
    if (this.workSpace && this.workSpace.codeBook) {
      const code = CodeModel.create(data);
      this.props.rootStore.codeBookStore.createCodeAndAddTo(
        this.workSpace.codeBook.id,
        code
      );
      return getSnapshot(code);
    }
    return null;
  };

  public onDeleteCode = (codeID: string) => {
    if (this.workSpace && this.workSpace.codeBook) {
      const success = this.props.rootStore.codeBookStore.removeCodeOf(
        this.workSpace.codeBook.id,
        codeID
      );
      return success;
    }
    return false;
  };

  public onUpdateEditorContent = (contentState: SlateValue) => {
    if (this.document) {
      this.props.rootStore.workSpaceStore.updateEditorState(
        this.document.id,
        contentState
      );
    }
  };

  get workSpace() {
    const workSpaceID = this.props.match.params.wsID;
    return this.props.rootStore.workSpaceStore.workSpaceBy(workSpaceID);
  }

  get document() {
    if (!this.workSpace) return null;
    const documentID = this.props.match.params.docID;
    const doc = this.workSpace.documents.get(documentID);
    return doc;
  }

  get codeList() {
    if (this.workSpace && this.workSpace.codeBook) {
      return this.workSpace.codeBook.codeList;
    }
    return [];
  }

  get hasDocument() {
    if (!this.document) return false;
    return !!this.document.id;
  }

  public render(): JSX.Element | null {
    return (
      <React.Fragment>
        <Helmet>
          <title>WorkSpace Detail</title>
        </Helmet>
        {this.hasDocument ? (
          <WorkStation
            codeList={this.codeList}
            onCreateCode={this.onCreateCode}
            onDeleteCode={this.onDeleteCode}
            onUpdateEditorContent={this.onUpdateEditorContent}
            editorState={this.document && this.document.editorContentState}
          />
        ) : (
          'No such document found'
        )}
      </React.Fragment>
    );
  }
}
