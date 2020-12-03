// Libraries
import React from "react";
import { Modal } from 'antd';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// images
import logo from '../assets/img/logo.svg';
import lock from '../assets/img/lock.png';
import unlock from '../assets/img/unlock.png';
import onestep from '../assets/img/onestep.png';


export default class Header extends React.Component {
    theme = createMuiTheme({
        palette: {
            primary: { main: 'rgba(1, 215, 179, 1)' },
            secondary: { main: 'rgba(56, 132, 255, 1)' }
        },
        typography: {
            useNextVariants: true,
        },
    });

    constructor(props) {
        super(props);
        this.Web3 = window.web3;

        this.state = {
            showMintage: this.props.status.showOnestep,
            maxInputNum: ''
        };
    }


    exMintage() {
        if (!this.props.status.isConnected) {
            return false;
        }
        this.getMaxNumToGenerateOnestep();
        this.props.showOnestwpFn();
        this.setState({
            maxInputNum: '',
            toUsedDAI: '',
            toUsedPAX: '',
            toUsedTUSD: '',
            toUsedUSDC: '',
        });
        // this.oneStepMintage('');
        // this.setState({
        //     ...this.state,
        //     showMintage: !this.state.showMintage
        // })
    }
    onClose = () => {
        this.props.closeOnestwpFn();
        // this.setState({
        //     ...this.state,
        //     showMintage: !this.state.showMintage
        // });
    };

    DisconnectMetamask() {
        this.props.DisconnectMetamask();
    }
    connectMetamask() {
        this.props.connectMetamask();
    }
    approve(token) {
        this.props.approve(token);
    }
    lock(token) {
        this.props.lock(token);
    }
    allocateTo(token) {
        this.props.allocateTo(token);
    }
    getMaxNumToGenerateOnestep() {
        this.props.getMaxNumToGenerateOnestep();
    }
    toGenerateMax() {
        this.props.toGenerateMax(this.Web3.toBigNumber(this.state.maxInputNum));
        // console.log(this.Web3.toBigNumber(this.state.maxInputNum));
        // console.log(this.Web3.toBigNumber(this.state.maxInputNum).toString(10));
    }
    oneStepMintageMax() {
        if (!this.props.status.calcMaxMinting) {
            return;
        }
        this.setState({
            ...this.state,
            maxInputNum: this.Web3.toBigNumber(this.props.status.calcMaxMinting).div(10 ** 18)
        })
        this.oneStepMintage(this.Web3.toBigNumber(this.props.status.calcMaxMinting).div(10 ** 18));
    }
    oneStepMintage(val) {
        if (val.length > 15) {
            return;
        }
        var toUsedDAI = this.Web3.toBigNumber(val).mul(this.Web3.toBigNumber(this.props.status.sectionDAI)).div(this.props.status.tatolSection).toString(10);
        var toUsedPAX = this.Web3.toBigNumber(val).mul(this.Web3.toBigNumber(this.props.status.sectionPAX)).div(this.props.status.tatolSection).toString(10);
        var toUsedTUSD = this.Web3.toBigNumber(val).mul(this.Web3.toBigNumber(this.props.status.sectionTUSD)).div(this.props.status.tatolSection).toString(10);
        var toUsedUSDC = this.Web3.toBigNumber(val).mul(this.Web3.toBigNumber(this.props.status.sectionUSDC)).div(this.props.status.tatolSection).toString(10);

        this.setState({
            ...this.state,
            maxInputNum: val,
            toUsedDAI: toUsedDAI,
            toUsedPAX: toUsedPAX,
            toUsedTUSD: toUsedTUSD,
            toUsedUSDC: toUsedUSDC,
            toUsedDAIError: false,
            toUsedPAXError: false,
            toUsedTUSDError: false,
            toUsedUSDCError: false
        })

        // if (this.Web3.toBigNumber(toUsedDAI).sub(this.Web3.toBigNumber(this.props.status.myDAI)) > 0) {
        //     this.setState({
        //         ...this.state,
        //         maxInputNum: val,
        //         toUsedDAIError: true
        //     })
        // }
        // if (this.Web3.toBigNumber(toUsedPAX).sub(this.Web3.toBigNumber(this.props.status.myPAX)) > 0) {
        //     this.setState({
        //         ...this.state,
        //         maxInputNum: val,
        //         toUsedPAXError: true
        //     })
        // }
        // if (this.Web3.toBigNumber(toUsedTUSD).sub(this.Web3.toBigNumber(this.props.status.myTUSD)) > 0) {
        //     this.setState({
        //         ...this.state,
        //         maxInputNum: val,
        //         toUsedTUSDError: true
        //     })
        // }
        // if (this.Web3.toBigNumber(toUsedUSDC).sub(this.Web3.toBigNumber(this.props.status.myUSDC)) > 0) {
        //     this.setState({
        //         ...this.state,
        //         maxInputNum: val,
        //         toUsedUSDCError: true
        //     })
        // }
    }

