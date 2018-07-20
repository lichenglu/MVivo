import {Button} from 'antd'
import * as React from 'react'
import {Helmet} from 'react-helmet'

class Home extends React.PureComponent {
  public render(): JSX.Element {
    return (
      <div>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <Button>Hello World</Button>
      </div>
    )
  }
}

export default Home
