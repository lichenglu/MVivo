import * as React from 'react'
import styled from 'styled-components'

interface IconProps {
  size?: number
  onClick?: () => void
}

const Container = styled.div`
  width: ${(props: IconProps) => props.size || 50}px;
  height: ${(props: IconProps) => props.size || 50}px;
  border-radius: 50%;
  background-color: #f06d50;
  margin: 0;
  display: flex;
  color: #fff;
  text-align: center;
  line-height: ${(props: IconProps) => props.size || 50}px;
  & > i {
    width: 100%;
  }
`

export default (props: IconProps) => (
  <Container {...props}>
    <i>MVivo</i>
  </Container>
)
