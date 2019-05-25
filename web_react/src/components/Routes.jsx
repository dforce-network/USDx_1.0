// Libraries
import React from "react";

import { Route, Switch } from "react-router-dom";

// Components
import Help from "./Help";
// import NotFound from "./NotFound";
import Home from './Home'


class App extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/help" title="CDP Portal: Help" component={Help} />
                <Route component={Home} />
            </Switch>
        )
    }
}

export default App;
