import {notification} from 'antd'
import {inject, observer} from 'mobx-react'
import React from 'react'
import {Helmet} from 'react-helmet'
import styled from 'styled-components'

import {RootStore} from '~/stores/root-store'

// components
import Uploader from './components/upload'

interface WorkSpaceDetailProps extends RouteCompProps<{id: string}> {
  rootStore: RootStore
}

interface WorkSpaceDetailState {
  manualInputDocument: boolean
}

const UploadContainer = styled.div`
	width: 100%;
	height: 80%
	margin: auto;
	flex: 0.1;

	@media (min-width: 500px) {
		width: 80%;
	}

	@media (min-width: 960px) {
		width: 50%;
		height: 50%;
	}
`

const Switch = styled.a`
  margin-top: 0.5rem;
  float: right;
`
@inject('rootStore')
@observer
export class WorkSpaceDetail extends React.Component<WorkSpaceDetailProps, WorkSpaceDetailState> {
  public state = {
    manualInputDocument: false
  }

  public onCompleteUpload = (data: {text: string; name: string}) => {
    if (this.workspace) {
      const documentT = this.props.rootStore.workSpaceStore.createDocument(data)
      this.workspace.setDocument(documentT)
      notification.success({
        description: 'Now you are all set to start coding!',
        message: 'Document uploaded!'
      })
    }
  }

  public onSwitchUploadMode = () =>
    this.setState({manualInputDocument: !this.state.manualInputDocument})

  get workspace() {
    const workspaceID = this.props.match.params.id
    return this.props.rootStore.workSpaceStore.workSpaceBy(workspaceID)
  }

  get hasDocument() {
    if (!this.workspace) return false
    if (!this.workspace.document) return false
    return !!this.workspace.document.id
  }

  public render(): JSX.Element | null {
    // if (!this.workspace) return null;
    const {manualInputDocument} = this.state

    return (
      <React.Fragment>
        <Helmet>
          <title>WorkSpace Detail</title>
        </Helmet>
        {this.hasDocument ? (
          <p>Hello World</p>
        ) : (
          <UploadContainer>
            <Uploader onCompleteUpload={this.onCompleteUpload} />
            <Switch onClick={this.onSwitchUploadMode}>
              {manualInputDocument ? 'Upload file?' : 'Copy and paste?'}
            </Switch>
          </UploadContainer>
        )}
      </React.Fragment>
    )
  }
}
