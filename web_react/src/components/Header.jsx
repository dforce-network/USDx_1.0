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
    allocateTo (token) {
        this.props.allocateTo(token);
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
                                    <span onClick={() => { this.allocateTo('DF')}} className="faucet">Faucet</span>
                                    <span className="balance">
                                        {this.props.status.myDF ? this.props.status.myDF.split('.')[0] : '0'}
                                        <i>{this.props.status.myDF ? '.' + this.props.status.myDF.split('.')[1] : '.00'}</i>
                                    </span>
                                </td>
                                <td>
                                    <span className="token">ETH</span>
                                    <span className="balance">
                                        {this.props.status.myETH ? this.props.status.myETH.split('.')[0] : '0'}
                                        <i>{this.props.status.myETH ? '.' + this.props.status.myETH.split('.')[1] : '.00'}</i>
                                    </span>
                                </td>
                                <td>
                                    <span className="token">USDx</span>
                                    <img style={{ display: this.props.status.approvedUSDx ? 'none' : 'inline-block' }} src={lock} alt="" onClick={() => { this.approve('USDx') }} />
                                    <img style={{ display: this.props.status.approvedUSDx ? 'inline-block' : 'none' }} src={unlock} alt="" onClick={() => { this.lock('USDx') }} />
                                    <span className="balance">
                                        {this.props.status.myUSDx ? this.props.status.myUSDx.split('.')[0] : '0'}
                                        <i>{this.props.status.myUSDx ? '.' + this.props.status.myUSDx.split('.')[1] : '.00'}</i>
                                    </span>
                                </td>
                                <td>
                                    <span className="token">DAI</span>
                                    <img style={{ display: this.props.status.approvedDAI ? 'none' : 'inline-block' }} src={lock} alt="" onClick={() => { this.approve('DAI') }} />
                                    <img style={{ display: this.props.status.approvedDAI ? 'inline-block' : 'none' }} src={unlock} alt="" onClick={() => { this.lock('DAI') }} />
                                    <span onClick={() => { this.allocateTo('DAI')}} className="faucet">Faucet</span>
                                    <span className="balance">
                                        {this.props.status.myDAI ? this.props.status.myDAI.split('.')[0] : '0'}
                                        <i>{this.props.status.myDAI ? this.props.status.myDAI.split('.')[1]?'.' + this.props.status.myDAI.split('.')[1]:'.00' : '.00'}</i>
                                    </span>
                                </td>
                                <td>
                                    <span className="token">PAX</span>
                                    <img style={{ display: this.props.status.approvedPAX ? 'none' : 'inline-block' }} src={lock} alt="" onClick={() => { this.approve('PAX') }} />
                                    <img style={{ display: this.props.status.approvedPAX ? 'inline-block' : 'none' }} src={unlock} alt="" onClick={() => { this.lock('PAX') }} />
                                    <span onClick={() => { this.allocateTo('PAX')}} className="faucet">Faucet</span>
                                    <span className="balance">
                                        {this.props.status.myPAX ? this.props.status.myPAX.split('.')[0] : '0'}
                                        <i>{this.props.status.myPAX ? this.props.status.myPAX.split('.')[1]?'.' + this.props.status.myPAX.split('.')[1]:'.00' : '.00'}</i>
                                    </span>
                                </td>
                                <td>
                                    <span className="token">TUSD</span>
                                    <img style={{ display: this.props.status.approvedTUSD ? 'none' : 'inline-block' }} src={lock} alt="" onClick={() => { this.approve('TUSD') }} />
                                    <img style={{ display: this.props.status.approvedTUSD ? 'inline-block' : 'none' }} src={unlock} alt="" onClick={() => { this.lock('TUSD') }} />
                                    <span onClick={() => { this.allocateTo('TUSD')}} className="faucet">Faucet</span>
                                    <span className="balance">
                                        {this.props.status.myTUSD ? this.props.status.myTUSD.split('.')[0] : '0'}
                                        <i>{this.props.status.myTUSD ? this.props.status.myTUSD.split('.')[1]?'.' + this.props.status.myTUSD.split('.')[1]:'.00' : '.00'}</i>
                                    </span>
                                </td>
                                <td className='noborder'>
                                    <span className="token">USDC</span>
                                    <img style={{ display: this.props.status.approvedUSDC ? 'none' : 'inline-block' }} src={lock} alt="" onClick={() => { this.approve('USDC') }} />
                                    <img style={{ display: this.props.status.approvedUSDC ? 'inline-block' : 'none' }} src={unlock} alt="" onClick={() => { this.lock('USDC') }} />
                                    <span onClick={() => { this.allocateTo('USDC')}} className="faucet">Faucet</span>
                                    <span className="balance">
                                        {this.props.status.myUSDC ? this.props.status.myUSDC.split('.')[0] : '0'}
                                        <i>{this.props.status.myUSDC ? this.props.status.myUSDC.split('.')[1]?'.' + this.props.status.myUSDC.split('.')[1]:'.00' : '.00'}</i>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div className="status">
                        <p className="title">
                            <span className="netdot" style={{ background: this.props.status.netTypeColor ? this.props.status.netTypeColor : '#fff' }}></span>
                            <span className="nettype">
                                {this.props.status.isConnected ? this.props.status.netType : 'Unconnect'}
                            </span>
                        </p>
                        <div className="logoin">
                            {this.props.status.isConnected ? this.props.status.accountAddress.substring(0, 8) + '...' + this.props.status.accountAddress.substring(this.props.status.accountAddress.length - 6) : 'Connect to MetaMask'}
                            <div className="popup">
                                <span><em></em></span>
                                <p style={{ display: this.props.status.isConnected ? 'none' : 'block' }} onClick={() => { this.connectMetamask() }}>Connect</p>
                                <p className="out" style={{ display: this.props.status.isConnected ? 'block' : 'none' }} onClick={() => { this.DisconnectMetamask() }}>Logout</p>
                            </div>
                        </div>
                    </div>

                    <div className="dfPrice">
                        <p>
                            <span className='dftoken'>DF/USD</span>
                            <span className='dftokenPrice'>
                                {this.props.status.dfPrice ? this.props.status.dfPrice : '0.00'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}



