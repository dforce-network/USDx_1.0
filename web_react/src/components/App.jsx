// Libraries
import React from 'react';
import {Provider} from "mobx-react";
import {BrowserRouter} from "react-router-dom";

// Styles
import '../scss/style.scss';

// Components
import Routes from './Routes';
// import Notify from './Notify';

// Stores
import rootStore from '../stores/Root';

// Convenient console access
window.transactions = rootStore.transactions;


class App extends React.Component {
    render() {
        return (
            <Provider>
                <BrowserRouter>
                    <React.Fragment>
                        <Routes />
                        
                        {/* <Notify /> */}
                    </React.Fragment>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default App;





