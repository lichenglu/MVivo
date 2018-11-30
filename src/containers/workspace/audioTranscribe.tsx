import { Button, Switch } from 'antd';
import isHotkey from 'is-hotkey';
import $ from 'jquery';
import { inject, observer } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import React from 'react';
import { Helmet } from 'react-helmet';
import ReactPlayer from 'react-player';
import { Change, Value as SlateValue } from 'slate';
import styled from 'styled-components';

import { CodeModel, RootStore } from '~/stores/root-store';

import AudioMock from '~/fixtures/google_output.json';
import { deserialize } from '~/lib/slate-plugins/google-speech-text-serializer';
import { export2Word } from '~/lib/utils';

// components
import { AudioPlayer } from '~/components/playback/audioPlayer';
import { WorkStation } from './components/workStation';

// slate related
import TimedText, { calculateTextColor } from '~/lib/slate-plugins/timedText';
import { TimeStampContextProvider } from '~/lib/slate-plugins/timedText/timeStateContext';
import { MARKS } from '~/lib/slate-plugins/utils/constants';

interface AudioTranscriptionProps
  extends RouteCompProps<{ wsID: string; docID: string }> {
  rootStore: RootStore;
}

interface AudioTranscriptionState {
  manualInputDocument: boolean;
  playedSeconds: number;
  allowCoding: boolean;
}

const ToolBarContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SwitchContainer = styled.div`
  display: flex;
  margin-left: 1rem;
  width: 20rem;
  height: 100%;
  align-self: flex-start;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;

  > * {
    margin-right: 1rem;
  }
`;

@inject('rootStore')
@observer
export class AudioTranscriptionContainer extends React.Component<
  AudioTranscriptionProps,
  AudioTranscriptionState
> {
  public state = {
    manualInputDocument: false,
    playedSeconds: 0,
    allowCoding: true,
  };

  public get plugins() {
    const self = this;
    return [
      TimedText({ type: MARKS.TimedText }),
      {
        onKeyDown(event: KeyboardEvent, change: Change, next: Function) {
          if (isHotkey('control+space', event)) {
            event.preventDefault();
            self.togglePlayer();
          }
          return next();
        },
      },
    ];
  }

  public player: ReactPlayer;

  public componentDidMount() {
    if (!this.document) {
      const documentT = this.props.rootStore.workSpaceStore.createDocument(
        {
          text: 'blah',
          name: 'transcribe',
          editorContentState: deserialize(AudioMock, {
            blockType: 'GSBlock',
            wordMarkType: MARKS.TimedText,
            toJSON: true,
          }),
        },
        {
          isHTML: false,
        }
      );
      this.workSpace!.addDocument(documentT);
    }
  }

  public componentDidUpdate(
    prevProps: AudioTranscriptionProps,
    prevState: AudioTranscriptionState
  ) {
    if (prevState.playedSeconds !== this.state.playedSeconds) {
      const { playedSeconds: currentTime } = this.state;
      $(`span.timestamped-text`).each(function() {
        // if the word's parent is a coded-text inline
        // then we don't change the color, because inline
        // has its own style
        if (
          $(this)
            .parents('span.coded-text')
            .get(0)
        ) {
          return;
        }

        // otherwise, we change words' colors in three different
        // ways
        const startTimeStr = $(this).attr('data-start');
        if (startTimeStr === undefined) return;
        const startTime = parseFloat(startTimeStr);
        const color = calculateTextColor(currentTime, startTime);
        $(this).css('color', color);
      });
    }
  }

  public togglePlayer = () => {
    if (!this.player) return;
    this.player.togglePlay();
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

  public onPlayBackProgress = ({
    playedSeconds,
  }: {
    playedSeconds: number;
  }) => {
    this.setState({ playedSeconds });
  };

  public onAllowCoding = (checked: boolean) =>
    this.setState({ allowCoding: checked });

  public onDownloadTranscript = () => {
    if (this.document) {
      export2Word({
        element: $('div.slate-editor')[0],
        docName: 'Transcript',
      });
    }
  };

  get workSpace() {
    const workSpaceID = this.props.match.params.wsID;
    return this.props.rootStore.workSpaceStore.workSpaceBy(workSpaceID);
  }

  get document() {
    if (!this.workSpace) return null;
    return this.workSpace.documentList.filter(
      doc => doc.name === 'transcribe'
    )[0];
  }

  get codeList() {
    if (this.workSpace && this.workSpace.codeBook) {
      return this.workSpace.codeBook.codeList;
    }
    return [];
  }

  public changeAudioProgress = (playedSeconds: number) => {
    this.setState({ playedSeconds });
    this.player.seekTo(playedSeconds);
  };

  public render(): JSX.Element | null {
    const { playedSeconds, allowCoding } = this.state;

    return (
      <TimeStampContextProvider
        value={{
          changeAudioProgress: this.changeAudioProgress,
          currentTime: playedSeconds,
        }}
      >
        <React.Fragment>
          <Helmet>
            <title>WorkSpace - transcription</title>
          </Helmet>

          <ToolBarContainer>
            <AudioPlayer
              url="https://storage.googleapis.com/speech-file-store/Kornguth4_MS.mp3"
              playerRef={player => (this.player = player)}
              containerStyle={{ marginBottom: '0.5rem' }}
              onProgress={this.onPlayBackProgress}
            />
            <SwitchContainer>
              <Switch
                unCheckedChildren="Allow Coding"
                checkedChildren="Disable Coding"
                onChange={this.onAllowCoding}
                checked={allowCoding}
              />
              <Button onClick={this.onDownloadTranscript}>
                Download Transcript
              </Button>
            </SwitchContainer>
          </ToolBarContainer>
          <WorkStation
            codeList={this.codeList}
            onCreateCode={this.onCreateCode}
            onDeleteCode={this.onDeleteCode}
            onUpdateEditorContent={this.onUpdateEditorContent}
            editorState={
              this.document &&
              SlateValue.fromJSON(this.document.editorContentState)
            }
            plugins={this.plugins}
            allowCoding={allowCoding}
          />
        </React.Fragment>
      </TimeStampContextProvider>
    );
  }
}
