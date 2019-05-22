import { Provider } from 'mobx-react';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import App from '~/App';
import { RootStore, setupRootStore } from '~/stores';
import registerServiceWorker from './registerServiceWorker';

import 'normalize.css';

interface RootComponentState {
  rootStore?: RootStore;
}

export class RootComponent extends React.PureComponent<{}, RootComponentState> {
  public async componentDidMount() {
    this.setState({
      rootStore: await setupRootStore(),
    });
  }

  public render() {
    const rootStore = this.state && this.state.rootStore;
    // Before we show the app, we have to wait for out state to be ready.
    // In the meantime, don't render anything. This will be the background
    // color set in native by rootView's background color.
    //
    // This step should be completely covered over by the splash screen though.
    //
    // You're welcome to swap in your own component to render if your boot up
    // sequence is too slow though.
    if (!rootStore) {
      return null;
    }

    // otherwise, we're ready to render the app
    // --- am: begin list of stores ---
    const otherStores = {};
    // --- am: end list of stores ---
    return (
      <Router>
        <Provider rootStore={rootStore} {...otherStores}>
          <App />
        </Provider>
      </Router>
    );
  }
}

ReactDOM.render(<RootComponent />, document.getElementById(
  'root'
) as HTMLElement);

registerServiceWorker();
