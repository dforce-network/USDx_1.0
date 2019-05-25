// Libraries
import React from 'react';
// images
import logo from '../assets/img/logo.png';

export default class Welcome extends React.Component {
    connectMetamask() {
        this.props.connectMetamask();
    }

    render() {
        return (
            <div className="welcome" style={{display: this.props.ifShow? 'none' : 'block'}}>
                <div className="box">
                    <div className="welcomeLogo"><img src={logo} alt=""/></div>
                    <h1>One Stablecoin For All</h1>
                    <p>
                        <span>USDx = $USD and Better </span>
                        USDx is the world’s <br/> first synthetic indexed stablecoinwith robust stability <br/> scalability and fungibility.
                    </p>
                    <div className="button" onClick={()=>{this.connectMetamask()}}>MetaMask</div>
                    <div className="intro">Connect to MetaMask</div>
                </div>
            </div>
        )
    }
}
