import * as React from "react";
import * as ReactDOM from "react-dom";
import { Switch, BrowserRouter, Route } from "react-router-dom";

import { renderFront } from "./prep_frontpage";
import { renderMainFunction } from "./prep_mainfunction";
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

ReactDOM.render(
  <BrowserRouter basename="/">
    <div>
      <Route exact path="/" render={renderFront} />

      <Route path="/organization" render={renderMainFunction} />
      <Route path="/coursepicker" render={renderMainFunction} />
      <Route path="/communicator" render={renderMainFunction} />
      <Route path="/discussion" render={renderMainFunction} />
      <Route path="/announcements" render={renderMainFunction} />
      <Route path="/announcer" render={renderMainFunction} />
      <Route path="/guider" render={renderMainFunction} />
      <Route path="/profile" render={renderMainFunction} />
      <Route path="/records" render={renderMainFunction} />
      <Route path="/evaluation" render={renderMainFunction} />
      <Route path="/ceepos/pay" render={renderMainFunction} />
      <Route path="/ceepos/done" render={renderMainFunction} />

      <Route path="/workspace/*" render={renderWorkspaces} />
    </div>
  </BrowserRouter>,
  document.getElementById("app")
);
