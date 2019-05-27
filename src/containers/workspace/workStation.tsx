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

// services
import { AutoCode } from '~/lib/slate-plugins';
import {
  MLModelProtocol,
  SequenceClassificationModel,
} from '~/services/tensorflow';
import tokenizer from '~/services/tensorflow/tokenizer.json';

interface WorkStationProps
  extends RouteCompProps<{ wsID: string; docID: string }> {
  rootStore: RootStore;
}

interface WorkStationState {
  manualInputDocument: boolean;
  mlModel?: MLModelProtocol;
}

// TODO:
// 1. Ask users to upload a text file if not available
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
    mlModel: undefined,
  };

  public async componentDidMount() {
    const modelURL = 'http://0.0.0.0:1234/ml-models/model.json';
    const asiaModel = new SequenceClassificationModel({
      labels: [
        'Personal advice',
        'Vocatives (addressing individual)',
        'Complementing, expressing appreciation',
        'Negative Activating',
        'Asking questions',
      ],
      maxSequenceLength: 55,
      src: modelURL,
      tokenizer,
    });
    await asiaModel.loadModel();
    this.setState({ mlModel: asiaModel });
  }

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
    const { mlModel } = this.state;

    return mlModel ? (
      <React.Fragment>
        <Helmet>
          <title>WorkSpace - work station</title>
        </Helmet>
        {this.hasDocument ? (
          <WorkStation
            plugins={[AutoCode({ model: mlModel })]}
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
    ) : null;
  }
}
