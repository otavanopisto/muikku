import * as React from "react";
import * as ReactDOM from "react-dom";
import { Switch, BrowserRouter, Route } from "react-router-dom";

import { prepareApp } from "~/run";

import Front from "~/containers/index.frontpage";
import { Action } from "redux";
import reducer from "~/reducers/index.frontpage";
import { loadLocale } from "~/actions/base/locales";
import tabOrMouse from "~/util/tab-or-mouse";

import { renderWorkspaces } from "~/entries/prep_workspace";

class Page extends React.Component {
  render() {
    return <div>Page #1</div>;
  }
}

class Page2 extends React.Component {
  render() {
    return <div>Page #2</div>;
  }
}

function renderFront() {
  return prepareApp(reducer, Front, async (store) => {
    // For user that are not logged in, we need to load the locale
    // data
    store.dispatch(loadLocale() as Action);
    // hack to remove the session if it still exists, this might
    // happen if the user session expired and he got to the homepage
    // but the chat was still active
    tabOrMouse();
    window.sessionStorage.removeItem("strophe-bosh-session");
  });
}

/*
  Front fails to initialize
*/

ReactDOM.render(
  <BrowserRouter basename="/">
    <div>
      <Route exact path="/" component={Page} />
      <Route path="/test" component={Page2} />

      <Route path="/front" render={renderFront} />
      <Route path="/workspace/*" render={renderWorkspaces} />
    </div>
  </BrowserRouter>,
  document.getElementById("app")
);
