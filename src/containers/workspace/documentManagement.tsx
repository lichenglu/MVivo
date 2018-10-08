import { message, notification } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import { DocumentSnapshot, RootStore } from '~/stores/root-store';

// components
import DocumentList from './components/documentList';
import ManualUpload from './components/manualUpload';
import Uploader from './components/upload';

interface DocumentManagementProps extends RouteCompProps<{ id: string }> {
  rootStore: RootStore;
}

interface DocumentManagementState {
  manualInputDocument: boolean;
  viewingDocs: boolean;
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

@inject('rootStore')
@observer
export class DocumentManagement extends React.Component<
  DocumentManagementProps,
  DocumentManagementState
> {
  public state = {
    manualInputDocument: false,
    viewingDocs: this.hasDocument,
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

      this.workSpace.addDocument(documentT);
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

  public onOpenFile = ({ document }: { document: DocumentSnapshot }) => {
    if (!this.workSpace) {
      console.log(
        `[onOpenFile] Cannot open document. Because workspace is null`
      );
      return;
    }
    this.props.history.push(
      `/workspace/${this.workSpace.id}/document/${document.id}`
    );
  };

  public onSwitchViewingMode = () =>
    this.setState({ viewingDocs: !this.state.viewingDocs });

  get workSpace() {
    const workSpaceID = this.props.match.params.id;
    return this.props.rootStore.workSpaceStore.workSpaceBy(workSpaceID);
  }

  get documents() {
    if (!this.workSpace) return null;
    return this.workSpace.documentList;
  }

  get codeList() {
    if (this.workSpace && this.workSpace.codeBook) {
      return this.workSpace.codeBook.codeList;
    }
    return [];
  }

  get hasDocument() {
    return this.documents && this.documents.length > 0;
  }

  public render(): JSX.Element | null {
    // if (!this.workSpace) return null;
    const { manualInputDocument, viewingDocs } = this.state;

    return (
      <React.Fragment>
        <Helmet>
          <title>WorkSpace Detail</title>
        </Helmet>
        {viewingDocs ? (
          <DocumentList
            documents={this.documents}
            onOpenFile={this.onOpenFile}
            onCreate={this.onSwitchViewingMode}
          />
        ) : (
          <UploadContainer>
            {this.hasDocument && (
              <Switch
                onClick={this.onSwitchViewingMode}
                style={{ alignSelf: 'flex-start', marginBottom: '0.5rem' }}
              >
                {'Go to document list'}
              </Switch>
            )}

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