    toThousands(str) {
        var num = str;
        var re = /\d{3}$/;
        var result = '';

        while (re.test(num)) {
            result = RegExp.lastMatch + result;
            if (num !== RegExp.lastMatch) {
                result = ',' + result;
                num = RegExp.leftContext;
            } else {
                num = '';
                break;
            }
        }
        if (num) { result = num + result; }
        return result;
    }


    render() {
        return (
            <MuiThemeProvider theme={this.theme}>
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
                                        {/* <span onClick={() => { this.allocateTo('DF') }} className="faucet" style={{ display: (this.props.status.netType === 'Main') ? 'none' : 'inline-block' }}>Faucet</span> */}
                                        <span className="balance">
                                            {this.props.status.myDF ? this.toThousands(this.props.status.myDF.split('.')[0]) : '0'}
                                            <i>{this.props.status.myDF ? '.' + this.props.status.myDF.split('.')[1] : '.00'}</i>
                                        </span>
                                    </td>
                                    <td>
                                        <span className="token">ETH</span>
                                        <span className="balance">
                                            {this.props.status.myETH ? this.toThousands(this.props.status.myETH.split('.')[0]) : '0'}
                                            <i>{this.props.status.myETH ? '.' + this.props.status.myETH.split('.')[1] : '.00'}</i>
                                        </span>
                                    </td>
                                    <td>
                                        <span className="token">USDx</span>
                                        <img style={{ display: this.props.status.approvedUSDx ? 'none' : 'inline-block' }} src={lock} alt="" onClick={() => { this.approve('USDx') }} />
                                        <img style={{ display: this.props.status.approvedUSDx ? 'inline-block' : 'none' }} src={unlock} alt="" onClick={() => { this.lock('USDx') }} />
                                        <span className="balance">
                                            {this.props.status.myUSDx ? this.toThousands(this.props.status.myUSDx.split('.')[0]) : '0'}
                                            <i>{this.props.status.myUSDx ? '.' + this.props.status.myUSDx.split('.')[1] : '.00'}</i>
                                        </span>
                                    </td>
                                    {/* <td>
                                        <span className="token">DAI</span>
                                        <img style={{ display: this.props.status.approvedDAI ? 'none' : 'inline-block' }} src={lock} alt="" onClick={() => { this.approve('DAI') }} />
                                        <img style={{ display: this.props.status.approvedDAI ? 'inline-block' : 'none' }} src={unlock} alt="" onClick={() => { this.lock('DAI') }} />
                                        <span onClick={() => { this.allocateTo('DAI') }} className="faucet" style={{ display: (this.props.status.netType === 'Main') ? 'none' : 'inline-block' }}>Faucet</span>
                                        <span className="balance">
                                            {this.props.status.myDAI ? this.toThousands(this.props.status.myDAI.split('.')[0]) : '0'}
                                            <i>{this.props.status.myDAI ? this.props.status.myDAI.split('.')[1] ? '.' + this.props.status.myDAI.split('.')[1] : '.00' : '.00'}</i>
                                        </span>
                                    </td> */}
                                    <td>
                                        <span className="token">PAX</span>
                                        <img style={{ display: this.props.status.approvedPAX ? 'none' : 'inline-block' }} src={lock} alt="" onClick={() => { this.approve('PAX') }} />
                                        <img style={{ display: this.props.status.approvedPAX ? 'inline-block' : 'none' }} src={unlock} alt="" onClick={() => { this.lock('PAX') }} />
                                        {/* <span onClick={() => { this.allocateTo('PAX') }} className="faucet" style={{ display: (this.props.status.netType === 'Main') ? 'none' : 'inline-block' }}>Faucet</span> */}
                                        <span className="balance">
                                            {this.props.status.myPAX ? this.toThousands(this.props.status.myPAX.split('.')[0]) : '0'}
                                            <i>{this.props.status.myPAX ? this.props.status.myPAX.split('.')[1] ? '.' + this.props.status.myPAX.split('.')[1] : '.00' : '.00'}</i>
                                        </span>
                                    </td>
                                    <td>
                                        <span className="token">TUSD</span>
                                        <img style={{ display: this.props.status.approvedTUSD ? 'none' : 'inline-block' }} src={lock} alt="" onClick={() => { this.approve('TUSD') }} />
                                        <img style={{ display: this.props.status.approvedTUSD ? 'inline-block' : 'none' }} src={unlock} alt="" onClick={() => { this.lock('TUSD') }} />
                                        {/* <span onClick={() => { this.allocateTo('TUSD') }} className="faucet" style={{ display: (this.props.status.netType === 'Main') ? 'none' : 'inline-block' }}>Faucet</span> */}
                                        <span className="balance">
                                            {this.props.status.myTUSD ? this.toThousands(this.props.status.myTUSD.split('.')[0]) : '0'}
                                            <i>{this.props.status.myTUSD ? this.props.status.myTUSD.split('.')[1] ? '.' + this.props.status.myTUSD.split('.')[1] : '.00' : '.00'}</i>
                                        </span>
                                    </td>
                                    <td className='noborder'>
                                        <span className="token">USDC</span>
                                        <img style={{ display: this.props.status.approvedUSDC ? 'none' : 'inline-block' }} src={lock} alt="" onClick={() => { this.approve('USDC') }} />
                                        <img style={{ display: this.props.status.approvedUSDC ? 'inline-block' : 'none' }} src={unlock} alt="" onClick={() => { this.lock('USDC') }} />
                                        {/* <span onClick={() => { this.allocateTo('USDC') }} className="faucet" style={{ display: (this.props.status.netType === 'Main') ? 'none' : 'inline-block' }}>Faucet</span> */}
                                        <span className="balance">
                                            {this.props.status.myUSDC ? this.toThousands(this.props.status.myUSDC.split('.')[0]) : '0'}
                                            <i>{this.props.status.myUSDC ? this.props.status.myUSDC.split('.')[1] ? '.' + this.props.status.myUSDC.split('.')[1] : '.00' : '.00'}</i>
                                        </span>
                                    </td>

                                    {/* <td className='noborder'>
                                        <div className="oneStep" onClick={() => { this.exMintage() }} style={{ color: this.props.status.isConnected ? 'rgba(1, 234, 160, 1)' : '#8b8f95' }}>
                                            <img className='onepic' src={onestep} alt="" />
                                            Mintage
                                        </div>
                                        <Modal
                                            closable={true}
                                            maskClosable={false}
                                            onCancel={this.onClose}
                                            visible={this.props.status.showOnestep}
                                            footer={null}
                                        >
                                            <div>
                                                <p>Max USDx available to generate: <span>{this.props.status.calcMaxMinting ? this.props.status.calcMaxMinting.div(10 ** 18).toString() : '0.00'}</span></p>
                                                <div className='flexBox'>
                                                    <input className='headerInput' type="number" onChange={(val) => { this.oneStepMintage(val.target.value) }} value={this.state.maxInputNum} />
                                                    <div className='maxBtn' onClick={() => { this.oneStepMintageMax() }}>Max</div>
                                                </div>
                                                <div className='geneBtn'>
                                                    <Button
                                                        onClick={() => { this.toGenerateMax() }}
                                                        variant="contained"
                                                        color="secondary"
                                                        // disabled={!this.state.toUsedDAIError && !this.state.toUsedPAXError && !this.state.toUsedTUSDError && !this.state.toUsedUSDCError && Number(this.state.maxInputNum) > 0 ? false : true}
                                                        disabled={Number(this.state.maxInputNum) > 0 && (this.props.status.calcMaxMinting.div(10 ** 18)).sub(Number(this.state.maxInputNum)) >= 0 && !this.props.status.isMintting ? false : true}
                                                        fullWidth={true}
                                                    >
                                                        GENERATE
                                                    </Button>
                                                </div>
                                                <p className='usedTitle'>Constituents to be used:</p>
                                                <div className='usedSection'>
                                                    <p className='usedP'>
                                                        DAI
                                                    <span style={{ color: this.state.toUsedDAI ? this.Web3.toBigNumber(this.state.maxInputNum).mul(this.Web3.toBigNumber(this.props.status.sectionDAI)).div(this.props.status.tatolSection).sub(this.Web3.toBigNumber(this.props.status.myDAI)) > 0 ? 'red' : '#9696a2' : '#9696a2' }}>{this.state.toUsedDAI ? this.state.toUsedDAI : '0.00'}</span>
                                                    </p>
                                                    <p className='usedP noRightM'>
                                                        PAX
                                                    <span style={{ color: this.state.toUsedPAX ? this.Web3.toBigNumber(this.state.maxInputNum).mul(this.Web3.toBigNumber(this.props.status.sectionPAX)).div(this.props.status.tatolSection).sub(this.Web3.toBigNumber(this.props.status.myPAX)) > 0 ? 'red' : '#9696a2' : '#9696a2' }}>{this.state.toUsedPAX ? this.state.toUsedPAX : '0.00'}</span>
                                                    </p>
                                                </div>
                                                <div className='usedSection'>
                                                    <p className='usedP'>
                                                        TUSD
                                                    <span style={{ color: this.state.toUsedTUSD ? this.Web3.toBigNumber(this.state.maxInputNum).mul(this.Web3.toBigNumber(this.props.status.sectionTUSD)).div(this.props.status.tatolSection).sub(this.Web3.toBigNumber(this.props.status.myTUSD)) > 0 ? 'red' : '#9696a2' : '#9696a2' }}>{this.state.toUsedTUSD ? this.state.toUsedTUSD : '0.00'}</span>
                                                    </p>
                                                    <p className='usedP noRightM'>
                                                        USDC
                                                    <span style={{ color: this.state.toUsedUSDC ? this.Web3.toBigNumber(this.state.maxInputNum).mul(this.Web3.toBigNumber(this.props.status.sectionUSDC)).div(this.props.status.tatolSection).sub(this.Web3.toBigNumber(this.props.status.myUSDC)) > 0 ? 'red' : '#9696a2' : '#9696a2' }}>{this.state.toUsedUSDC ? this.state.toUsedUSDC : '0.00'}</span>
                                                    </p>
                                                </div>
                                                <div className="clear"></div>
                                            </div>
                                        </Modal>
                                    </td> */}

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
            </MuiThemeProvider>
        )
    }
}



