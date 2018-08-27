import { message, notification } from 'antd';
import { inject, observer } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import { CodeModel, CodeSnapshot, RootStore } from '~/stores/root-store';

// components
import ManualUpload from './components/manualUpload';
import Uploader from './components/upload';
import WorkStation from './components/workStation';

interface WorkSpaceDetailProps extends RouteCompProps<{ id: string }> {
  rootStore: RootStore;
}

interface WorkSpaceDetailState {
  manualInputDocument: boolean;
}

const UploadContainer = styled.div`
	width: 100%;
	height: 80%
	margin: auto;
	display: flex;
	flex-direction: column;
	flex: 0.1;

	@media (min-width: 500px) {
		width: 80%;
	}

	@media (min-width: 960px) {
		width: 50%;
		height: 50%;
	}
`;

const Switch = styled.a`
  margin-top: 0.5rem;
  display: block;
  align-self: flex-end;
`;

// TODO:
// 1. Asked to upload text file if not available
// 2. Add more text file, unlink text file
// 3. Link/unlink more code book
// 4. Update workSpace info
@inject('rootStore')
@observer
export class WorkSpaceDetail extends React.Component<
  WorkSpaceDetailProps,
  WorkSpaceDetailState
> {
  public state = {
    manualInputDocument: false,
  };

  public onCompleteUpload = (data: { text: string; name: string }) => {
    if (this.workSpace) {
      const documentT = this.props.rootStore.workSpaceStore.createDocument(
        data
      );

      let codeBook = this.workSpace.codeBook;
      if (!codeBook) {
        codeBook = this.props.rootStore.createCodeBook({
          name: `${this.workSpace.id}_code_book`,
        });
        this.workSpace.setCodeBook(codeBook);
      }

      this.workSpace.setDocument(documentT);
      notification.success({
        description: 'Now you are all set to start coding!',
        message: 'Document uploaded!',
      });
    } else {
      message.error(`Failed to add document because work space is not found`);
    }
  };

  public onSwitchUploadMode = () =>
    this.setState({ manualInputDocument: !this.state.manualInputDocument });

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

  get workSpace() {
    const workSpaceID = this.props.match.params.id;
    return this.props.rootStore.workSpaceStore.workSpaceBy(workSpaceID);
  }

  get codeList() {
    if (this.workSpace && this.workSpace.codeBook) {
      return this.workSpace.codeBook.codeList;
    }
    return [];
  }

  get hasDocument() {
    if (!this.workSpace) return false;
    if (!this.workSpace.document) return false;
    return !!this.workSpace.document.id;
  }

  public render(): JSX.Element | null {
    // if (!this.workSpace) return null;
    const { manualInputDocument } = this.state;

    return (
      <React.Fragment>
        <Helmet>
          <title>WorkSpace Detail</title>
        </Helmet>
        {this.hasDocument ? (
          <WorkStation
            codeList={this.codeList}
            onCreateCode={this.onCreateCode}
          />
        ) : (
          <UploadContainer>
            {!manualInputDocument && (
              <Uploader onCompleteUpload={this.onCompleteUpload} />
            )}
            <Switch onClick={this.onSwitchUploadMode}>
              {manualInputDocument ? 'Upload file?' : 'Copy and paste?'}
            </Switch>
            {manualInputDocument && (
              <ManualUpload onCompleteUpload={this.onCompleteUpload} />
            )}
          </UploadContainer>
        )}
      </React.Fragment>
    );
  }
}
