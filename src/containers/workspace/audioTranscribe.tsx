import $ from 'jquery';
import { inject, observer } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import React from 'react';
import { Helmet } from 'react-helmet';
import ReactPlayer from 'react-player';
import { Value as SlateValue } from 'slate';

import { CodeModel, RootStore } from '~/stores/root-store';

import AudioMock from '~/fixtures/google_output.json';
import { deserialize } from '~/lib/slate-plugins/google-speech-text-serializer';

// components
import { AudioPlayer } from '~/components/playback/audioPlayer';
import { WorkStation } from './components/workStation';

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
}

// TODO:
// 1. Asked to upload text file if not available
// 2. Add more text file, unlink text file
// 3. Link/unlink more code book
// 4. Update workSpace info
@inject('rootStore')
@observer
export class AudioTranscriptionContainer extends React.Component<
  AudioTranscriptionProps,
  AudioTranscriptionState
> {
  public state = {
    manualInputDocument: false,
    playedSeconds: 0,
  };

  public plugins = [TimedText({ type: MARKS.TimedText })];

  public player: ReactPlayer;

  public componentDidUpdate(
    prevProps: AudioTranscriptionProps,
    prevState: AudioTranscriptionState
  ) {
    if (prevState.playedSeconds !== this.state.playedSeconds) {
      const { playedSeconds: currentTime } = this.state;
      $(`span.timestamped-text`).each(function() {
        const startTimeStr = $(this).attr('data-start');
        if (startTimeStr === undefined) return;
        const startTime = parseFloat(startTimeStr);
        const color = calculateTextColor(currentTime, startTime);
        $(this).css('color', color);
      });
    }
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

  public onPlayBackProgress = ({
    playedSeconds,
  }: {
    playedSeconds: number;
  }) => {
    this.setState({ playedSeconds });
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

  public changeAudioProgress = (playedSeconds: number) => {
    this.setState({ playedSeconds });
    this.player.seekTo(playedSeconds);
  };

  public render(): JSX.Element | null {
    const { playedSeconds } = this.state;

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
          <AudioPlayer
            url="https://storage.googleapis.com/speech-file-store/Kornguth4_MS.mp3"
            playerRef={player => (this.player = player)}
            containerStyle={{ marginBottom: '0.5rem' }}
            onProgress={this.onPlayBackProgress}
          />
          <WorkStation
            codeList={this.codeList}
            onCreateCode={this.onCreateCode}
            onDeleteCode={this.onDeleteCode}
            onUpdateEditorContent={this.onUpdateEditorContent}
            editorState={deserialize(AudioMock, {
              blockType: 'GSBlock',
              wordMarkType: MARKS.TimedText,
            })}
            plugins={this.plugins}
          />
        </React.Fragment>
      </TimeStampContextProvider>
    );
  }
}
