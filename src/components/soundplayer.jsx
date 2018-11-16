import React from 'react';
import Sound from 'react-sound';
import styled from 'styled-components';

// it's just an alias for `withSoundCloudAudio` but makes code clearer
import { withCustomAudio } from 'react-soundplayer/addons';

import { Colors } from '~/themes';

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

export default props => (
  <Container>
    <Sound {...props} playStatus={Sound.status.PLAYING} />
  </Container>
);
