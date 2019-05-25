// Libraries
import React from "react";
// images
import logo from '../assets/img/logo.png';
import lock from '../assets/img/lock.png';
import unlock from '../assets/img/unlock.png';


export default class Header extends React.Component {
    DisconnectMetamask () {
        this.props.DisconnectMetamask();
    }
    connectMetamask () {
        this.props.connectMetamask();
    }
    approve (token) {
        this.props.approve(token);
    }
    lock (token) {
        this.props.lock(token);
    }


    render() {
        return (
            <div className="headerWrap">
                <div className="myHeader">
                    <div className="logo"><img src={logo} alt="" /></div>
                    <table className="balanceTable">
                        <tbody>
                            <tr>
                                <td>
                                    <span className="token">DF</span>
                                    <img style={{ display: this.props.status.approvedDF ? 'none' : 'inline-block' }} src={lock} alt="" onClick={() => { this.approve('DF') }} />
                                    <img style={{ display: this.props.status.approvedDF ? 'inline-block' : 'none' }} src={unlock} alt="" onClick={() => { this.lock('DF') }} />
                                    <span className="balance">{this.props.status.myDF ? this.props.status.myDF : '0.0'}</span>
                                </td>
                                <td>
                                    <span className="token">ETH</span>
                                    <span className="balance">{this.props.status.myETH ? this.props.status.myETH : '0.0'}</span>
                                </td>
                                <td>
                                    <span className="token">USDx</span>
                                    <img style={{ display: this.props.status.approvedUSDx ? 'none' : 'inline-block' }} src={lock} alt="" onClick={() => { this.approve('USDx') }} />
                                    <img style={{ display: this.props.status.approvedUSDx ? 'inline-block' : 'none' }} src={unlock} alt="" onClick={() => { this.lock('USDx') }} />
                                    <span className="balance">{this.props.status.myUSDx ? this.props.status.myUSDx : '0.0'}</span>
                                </td>
                                <td>
                                    <span className="token">DAI</span>
                                    <img style={{ display: this.props.status.approvedDAI ? 'none' : 'inline-block' }} src={lock} alt="" onClick={() => { this.approve('DAI') }} />
                                    <img style={{ display: this.props.status.approvedDAI ? 'inline-block' : 'none' }} src={unlock} alt="" onClick={() => { this.lock('DAI') }} />
                                    <span className="balance">{this.props.status.myDAI ? this.props.status.myDAI : '0.0'}</span>
                                </td>
                                <td>
                                    <span className="token">PAX</span>
                                    <img style={{ display: this.props.status.approvedPAX ? 'none' : 'inline-block' }} src={lock} alt="" onClick={() => { this.approve('PAX') }} />
                                    <img style={{ display: this.props.status.approvedPAX ? 'inline-block' : 'none' }} src={unlock} alt="" onClick={() => { this.lock('PAX') }} />
                                    <span className="balance">{this.props.status.myPAX ? this.props.status.myPAX : '0.0'}</span>
                                </td>
                                <td>
                                    <span className="token">USDC</span>
                                    <img style={{ display: this.props.status.approvedUSDC ? 'none' : 'inline-block' }} src={lock} alt="" onClick={() => { this.approve('USDC') }} />
                                    <img style={{ display: this.props.status.approvedUSDC ? 'inline-block' : 'none' }} src={unlock} alt="" onClick={() => { this.lock('USDC') }} />
                                    <span className="balance">{this.props.status.myUSDC ? this.props.status.myUSDC : '0.0'}</span>
                                </td>
                                <td className='noborder'>
                                    <span className="token">TUSD</span>
                                    <img style={{ display: this.props.status.approvedTUSD ? 'none' : 'inline-block' }} src={lock} alt="" onClick={() => { this.approve('TUSD') }} />
                                    <img style={{ display: this.props.status.approvedTUSD ? 'inline-block' : 'none' }} src={unlock} alt="" onClick={() => { this.lock('TUSD') }} />
                                    <span className="balance">{this.props.status.myTUSD ? this.props.status.myTUSD : '0.0'}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div className="status">
                        <p className="title">
                            <span className="netdot" style={{ background: this.props.status.netTypeColor ? this.props.status.netTypeColor : '#fff' }}></span>
                            <span className="nettype">
                                {this.props.status.netType ? this.props.status.netType : 'Disconnect'}
                            </span>
                        </p>
                        <div className="logoin">
                            {this.props.status.isConnected ? this.props.status.accountAddress.substring(0, 8) + '...' + this.props.status.accountAddress.substring(this.props.status.accountAddress.length - 6) : 'Connect to MetaMask'}
                            <div className="popup">
                                <span><em></em></span>
                                <p style={{ display: this.props.status.isConnected ? 'none' : 'block' }} onClick={() => { this.connectMetamask() }}>Login</p>
                                <p className="out" style={{ display: this.props.status.isConnected ? 'block' : 'none' }} onClick={() => { this.DisconnectMetamask() }}>Logout</p>
                            </div>
                        </div>
                    </div>

                    <div className="dfPrice">
                        <p>
                            <span className='dftoken'>DF/USD</span>
                            <span className='dftokenPrice'>250.11</span>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}



