import {Layout, Menu} from 'antd'
import * as React from 'react'
import styled from 'styled-components'

import Icon from '../icon'

const {Header: AntHeader} = Layout

const CustomHeader = styled(AntHeader)`
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
`

const CustomMenu = styled(Menu)`
  line-height: 64px;
`

const CustomIcon = styled(Icon)`
  float: left;
  margin-right: 50px;
`

interface IHeaderProps {
  items: Array<{key: string; title: string}>
}

class Header extends React.PureComponent<IHeaderProps> {
  public render(): JSX.Element {
    const {items} = this.props
    return (
      <CustomHeader>
        <CustomIcon />
        <CustomMenu theme="dark" mode="horizontal" style={{lineHeight: '64px'}}>
          {items.map(({key, title}) => <Menu.Item key={key}>{title}</Menu.Item>)}
        </CustomMenu>
      </CustomHeader>
    )
  }
}

export default Header
