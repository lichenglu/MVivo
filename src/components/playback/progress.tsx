import React, { PureComponent } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #ddd;
  width: 100%;
  height: 0.5rem;
  overflow: hidden;
  cursor: pointer;
`;

const ProgressBar = styled.div`
  background-color: #fc561e;
  height: 100%;
  transition: width 0.2s ease-in;
`;

interface ProgressProps {
  onSeekTrack: (xPos: number, e: React.MouseEvent<HTMLDivElement>) => void;
  value?: number;
  duration: number;
  currentTime: number;
  innerStyle?: object;
  style?: object;
}

export class Progress extends PureComponent<ProgressProps> {
  public handleSeekTrack = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onSeekTrack } = this.props;
    const xPos =
      (e.pageX - e.currentTarget.getBoundingClientRect().left) /
      e.currentTarget.offsetWidth;

    onSeekTrack && onSeekTrack.call(this, xPos, e);
  };

  public render() {
    const { style, currentTime, duration } = this.props;
    let { value = 0, innerStyle } = this.props;

    if (!value && currentTime && duration) {
      value = (currentTime / duration) * 100 || 0;
    }

    if (value < 0) {
      value = 0;
    }

    if (value > 100) {
      value = 100;
    }

    if (!innerStyle) {
      innerStyle = {};
    }

    innerStyle = Object.assign({}, innerStyle, { width: `${value}%` });

    return (
      <Container style={style} onClick={this.handleSeekTrack}>
        <ProgressBar style={innerStyle} />
      </Container>
    );
  }
}
