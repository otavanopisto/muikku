import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Switch, BrowserRouter, Route } from 'react-router-dom';

import Front from "~/containers/index.frontpage";

//ReactDOM.render(<App />, document.getElementById('app'));

class Page extends React.Component {
  render() {
    return <div>Page #1</div>
  }
}

class Page2 extends React.Component {
  render() {
    return <div>Page #2</div>
  }
}

/*
  Front fails to initialize
*/

ReactDOM.render(
    <BrowserRouter>
      <div>
          <Route exact path="/" component={Page} />
          <Route path="/test" component={Page2} />

          <Route path="/front" component={Front} />
      </div>
    </BrowserRouter>, document.getElementById('app'));
