import { Icon, message } from 'antd';
import React from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import styled from 'styled-components';

import { Colors } from '~/themes';

import { Duration } from './duration';
import { Progress } from './progress';

const Container = styled.div`
  height: auto;
  width: 25rem;
  padding: 12px 8px;
//   box-shadow: 0px 1px 1px 1px ${Colors.shadowGray};
  border: solid 1px ${Colors.borderGray.toString()};
  border-radius: 2%;
  display: flex;
  flex-direction: column;
`;

const ControlContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const DurationContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 0.5rem;
`;

const StyledPlayer = styled(ReactPlayer)``;

const ControlBtn = styled(Icon)`
  color: ${Colors.surfGreenDark.toString()};
  font-size: 2rem;
  transition: 0.35s;
  cursor: pointer;
  margin-right: 0.5rem;
  &:hover {
    color: ${Colors.surfGreenDark.darken(0.2).toString()};
  }
`;

const StyledProgress = styled(Progress)`
  flex: 1;
`;

interface AudioPlayerProps extends ReactPlayerProps {
  containerStyle: object;
  playerRef?: (instance: ReactPlayer) => void;
}

interface AudioPlayerState {
  ready: boolean;
  playing: boolean;
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
  duration: number;
}

export class AudioPlayer extends React.PureComponent<
  AudioPlayerProps,
  AudioPlayerState
> {
  public state: AudioPlayerState = {
    ready: false,
    playing: false,
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
    duration: 0,
  };

  private player: ReactPlayer | null;

  public componentDidMount() {
    const { url } = this.props;
    if (!url) {
      message.error('Audio URL missing. URL is required for audio player!');
      return;
    }
    if (Array.isArray(url)) {
      return;
    }
    if (!ReactPlayer.canPlay(url)) {
      message.error(
        'Bad audio URL. Make sure this URL can be accessed publicly and can be played'
      );
    }
  }

  public togglePlay = () => this.setState({ playing: !this.state.playing });

  public onProgress = (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    const { played, playedSeconds, loaded, loadedSeconds } = state;
    const { onProgress } = this.props;

    this.setState({ played, playedSeconds, loaded, loadedSeconds });
    if (onProgress) onProgress(state);
  };

  public onSeekTrack = (xPos: number) => {
    const { duration } = this.state;
    if (this.player) {
      this.player.seekTo(duration * xPos);
    }
  };

  public render() {
    const { playing, playedSeconds, duration, ready } = this.state;
    const { playerRef, containerStyle } = this.props;

    return (
      <Container style={containerStyle}>
        <StyledPlayer
          width="100%"
          height="100%"
          progressInterval={200}
          {...this.props}
          playing={playing}
          onReady={() => this.setState({ ready: true })}
          onProgress={this.onProgress}
          onDuration={(totalDuration: number) =>
            this.setState({ duration: totalDuration })
          }
          ref={(player: ReactPlayer) => {
            this.player = player;
            if (playerRef) playerRef(player);
          }}
        />
        <ControlContainer>
          <ControlBtn
            onClick={this.togglePlay}
            type={playing ? 'pause-circle' : 'right-circle'}
            theme="filled"
          />
          <StyledProgress
            currentTime={playedSeconds}
            duration={duration}
            onSeekTrack={this.onSeekTrack}
          />
        </ControlContainer>
        <DurationContainer>
          <Duration seconds={playedSeconds} />
          <span style={{ margin: '0 0.3rem' }}>{'|'}</span>
          <Duration seconds={duration} />
        </DurationContainer>
      </Container>
    );
  }
}
