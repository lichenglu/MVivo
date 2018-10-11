import styled from 'styled-components';

export const ColorGrid = styled.div<{ bgColor: string }>`
  width: 1rem;
  height: 1rem;
  border-radius: 5px;
  margin-right: 6px;
  background-color: ${({ bgColor }) => bgColor};
`;
