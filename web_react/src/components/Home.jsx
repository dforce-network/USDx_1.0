// Libraries
import React from 'react';
import DocuentTitle from 'react-document-title';
import Cookie from 'react-cookies';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import 'antd/dist/antd.css';
import { Tooltip, Progress, Select, Drawer } from 'antd';

// abis
import abiTokens from '../abi/abiTokens';
import abiUSDx from '../abi/abiUSDx';
import abiProtocol from '../abi/abiProtocol';
import abiProtocolView from '../abi/abiProtocolView';

// address map
import addressMap from '../abi/addressMap'

// components
import Notify from './Notify';
import Header from './Header';
import BodyLeft from './BodyLeft';
import History from './History';

// images
import doubt from '../assets/img/doubt.png';
import exchangeTo from '../assets/img/exchangeTo.png';
import exchangeBack from '../assets/img/exchangeBack.png';
import warningtips from '../assets/img/warningtips.png';
import right_net from '../assets/img/right_net.png';
import error_net from '../assets/img/error_net.png';
import dai from '../assets/img/dai.png';
import pax from '../assets/img/pax.png';
import tusd from '../assets/img/tusd.png';
import usdc from '../assets/img/usdc.png';
import meun from '../assets/img/meun.png';
import close_mobile from '../assets/img/close_mobile.png';
import faq_icon from '../assets/img/icon-FAQ.svg';

import Twitter from '../assets/img/twitter.svg';
import Telegram from '../assets/img/telegram.svg';
import Medium from '../assets/img/medium.svg';
import Reddit from '../assets/img/Reddit.svg';
import Discord from '../assets/img/Discord.svg';
import LinkedIn from '../assets/img/LinkedIn.svg';
import Youtube from '../assets/img/Youtube.svg';

export default class Home extends React.Component {
    units = 10 ** 18;
    tatolSection = 0;
    tatolSectionBurning = 0;
    gasFee = 3000000;
    faucetNum = 10000;
    gasRatio = 1.3;

    theme = createMuiTheme({
        palette: {
            primary: { main: 'rgba(1, 215, 179, 1)' },
            secondary: { main: 'rgba(56, 132, 255, 1)' }
        },
        typography: {
            useNextVariants: true,
        },
    });

    showDrawer = () => {
        this.setState({
            visible: !this.state.visible,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    toThousandsbodyleft(str) {
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

    constructor(props) {
        super(props);
        this.state = {
            transcations: {},
            toDeposit: 'PAX',
            toDepositNum: '',
            toWithdraw: 'PAX',
            toWithdrawNum: '',
            toDestroyNum: '',
            tab1: true,
            netType: 'Main',
            myHistory: [],
            gasPrice: 0,
            claimDAI: '0.00',
            claimPAX: '0.00',
            claimTUSD: '0.00',
            claimUSDC: '0.00',
            DAIonPool: '0.00',
            PAXonPool: '0.00',
            TUSDonPool: '0.00',
            USDConPool: '0.00'
        }
        if (window.web3) {
            this.Web3 = window.web3;

            this.Web3.version.getNetwork((err, net) => {
                console.log(net);
                this.addressDAI = addressMap[net]['addressDAI'];
                this.addressPAX = addressMap[net]['addressPAX'];
                this.addressTUSD = addressMap[net]['addressTUSD'];
                this.addressUSDC = addressMap[net]['addressUSDC'];
                this.addressDF = addressMap[net]['addressDF'];
                this.addressUSDx = addressMap[net]['addressUSDx'];
                this.addressProtocol = addressMap[net]['addressProtocol'];
                this.addressProtocolView = addressMap[net]['addressProtocolView'];
                this.addressEngine = addressMap[net]['addressEngine'];
                this.addressPool = addressMap[net]['addressPool'];


                this.contractDAI = this.Web3.eth.contract(abiTokens).at(this.addressDAI);
                this.contractPAX = this.Web3.eth.contract(abiTokens).at(this.addressPAX);
                this.contractTUSD = this.Web3.eth.contract(abiTokens).at(this.addressTUSD);
                this.contractUSDC = this.Web3.eth.contract(abiTokens).at(this.addressUSDC);

                this.contractDF = this.Web3.eth.contract(abiTokens).at(this.addressDF);

                this.contractUSDx = this.Web3.eth.contract(abiUSDx).at(this.addressUSDx);
                this.contractProtocol = this.Web3.eth.contract(abiProtocol).at(this.addressProtocol);
                this.contractProtocolView = this.Web3.eth.contract(abiProtocolView).at(this.addressProtocolView);

                this.contractProtocol.allEvents({ toBlock: 'latest' }).watch((error, result) => {
                    console.log(error, result);
                    if (result && result.args._sender.toLowerCase() === this.state.accountAddress.toLowerCase()) {
                        var itemHistory = result;
                        itemHistory.timeStamp = new Date().getTime();

                        var tmphistory = this.state.myHistory;
                        tmphistory.unshift(itemHistory);

                        this.setState({
                            ...this.state,
                            myHistory: tmphistory
                        })

                        var localHistory = JSON.parse(localStorage.getItem(this.state.accountAddress));
                        console.log(localHistory);
                        console.log(this.state.netType);
                        console.log(localHistory[this.state.netType]);

                        localHistory[this.state.netType].history.unshift(itemHistory);
                        localStorage.setItem(this.state.accountAddress, JSON.stringify(localHistory));
                    }
                });

                if (document.body.clientWidth <= 900) {
                    console.log(document.body.clientWidth);
                    setTimeout(() => {
                        this.connectMetamask();
                    }, 1500)
                }
            })
        } else {
            alert('pls install metamask first.');
        }

        setInterval(() => {
            if (!this.Web3.eth.coinbase) {
                console.log('metamask not log in');
                return;
            }
            if (Cookie.load('isLogin') === 'false') {
                console.log('i am out ( -i clicked log out- )');
                return;
            }
            if (this.state.accountAddress !== this.Web3.eth.coinbase) {
                console.log('ReConnect...');
                this.setState({
                    approvedDAI: false,
                    approvedPAX: false,
                    approvedTUSD: false,
                    approvedUSDC: false,
                    approvedDF: false,
                    approvedUSDx: false,
                    DAIonBank: '0.00',
                    PAXonBank: '0.00',
                    TUSDonBank: '0.00',
                    USDConBank: '0.00',
                    claimDAI: '0.00',
                    claimPAX: '0.00',
                    claimTUSD: '0.00',
                    claimUSDC: '0.00',
                    DAIonPool: '0.00',
                    PAXonPool: '0.00',
                    TUSDonPool: '0.00',
                    USDConPool: '0.00',
                    myDAI: '0.00',
                    myPAX: '0.00',
                    myTUSD: '0.00',
                    myUSDC: '0.00',
                    myDF: '0.00',
                    myUSDx: '0.00',
                    myETH: '0.00',
                    myDAIonPool: '0.00',
                    myPAXonPool: '0.00',
                    myTUSDonPool: '0.00',
                    myUSDConPool: '0.00',
                    couldClaim: false,
                    userMaxToClaim: '0.00',
                    toDepositNum: '',
                    toDestroyNum: '',
                    toWithdrawNum: '',
                    myHistory: [],
                    couldDeposit: false,
                    maxGenerateUSDx: '0.00',
                    transcations: {}
                });
                this.connectMetamask();
            } else {
                return;
            }
            console.log('net or account changed')
        }, 2000);

        setInterval(() => {
            if (this.state.isConnected) {
                console.log('get new status...');
                this.getMyBalance();
                this.getPoolBankTotalStatus();
                this.getUserWithdrawBalance();
                this.checkApprove();
                this.getUserMaxToClaim();
                this.getPrice();
                this.getColMaxClaim();
                this.getUserWithdrawBalance();
                // this.isSyncing();
                this.getGasPrice();
            } else {
                console.log('not connected...');
                return;
            }
        }, 1000 * 15)
    }

    componentWillMount() { }
    componentDidMount() { }
    render() {
        return (
            <DocuentTitle title='USDx'>
                <React.Fragment>
                    {/* <Welcome ifShow={this.state.isConnected} connectMetamask={()=>{this.connectMetamask()}}/> */}
                    <Notify transcations={this.state.transcations} netType={this.state.netType} />
                    <div className='topTips' style={{ display: this.state.isConnected && this.state.netType === 'Rinkeby' ? 'block' : 'none' }}>
                        <img src={right_net} alt="" />
                        <span>Note: You are currently connected to the Rinkeby Testnet</span>
                    </div>
                    <div className='topTips redBg' style={{ display: this.state.isConnected && this.state.netType !== 'Rinkeby' && this.state.netType !== 'Main' ? 'block' : 'none' }}>
                        <img src={error_net} alt="" />
                        <span>USDx is currently only available on Mainnet or the Rinkeby Testnet</span>
                    </div>
                    {/* <div className='topTips redBg' style={{display: !this.state.isConnected ? 'block':'none'}}>
                        <img src={error_net} alt=""/>
                        <span>Please enable MetaMask or visit this page in a Web3 browser to interact with the dForce protocol</span>
                    </div> */}
                    <Header
                        status={this.state}
                        DisconnectMetamask={() => { this.DisconnectMetamask() }}
                        connectMetamask={() => { this.connectMetamask() }}
                        approve={(v) => { this.approve(v) }}
                        lock={(v) => { this.lock(v) }}
                        allocateTo={(v) => { this.allocateTo(v) }}
                        getMaxNumToGenerateOnestep={() => { this.getMaxNumToGenerateOnestep() }}
                        toGenerateMax={(BN) => { this.toGenerateMax(BN) }}
                        showOnestwpFn={() => { this.showOnestwpFn() }}
                        closeOnestwpFn={() => { this.closeOnestwpFn() }}
                    />
                    <MuiThemeProvider theme={this.theme}>
                        <div className="body">
                            <BodyLeft data={this.state} />
                            <Drawer
                                placement={'left'}
                                closable={false}
                                onClose={this.onClose}
                                visible={this.state.visible}
                                width='300px'
                            >

                                <div className="openMeun" onClick={this.showDrawer} style={{ background: 'rgba(34, 44, 60, 1)', position: 'fixed', left: '300px', top: '96px', zIndex: '999', height: '30px', width: '38px', lineHeight: '30px', paddingLeft: '8px', borderRadius: '0 15px 15px 0' }}>
                                    <img src={this.state.visible ? close_mobile : meun} alt="" style={{ width: '16px' }} />
                                </div>
                                <div className="bodyleftHome" style={{}}>
                                    <div className="title" style={{ fontSize: '14px', fontWeight: 300 }}>
                                        {/* <Tooltip placement="bottomLeft" title='Outstanding constituents pending for conversion due to inventory shortage and allocated USDx to be claimed by contributors of each constituent.'>
                                            <Button></Button>
                                        </Tooltip> */}
                                        Constituents Pending Pool:
                                    </div>
                                    {/* <div className="pool" style={{ width: '260px', marginTop: '10px', height: '60px', background: 'rgba(255, 245, 228, 1)', marginLeft: '-5px', borderRadius: '5px' }}>
                                        <div className="leftSection" style={{ float: 'left', width: '40px', textAlign: 'center', height: '60px', lineHeight: '60px', fontSize: '14px' }}>
                                            {this.state.sectionDAI ? (this.state.sectionDAI * 100 / this.state.tatolSection).toFixed() : '-'}%
                                        </div>
                                        <div className="left" style={{ width: '60px', height: '60px', paddingTop: '8px', paddingBottom: '3px', paddingLeft: '8px', float: 'left' }}>
                                            <img src={dai} alt="" style={{ width: '28px' }} />
                                            <p className="token" style={{ fontSize: '12px' }}>DAI</p>
                                        </div>
                                        <div className="right" style={{ width: '150px', height: '60px', float: 'left' }}>
                                            <div className="section" style={{ fontSize: '14px', fontWeight: 300, paddingTop: '8px' }}>
                                                <Tooltip title={'Claimable USDx: ' + this.toThousandsbodyleft(this.state.claimDAI.split('.')[0]) + '.' + this.state.claimDAI.split('.')[1] + ' / Pending DAI: ' + this.toThousandsbodyleft(this.state.DAIonPool.split('.')[0]) + '.' + this.state.DAIonPool.split('.')[1]}>
                                                    <Progress
                                                        percent={100}
                                                        successPercent={
                                                            (this.state.claimDAI && this.state.claimDAI > 0) ?
                                                                ((this.state.claimDAI / (Number(this.state.DAIonPool) + Number(this.state.claimDAI))).toFixed(2) * 100) < 5 ?
                                                                    '5'
                                                                    :
                                                                    Number(this.state.DAIonPool) === 0 ?
                                                                        '100'
                                                                        :
                                                                        (this.state.claimDAI / (Number(this.state.DAIonPool) + Number(this.state.claimDAI))).toFixed(2) * 100 >= 95 ?
                                                                            '95'
                                                                            :
                                                                            (this.state.claimDAI / (Number(this.state.DAIonPool) + Number(this.state.claimDAI))).toFixed(2) * 100
                                                                :
                                                                '0'
                                                        }
                                                        showInfo={false}
                                                    />
                                                </Tooltip>
                                            </div>
                                            <p className="sectionNum" style={{ fontSize: '16px', fontWeight: 400, marginTop: '3px', textAlign: 'right' }}>
                                                <span>{this.state.DAIonPool ? this.toThousandsbodyleft(this.state.DAIonPool.split('.')[0]) : '0'}</span>
                                                <span className="sectionDot" style={{ fontSize: '80%', opacity: 0.7, fontWeight: 200 }}>{this.state.DAIonPool ? '.' + this.state.DAIonPool.split('.')[1] : '.00'}</span>
                                            </p>
                                        </div>
                                        <div className="clear"></div>
                                    </div> */}
                                    <div className="pool poolColor2" style={{ width: '260px', marginTop: '10px', height: '60px', marginLeft: '-5px', borderRadius: '5px', background: 'rgba(219, 255, 249, 1)', backgroundSize: 'auto 100%' }}>
                                        <div className="leftSection" style={{ float: 'left', width: '40px', textAlign: 'center', height: '60px', lineHeight: '60px', fontSize: '14px' }}>
                                            {this.state.sectionPAX ? (this.state.sectionPAX * 100 / this.state.tatolSection).toFixed() : '-'}%
                                        </div>
                                        <div className="left" style={{ width: '60px', height: '60px', paddingTop: '8px', paddingBottom: '3px', paddingLeft: '8px', float: 'left' }}>
                                            <img src={pax} alt="" style={{ width: '28px' }} />
                                            <p className="token" style={{ fontSize: '12px' }}>PAX</p>
                                        </div>
                                        <div className="right" style={{ width: '150px', height: '60px', float: 'left' }}>
                                            <div className="section" style={{ fontSize: '14px', fontWeight: 300, paddingTop: '8px' }}>
                                                <Tooltip title={'Claimable USDx: ' + this.toThousandsbodyleft(this.state.claimPAX.split('.')[0]) + '.' + this.state.claimPAX.split('.')[1] + ' / Pending PAX: ' + this.toThousandsbodyleft(this.state.PAXonPool.split('.')[0]) + '.' + this.state.PAXonPool.split('.')[1]}>
                                                    <Progress
                                                        successPercent={
                                                            (this.state.claimPAX && this.state.claimPAX > 0) ?
                                                                ((this.state.claimPAX / (Number(this.state.PAXonPool) + Number(this.state.claimPAX))).toFixed(2) * 100) < 5 ?
                                                                    '5'
                                                                    :
                                                                    Number(this.state.PAXonPool) === 0 ?
                                                                        '100'
                                                                        :
                                                                        (this.state.claimPAX / (Number(this.state.PAXonPool) + Number(this.state.claimPAX))).toFixed(2) * 100 >= 95 ?
                                                                            '95'
                                                                            :
                                                                            (this.state.claimPAX / (Number(this.state.PAXonPool) + Number(this.state.claimPAX))).toFixed(2) * 100
                                                                :
                                                                '0'
                                                        }
                                                        percent={100}
                                                        showInfo={false}
                                                    />
                                                </Tooltip>
                                            </div>
                                            <p className="sectionNum" style={{ fontSize: '16px', fontWeight: 400, marginTop: '3px', textAlign: 'right' }}>
                                                <span>{this.state.PAXonPool ? this.toThousandsbodyleft(this.state.PAXonPool.split('.')[0]) : '0'}</span>
                                                <span className="sectionDot" style={{ fontSize: '80%', opacity: 0.7, fontWeight: 200 }}>{this.state.PAXonPool ? '.' + this.state.PAXonPool.split('.')[1] : '.00'}</span>
                                            </p>
                                        </div>
                                        <div className="clear"></div>
                                    </div>
                                    <div className="pool poolColor4" style={{ width: '260px', marginTop: '10px', height: '60px', marginLeft: '-5px', borderRadius: '5px', background: 'rgba(255, 236, 236, 1)' }}>
                                        <div className="leftSection" style={{ float: 'left', width: '40px', textAlign: 'center', height: '60px', lineHeight: '60px', fontSize: '14px' }}>
                                            {this.state.sectionTUSD ? (this.state.sectionTUSD * 100 / this.state.tatolSection).toFixed() : '-'}%
                                        </div>
                                        <div className="left" style={{ width: '60px', height: '60px', paddingTop: '8px', paddingBottom: '3px', paddingLeft: '8px', float: 'left' }}>
                                            <img src={tusd} alt="" style={{ width: '28px' }} />
                                            <p className="token" style={{ fontSize: '12px' }}>TUSD</p>
                                        </div>
                                        <div className="right" style={{ width: '150px', height: '60px', float: 'left' }}>
                                            <div className="section" style={{ fontSize: '14px', fontWeight: 300, paddingTop: '8px' }}>
                                                <Tooltip title={'Claimable USDx: ' + this.toThousandsbodyleft(this.state.claimTUSD.split('.')[0]) + '.' + this.state.claimTUSD.split('.')[1] + ' / Pending TUSD: ' + this.toThousandsbodyleft(this.state.TUSDonPool.split('.')[0]) + '.' + this.state.TUSDonPool.split('.')[1]}>
                                                    <Progress
                                                        successPercent={
                                                            (this.state.claimTUSD && this.state.claimTUSD > 0) ?
                                                                ((this.state.claimTUSD / (Number(this.state.TUSDonPool) + Number(this.state.claimTUSD))).toFixed(2) * 100) < 5 ?
                                                                    '5'
                                                                    :
                                                                    Number(this.state.TUSDonPool) === 0 ?
                                                                        '100'
                                                                        :
                                                                        (this.state.claimTUSD / (Number(this.state.TUSDonPool) + Number(this.state.claimTUSD))).toFixed(2) * 100 >= 95 ?
                                                                            '95'
                                                                            :
                                                                            (this.state.claimTUSD / (Number(this.state.TUSDonPool) + Number(this.state.claimTUSD))).toFixed(2) * 100
                                                                :
                                                                '0'
                                                        }
                                                        percent={100}
                                                        showInfo={false}
                                                    />
                                                </Tooltip>
                                            </div>
                                            <p className="sectionNum" style={{ fontSize: '16px', fontWeight: 400, marginTop: '3px', textAlign: 'right' }}>
                                                <span>{this.state.TUSDonPool ? this.toThousandsbodyleft(this.state.TUSDonPool.split('.')[0]) : '0'}</span>
                                                <span className="sectionDot" style={{ fontSize: '80%', opacity: 0.7, fontWeight: 200 }}>{this.state.TUSDonPool ? '.' + this.state.TUSDonPool.split('.')[1] : '.00'}</span>
                                            </p>
                                        </div>
                                        <div className="clear"></div>
                                    </div>
                                    <div className="pool poolColor3" style={{ width: '260px', marginTop: '10px', height: '60px', marginLeft: '-5px', borderRadius: '5px', background: 'rgba(226, 244, 255, 1)' }}>
                                        <div className="leftSection" style={{ float: 'left', width: '40px', textAlign: 'center', height: '60px', lineHeight: '60px', fontSize: '14px' }}>
                                            {this.state.sectionUSDC ? (this.state.sectionUSDC * 100 / this.state.tatolSection).toFixed() : '-'}%
                                        </div>
                                        <div className="left" style={{ width: '60px', height: '60px', paddingTop: '8px', paddingBottom: '3px', paddingLeft: '8px', float: 'left' }}>
                                            <img src={usdc} alt="" style={{ width: '28px' }} />
                                            <p className="token" style={{ fontSize: '12px' }}>USDC</p>
                                        </div>
                                        <div className="right" style={{ width: '150px', height: '60px', float: 'left' }}>
                                            <div className="section" style={{ fontSize: '14px', fontWeight: 300, paddingTop: '8px' }}>
                                                <Tooltip title={'Claimable USDx: ' + this.toThousandsbodyleft(this.state.claimUSDC.split('.')[0]) + '.' + this.state.claimUSDC.split('.')[1] + ' / Pending USDC: ' + this.toThousandsbodyleft(this.state.USDConPool.split('.')[0]) + '.' + this.state.USDConPool.split('.')[1]}>
                                                    <Progress
                                                        percent={100}
                                                        showInfo={false}
                                                        successPercent={
                                                            (this.state.claimUSDC && this.state.claimUSDC > 0) ?
                                                                ((this.state.claimUSDC / (Number(this.state.USDConPool) + Number(this.state.claimUSDC))).toFixed(2) * 100) < 5 ?
                                                                    '5'
                                                                    :
                                                                    Number(this.state.USDConPool) === 0 ?
                                                                        '100'
                                                                        :
                                                                        (this.state.claimUSDC / (Number(this.state.USDConPool) + Number(this.state.claimUSDC))).toFixed(2) * 100 >= 95 ?
                                                                            '95'
                                                                            :
                                                                            (this.state.claimUSDC / (Number(this.state.USDConPool) + Number(this.state.claimUSDC))).toFixed(2) * 100
                                                                :
                                                                '0'
                                                        }
                                                    />
                                                </Tooltip>
                                            </div>
                                            <p className="sectionNum" style={{ fontSize: '16px', fontWeight: 400, marginTop: '3px', textAlign: 'right' }}>
                                                <span>{this.state.USDConPool ? this.toThousandsbodyleft(this.state.USDConPool.split('.')[0]) : '0'}</span>
                                                <span className="sectionDot" style={{ fontSize: '80%', opacity: 0.7, fontWeight: 200 }}>{this.state.USDConPool ? '.' + this.state.USDConPool.split('.')[1] : '.00'}</span>
                                            </p>
                                        </div>
                                        <div className="clear"></div>
                                    </div>

                                    <div className="totalUSDx" style={{ marginTop: '40px' }}>
                                        <div className="title">
                                            {/* <Tooltip placement="bottomLeft" title='Total USDx minted (always identical to the sum total of collaterals)'>
                                                <Button></Button>
                                            </Tooltip> */}
                                            Total USDx Outstanding:
                                        </div>
                                        <div className="usdxNum" style={{ margin: 0, marginTop: '4px', fontSize: '16px', fontWeight: 400, textAlign: 'right', paddingRight: '5px' }}>
                                            <span>{this.state.totalSupplyUSDx ? this.toThousandsbodyleft(this.state.totalSupplyUSDx.split('.')[0]) : '0'}</span>
                                            <span className="sectionDot" style={{ fontSize: '80%', opacity: 0.7, fontWeight: 200 }}>{this.state.totalSupplyUSDx ? '.' + this.state.totalSupplyUSDx.split('.')[1] : '.00'}</span>
                                        </div>
                                    </div>

                                    <div className="globalpool" style={{ paddingTop: '30px' }}>
                                        <div className="title">
                                            {/* <Tooltip placement="bottomLeft" title='Constituents locked as collaterals (the sum total is always idential to the amount of outstanding USDx)'>
                                                <Button></Button>
                                            </Tooltip> */}
                                            Global Collateral Pool:
                                        </div>
                                        {/* <div className="sectionToken" style={{ marginTop: '10px' }}>
                                            <span className="token" style={{ fontSize: '14px', width: '60px', lineHeight: '30px' }}>DAI</span>
                                            <span className="tokenNum" style={{ fontSize: '16px', fontWeight: 400, float: 'right', marginRight: '5px' }}>
                                                {this.state.DAIonBank ? this.toThousandsbodyleft(this.state.DAIonBank.split('.')[0]) : '0'}
                                                <i style={{ fontStyle: 'normal', fontSize: '80%', opacity: 0.7, fontWeight: 200 }}>{this.state.DAIonBank ? '.' + this.state.DAIonBank.split('.')[1] : '.00'}</i>
                                            </span>
                                        </div> */}
                                        <div className="sectionToken">
                                            <span className="token" style={{ fontSize: '14px', width: '60px', lineHeight: '30px' }}>PAX</span>
                                            <span className="tokenNum" style={{ fontSize: '16px', fontWeight: 400, float: 'right', marginRight: '5px' }}>
                                                {this.state.PAXonBank ? this.toThousandsbodyleft(this.state.PAXonBank.split('.')[0]) : '0'}
                                                <i style={{ fontStyle: 'normal', fontSize: '80%', opacity: 0.7, fontWeight: 200 }}>{this.state.PAXonBank ? '.' + this.state.PAXonBank.split('.')[1] : '.00'}</i>
                                            </span>
                                        </div>
                                        <div className="sectionToken">
                                            <span className="token" style={{ fontSize: '14px', width: '60px', lineHeight: '30px' }}>TUSD</span>
                                            <span className="tokenNum" style={{ fontSize: '16px', fontWeight: 400, float: 'right', marginRight: '5px' }}>
                                                {this.state.TUSDonBank ? this.toThousandsbodyleft(this.state.TUSDonBank.split('.')[0]) : '0'}
                                                <i style={{ fontStyle: 'normal', fontSize: '80%', opacity: 0.7, fontWeight: 200 }}>{this.state.TUSDonBank ? '.' + this.state.TUSDonBank.split('.')[1] : '.00'}</i>
                                            </span>
                                        </div>
                                        <div className="sectionToken">
                                            <span className="token" style={{ fontSize: '14px', width: '60px', lineHeight: '30px' }}>USDC</span>
                                            <span className="tokenNum" style={{ fontSize: '16px', fontWeight: 400, float: 'right', marginRight: '5px' }}>
                                                {this.state.USDConBank ? this.toThousandsbodyleft(this.state.USDConBank.split('.')[0]) : '0'}
                                                <i style={{ fontStyle: 'normal', fontSize: '80%', opacity: 0.7, fontWeight: 200 }}>{this.state.USDConBank ? '.' + this.state.USDConBank.split('.')[1] : '.00'}</i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Drawer>

                            <div className="bodyright">
                                <div className="openMeun" style={{ background: 'rgba(34, 44, 60, 1)', position: 'fixed', left: '0', top: '96px', zIndex: '999', height: '30px', width: '38px', lineHeight: '30px', paddingLeft: '8px', borderRadius: '0 15px 15px 0' }} onClick={this.showDrawer}>
                                    <img src={meun} alt="" style={{ width: '16px' }} />
                                </div>
                                <div className="tab1">
                                    <div className="titleInTab">
                                        <div className="leftTitle">EXCHANGE</div>
                                        <div className="rightIcon">
                                            <IconButton color="inherit" onClick={() => { this.handleChange1() }}>
                                                <img src={exchangeTo} alt="" style={{ display: this.state.tab1 ? 'block' : 'none' }} />
                                                <img src={exchangeBack} alt="" style={{ display: !this.state.tab1 ? 'block' : 'none' }} />
                                            </IconButton>
                                        </div>
                                        <div className="clear"></div>
                                    </div>
                                    <div style={{ display: this.state.tab1 ? 'block' : 'none' }} className="generate">
                                        <p className="details">Select which constituent you would like to deposit:</p>
                                        <div className="input">
                                            <input type="number" onChange={(val) => { this.depositNumChange(val.target.value) }} value={this.state.toDepositNum} />
                                            <Select className="mySelect" defaultValue="PAX" onChange={(val) => { this.depositOptChange(val) }}>
                                                {/* <Select.Option value="DAI">DAI</Select.Option> */}
                                                <Select.Option value="PAX">PAX</Select.Option>
                                                <Select.Option value="TUSD">TUSD</Select.Option>
                                                <Select.Option value="USDC">USDC</Select.Option>
                                            </Select>
                                        </div>
                                        <div className="myBalanceOnPool myBalanceOnPoolMax">
                                            Max USDx available to aggregate:
                                        <span>
                                                <i>{this.state.maxGenerateUSDx ? this.toThousands(this.state.maxGenerateUSDx.split('.')[0]) : '0'}</i>
                                                {this.state.maxGenerateUSDx ? '.' + this.state.maxGenerateUSDx.split('.')[1] : '.00'}
                                            </span>
                                        </div>
                                        <div className="ButtonWrap">
                                            <Button
                                                onClick={() => { this.deposit() }}
                                                variant="contained"
                                                color="secondary"
                                                disabled={this.state.couldDeposit ? false : true}
                                                fullWidth={true}
                                            >
                                                GENERATE
                                        </Button>
                                        </div>
                                        <div className="diverLine"></div>
                                        <div className="claim">
                                            Max USDx to claim:
                                        <span>
                                                <i>{this.state.userMaxToClaim ? this.toThousands(this.state.userMaxToClaim.split('.')[0]) : '0'}</i>
                                                {this.state.userMaxToClaim ? '.' + this.state.userMaxToClaim.split('.')[1] : '.00'}
                                            </span>
                                        </div>
                                        <div className="ButtonWrap marginTop10 marginMax ButtonWrap_new">
                                            <Button
                                                onClick={() => { this.claim() }}
                                                variant="contained"
                                                color="secondary"
                                                disabled={this.state.couldClaim ? false : true}
                                                fullWidth={true}
                                            >
                                                CLAIM
                                        </Button>
                                        </div>
                                        <div className="errtips" style={{ display: this.state.errTips ? 'block' : 'none' }}>
                                            <h4>Reminder</h4>
                                            Insufficient {this.state.toDeposit}
                                        </div>
                                    </div>

                                    <div style={{ display: !this.state.tab1 ? 'block' : 'none' }} className="generate">
                                        <p className="details">How much USDx you would like to reconvert into constituents:</p>
                                        <div className="input">
                                            <input type="number" onChange={(val) => { this.destroyNumChange(val.target.value) }} value={this.state.toDestroyNum} />
                                            <Select className="mySelect" defaultValue="USDx" disabled></Select>
                                        </div>
                                        <div className="clear"></div>
                                        <div className="ButtonWrap ButtonWrapWithdraw">
                                            <Button
                                                onClick={() => { this.destroy() }}
                                                variant="contained"
                                                color="secondary"
                                                disabled={this.state.couldDestroy ? false : true}
                                                fullWidth={true}
                                            >CONVERT
                                        </Button>
                                        </div>
                                        <div className="tips tipsMax">
                                            <div className="imgWrap">
                                                <img src={warningtips} alt="" />
                                                <div className="detials">Please note that 0.1% of USDx equivalent of DF will be consumed for the reconversion of USDx.</div>
                                            </div>
                                            Fee in DF Token:
                                        <span style={{ color: Number(this.state.toDestroyNum * this.state.feeRate / this.state.dfPrice) - Number(this.state.myDF) > 0 ? '#fc5645' : '#9696a2' }}>
                                                <i style={{ color: Number(this.state.toDestroyNum * this.state.feeRate / this.state.dfPrice) - Number(this.state.myDF) > 0 ? '#fc5645' : '#9696a2' }}>{(this.state.toDestroyNum * this.state.feeRate / this.state.dfPrice).toFixed(2).toString().split('.')[0]}</i>
                                                {'.' + (this.state.toDestroyNum * this.state.feeRate / this.state.dfPrice).toFixed(2).toString().split('.')[1]}
                                            </span>
                                        </div>
                                        <div className="errtips" style={{ display: this.state.errTipsDestroy ? 'block' : 'none' }}>
                                            {/* <div className="errtips"> */}
                                            <h4>Reminder</h4>
                                            <span style={{ display: this.state.errTipsDestroy && !this.state.getDestroyThresholdBool && Number(this.state.toDestroyNum * this.state.feeRate / this.state.dfPrice) - Number(this.state.myDF) < 0 ? 'block' : 'none' }}>Insufficient USDx.</span>
                                            <span style={{ display: this.state.getDestroyThresholdBool ? 'block' : 'none' }}>The minimum accuracy to unconvert is no less than 0.01 USDx.</span>
                                            <span style={{ display: Number(this.state.toDestroyNum * this.state.feeRate / this.state.dfPrice) - Number(this.state.myDF) > 0 ? 'block' : 'none' }}>Insufficient DF.</span>
                                        </div>
                                        <div className="myBalanceOnPoolSection">
                                            <div className="title">Constituents to be returned:</div>
                                            {/* <p className='partToken'>
                                                <span>DAI</span>
                                                <span className='right'>
                                                    {this.state.USDxToDAI ? this.toThousands(this.state.USDxToDAI.split('.')[0]) : '0'}
                                                    <i>{this.state.USDxToDAI ? this.state.USDxToDAI.split('.')[1] ? '.' + this.state.USDxToDAI.split('.')[1] : '.00' : '.00'}</i>
                                                </span>
                                            </p> */}
                                            <p className='partSec_new'>
                                                <span className='exMargin_new'>PAX</span>
                                                <span className='right_new'>
                                                    {this.state.USDxToPAX ? this.toThousands(this.state.USDxToPAX.split('.')[0]) : '0'}
                                                    <i>{this.state.USDxToPAX ? this.state.USDxToPAX.split('.')[1] ? '.' + this.state.USDxToPAX.split('.')[1] : '.00' : '.00'}</i>
                                                </span>
                                            </p>
                                            <div className="clear"></div>
                                            <p className='partSec_new'>
                                                <span className='exMargin_new'>TUSD</span>
                                                <span className='right_new'>
                                                    {this.state.USDxToTUSD ? this.toThousands(this.state.USDxToTUSD.split('.')[0]) : '0'}
                                                    <i>{this.state.USDxToTUSD ? this.state.USDxToTUSD.split('.')[1] ? '.' + this.state.USDxToTUSD.split('.')[1] : '.00' : '.00'}</i>
                                                </span>
                                            </p>
                                            <div className="clear"></div>
                                            <p className='partSec_new'>
                                                <span className='exMargin_new'>USDC</span>
                                                <span className='right_new'>
                                                    {this.state.USDxToUSDC ? this.toThousands(this.state.USDxToUSDC.split('.')[0]) : '0'}
                                                    <i>{this.state.USDxToUSDC ? this.state.USDxToUSDC.split('.')[1] ? '.' + this.state.USDxToUSDC.split('.')[1] : '.00' : '.00'}</i>
                                                </span>
                                            </p>
                                            <div className="clear"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tab1 noRightMargin">
                                    <div className="titleInTab">
                                        <div className="leftTitle">WITHDRAW</div>
                                        <div className="clear"></div>
                                    </div>
                                    <div className="generate nomargin">
                                        <p className="details">Select which constituent you would like to withdraw:</p>
                                        <div className="input">
                                            <div className="maxNum" onClick={() => { this.adjustMaxToWithdraw() }}>MAX</div>
                                            <input type="number" onChange={(val) => { this.withdrawNumChange(val.target.value) }} value={this.state.toWithdrawNum} />
                                            <Select className="mySelect" defaultValue="PAX" onChange={(val) => { this.withdrawOptChange(val) }}>
                                                {/* <Select.Option value="DAI">DAI</Select.Option> */}
                                                <Select.Option value="PAX">PAX</Select.Option>
                                                <Select.Option value="TUSD">TUSD</Select.Option>
                                                <Select.Option value="USDC">USDC</Select.Option>
                                            </Select>
                                        </div>
                                        <div className="clear"></div>
                                        <div className="ButtonWrap ButtonWrapWithdraw">
                                            <Button
                                                onClick={() => { this.withdraw() }}
                                                variant="contained"
                                                color="secondary"
                                                disabled={this.state.couldWithdraw ? false : true}
                                                fullWidth={true}
                                            >WITHDRAW
                                        </Button>
                                        </div>
                                        <div className="errtips" style={{ display: this.state.errTipsWithdraw ? 'block' : 'none' }}>
                                            <h4>Reminder</h4>
                                            Insufficient {this.state.toWithdraw}.
                                            </div>
                                        <div className="myBalanceOnPoolSection">
                                            <div className="title">Constituent balance:</div>
                                            {/* <p className='partToken'>
                                                <span>DAI</span>
                                                <span className='right' title={this.state.myDAIonPoolOrigin}>
                                                    {this.state.myDAIonPool ? this.toThousands(this.state.myDAIonPool.split('.')[0]) : '0'}
                                                    <i>{this.state.myDAIonPool ? '.' + this.state.myDAIonPool.split('.')[1] : '.00'}</i>
                                                </span>
                                            </p> */}
                                            <p className='partSec_new'>
                                                <span className='exMargin_new'>PAX</span>
                                                <span className='right_new' title={this.state.myPAXonPoolOrigin}>
                                                    {this.state.myPAXonPool ? this.toThousands(this.state.myPAXonPool.split('.')[0]) : '0'}
                                                    <i>{this.state.myPAXonPool ? '.' + this.state.myPAXonPool.split('.')[1] : '.00'}</i>
                                                </span>
                                            </p>
                                            <div className="clear"></div>
                                            <p className='partSec_new'>
                                                <span className='exMargin_new'>TUSD</span>
                                                <span className='right_new' title={this.state.myTUSDonPoolOrigin}>
                                                    {this.state.myTUSDonPool ? this.toThousands(this.state.myTUSDonPool.split('.')[0]) : '0'}
                                                    <i>{this.state.myTUSDonPool ? '.' + this.state.myTUSDonPool.split('.')[1] : '.00'}</i>
                                                </span>
                                            </p>
                                            <div className="clear"></div>
                                            <p className='partSec_new'>
                                                <span className='exMargin_new'>USDC</span>
                                                <span className='right_new' title={this.state.myUSDConPoolOrigin}>
                                                    {this.state.myUSDConPool ? this.toThousands(this.state.myUSDConPool.split('.')[0]) : '0'}
                                                    <i>{this.state.myUSDConPool ? '.' + this.state.myUSDConPool.split('.')[1] : '.00'}</i>
                                                </span>
                                            </p>
                                            <div className="clear"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="clear"></div>
                                <History
                                    data={this.state}
                                    addressDAI={this.addressDAI}
                                    addressPAX={this.addressPAX}
                                    addressTUSD={this.addressTUSD}
                                    addressUSDC={this.addressUSDC}
                                    web3={this.Web3}
                                />
                                {/* <div className="history"></div> */}

                                <div className="faq-wrap">
                                    {/* foot */}
                                    <div className="foot">
                                        <div className="foot-item">
                                            <div className="foot-item-title">Resource</div>
                                            <div className="foot-item-content">
                                                <a href='https://github.com/dforce-network/USDx_1.0' target='_blank' rel="noopener noreferrer">
                                                    GitHub
                                                </a>
                                            </div>
                                            <div className="foot-item-content">
                                                <a href={'https://docs.dforce.network/dforce-assets/usdx'} target='_blank' rel="noopener noreferrer">
                                                    FAQ
                                                </a>
                                            </div>
                                        </div>

                                        <div className="foot-item">
                                            <div className="foot-item-title">
                                                Community
                                            </div>
                                            <div className="foot-item-content icom-a">
                                                <a href='https://twitter.com/dForcenet' target='_blank' rel="noopener noreferrer">
                                                    <img alt='' src={Twitter} />
                                                </a>
                                                <a href='https://t.me/dforcenet' target='_blank' rel="noopener noreferrer">
                                                    <img alt='' src={Telegram} />
                                                </a>
                                                <a href='https://medium.com/dforcenet' target='_blank' rel="noopener noreferrer">
                                                    <img alt='' src={Medium} />
                                                </a>
                                                <a href='https://www.reddit.com/r/dForceNetwork' target='_blank' rel="noopener noreferrer">
                                                    <img alt='' src={Reddit} />
                                                </a>
                                                <a href='https://discord.gg/c2PC8SM' target='_blank' rel="noopener noreferrer">
                                                    <img alt='' src={Discord} />
                                                </a>
                                                <a href='https://www.linkedin.com/company/dforce-network' target='_blank' rel="noopener noreferrer">
                                                    <img alt='' src={LinkedIn} />
                                                </a>
                                                <a href='https://www.youtube.com/channel/UCM6Vgoc-BhFGG11ZndUr6Ow' target='_blank' rel="noopener noreferrer">
                                                    <img alt='' src={Youtube} />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="foot-item padding-left20">
                                            <div className="foot-item-title">Contract US</div>
                                            <div className="foot-item-content">support@dforce.network</div>
                                            <div className="foot-item-content">bd@dforce.network</div>
                                            <div className="foot-item-content">tech@dforce.network</div>
                                        </div>
                                        <div className="clear"></div>
                                    </div>
                                </div>

                            </div>
                            <div className="clear"></div>
                        </div>
                    </MuiThemeProvider>
                </React.Fragment>
            </DocuentTitle>
        )
    }


    handleChange1 = () => {
        this.setState({
            ...this.state,
            tab1: !this.state.tab1
        });
    }

    // connectMetamask
    DisconnectMetamask() {
        this.setState({
            isConnected: false,
            accountAddress: ''
        })
        Cookie.save('isLogin', 'false', { path: '/' });
        window.location.reload();
        return;
    }
    // connectMetamask
    connectMetamask() {
        this.Web3.currentProvider.enable().then(
            res => {
                console.log('you connected.');
                this.setState({
                    ...this.state,
                    isConnected: true,
                    accountAddress: res[0]
                });
                this.getNetType();
                this.getDecimals();
                this.getMyBalance();
                this.getPoolBankTotalStatus();
                this.getUserWithdrawBalance();
                this.checkApprove();
                this.getDestroyThreshold();
                this.getUserMaxToClaim();
                this.getPrice();
                this.getFeeRate();
                this.getColMaxClaim();
                this.getUserWithdrawBalance();
                this.getMyHistory();
                Cookie.save('isLogin', 'true', { path: '/' });
                this.getGasPrice();
            },
            err => {
                console.log(err);
                this.DisconnectMetamask();
                alert('cancel the connection');
            }
        );
    }

    // toThousands
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

    // getNetType
    getNetType() {
        this.Web3.version.getNetwork((err, net) => {
            switch (net) {
                case '1':
                    this.setState({
                        ...this.state,
                        netTypeColor: '#1abc9c',
                        netType: 'Main'
                    });
                    break;
                case '3':
                    this.setState({
                        ...this.state,
                        netTypeColor: '#FC4E8E',
                        netType: 'Ropsten'
                    });
                    break;
                case '4':
                    this.setState({
                        ...this.state,
                        netTypeColor: '#F5C250',
                        netType: 'Rinkeby'
                    });
                    break;
                case '42':
                    this.setState({
                        ...this.state,
                        netTypeColor: '#715EFB',
                        netType: 'Kovan'
                    });
                    break;
                default:
                    this.setState({
                        ...this.state,
                        netTypeColor: '#fff',
                        netType: 'Unknown'
                    });
            }
        });
    }
    // getDecimals
    getDecimals() {
        this.contractDAI.decimals.call((err, ret) => {
            this.setState({
                ...this.state,
                decimalsDAI: ret.toFixed()
            })
        })
        this.contractPAX.decimals.call((err, ret) => {
            this.setState({
                ...this.state,
                decimalsPAX: ret.toFixed()
            })
        })
        this.contractTUSD.decimals.call((err, ret) => {
            this.setState({
                ...this.state,
                decimalsTUSD: ret.toFixed()
            })
        })
        this.contractUSDC.decimals.call((err, ret) => {
            this.setState({
                ...this.state,
                decimalsUSDC: ret.toFixed()
            })
        })
        this.contractUSDx.decimals.call((err, ret) => {
            this.setState({
                ...this.state,
                decimalsUSDx: ret.toFixed()
            })
        })
        this.contractDF.decimals.call((err, ret) => {
            this.setState({
                ...this.state,
                decimalsDF: ret.toFixed()
            })
        })

        setTimeout(() => {
            this.getTokenSection();
            this.getTokenBurningSection();
        }, 2000);
    }

    // getMyHistory
    getMyHistory() {
        setTimeout(() => {
            if (!localStorage.getItem(this.state.accountAddress)) {
                console.log('no history yet...');
                var obj = {
                    Main: {
                        history: []
                    },
                    Ropsten: {
                        history: []
                    },
                    Rinkeby: {
                        history: []
                    },
                    Kovan: {
                        history: []
                    }
                };
                localStorage.setItem(this.state.accountAddress, JSON.stringify(obj));
                return;
            } else {
                var historyArr = (JSON.parse(localStorage.getItem(this.state.accountAddress)))[this.state.netType].history;
                console.log(historyArr);
                this.setState({
                    ...this.state,
                    myHistory: historyArr
                })
            }
        }, 3000)
    }


    // get the Token section
    getTokenSection() {
        // this.tatolSection = 0;
        this.contractProtocolView.getMintingSection.call((err, ret) => {
            // console.log(ret[0])
            // console.log(ret[1])
            if (ret) {
                var addressArry = ret[0];
                var secArry = ret[1];
                this.tatolSection = 0;

                for (let i = 0; i < addressArry.length; i++) {
                    if (addressArry[i].toLowerCase() === this.addressDAI) {
                        this.sectionDAI = secArry[i].div(10 ** 18).toFixed();
                        this.tatolSection = Number(this.tatolSection) + Number(this.sectionDAI);
                        this.setState({
                            ...this.state,
                            sectionDAI: this.sectionDAI,
                            tatolSection: this.tatolSection
                        })
                    }
                    if (addressArry[i].toLowerCase() === this.addressPAX) {
                        this.sectionPAX = secArry[i].div(10 ** 18).toFixed();
                        this.tatolSection = Number(this.tatolSection) + Number(this.sectionPAX);
                        this.setState({
                            ...this.state,
                            sectionPAX: this.sectionPAX,
                            tatolSection: this.tatolSection
                        })
                    }
                    if (addressArry[i].toLowerCase() === this.addressUSDC) {
                        this.sectionUSDC = secArry[i].div(10 ** 18).toFixed();
                        this.tatolSection = Number(this.tatolSection) + Number(this.sectionUSDC);
                        this.setState({
                            ...this.state,
                            sectionUSDC: this.sectionUSDC,
                            tatolSection: this.tatolSection
                        })
                    }
                    if (addressArry[i].toLowerCase() === this.addressTUSD) {
                        this.sectionTUSD = secArry[i].div(10 ** 18).toFixed();
                        this.tatolSection = Number(this.tatolSection) + Number(this.sectionTUSD);
                        this.setState({
                            ...this.state,
                            sectionTUSD: this.sectionTUSD,
                            tatolSection: this.tatolSection
                        })
                    }
                }
            }
        })
    }
    // get the Token Burning section
    getTokenBurningSection() {
        this.tatolSectionBurning = 0;
        this.contractProtocolView.getBurningSection.call((err, ret) => {
            // console.log(err, ret);
            if (ret) {
                var addrArry = ret[0];
                var sectionArry = ret[1];

                for (let i = 0; i < addrArry.length; i++) {
                    if (addrArry[i].toLowerCase() === this.addressDAI) {
                        this.sectionDAIBurning = sectionArry[i].div(10 ** 16).toFixed();
                        this.tatolSectionBurning = Number(this.tatolSectionBurning) + Number(this.sectionDAIBurning);
                        this.setState({
                            ...this.state,
                            sectionDAIBurning: this.sectionDAIBurning,
                            tatolSectionBurning: this.tatolSectionBurning
                        })
                    }
                    if (addrArry[i].toLowerCase() === this.addressPAX) {
                        this.sectionPAXBurning = sectionArry[i].div(10 ** 16).toFixed();
                        this.tatolSectionBurning = Number(this.tatolSectionBurning) + Number(this.sectionPAXBurning);
                        this.setState({
                            ...this.state,
                            sectionPAXBurning: this.sectionPAXBurning,
                            tatolSectionBurning: this.tatolSectionBurning
                        })
                    }
                    if (addrArry[i].toLowerCase() === this.addressTUSD) {
                        this.sectionTUSDBurning = sectionArry[i].div(10 ** 16).toFixed();
                        this.tatolSectionBurning = Number(this.tatolSectionBurning) + Number(this.sectionTUSDBurning);
                        this.setState({
                            ...this.state,
                            sectionTUSDBurning: this.sectionTUSDBurning,
                            tatolSectionBurning: this.tatolSectionBurning
                        })
                    }
                    if (addrArry[i].toLowerCase() === this.addressUSDC) {
                        this.sectionUSDCBurning = sectionArry[i].div(10 ** 16).toFixed();
                        this.tatolSectionBurning = Number(this.tatolSectionBurning) + Number(this.sectionUSDCBurning);
                        this.setState({
                            ...this.state,
                            sectionUSDCBurning: this.sectionUSDCBurning,
                            tatolSectionBurning: this.tatolSectionBurning
                        })
                    }
                }
            }
        })
    }
    // getMaxNumToGenerateOnestep
    getMaxNumToGenerateOnestep() {
        this.contractProtocolView.calcMaxMinting.call((err, ret) => {
            // console.log(err, ret);
            if (ret) {
                this.setState({
                    ...this.state,
                    calcMaxMinting: ret
                })
            }
        })
    }

    // getDestroyThreshold
    getDestroyThreshold() {
        this.contractProtocolView.getDestroyThreshold.call((err, ret) => {
            this.setState({
                ...this.state,
                getDestroyThreshold: ret / (10 ** 10) / (10 ** 8)
            })
        })
    }
    // getUserMaxToClaim
    getUserMaxToClaim() {
        this.contractProtocolView.getUserMaxToClaim.call((err, ret) => {
            // console.log(err, ret);
            if (ret && ret.c[0] > 0) {
                this.setState({
                    ...this.state,
                    userMaxToClaim: this.formatNumber(ret, 'USDx'),
                    couldClaim: true
                })
            } else {
                this.setState({
                    ...this.state,
                    userMaxToClaim: '0.00',
                    couldClaim: false
                })
            }
        })
    }
    // getPrice
    getPrice() {
        this.contractProtocolView.getPrice.call(0, (err, ret) => {
            // console.log(err, ret);
            if (ret) {
                this.setState({
                    ...this.state,
                    dfPrice: this.formatNumber(ret, 'DF')
                })
            }
        })
    }
    // getFeeRate
    getFeeRate() {
        this.contractProtocolView.getFeeRate.call(1, (err, ret) => {
            // console.log(err, ret);
            if (ret) {
                this.setState({
                    ...this.state,
                    feeRate: ret / 10000
                })
            }
        })
    }
    // getColMaxClaim
    getColMaxClaim() {
        this.contractProtocolView.getColMaxClaim.call((err, ret) => {
            // console.log(err, ret);
            if (ret) {
                var claimAddress = ret[0];
                var claimNumber = ret[1];

                for (let i = 0; i < claimAddress.length; i++) {
                    if (claimAddress[i] === this.addressDAI) {
                        this.setState({
                            ...this.state,
                            claimDAI: this.formatNumber(claimNumber[i], 'USDx')
                        })
                    }
                    if (claimAddress[i] === this.addressPAX) {
                        this.setState({
                            ...this.state,
                            claimPAX: this.formatNumber(claimNumber[i], 'USDx')
                        })
                    }
                    if (claimAddress[i] === this.addressTUSD) {
                        this.setState({
                            ...this.state,
                            claimTUSD: this.formatNumber(claimNumber[i], 'USDx')
                        })
                    }
                    if (claimAddress[i] === this.addressUSDC) {
                        this.setState({
                            ...this.state,
                            claimUSDC: this.formatNumber(claimNumber[i], 'USDx')
                        })
                    }
                }
            }
        })
    }


    // *** isSyncing ***
    isSyncing() {
        this.Web3.eth.isSyncing((res) => {
            if (res) {
                console.log(res);
            }
        })
        // lastSyncState: false
        // this.Web3.eth.syncing((err, ret)=>{
        //     console.log(err, ret);
        // })
    }


    // *** get price ***
    getGasPrice() {
        this.Web3.eth.getGasPrice((e, r) => {
            // console.log(e, Number(r));
            this.setState({
                ...this.state,
                gasPrice: Number(r)
            })
        })
    }


    // *** get My Balance ***
    getMyBalance() {
        this.Web3.eth.getBalance(this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myETH: this.formatNumber(ret, 'ETH')
            });
        });
        this.contractDAI.balanceOf.call(this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myDAI: this.formatNumber(ret, 'DAI'),
                myDAIOrigin: ret.toString(10)
            });
        });
        this.contractPAX.balanceOf.call(this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myPAX: this.formatNumber(ret, 'PAX'),
                myPAXOrigin: ret.toString(10)
            });
        });
        this.contractTUSD.balanceOf.call(this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myTUSD: this.formatNumber(ret, 'TUSD'),
                myTUSDOrigin: ret.toString(10)
            });
        });
        this.contractUSDC.balanceOf.call(this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myUSDC: this.formatNumber(ret, 'USDC'),
                myUSDCOrigin: ret.toString(10)
            });
        });
        this.contractDF.balanceOf.call(this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myDF: this.formatNumber(ret, 'DF')
            });
        });
        this.contractUSDx.balanceOf.call(this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myUSDx: this.formatNumber(ret, 'USDx')
            });
        });
    }


    // *** get Pool_Bank_Total Status ***
    getPoolBankTotalStatus() {
        this.contractUSDx.totalSupply.call((err, ret) => {
            this.setState({
                ...this.state,
                totalSupplyUSDx: this.formatNumber(ret, 'USDx')
            });
        });

        this.contractProtocolView.getPoolStatus.call((err, ret) => {
            // console.log(err, ret);
            if (ret) {
                var addressIDs = ret[0];
                var myBalance = ret[1];

                for (let i = 0; i < addressIDs.length; i++) {
                    if (addressIDs[i] === this.addressDAI) {
                        this.setState({
                            ...this.state,
                            DAIonPool: this.formatNumber(myBalance[i], 'DAI')
                        });
                    }
                    if (addressIDs[i] === this.addressPAX) {
                        this.setState({
                            ...this.state,
                            PAXonPool: this.formatNumber(myBalance[i], 'PAX')
                        });
                    }
                    if (addressIDs[i] === this.addressTUSD) {
                        this.setState({
                            ...this.state,
                            TUSDonPool: this.formatNumber(myBalance[i], 'TUSD')
                        });
                    }
                    if (addressIDs[i] === this.addressUSDC) {
                        this.setState({
                            ...this.state,
                            USDConPool: this.formatNumber(myBalance[i], 'USDC')
                        });
                    }
                }
            }
        })

        this.contractProtocolView.getColStatus.call((err, ret) => {
            // console.log(err, ret);
            if (ret) {
                var addressIDs = ret[0];
                var myBalance = ret[1];

                for (let i = 0; i < addressIDs.length; i++) {
                    if (addressIDs[i] === this.addressDAI) {
                        this.setState({
                            ...this.state,
                            DAIonBank: this.formatNumber(myBalance[i], 'DAI')
                        });
                    }
                    if (addressIDs[i] === this.addressPAX) {
                        this.setState({
                            ...this.state,
                            PAXonBank: this.formatNumber(myBalance[i], 'PAX')
                        });
                    }
                    if (addressIDs[i] === this.addressTUSD) {
                        this.setState({
                            ...this.state,
                            TUSDonBank: this.formatNumber(myBalance[i], 'TUSD')
                        });
                    }
                    if (addressIDs[i] === this.addressUSDC) {
                        this.setState({
                            ...this.state,
                            USDConBank: this.formatNumber(myBalance[i], 'USDC')
                        });
                    }
                }
            }
        })
    }


    // *** get User Withdraw Balance ***
    getUserWithdrawBalance() {
        this.contractProtocolView.getUserWithdrawBalance.call((err, ret) => {
            // console.log(err, ret);
            if (ret) {
                var addressIDs = ret[0];
                var myBalance = ret[1];

                for (let i = 0; i < addressIDs.length; i++) {
                    if (addressIDs[i] === this.addressDAI) {
                        this.setState({
                            ...this.state,
                            myDAIonPool: this.formatNumber(myBalance[i], 'DAI'),
                            myDAIonPoolOrigin: this.handleMaxWithdraw(myBalance[i].toString(10), 'DAI')
                        })
                    }
                    if (addressIDs[i] === this.addressPAX) {
                        this.setState({
                            ...this.state,
                            myPAXonPool: this.formatNumber(myBalance[i], 'PAX'),
                            myPAXonPoolOrigin: this.handleMaxWithdraw(myBalance[i].toString(10), 'PAX')
                        })
                    }
                    if (addressIDs[i] === this.addressTUSD) {
                        this.setState({
                            ...this.state,
                            myTUSDonPool: this.formatNumber(myBalance[i], 'TUSD'),
                            myTUSDonPoolOrigin: this.handleMaxWithdraw(myBalance[i].toString(10), 'TUSD')
                        })
                    }
                    if (addressIDs[i] === this.addressUSDC) {
                        this.setState({
                            ...this.state,
                            myUSDConPool: this.formatNumber(myBalance[i], 'USDC'),
                            myUSDConPoolOrigin: this.handleMaxWithdraw(myBalance[i].toString(10), 'USDC')
                        })
                    }
                }
            }
        })
    }
    handleMaxWithdraw(NumStr, token) {
        if (token === 'DAI') {
            if (NumStr.length < 18) {
                NumStr = '00000000000000000' + NumStr;
                return this.Web3.toBigNumber(NumStr.substring(0, NumStr.length - this.state.decimalsDAI) + '.' + NumStr.substring(NumStr.length - this.state.decimalsDAI)).toString(10);
            } else {
                return this.Web3.toBigNumber(NumStr.substring(0, NumStr.length - this.state.decimalsDAI) + '.' + NumStr.substring(NumStr.length - this.state.decimalsDAI)).toString(10);
            }
        }
        if (token === 'PAX') {
            if (NumStr.length < 18) {
                NumStr = '00000000000000000' + NumStr;
                return this.Web3.toBigNumber(NumStr.substring(0, NumStr.length - this.state.decimalsPAX) + '.' + NumStr.substring(NumStr.length - this.state.decimalsPAX)).toString(10);
            } else {
                return this.Web3.toBigNumber(NumStr.substring(0, NumStr.length - this.state.decimalsPAX) + '.' + NumStr.substring(NumStr.length - this.state.decimalsPAX)).toString(10);
            }
        }
        if (token === 'TUSD') {
            if (NumStr.length < 18) {
                NumStr = '00000000000000000' + NumStr;
                return this.Web3.toBigNumber(NumStr.substring(0, NumStr.length - this.state.decimalsTUSD) + '.' + NumStr.substring(NumStr.length - this.state.decimalsTUSD)).toString(10);
            } else {
                return this.Web3.toBigNumber(NumStr.substring(0, NumStr.length - this.state.decimalsTUSD) + '.' + NumStr.substring(NumStr.length - this.state.decimalsTUSD)).toString(10);
            }
        }
        if (token === 'USDC') {
            if (NumStr.length < 18) {
                NumStr = '00000000000000000' + NumStr;
                return this.Web3.toBigNumber(NumStr.substring(0, NumStr.length - this.state.decimalsUSDC) + '.' + NumStr.substring(NumStr.length - this.state.decimalsUSDC)).toString(10);
            } else {
                return this.Web3.toBigNumber(NumStr.substring(0, NumStr.length - this.state.decimalsUSDC) + '.' + NumStr.substring(NumStr.length - this.state.decimalsUSDC)).toString(10);
            }
        }
    }


    // *** format number ***
    formatNumber(BNr, token) {
        var originStr = '0';

        if (token === 'USDx') {
            if (BNr.toFixed() < (10 ** (this.state.decimalsUSDx - 3)) && BNr.toFixed() > 0) {
                return '0.00';
            }
            originStr = BNr.div(10 ** this.state.decimalsUSDx).toString(10);
        } else if (token === 'ETH') {
            if (BNr.toFixed() < (10 ** 15) && BNr.toFixed() > 0) {
                return '0.00';
            }
            originStr = BNr.div(10 ** 18).toString(10);
        } else if (token === 'DAI') {
            if (BNr.toFixed() < (10 ** (this.state.decimalsDAI - 3)) && BNr.toFixed() > 0) {
                return '0.00';
            }
            originStr = BNr.div(10 ** this.state.decimalsDAI).toString(10);
        } else if (token === 'PAX') {
            if (BNr.toFixed() < (10 ** (this.state.decimalsPAX - 3)) && BNr.toFixed() > 0) {
                return '0.00';
            }
            originStr = BNr.div(10 ** this.state.decimalsPAX).toString(10);
        } else if (token === 'TUSD') {
            if (BNr.toFixed() < (10 ** (this.state.decimalsTUSD - 3)) && BNr.toFixed() > 0) {
                return '0.00';
            }
            originStr = BNr.div(10 ** this.state.decimalsTUSD).toString(10);
        } else if (token === 'USDC') {
            if (BNr.toFixed() < (10 ** (this.state.decimalsUSDC - 3)) && BNr.toFixed() > 0) {
                return '0.00';
            }
            originStr = BNr.div(10 ** this.state.decimalsUSDC).toString(10);
        } else if (token === 'DF') {
            if (BNr.toFixed() < (10 ** (this.state.decimalsDF - 3)) && BNr.toFixed() > 0) {
                return '0.00';
            }
            originStr = BNr.div(10 ** this.state.decimalsDF).toString(10);
        } else if (token === '') {
            // if (BNr.toFixed() < (10 ** 10) && BNr.toFixed() > 0) {
            //     return '0.00';
            // }
            originStr = BNr.toString(10);
        }


        if (originStr.indexOf('.') > 0) {
            originStr = originStr.substr(0, originStr.indexOf('.') + 3);
            if (originStr.length >= 12) {
                return originStr = originStr.substr(0, 11);
            } else {
                return originStr;
            }
        } else if (isNaN(originStr)) {
            return '0.00'
        } else {
            return originStr + '.00';
        }
    }


    // *** check if approve ***
    checkApprove() {
        this.contractDAI.allowance.call(this.state.accountAddress, this.addressPool, (err, ret) => {
            if (err) {
                this.setState({
                    ...this.state,
                    approvedDAI: false
                });
            }
            if (ret && ret.c[0] > 0) {
                this.setState({
                    ...this.state,
                    approvedDAI: true
                });
            } else {
                this.setState({
                    ...this.state,
                    approvedDAI: false
                });
            }
        });
        this.contractPAX.allowance.call(this.state.accountAddress, this.addressPool, (err, ret) => {
            if (err) {
                this.setState({
                    ...this.state,
                    approvedPAX: false
                });
            }
            if (ret && ret.c[0] > 0) {
                this.setState({
                    ...this.state,
                    approvedPAX: true
                });
            } else {
                this.setState({
                    ...this.state,
                    approvedPAX: false
                });
            }
        });
        this.contractTUSD.allowance.call(this.state.accountAddress, this.addressPool, (err, ret) => {
            if (err) {
                this.setState({
                    ...this.state,
                    approvedTUSD: false
                });
            }
            if (ret && ret.c[0] > 0) {
                this.setState({
                    ...this.state,
                    approvedTUSD: true
                });
            } else {
                this.setState({
                    ...this.state,
                    approvedTUSD: false
                });
            }
        });
        this.contractUSDC.allowance.call(this.state.accountAddress, this.addressPool, (err, ret) => {
            if (err) {
                this.setState({
                    ...this.state,
                    approvedUSDC: false
                });
            }
            if (ret && ret.c[0] > 0) {
                this.setState({
                    ...this.state,
                    approvedUSDC: true
                });
            } else {
                this.setState({
                    ...this.state,
                    approvedUSDC: false
                });
            }
        });
        this.contractDF.allowance.call(this.state.accountAddress, this.addressEngine, (err, ret) => {
            if (err) {
                this.setState({
                    ...this.state,
                    approvedDF: false
                });
            }
            if (ret && ret.c[0] > 0) {
                this.setState({
                    ...this.state,
                    approvedDF: true
                });
            } else {
                this.setState({
                    ...this.state,
                    approvedDF: false
                });
            }
        });
        this.contractUSDx.allowance.call(this.state.accountAddress, this.addressEngine, (err, ret) => {
            if (err) {
                this.setState({
                    ...this.state,
                    approvedUSDx: false
                });
            }
            if (ret && ret.c[0] > 0) {
                this.setState({
                    ...this.state,
                    approvedUSDx: true
                });
            } else {
                this.setState({
                    ...this.state,
                    approvedUSDx: false
                });
            }
        });
    }


    // *** Approve ***
    approve(token) {
        if (!this.state.isConnected) {
            return;
        }

        Cookie.save('curAccount', this.state.accountAddress, { path: '/' });

        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Approve ' + token) {
                return;
            }
        }

        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Approve ' + token
        }
        this.setState({ tmepState });

        // witch token to be approved
        if (token === 'DAI') {
            this.contractDAI.approve.estimateGas(
                this.addressPool,
                -1,
                {
                    from: this.state.accountAddress
                },
                (err, gasLimit) => {
                    this.contractDAI.approve.sendTransaction(
                        this.addressPool,
                        -1,
                        {
                            from: this.state.accountAddress,
                            gas: Math.ceil(gasLimit * this.gasRatio),
                            gasPrice: this.state.gasPrice
                        },
                        (err, ret) => {
                            if (err) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Approve ' + token) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'User reject transaction'
                                        }
                                        this.setState({ tmepState });

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({ tmepState });
                                        }, 3000);
                                    };
                                    return false;
                                });
                            }
                            if (ret) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;

                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Approve ' + token) {
                                        tmepState.transcations[key].txhash = ret;
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            msg: 'Waiting for confirmation...'
                                        }
                                        this.setState({ tmepState });
                                    };
                                    return false;
                                });

                                var approveDAItimer = setInterval(() => {
                                    console.log('i am checking approve DAI...');
                                    this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                        if (data && data.status === '0x1') {
                                            clearInterval(approveDAItimer);
                                            if (Cookie.load('curAccount') === this.state.accountAddress) {
                                                this.setState({
                                                    ...this.state,
                                                    approvedDAI: true
                                                });
                                            }
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'success',
                                                        msg: 'Transaction succeeded'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                            if (this.state.fromDepositDAI) {
                                                if (Cookie.load('curAccount') === this.state.accountAddress) {
                                                    this.setState({
                                                        ...this.state,
                                                        fromDepositDAI: false
                                                    });
                                                    setTimeout(() => {
                                                        this.deposit();
                                                    }, 4000)
                                                } else {
                                                    return false;
                                                }
                                            }
                                            if (this.state.fromGenerateMax) {
                                                if (Cookie.load('curAccount') === this.state.accountAddress) {
                                                    this.setState({
                                                        ...this.state,
                                                        fromGenerateMax: false
                                                    });
                                                    setTimeout(() => {
                                                        this.toGenerateMax(this.state.toGenerateMaxNum);
                                                    }, 4000)
                                                } else {
                                                    return false;
                                                }
                                            }
                                        }
                                        if (data && data.status === '0x0') {
                                            clearInterval(approveDAItimer);
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'error',
                                                        msg: 'Transaction failed'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                        }
                                    })
                                }, 2000);
                            }
                        }
                    );
                }
            )
        } else if (token === 'PAX') {
            this.contractPAX.approve.estimateGas(
                this.addressPool,
                -1,
                {
                    from: this.state.accountAddress
                },
                (err, gasLimit) => {
                    this.contractPAX.approve.sendTransaction(
                        this.addressPool,
                        -1,
                        {
                            from: this.state.accountAddress,
                            gas: Math.ceil(gasLimit * this.gasRatio),
                            gasPrice: this.state.gasPrice
                        },
                        (err, ret) => {
                            if (err) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Approve ' + token) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'User reject transaction'
                                        }
                                        this.setState({ tmepState });

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({ tmepState });
                                        }, 3000);
                                    };
                                    return false;
                                });
                            }
                            if (ret) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;

                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Approve ' + token) {
                                        tmepState.transcations[key].txhash = ret;
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            msg: 'Waiting for confirmation...'
                                        }
                                        this.setState({ tmepState });
                                    };
                                    return false;
                                });

                                var approvePAXtimer = setInterval(() => {
                                    console.log('i am checking approve PAX...');
                                    this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                        if (data && data.status === '0x1') {
                                            clearInterval(approvePAXtimer);
                                            if (Cookie.load('curAccount') === this.state.accountAddress) {
                                                this.setState({
                                                    ...this.state,
                                                    approvedPAX: true
                                                });
                                            }
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'success',
                                                        msg: 'Transaction succeeded'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                            if (this.state.fromDepositPAX) {
                                                if (Cookie.load('curAccount') === this.state.accountAddress) {
                                                    this.setState({
                                                        ...this.state,
                                                        fromDepositPAX: false
                                                    });
                                                    setTimeout(() => {
                                                        this.deposit();
                                                    }, 4000)
                                                } else {
                                                    return false;
                                                }
                                            }
                                            if (this.state.fromGenerateMax) {
                                                if (Cookie.load('curAccount') === this.state.accountAddress) {
                                                    this.setState({
                                                        ...this.state,
                                                        fromGenerateMax: false
                                                    });
                                                    setTimeout(() => {
                                                        this.toGenerateMax(this.state.toGenerateMaxNum);
                                                    }, 4000)
                                                } else {
                                                    return false;
                                                }
                                            }
                                        }
                                        if (data && data.status === '0x0') {
                                            clearInterval(approvePAXtimer);
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'error',
                                                        msg: 'Transaction failed'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                        }
                                    })
                                }, 2000);
                            }
                        }
                    );
                }
            )
        } else if (token === 'TUSD') {
            this.contractTUSD.approve.estimateGas(
                this.addressPool,
                -1,
                {
                    from: this.state.accountAddress
                },
                (err, gasLimit) => {
                    this.contractTUSD.approve.sendTransaction(
                        this.addressPool,
                        -1,
                        {
                            from: this.state.accountAddress,
                            gas: Math.ceil(gasLimit * this.gasRatio),
                            gasPrice: this.state.gasPrice
                        },
                        (err, ret) => {
                            if (err) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Approve ' + token) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'User reject transaction'
                                        }
                                        this.setState({ tmepState });

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({ tmepState });
                                        }, 3000);
                                    };
                                    return false;
                                });
                            }
                            if (ret) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;

                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Approve ' + token) {
                                        tmepState.transcations[key].txhash = ret;
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            msg: 'Waiting for confirmation...'
                                        }
                                        this.setState({ tmepState });
                                    };
                                    return false;
                                });

                                var approveTUSDtimer = setInterval(() => {
                                    console.log('i am checking approve TUSD...');
                                    this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                        if (data && data.status === '0x1') {
                                            clearInterval(approveTUSDtimer);
                                            if (Cookie.load('curAccount') === this.state.accountAddress) {
                                                this.setState({
                                                    ...this.state,
                                                    approvedTUSD: true
                                                });
                                            }
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'success',
                                                        msg: 'Transaction succeeded'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                            if (this.state.fromDepositTUSD) {
                                                if (Cookie.load('curAccount') === this.state.accountAddress) {
                                                    this.setState({
                                                        ...this.state,
                                                        fromDepositTUSD: false
                                                    });
                                                    setTimeout(() => {
                                                        this.deposit();
                                                    }, 4000)
                                                } else {
                                                    return false;
                                                }
                                            }
                                            if (this.state.fromGenerateMax) {
                                                if (Cookie.load('curAccount') === this.state.accountAddress) {
                                                    this.setState({
                                                        ...this.state,
                                                        fromGenerateMax: false
                                                    });
                                                    setTimeout(() => {
                                                        this.toGenerateMax(this.state.toGenerateMaxNum);
                                                    }, 4000)
                                                } else {
                                                    return false;
                                                }
                                            }
                                        }
                                        if (data && data.status === '0x0') {
                                            clearInterval(approveTUSDtimer);
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'error',
                                                        msg: 'Transaction failed'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                        }
                                    })
                                }, 2000);
                            }
                        }
                    );
                }
            )
        } else if (token === 'USDC') {
            this.contractUSDC.approve.estimateGas(
                this.addressPool,
                -1,
                {
                    from: this.state.accountAddress
                },
                (err, gasLimit) => {
                    this.contractUSDC.approve.sendTransaction(
                        this.addressPool,
                        -1,
                        {
                            from: this.state.accountAddress,
                            gas: Math.ceil(gasLimit * this.gasRatio),
                            gasPrice: this.state.gasPrice
                        },
                        (err, ret) => {
                            if (err) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Approve ' + token) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'User reject transaction'
                                        }
                                        this.setState({ tmepState });

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({ tmepState });
                                        }, 3000);
                                    };
                                    return false;
                                });
                            }
                            if (ret) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;

                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Approve ' + token) {
                                        tmepState.transcations[key].txhash = ret;
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            msg: 'Waiting for confirmation...'
                                        }
                                        this.setState({ tmepState });
                                    };
                                    return false;
                                });

                                var approveUSDCtimer = setInterval(() => {
                                    console.log('i am checking approve USDC...');
                                    this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                        if (data && data.status === '0x1') {
                                            clearInterval(approveUSDCtimer);
                                            if (Cookie.load('curAccount') === this.state.accountAddress) {
                                                this.setState({
                                                    ...this.state,
                                                    approvedUSDC: true
                                                });
                                            }
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'success',
                                                        msg: 'Transaction succeeded'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                            if (this.state.fromDepositUSDC) {
                                                if (Cookie.load('curAccount') === this.state.accountAddress) {
                                                    this.setState({
                                                        ...this.state,
                                                        fromDepositUSDC: false
                                                    });
                                                    setTimeout(() => {
                                                        this.deposit();
                                                    }, 4000)
                                                } else {
                                                    return false;
                                                }
                                            }
                                            if (this.state.fromGenerateMax) {
                                                if (Cookie.load('curAccount') === this.state.accountAddress) {
                                                    this.setState({
                                                        ...this.state,
                                                        fromGenerateMax: false
                                                    });
                                                    setTimeout(() => {
                                                        this.toGenerateMax(this.state.toGenerateMaxNum);
                                                    }, 4000)
                                                } else {
                                                    return false;
                                                }
                                            }
                                        }
                                        if (data && data.status === '0x0') {
                                            clearInterval(approveUSDCtimer);
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'error',
                                                        msg: 'Transaction failed'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                        }
                                    })
                                }, 2000);
                            }
                        }
                    );
                }
            )
        } else if (token === 'DF') {
            this.contractDF.approve.estimateGas(
                this.addressEngine,
                -1,
                {
                    from: this.state.accountAddress
                },
                (err, gasLimit) => {
                    this.contractDF.approve.sendTransaction(
                        this.addressEngine,
                        -1,
                        {
                            from: this.state.accountAddress,
                            gas: Math.ceil(gasLimit * this.gasRatio),
                            gasPrice: this.state.gasPrice
                        },
                        (err, ret) => {
                            if (err) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Approve ' + token) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'User reject transaction'
                                        }
                                        this.setState({ tmepState });

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({ tmepState });
                                        }, 3000);
                                    };
                                    return false;
                                });
                            }
                            if (ret) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;

                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Approve ' + token) {
                                        tmepState.transcations[key].txhash = ret;
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            msg: 'Waiting for confirmation...'
                                        }
                                        this.setState({ tmepState });
                                    };
                                    return false;
                                });

                                var approveDFtimer = setInterval(() => {
                                    console.log('i am checking approve DF...');
                                    this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                        if (data && data.status === '0x1') {
                                            clearInterval(approveDFtimer);
                                            if (Cookie.load('curAccount') === this.state.accountAddress) {
                                                this.setState({
                                                    ...this.state,
                                                    approvedDF: true
                                                });
                                            }
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'success',
                                                        msg: 'Transaction succeeded'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                            if (this.state.fromDestroy1) {
                                                if (Cookie.load('curAccount') === this.state.accountAddress) {
                                                    this.setState({
                                                        ...this.state,
                                                        fromDestroy1: false
                                                    });
                                                    setTimeout(() => {
                                                        this.destroy();
                                                    }, 4000)
                                                } else {
                                                    return false;
                                                }
                                            }
                                        }
                                        if (data && data.status === '0x0') {
                                            clearInterval(approveDFtimer);
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'error',
                                                        msg: 'Transaction failed'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                        }
                                    })
                                }, 2000);
                            }
                        }
                    );
                }
            )
        } else if (token === 'USDx') {
            this.contractUSDx.approve.estimateGas(
                this.addressEngine,
                -1,
                {
                    from: this.state.accountAddress
                },
                (err, gasLimit) => {
                    this.contractUSDx.approve.sendTransaction(
                        this.addressEngine,
                        -1,
                        {
                            from: this.state.accountAddress,
                            gas: Math.ceil(gasLimit * this.gasRatio),
                            gasPrice: this.state.gasPrice
                        },
                        (err, ret) => {
                            if (err) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Approve ' + token) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'User reject transaction'
                                        }
                                        this.setState({ tmepState });

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({ tmepState });
                                        }, 3000);
                                    };
                                    return false;
                                });
                            }
                            if (ret) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;

                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Approve ' + token) {
                                        tmepState.transcations[key].txhash = ret;
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            msg: 'Waiting for confirmation...'
                                        }
                                        this.setState({ tmepState });
                                    };
                                    return false;
                                });

                                var approveUSDxtimer = setInterval(() => {
                                    console.log('i am checking approve USDx...');
                                    this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                        if (data && data.status === '0x1') {
                                            clearInterval(approveUSDxtimer);
                                            if (Cookie.load('curAccount') === this.state.accountAddress) {
                                                this.setState({
                                                    ...this.state,
                                                    approvedUSDx: true
                                                });
                                            }
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'success',
                                                        msg: 'Transaction succeeded'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                            if (this.state.fromDestroy2) {
                                                if (Cookie.load('curAccount') === this.state.accountAddress) {
                                                    this.setState({
                                                        ...this.state,
                                                        fromDestroy2: false
                                                    });
                                                    setTimeout(() => {
                                                        this.destroy();
                                                    }, 4000)
                                                } else {
                                                    return false;
                                                }
                                            }
                                        }
                                        if (data && data.status === '0x0') {
                                            clearInterval(approveUSDxtimer);
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'error',
                                                        msg: 'Transaction failed'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                        }
                                    })
                                }, 2000);
                            }
                        }
                    );
                }
            )
        }
    }


    // *** Lock ***
    lock(token) {
        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Lock ' + token) {
                return;
            }
        }

        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Lock ' + token,
        }
        this.setState({ tmepState });

        // witch token to be locked
        if (token === 'DAI') {
            this.contractDAI.approve.estimateGas(
                this.addressPool,
                0,
                {
                    from: this.state.accountAddress
                },
                (err, gasLimit) => {
                    this.contractDAI.approve.sendTransaction(
                        this.addressPool,
                        0,
                        {
                            from: this.state.accountAddress,
                            gas: Math.ceil(gasLimit * this.gasRatio),
                            gasPrice: this.state.gasPrice
                        },
                        (err, ret) => {
                            if (err) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Lock ' + token) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'User reject transaction'
                                        }
                                        this.setState({ tmepState });

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({ tmepState });
                                        }, 3000);
                                    };
                                    return false;
                                });
                            }
                            if (ret) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;

                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Lock ' + token) {
                                        tmepState.transcations[key].txhash = ret;
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            msg: 'Waiting for confirmation...'
                                        }
                                        this.setState({ tmepState });
                                    };
                                    return false;
                                });

                                var lockDAItimer = setInterval(() => {
                                    console.log('i am checking lock DAI...');
                                    this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                        if (data && data.status === '0x1') {
                                            clearInterval(lockDAItimer);
                                            this.setState({
                                                ...this.state,
                                                approvedDAI: false
                                            });
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'success',
                                                        msg: 'Transaction succeeded'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                        }
                                        if (data && data.status === '0x0') {
                                            clearInterval(lockDAItimer);
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'error',
                                                        msg: 'Transaction failed'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                        }
                                    })
                                }, 2000);
                            }
                        }
                    );
                }
            )
        } else if (token === 'PAX') {
            this.contractPAX.approve.estimateGas(
                this.addressPool,
                0,
                {
                    from: this.state.accountAddress
                },
                (err, gasLimit) => {
                    this.contractPAX.approve.sendTransaction(
                        this.addressPool,
                        0,
                        {
                            from: this.state.accountAddress,
                            gas: Math.ceil(gasLimit * this.gasRatio),
                            gasPrice: this.state.gasPrice
                        },
                        (err, ret) => {
                            if (err) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Lock ' + token) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'User reject transaction'
                                        }
                                        this.setState({ tmepState });

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({ tmepState });
                                        }, 3000);
                                    };
                                    return false;
                                });
                            }
                            if (ret) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;

                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Lock ' + token) {
                                        tmepState.transcations[key].txhash = ret;
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            msg: 'Waiting for confirmation...'
                                        }
                                        this.setState({ tmepState });
                                    };
                                    return false;
                                });

                                var lockPAXtimer = setInterval(() => {
                                    console.log('i am checking lock PAX...');
                                    this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                        if (data && data.status === '0x1') {
                                            clearInterval(lockPAXtimer);
                                            this.setState({
                                                ...this.state,
                                                approvedPAX: false
                                            });
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'success',
                                                        msg: 'Transaction succeeded'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                        }
                                        if (data && data.status === '0x0') {
                                            clearInterval(lockPAXtimer);
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'error',
                                                        msg: 'Transaction failed'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                        }
                                    })
                                }, 2000);
                            }
                        }
                    );
                }
            )
        } else if (token === 'TUSD') {
            this.contractTUSD.approve.estimateGas(
                this.addressPool,
                0,
                {
                    from: this.state.accountAddress
                },
                (err, gasLimit) => {
                    this.contractTUSD.approve.sendTransaction(
                        this.addressPool,
                        0,
                        {
                            from: this.state.accountAddress,
                            gas: Math.ceil(gasLimit * this.gasRatio),
                            gasPrice: this.state.gasPrice
                        },
                        (err, ret) => {
                            if (err) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Lock ' + token) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'User reject transaction'
                                        }
                                        this.setState({ tmepState });

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({ tmepState });
                                        }, 3000);
                                    };
                                    return false;
                                });
                            }
                            if (ret) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;

                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Lock ' + token) {
                                        tmepState.transcations[key].txhash = ret;
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            msg: 'Waiting for confirmation...'
                                        }
                                        this.setState({ tmepState });
                                    };
                                    return false;
                                });

                                var lockTUSDtimer = setInterval(() => {
                                    console.log('i am checking lock TUSD...');
                                    this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                        if (data && data.status === '0x1') {
                                            clearInterval(lockTUSDtimer);
                                            this.setState({
                                                ...this.state,
                                                approvedTUSD: false
                                            });
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'success',
                                                        msg: 'Transaction succeeded'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                        }
                                        if (data && data.status === '0x0') {
                                            clearInterval(lockTUSDtimer);
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'error',
                                                        msg: 'Transaction failed'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                        }
                                    })
                                }, 2000);
                            }
                        }
                    );
                }
            )
        } else if (token === 'USDC') {
            this.contractUSDC.approve.estimateGas(
                this.addressPool,
                0,
                {
                    from: this.state.accountAddress
                },
                (err, gasLimit) => {
                    this.contractUSDC.approve.sendTransaction(
                        this.addressPool,
                        0,
                        {
                            from: this.state.accountAddress,
                            gas: Math.ceil(gasLimit * this.gasRatio),
                            gasPrice: this.state.gasPrice
                        },
                        (err, ret) => {
                            if (err) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Lock ' + token) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'User reject transaction'
                                        }
                                        this.setState({ tmepState });

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({ tmepState });
                                        }, 3000);
                                    };
                                    return false;
                                });
                            }
                            if (ret) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;

                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Lock ' + token) {
                                        tmepState.transcations[key].txhash = ret;
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            msg: 'Waiting for confirmation...'
                                        }
                                        this.setState({ tmepState });
                                    };
                                    return false;
                                });

                                var lockUSDCtimer = setInterval(() => {
                                    console.log('i am checking lock USDC...');
                                    this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                        if (data && data.status === '0x1') {
                                            clearInterval(lockUSDCtimer);
                                            this.setState({
                                                ...this.state,
                                                approvedUSDC: false
                                            });
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'success',
                                                        msg: 'Transaction succeeded'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                        }
                                        if (data && data.status === '0x0') {
                                            clearInterval(lockUSDCtimer);
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'error',
                                                        msg: 'Transaction failed'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                        }
                                    })
                                }, 2000);
                            }
                        }
                    );
                }
            )
        } else if (token === 'DF') {
            this.contractDF.approve.estimateGas(
                this.addressEngine,
                0,
                {
                    from: this.state.accountAddress
                },
                (err, gasLimit) => {
                    this.contractDF.approve.sendTransaction(
                        this.addressEngine,
                        0,
                        {
                            from: this.state.accountAddress,
                            gas: Math.ceil(gasLimit * this.gasRatio),
                            gasPrice: this.state.gasPrice
                        },
                        (err, ret) => {
                            if (err) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Lock ' + token) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'User reject transaction'
                                        }
                                        this.setState({ tmepState });

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({ tmepState });
                                        }, 3000);
                                    };
                                    return false;
                                });
                            }
                            if (ret) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;

                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Lock ' + token) {
                                        tmepState.transcations[key].txhash = ret;
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            msg: 'Waiting for confirmation...'
                                        }
                                        this.setState({ tmepState });
                                    };
                                    return false;
                                });

                                var lockDFtimer = setInterval(() => {
                                    console.log('i am checking lock DF...');
                                    this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                        if (data && data.status === '0x1') {
                                            clearInterval(lockDFtimer);
                                            this.setState({
                                                ...this.state,
                                                approvedDF: false
                                            });
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'success',
                                                        msg: 'Transaction succeeded'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                        }
                                        if (data && data.status === '0x0') {
                                            clearInterval(lockDFtimer);
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'error',
                                                        msg: 'Transaction failed'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                        }
                                    })
                                }, 2000);
                            }
                        }
                    );
                }
            )
        } else if (token === 'USDx') {
            this.contractUSDx.approve.estimateGas(
                this.addressEngine,
                0,
                {
                    from: this.state.accountAddress
                },
                (err, gasLimit) => {
                    this.contractUSDx.approve.sendTransaction(
                        this.addressEngine,
                        0,
                        {
                            from: this.state.accountAddress,
                            gas: Math.ceil(gasLimit * this.gasRatio),
                            gasPrice: this.state.gasPrice
                        },
                        (err, ret) => {
                            if (err) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Lock ' + token) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'User reject transaction'
                                        }
                                        this.setState({ tmepState });

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({ tmepState });
                                        }, 3000);
                                    };
                                    return false;
                                });
                            }
                            if (ret) {
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;

                                keys.map((key) => {
                                    if (tmepState.transcations[key].title === 'Lock ' + token) {
                                        tmepState.transcations[key].txhash = ret;
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            msg: 'Waiting for confirmation...'
                                        }
                                        this.setState({ tmepState });
                                    };
                                    return false;
                                });

                                var lockUSDxtimer = setInterval(() => {
                                    console.log('i am checking lock USDx...');
                                    this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                        if (data && data.status === '0x1') {
                                            clearInterval(lockUSDxtimer);
                                            this.setState({
                                                ...this.state,
                                                approvedUSDx: false
                                            });
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'success',
                                                        msg: 'Transaction succeeded'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                        }
                                        if (data && data.status === '0x0') {
                                            clearInterval(lockUSDxtimer);
                                            const keys = Object.keys(this.state.transcations);
                                            const tmepState = this.state;
                                            keys.map((key) => {
                                                if (tmepState.transcations[key].txhash === ret) {
                                                    tmepState.transcations[key] = {
                                                        ...tmepState.transcations[key],
                                                        class: 'error',
                                                        msg: 'Transaction failed'
                                                    }
                                                    this.setState({ tmepState });

                                                    setTimeout(() => {
                                                        delete tmepState.transcations[key];
                                                        this.setState({ tmepState });
                                                    }, 3000);
                                                };
                                                return false;
                                            })
                                        }
                                    })
                                }, 2000);
                            }
                        }
                    );
                }
            )
        }
    }


    // *** adjust Max To Withdraw ***
    adjustMaxToWithdraw() {
        if (this.state.toWithdraw === 'DAI') {
            this.setState({
                ...this.state,
                toWithdrawNum: this.state.myDAIonPoolOrigin
            })
        }
        if (this.state.toWithdraw === 'PAX') {
            this.setState({
                ...this.state,
                toWithdrawNum: this.state.myPAXonPoolOrigin
            })
        }
        if (this.state.toWithdraw === 'TUSD') {
            this.setState({
                ...this.state,
                toWithdrawNum: this.state.myTUSDonPoolOrigin
            })
        }
        if (this.state.toWithdraw === 'USDC') {
            this.setState({
                ...this.state,
                toWithdrawNum: this.state.myUSDConPoolOrigin
            })
        }

        setTimeout(() => {
            this.withdrawNumChange(this.state.toWithdrawNum);
        }, 500)
    }
    // *** withdraw ***
    withdrawNumChange(val) {
        if (val.length > 20) {
            return;
        }
        if (this.state.toWithdraw === 'DAI') {
            if (Number(val) > 0 && Number(val) <= Number(this.state.myDAIonPoolOrigin)) {
                this.setState({
                    ...this.state,
                    errTipsWithdraw: false,
                    couldWithdraw: true,
                    toWithdrawNum: val
                })
            } else {
                this.setState({
                    ...this.state,
                    errTipsWithdraw: true,
                    couldWithdraw: false,
                    toWithdrawNum: val
                })
                if (val === '' || Number(val) === 0) {
                    this.setState({
                        ...this.state,
                        errTipsWithdraw: false,
                        couldWithdraw: false,
                        toWithdrawNum: val
                    })
                }
            }
        }
        if (this.state.toWithdraw === 'PAX') {
            if (Number(val) > 0 && Number(val) <= Number(this.state.myPAXonPoolOrigin)) {
                this.setState({
                    ...this.state,
                    errTipsWithdraw: false,
                    couldWithdraw: true,
                    toWithdrawNum: val
                })
            } else {
                this.setState({
                    ...this.state,
                    errTipsWithdraw: true,
                    couldWithdraw: false,
                    toWithdrawNum: val
                })
                if (val === '' || Number(val) === 0) {
                    this.setState({
                        ...this.state,
                        errTipsWithdraw: false,
                        couldWithdraw: false,
                        toWithdrawNum: val
                    })
                }
            }
        }
        if (this.state.toWithdraw === 'TUSD') {
            if (Number(val) > 0 && Number(val) <= Number(this.state.myTUSDonPoolOrigin)) {
                this.setState({
                    ...this.state,
                    errTipsWithdraw: false,
                    couldWithdraw: true,
                    toWithdrawNum: val
                })
            } else {
                this.setState({
                    ...this.state,
                    errTipsWithdraw: true,
                    couldWithdraw: false,
                    toWithdrawNum: val
                })
                if (val === '' || Number(val) === 0) {
                    this.setState({
                        ...this.state,
                        errTipsWithdraw: false,
                        couldWithdraw: false,
                        toWithdrawNum: val
                    })
                }
            }
        }
        if (this.state.toWithdraw === 'USDC') {
            if (Number(val) > 0 && Number(val) <= Number(this.state.myUSDConPoolOrigin)) {
                this.setState({
                    ...this.state,
                    errTipsWithdraw: false,
                    couldWithdraw: true,
                    toWithdrawNum: val
                })
            } else {
                this.setState({
                    ...this.state,
                    errTipsWithdraw: true,
                    couldWithdraw: false,
                    toWithdrawNum: val
                })
                if (val === '' || Number(val) === 0) {
                    this.setState({
                        ...this.state,
                        errTipsWithdraw: false,
                        couldWithdraw: false,
                        toWithdrawNum: val
                    })
                }
            }
        }
    }
    withdrawOptChange(token) {
        this.setState({
            ...this.state,
            toWithdraw: token
        }, () => {
            if (!this.state.toWithdrawNum) {
                return;
            }
            this.withdrawNumChange(this.state.toWithdrawNum);
        })

        // setTimeout(() => {
        //     if (!this.state.toWithdrawNum) {
        //         return;
        //     }
        //     this.withdrawNumChange(this.state.toWithdrawNum);
        // }, 0);
    }
    withdraw() {
        if (!this.state.couldWithdraw) {
            return;
        }
        var addr;
        var num;
        if (this.state.toWithdraw === 'DAI') {
            addr = this.addressDAI;
            num = this.Web3.toBigNumber(this.state.toWithdrawNum).mul(this.Web3.toBigNumber(10 ** this.state.decimalsDAI));
            this.withdrawDAI(addr, num);
        } else if (this.state.toWithdraw === 'PAX') {
            addr = this.addressPAX;
            num = this.Web3.toBigNumber(this.state.toWithdrawNum).mul(this.Web3.toBigNumber(10 ** this.state.decimalsPAX));
            this.withdrawPAX(addr, num);
        } else if (this.state.toWithdraw === 'TUSD') {
            addr = this.addressTUSD;
            num = this.Web3.toBigNumber(this.state.toWithdrawNum).mul(this.Web3.toBigNumber(10 ** this.state.decimalsTUSD));
            this.withdrawTUSD(addr, num);
        } else if (this.state.toWithdraw === 'USDC') {
            addr = this.addressUSDC;
            num = this.Web3.toBigNumber(this.state.toWithdrawNum).mul(this.Web3.toBigNumber(10 ** this.state.decimalsUSDC));
            this.withdrawUSDC(addr, num);
        }
    }
    withdrawDAI(addr, num) {
        var str1;
        var str2;
        if (num.div(10 ** this.state.decimalsDAI).toString(10).indexOf('.') > 0) {
            str1 = this.toThousands(num.div(10 ** this.state.decimalsDAI).toString(10).split('.')[0]);
            str2 = '.' + num.div(10 ** this.state.decimalsDAI).toString(10).split('.')[1];
        } else {
            str1 = this.toThousands(num.div(10 ** this.state.decimalsDAI).toString(10));
            str2 = '';
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Withdraw ' + str1 + str2 + ' DAI',
        }
        this.setState({ tmepState });
        // get Limit first
        this.contractProtocol.withdraw.estimateGas(
            addr,
            0,
            num,
            {
                from: this.state.accountAddress
            },
            (err, gasLimit) => {
                this.contractProtocol.withdraw.sendTransaction(
                    addr,
                    0,
                    num,
                    {
                        from: this.state.accountAddress,
                        gas: Math.ceil(gasLimit * this.gasRatio),
                        gasPrice: this.state.gasPrice
                    },
                    (err, ret) => {
                        if (err) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;
                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        class: 'error',
                                        msg: 'User reject transaction'
                                    }
                                    this.setState({ tmepState });

                                    setTimeout(() => {
                                        delete tmepState.transcations[key];
                                        this.setState({ tmepState });
                                    }, 3000);
                                };
                                return false;
                            });
                        }
                        if (ret) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;

                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    this.setState({ tmepState });
                                };
                                return false;
                            });

                            var timerOBJ = {};
                            var tempRnum = Math.random();
                            timerOBJ[tempRnum] = setInterval(() => {
                                console.log('i am checking withdraw DAI... =>' + tempRnum);
                                this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                tmepState.toWithdrawNum = '';
                                                tmepState.couldWithdraw = false;
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        setTimeout(() => {
                                            this.getMyBalance();
                                            this.getPoolBankTotalStatus();
                                            this.getUserWithdrawBalance();
                                        }, 3000)
                                        // !!window.ethereum.isImToken
                                        if (!!window.ethereum.isImToken) {
                                            var itemHistory = {
                                                event: 'Withdraw',
                                                title: 'Withdraw ' + str1 + str2 + ' DAI',
                                                transactionHash: ret,
                                                timeStamp: new Date().getTime()
                                            };
                                            var tmphistory = this.state.myHistory;
                                            tmphistory.unshift(itemHistory);
                                            this.setState({
                                                ...this.state,
                                                myHistory: tmphistory
                                            })
                                            var localHistory = JSON.parse(localStorage.getItem(this.state.accountAddress));
                                            localHistory[this.state.netType].history.unshift(itemHistory);
                                            localStorage.setItem(this.state.accountAddress, JSON.stringify(localHistory));
                                        }
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'error',
                                                    msg: 'Transaction failed'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                    }
                                })
                            }, 2000);
                        }
                    }
                )
            }
        )
    }
    withdrawPAX(addr, num) {
        var str1;
        var str2;
        if (num.div(10 ** this.state.decimalsPAX).toString(10).indexOf('.') > 0) {
            str1 = this.toThousands(num.div(10 ** this.state.decimalsPAX).toString(10).split('.')[0]);
            str2 = '.' + num.div(10 ** this.state.decimalsPAX).toString(10).split('.')[1];
        } else {
            str1 = this.toThousands(num.div(10 ** this.state.decimalsPAX).toString(10));
            str2 = '';
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Withdraw ' + str1 + str2 + ' PAX',
        }
        this.setState({ tmepState });
        // get Limit first
        this.contractProtocol.withdraw.estimateGas(
            addr,
            0,
            num,
            {
                from: this.state.accountAddress
            },
            (err, gasLimit) => {
                this.contractProtocol.withdraw.sendTransaction(
                    addr,
                    0,
                    num,
                    {
                        from: this.state.accountAddress,
                        gas: Math.ceil(gasLimit * this.gasRatio),
                        gasPrice: this.state.gasPrice
                    },
                    (err, ret) => {
                        if (err) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;
                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        class: 'error',
                                        msg: 'User reject transaction'
                                    }
                                    this.setState({ tmepState });

                                    setTimeout(() => {
                                        delete tmepState.transcations[key];
                                        this.setState({ tmepState });
                                    }, 3000);
                                };
                                return false;
                            });
                        }
                        if (ret) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;

                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    this.setState({ tmepState });
                                };
                                return false;
                            });

                            var timerOBJ = {};
                            var tempRnum = Math.random();
                            timerOBJ[tempRnum] = setInterval(() => {
                                console.log('i am checking withdraw PAX... =>' + tempRnum);
                                this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                tmepState.toWithdrawNum = '';
                                                tmepState.couldWithdraw = false;
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        setTimeout(() => {
                                            this.getMyBalance();
                                            this.getPoolBankTotalStatus();
                                            this.getUserWithdrawBalance();
                                        }, 3000)
                                        // !!window.ethereum.isImToken
                                        if (!!window.ethereum.isImToken) {
                                            var itemHistory = {
                                                event: 'Withdraw',
                                                title: 'Withdraw ' + str1 + str2 + ' PAX',
                                                transactionHash: ret,
                                                timeStamp: new Date().getTime()
                                            };
                                            var tmphistory = this.state.myHistory;
                                            tmphistory.unshift(itemHistory);
                                            this.setState({
                                                ...this.state,
                                                myHistory: tmphistory
                                            })
                                            var localHistory = JSON.parse(localStorage.getItem(this.state.accountAddress));
                                            localHistory[this.state.netType].history.unshift(itemHistory);
                                            localStorage.setItem(this.state.accountAddress, JSON.stringify(localHistory));
                                        }
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'error',
                                                    msg: 'Transaction failed'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                    }
                                })
                            }, 2000);
                        }
                    }
                )
            }
        )
    }
    withdrawTUSD(addr, num) {
        var str1;
        var str2;
        if (num.div(10 ** this.state.decimalsTUSD).toString(10).indexOf('.') > 0) {
            str1 = this.toThousands(num.div(10 ** this.state.decimalsTUSD).toString(10).split('.')[0]);
            str2 = '.' + num.div(10 ** this.state.decimalsTUSD).toString(10).split('.')[1];
        } else {
            str1 = this.toThousands(num.div(10 ** this.state.decimalsTUSD).toString(10));
            str2 = '';
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Withdraw ' + str1 + str2 + ' TUSD',
        }
        this.setState({ tmepState });
        // get Limit first
        this.contractProtocol.withdraw.estimateGas(
            addr,
            0,
            num,
            {
                from: this.state.accountAddress
            },
            (err, gasLimit) => {
                this.contractProtocol.withdraw.sendTransaction(
                    addr,
                    0,
                    num,
                    {
                        from: this.state.accountAddress,
                        gas: Math.ceil(gasLimit * this.gasRatio),
                        gasPrice: this.state.gasPrice
                    },
                    (err, ret) => {
                        if (err) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;
                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        class: 'error',
                                        msg: 'User reject transaction'
                                    }
                                    this.setState({ tmepState });

                                    setTimeout(() => {
                                        delete tmepState.transcations[key];
                                        this.setState({ tmepState });
                                    }, 3000);
                                };
                                return false;
                            });
                        }
                        if (ret) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;

                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    this.setState({ tmepState });
                                };
                                return false;
                            });

                            var timerOBJ = {};
                            var tempRnum = Math.random();
                            timerOBJ[tempRnum] = setInterval(() => {
                                console.log('i am checking withdraw TUSD... =>' + tempRnum);
                                this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                tmepState.toWithdrawNum = '';
                                                tmepState.couldWithdraw = false;
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        setTimeout(() => {
                                            this.getMyBalance();
                                            this.getPoolBankTotalStatus();
                                            this.getUserWithdrawBalance();
                                        }, 3000)
                                        // !!window.ethereum.isImToken
                                        if (!!window.ethereum.isImToken) {
                                            var itemHistory = {
                                                event: 'Withdraw',
                                                title: 'Withdraw ' + str1 + str2 + ' TUSD',
                                                transactionHash: ret,
                                                timeStamp: new Date().getTime()
                                            };
                                            var tmphistory = this.state.myHistory;
                                            tmphistory.unshift(itemHistory);
                                            this.setState({
                                                ...this.state,
                                                myHistory: tmphistory
                                            })
                                            var localHistory = JSON.parse(localStorage.getItem(this.state.accountAddress));
                                            localHistory[this.state.netType].history.unshift(itemHistory);
                                            localStorage.setItem(this.state.accountAddress, JSON.stringify(localHistory));
                                        }
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'error',
                                                    msg: 'Transaction failed'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                    }
                                })
                            }, 2000);
                        }
                    }
                )
            }
        )
    }
    withdrawUSDC(addr, num) {
        var str1;
        var str2;
        if (num.div(10 ** this.state.decimalsUSDC).toString(10).indexOf('.') > 0) {
            str1 = this.toThousands(num.div(10 ** this.state.decimalsUSDC).toString(10).split('.')[0]);
            str2 = '.' + num.div(10 ** this.state.decimalsUSDC).toString(10).split('.')[1];
        } else {
            str1 = this.toThousands(num.div(10 ** this.state.decimalsUSDC).toString(10));
            str2 = '';
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Withdraw ' + str1 + str2 + ' USDC',
        }
        this.setState({ tmepState });
        // get Limit first
        this.contractProtocol.withdraw.estimateGas(
            addr,
            0,
            num,
            {
                from: this.state.accountAddress
            },
            (err, gasLimit) => {
                this.contractProtocol.withdraw.sendTransaction(
                    addr,
                    0,
                    num,
                    {
                        from: this.state.accountAddress,
                        gas: Math.ceil(gasLimit * this.gasRatio),
                        gasPrice: this.state.gasPrice
                    },
                    (err, ret) => {
                        if (err) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;
                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        class: 'error',
                                        msg: 'User reject transaction'
                                    }
                                    this.setState({ tmepState });

                                    setTimeout(() => {
                                        delete tmepState.transcations[key];
                                        this.setState({ tmepState });
                                    }, 3000);
                                };
                                return false;
                            });
                        }
                        if (ret) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;

                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    this.setState({ tmepState });
                                };
                                return false;
                            });

                            var timerOBJ = {};
                            var tempRnum = Math.random();
                            timerOBJ[tempRnum] = setInterval(() => {
                                console.log('i am checking withdraw USDC... =>' + tempRnum);
                                this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                tmepState.toWithdrawNum = '';
                                                tmepState.couldWithdraw = false;
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        setTimeout(() => {
                                            this.getMyBalance();
                                            this.getPoolBankTotalStatus();
                                            this.getUserWithdrawBalance();
                                        }, 3000)
                                        // !!window.ethereum.isImToken
                                        if (!!window.ethereum.isImToken) {
                                            var itemHistory = {
                                                event: 'Withdraw',
                                                title: 'Withdraw ' + str1 + str2 + ' USDC',
                                                transactionHash: ret,
                                                timeStamp: new Date().getTime()
                                            };
                                            var tmphistory = this.state.myHistory;
                                            tmphistory.unshift(itemHistory);
                                            this.setState({
                                                ...this.state,
                                                myHistory: tmphistory
                                            })
                                            var localHistory = JSON.parse(localStorage.getItem(this.state.accountAddress));
                                            localHistory[this.state.netType].history.unshift(itemHistory);
                                            localStorage.setItem(this.state.accountAddress, JSON.stringify(localHistory));
                                        }
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'error',
                                                    msg: 'Transaction failed'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                    }
                                })
                            }, 2000);
                        }
                    }
                )
            }
        )
    }


    // *** get USDx For my Deposit ***
    getUSDXForDeposit(tokenID, amount) {
        this.contractProtocolView.getUSDXForDeposit.call(tokenID, amount, (err, ret) => {
            console.log(err, ret);
            if (ret) {
                if (this.state.toDepositNum === '' || Number(this.state.toDepositNum) === 0) {
                    return;
                }

                this.setState({
                    ...this.state,
                    maxGenerateUSDx: this.formatNumber(ret, 'USDx')
                })
            }
        })
    }


    // *** deposit ***
    depositNumChange(val) {
        if (val === '' || Number(val) === 0) {
            this.setState({
                ...this.state,
                couldDeposit: false,
                errTips: false,
                toDepositNum: val,
                maxGenerateUSDx: '0.00'
            })
            return;
        }

        if (val.length > 16) {
            return;
        }
        var address = this.addressDAI;
        var tempUnits = this.state.decimalsDAI;

        if (this.state.toDeposit === 'DAI') {
            address = this.addressDAI;
            tempUnits = this.state.decimalsDAI;
            if (Number(val) > 0 && Number(val) <= Number(this.state.myDAI)) {
                this.setState({
                    ...this.state,
                    couldDeposit: true,
                    errTips: false,
                    toDepositNum: val
                }, () => {
                    this.getUSDXForDeposit(address, val * (10 ** tempUnits));
                })
            } else {
                this.setState({
                    ...this.state,
                    couldDeposit: false,
                    errTips: true,
                    toDepositNum: val
                })
            }
        }
        if (this.state.toDeposit === 'PAX') {
            address = this.addressPAX;
            tempUnits = this.state.decimalsPAX;
            if (Number(val) > 0 && Number(val) <= Number(this.state.myPAX)) {
                this.setState({
                    ...this.state,
                    couldDeposit: true,
                    errTips: false,
                    toDepositNum: val
                }, () => {
                    this.getUSDXForDeposit(address, val * (10 ** tempUnits));
                })
            } else {
                this.setState({
                    ...this.state,
                    couldDeposit: false,
                    errTips: true,
                    toDepositNum: val
                })
            }
        }
        if (this.state.toDeposit === 'TUSD') {
            address = this.addressTUSD;
            tempUnits = this.state.decimalsTUSD;
            if (Number(val) > 0 && Number(val) <= Number(this.state.myTUSD)) {
                this.setState({
                    ...this.state,
                    couldDeposit: true,
                    errTips: false,
                    toDepositNum: val
                }, () => {
                    this.getUSDXForDeposit(address, val * (10 ** tempUnits));
                })
            } else {
                this.setState({
                    ...this.state,
                    couldDeposit: false,
                    errTips: true,
                    toDepositNum: val
                })
            }
        }
        if (this.state.toDeposit === 'USDC') {
            address = this.addressUSDC;
            tempUnits = this.state.decimalsUSDC;
            if (Number(val) > 0 && Number(val) <= Number(this.state.myUSDC)) {
                this.setState({
                    ...this.state,
                    couldDeposit: true,
                    errTips: false,
                    toDepositNum: val
                }, () => {
                    this.getUSDXForDeposit(address, val * (10 ** tempUnits));
                })
            } else {
                this.setState({
                    ...this.state,
                    couldDeposit: false,
                    errTips: true,
                    toDepositNum: val
                })
            }
        }
    }
    depositOptChange(token) {
        this.setState({
            ...this.state,
            toDeposit: token
        }, () => {
            if (!this.state.toDepositNum) {
                return;
            }
            this.depositNumChange(this.state.toDepositNum);
        })

        // setTimeout(() => {
        //     if (!this.state.toDepositNum) {
        //         return;
        //     }
        //     this.depositNumChange(this.state.toDepositNum);
        // }, 0);
    }
    deposit() {
        if (!this.state.couldDeposit) {
            return;
        }
        var addr;
        var num;
        if (this.state.toDeposit === 'DAI') {
            addr = this.addressDAI;
            num = this.Web3.toBigNumber(this.state.toDepositNum).mul(this.Web3.toBigNumber(10 ** this.state.decimalsDAI));
            this.depositDAI(addr, num);
        } else if (this.state.toDeposit === 'PAX') {
            addr = this.addressPAX;
            num = this.Web3.toBigNumber(this.state.toDepositNum).mul(this.Web3.toBigNumber(10 ** this.state.decimalsPAX));
            this.depositPAX(addr, num);
        } else if (this.state.toDeposit === 'TUSD') {
            addr = this.addressTUSD;
            num = this.Web3.toBigNumber(this.state.toDepositNum).mul(this.Web3.toBigNumber(10 ** this.state.decimalsTUSD));
            this.depositTUSD(addr, num);
        } else if (this.state.toDeposit === 'USDC') {
            addr = this.addressUSDC;
            num = this.Web3.toBigNumber(this.state.toDepositNum).mul(this.Web3.toBigNumber(10 ** this.state.decimalsUSDC));
            this.depositUSDC(addr, num);
        }
    }
    depositDAI(addr, num) {
        if (!this.state.approvedDAI) {
            this.setState({
                ...this.state,
                fromDepositDAI: true
            });
            this.approve('DAI');
            return;
        }
        var str1;
        var str2;
        if (num.div(10 ** this.state.decimalsDAI).toString(10).indexOf('.') > 0) {
            str1 = this.toThousands(num.div(10 ** this.state.decimalsDAI).toString(10).split('.')[0]);
            str2 = '.' + num.div(10 ** this.state.decimalsDAI).toString(10).split('.')[1];
        } else {
            str1 = this.toThousands(num.div(10 ** this.state.decimalsDAI).toString(10));
            str2 = '';
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Deposit ' + str1 + str2 + ' DAI',
        }
        this.setState({ tmepState });
        // get Limit first
        this.contractProtocol.deposit.estimateGas(
            addr,
            0,
            num,
            {
                from: this.state.accountAddress
            },
            (err, gasLimit) => {
                // console.log(err, gasLimit);
                this.contractProtocol.deposit.sendTransaction(
                    addr,
                    0,
                    num,
                    {
                        from: this.state.accountAddress,
                        gas: 900000,
                        gasPrice: this.state.gasPrice
                    },
                    (err, ret) => {
                        if (err) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;
                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        class: 'error',
                                        msg: 'User reject transaction'
                                    }
                                    this.setState({ tmepState });

                                    setTimeout(() => {
                                        delete tmepState.transcations[key];
                                        this.setState({ tmepState });
                                    }, 3000);
                                };
                                return false;
                            });
                        }
                        if (ret) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;

                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    this.setState({ tmepState });
                                };
                                return false;
                            });

                            var timerOBJ = {};
                            var tempRnum = Math.random();
                            timerOBJ[tempRnum] = setInterval(() => {
                                console.log('i am checking deposit DAI... =>' + tempRnum);
                                this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                tmepState.toDepositNum = '';
                                                tmepState.couldDeposit = false;
                                                tmepState.maxGenerateUSDx = '';
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        setTimeout(() => {
                                            this.getMyBalance();
                                            this.getPoolBankTotalStatus();
                                            this.getUserWithdrawBalance();
                                        }, 3000)

                                        // !!window.ethereum.isImToken
                                        if (!!window.ethereum.isImToken) {
                                            var itemHistory = {
                                                event: 'Deposit',
                                                title: 'Deposit ' + str1 + str2 + ' DAI',
                                                transactionHash: ret,
                                                timeStamp: new Date().getTime()
                                            };
                                            var tmphistory = this.state.myHistory;
                                            tmphistory.unshift(itemHistory);
                                            this.setState({
                                                ...this.state,
                                                myHistory: tmphistory
                                            })
                                            var localHistory = JSON.parse(localStorage.getItem(this.state.accountAddress));
                                            localHistory[this.state.netType].history.unshift(itemHistory);
                                            localStorage.setItem(this.state.accountAddress, JSON.stringify(localHistory));
                                        }

                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'error',
                                                    msg: 'Transaction failed'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                    }
                                })
                            }, 2000);
                        }
                    }
                )
            }
        )
    }
    depositPAX(addr, num) {
        if (!this.state.approvedPAX) {
            this.setState({
                ...this.state,
                fromDepositPAX: true
            });
            this.approve('PAX');
            return;
        }
        var str1;
        var str2;
        if (num.div(10 ** this.state.decimalsPAX).toString(10).indexOf('.') > 0) {
            str1 = this.toThousands(num.div(10 ** this.state.decimalsPAX).toString(10).split('.')[0]);
            str2 = '.' + num.div(10 ** this.state.decimalsPAX).toString(10).split('.')[1];
        } else {
            str1 = this.toThousands(num.div(10 ** this.state.decimalsPAX).toString(10));
            str2 = '';
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Deposit ' + str1 + str2 + ' PAX',
        }
        this.setState({ tmepState });
        // get Limit first
        this.contractProtocol.deposit.estimateGas(
            addr,
            0,
            num,
            {
                from: this.state.accountAddress
            },
            (err, gasLimit) => {
                this.contractProtocol.deposit.sendTransaction(
                    addr,
                    0,
                    num,
                    {
                        from: this.state.accountAddress,
                        gas: 900000,
                        gasPrice: this.state.gasPrice
                    },
                    (err, ret) => {
                        if (err) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;
                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        class: 'error',
                                        msg: 'User reject transaction'
                                    }
                                    this.setState({ tmepState });

                                    setTimeout(() => {
                                        delete tmepState.transcations[key];
                                        this.setState({ tmepState });
                                    }, 3000);
                                };
                                return false;
                            });
                        }
                        if (ret) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;

                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    this.setState({ tmepState });
                                };
                                return false;
                            });

                            var timerOBJ = {};
                            var tempRnum = Math.random();
                            timerOBJ[tempRnum] = setInterval(() => {
                                console.log('i am checking deposit PAX... =>' + tempRnum);
                                this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                tmepState.toDepositNum = '';
                                                tmepState.couldDeposit = false;
                                                tmepState.maxGenerateUSDx = '';
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        setTimeout(() => {
                                            this.getMyBalance();
                                            this.getPoolBankTotalStatus();
                                            this.getUserWithdrawBalance();
                                        }, 3000)
                                        // !!window.ethereum.isImToken
                                        if (!!window.ethereum.isImToken) {
                                            var itemHistory = {
                                                event: 'Deposit',
                                                title: 'Deposit ' + str1 + str2 + ' PAX',
                                                transactionHash: ret,
                                                timeStamp: new Date().getTime()
                                            };
                                            var tmphistory = this.state.myHistory;
                                            tmphistory.unshift(itemHistory);
                                            this.setState({
                                                ...this.state,
                                                myHistory: tmphistory
                                            })
                                            var localHistory = JSON.parse(localStorage.getItem(this.state.accountAddress));
                                            localHistory[this.state.netType].history.unshift(itemHistory);
                                            localStorage.setItem(this.state.accountAddress, JSON.stringify(localHistory));
                                        }
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'error',
                                                    msg: 'Transaction failed'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                    }
                                })
                            }, 2000);
                        }
                    }
                )
            }
        )
    }
    depositTUSD(addr, num) {
        if (!this.state.approvedTUSD) {
            this.setState({
                ...this.state,
                fromDepositTUSD: true
            });
            this.approve('TUSD');
            return;
        }
        var str1;
        var str2;
        if (num.div(10 ** this.state.decimalsTUSD).toString(10).indexOf('.') > 0) {
            str1 = this.toThousands(num.div(10 ** this.state.decimalsTUSD).toString(10).split('.')[0]);
            str2 = '.' + num.div(10 ** this.state.decimalsTUSD).toString(10).split('.')[1];
        } else {
            str1 = this.toThousands(num.div(10 ** this.state.decimalsTUSD).toString(10));
            str2 = '';
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Deposit ' + str1 + str2 + ' TUSD',
        }
        this.setState({ tmepState });
        // get Limit first
        this.contractProtocol.deposit.estimateGas(
            addr,
            0,
            num,
            {
                from: this.state.accountAddress
            },
            (err, gasLimit) => {
                this.contractProtocol.deposit.sendTransaction(
                    addr,
                    0,
                    num,
                    {
                        from: this.state.accountAddress,
                        gas: 900000,
                        gasPrice: this.state.gasPrice
                    },
                    (err, ret) => {
                        if (err) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;
                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        class: 'error',
                                        msg: 'User reject transaction'
                                    }
                                    this.setState({ tmepState });

                                    setTimeout(() => {
                                        delete tmepState.transcations[key];
                                        this.setState({ tmepState });
                                    }, 3000);
                                };
                                return false;
                            });
                        }
                        if (ret) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;

                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    this.setState({ tmepState });
                                };
                                return false;
                            });

                            var timerOBJ = {};
                            var tempRnum = Math.random();
                            timerOBJ[tempRnum] = setInterval(() => {
                                console.log('i am checking deposit TUSD... =>' + tempRnum);
                                this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                tmepState.toDepositNum = '';
                                                tmepState.couldDeposit = false;
                                                tmepState.maxGenerateUSDx = '';
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        setTimeout(() => {
                                            this.getMyBalance();
                                            this.getPoolBankTotalStatus();
                                            this.getUserWithdrawBalance();
                                        }, 3000)
                                        // !!window.ethereum.isImToken
                                        if (!!window.ethereum.isImToken) {
                                            var itemHistory = {
                                                event: 'Deposit',
                                                title: 'Deposit ' + str1 + str2 + ' TUSD',
                                                transactionHash: ret,
                                                timeStamp: new Date().getTime()
                                            };
                                            var tmphistory = this.state.myHistory;
                                            tmphistory.unshift(itemHistory);
                                            this.setState({
                                                ...this.state,
                                                myHistory: tmphistory
                                            })
                                            var localHistory = JSON.parse(localStorage.getItem(this.state.accountAddress));
                                            localHistory[this.state.netType].history.unshift(itemHistory);
                                            localStorage.setItem(this.state.accountAddress, JSON.stringify(localHistory));
                                        }
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'error',
                                                    msg: 'Transaction failed'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                    }
                                })
                            }, 2000);
                        }
                    }
                )
            }
        )
    }
    depositUSDC(addr, num) {
        if (!this.state.approvedUSDC) {
            this.setState({
                ...this.state,
                fromDepositUSDC: true
            });
            this.approve('USDC');
            return;
        }
        var str1;
        var str2;
        if (num.div(10 ** this.state.decimalsUSDC).toString(10).indexOf('.') > 0) {
            str1 = this.toThousands(num.div(10 ** this.state.decimalsUSDC).toString(10).split('.')[0]);
            str2 = '.' + num.div(10 ** this.state.decimalsUSDC).toString(10).split('.')[1];
        } else {
            str1 = this.toThousands(num.div(10 ** this.state.decimalsUSDC).toString(10));
            str2 = '';
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Deposit ' + str1 + str2 + ' USDC',
        }
        this.setState({ tmepState });
        // get Limit first
        this.contractProtocol.deposit.estimateGas(
            addr,
            0,
            num,
            {
                from: this.state.accountAddress
            },
            (err, gasLimit) => {
                this.contractProtocol.deposit.sendTransaction(
                    addr,
                    0,
                    num,
                    {
                        from: this.state.accountAddress,
                        gas: 900000,
                        gasPrice: this.state.gasPrice
                    },
                    (err, ret) => {
                        if (err) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;
                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        class: 'error',
                                        msg: 'User reject transaction'
                                    }
                                    this.setState({ tmepState });

                                    setTimeout(() => {
                                        delete tmepState.transcations[key];
                                        this.setState({ tmepState });
                                    }, 3000);
                                };
                                return false;
                            });
                        }
                        if (ret) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;

                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    this.setState({ tmepState });
                                };
                                return false;
                            });

                            var timerOBJ = {};
                            var tempRnum = Math.random();
                            timerOBJ[tempRnum] = setInterval(() => {
                                console.log('i am checking deposit USDC... =>' + tempRnum);
                                this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                tmepState.toDepositNum = '';
                                                tmepState.couldDeposit = false;
                                                tmepState.maxGenerateUSDx = '';
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        setTimeout(() => {
                                            this.getMyBalance();
                                            this.getPoolBankTotalStatus();
                                            this.getUserWithdrawBalance();
                                        }, 3000)
                                        // !!window.ethereum.isImToken
                                        if (!!window.ethereum.isImToken) {
                                            var itemHistory = {
                                                event: 'Deposit',
                                                title: 'Deposit ' + str1 + str2 + ' USDC',
                                                transactionHash: ret,
                                                timeStamp: new Date().getTime()
                                            };
                                            var tmphistory = this.state.myHistory;
                                            tmphistory.unshift(itemHistory);
                                            this.setState({
                                                ...this.state,
                                                myHistory: tmphistory
                                            })
                                            var localHistory = JSON.parse(localStorage.getItem(this.state.accountAddress));
                                            localHistory[this.state.netType].history.unshift(itemHistory);
                                            localStorage.setItem(this.state.accountAddress, JSON.stringify(localHistory));
                                        }
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'error',
                                                    msg: 'Transaction failed'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                    }
                                })
                            }, 2000);
                        }
                    }
                )
            }
        )
    }


    // *** destroy ***
    destroyNumChange(val) {
        if (val.length > 16) {
            return;
        }
        if (Number(val) > 0 && this.Web3.toBigNumber(val).sub(this.Web3.toBigNumber(this.state.myUSDx)) <= 0) {
            var USDxToDAI = this.Web3.toBigNumber(val).mul(this.Web3.toBigNumber(this.state.sectionDAIBurning).div(this.Web3.toBigNumber(this.state.tatolSectionBurning)));
            var USDxToPAX = this.Web3.toBigNumber(val).mul(this.Web3.toBigNumber(this.state.sectionPAXBurning).div(this.Web3.toBigNumber(this.state.tatolSectionBurning)));
            var USDxToTUSD = this.Web3.toBigNumber(val).mul(this.Web3.toBigNumber(this.state.sectionTUSDBurning).div(this.Web3.toBigNumber(this.state.tatolSectionBurning)));
            var USDxToUSDC = this.Web3.toBigNumber(val).mul(this.Web3.toBigNumber(this.state.sectionUSDCBurning).div(this.Web3.toBigNumber(this.state.tatolSectionBurning)));
            this.setState({
                ...this.state,
                errTipsDestroy: false,
                couldDestroy: true,
                toDestroyNum: val,
                USDxToDAI: USDxToDAI.toString(10),
                USDxToPAX: USDxToPAX.toString(10),
                USDxToTUSD: USDxToTUSD.toString(10),
                USDxToUSDC: USDxToUSDC.toString(10),
                getDestroyThresholdBool: false
            })
            if (this.Web3.toBigNumber(val).mod(this.Web3.toBigNumber(this.state.getDestroyThreshold)).toString(10) !== '0') {
                this.setState({
                    ...this.state,
                    errTipsDestroy: true,
                    couldDestroy: false,
                    toDestroyNum: val,
                    USDxToDAI: '',
                    USDxToPAX: '',
                    USDxToTUSD: '',
                    USDxToUSDC: '',
                    getDestroyThresholdBool: true
                })
            }
            if (this.Web3.toBigNumber(val * this.state.feeRate / this.state.dfPrice).sub(this.Web3.toBigNumber(this.state.myDF)) > 0) {
                this.setState({
                    ...this.state,
                    errTipsDestroy: true,
                    couldDestroy: false,
                    toDestroyNum: val,
                    USDxToDAI: '',
                    USDxToPAX: '',
                    USDxToTUSD: '',
                    USDxToUSDC: '',
                    getDestroyThresholdBool: false
                })
            }
        } else {
            this.setState({
                ...this.state,
                errTipsDestroy: true,
                couldDestroy: false,
                toDestroyNum: val,
                USDxToDAI: '',
                USDxToPAX: '',
                USDxToTUSD: '',
                USDxToUSDC: '',
                getDestroyThresholdBool: false
            })
            if (val === '' || Number(val) === 0) {
                this.setState({
                    ...this.state,
                    errTipsDestroy: false,
                    couldDestroy: false,
                    toDestroyNum: val,
                    USDxToDAI: '',
                    USDxToPAX: '',
                    USDxToTUSD: '',
                    USDxToUSDC: '',
                    getDestroyThresholdBool: false
                })
            }
        }
    }
    destroy() {
        if (!this.state.couldDestroy) {
            return;
        }

        if (!this.state.approvedDF) {
            this.setState({
                ...this.state,
                fromDestroy1: true
            });
            this.approve('DF');
            return;
        }

        if (!this.state.approvedUSDx) {
            this.setState({
                ...this.state,
                fromDestroy2: true
            });
            this.approve('USDx');
            return;
        }

        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        var str1;
        var str2;
        if (this.state.toDestroyNum.indexOf('.') > 0) {
            str1 = this.toThousands(this.state.toDestroyNum.split('.')[0]);
            str2 = '.' + this.state.toDestroyNum.split('.')[1];
        } else {
            str1 = this.toThousands(this.state.toDestroyNum);
            str2 = '';
        }
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Reconvert ' + str1 + str2 + ' USDx',
        }
        this.setState({ tmepState });
        this.contractProtocol.destroy.estimateGas(
            0,
            this.Web3.toBigNumber(this.state.toDestroyNum).mul(this.Web3.toBigNumber(10 ** 18)),
            {
                from: this.state.accountAddress
            },
            (err, gasLimit) => {
                this.contractProtocol.destroy.sendTransaction(
                    0,
                    this.Web3.toBigNumber(this.state.toDestroyNum).mul(this.Web3.toBigNumber(10 ** 18)),
                    {
                        from: this.state.accountAddress,
                        gas: Math.ceil(gasLimit * this.gasRatio),
                        gasPrice: this.state.gasPrice
                    },
                    (err, ret) => {
                        if (err) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;
                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        class: 'error',
                                        msg: 'User reject transaction'
                                    }
                                    this.setState({ tmepState });

                                    setTimeout(() => {
                                        delete tmepState.transcations[key];
                                        this.setState({ tmepState });
                                    }, 3000);
                                };
                                return false;
                            });
                        }
                        if (ret) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;

                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    this.setState({ tmepState });
                                };
                                return false;
                            });

                            var timerOBJ = {};
                            var tempRnum = Math.random();
                            timerOBJ[tempRnum] = setInterval(() => {
                                console.log('i am checking Reconvert USDx... =>' + tempRnum);
                                this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                tmepState.toDestroyNum = '';
                                                tmepState.couldDestroy = false;
                                                tmepState.USDxToDAI = tmepState.USDxToPAX = tmepState.USDxToTUSD = tmepState.USDxToUSDC = '';
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        setTimeout(() => {
                                            this.getMyBalance();
                                            this.getPoolBankTotalStatus();
                                            this.getUserWithdrawBalance();
                                        }, 3000)
                                        // !!window.ethereum.isImToken
                                        if (!!window.ethereum.isImToken) {
                                            var itemHistory = {
                                                event: 'Destroy',
                                                title: 'Destroy ' + str1 + str2 + ' USDx',
                                                transactionHash: ret,
                                                timeStamp: new Date().getTime()
                                            };
                                            var tmphistory = this.state.myHistory;
                                            tmphistory.unshift(itemHistory);
                                            this.setState({
                                                ...this.state,
                                                myHistory: tmphistory
                                            })
                                            var localHistory = JSON.parse(localStorage.getItem(this.state.accountAddress));
                                            localHistory[this.state.netType].history.unshift(itemHistory);
                                            localStorage.setItem(this.state.accountAddress, JSON.stringify(localHistory));
                                        }
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'error',
                                                    msg: 'Transaction failed'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                    }
                                })
                            }, 2000);
                        }
                    }
                )
            }
        )
    }


    // *** toGenerateMax ***
    toGenerateMax(BN) {
        this.setState({
            ...this.state,
            toGenerateMaxNum: BN,
            isMintting: true
        });

        if (!this.state.approvedDAI) {
            this.setState({
                ...this.state,
                fromGenerateMax: true
            });
            this.approve('DAI');
            return;
        }
        if (!this.state.approvedPAX) {
            this.setState({
                ...this.state,
                fromGenerateMax: true
            });
            this.approve('PAX');
            return;
        }
        if (!this.state.approvedTUSD) {
            this.setState({
                ...this.state,
                fromGenerateMax: true
            });
            this.approve('TUSD');
            return;
        }
        if (!this.state.approvedUSDC) {
            this.setState({
                ...this.state,
                fromGenerateMax: true
            });
            this.approve('USDC');
            return;
        }

        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Mintage ' + this.toThousands(BN.toString(10)) + ' USDx',
        }
        this.setState({ tmepState });
        // get Limit first
        this.contractProtocol.oneClickMinting.estimateGas(
            0,
            BN.mul(this.Web3.toBigNumber(10 ** 18)),
            {
                from: this.state.accountAddress
            },
            (err, gasLimit) => {
                // console.log('0000000000000000',err,  BN.mul(this.Web3.toBigNumber(10 ** 18)), gasLimit, this.state.gasPrice)
                this.contractProtocol.oneClickMinting.sendTransaction(
                    0,
                    BN.mul(this.Web3.toBigNumber(10 ** 18)),
                    {
                        from: this.state.accountAddress,
                        gas: Math.ceil(gasLimit * this.gasRatio),
                        gasPrice: this.state.gasPrice
                    },
                    (err, ret) => {
                        if (err) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;
                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        class: 'error',
                                        msg: 'User reject transaction'
                                    }
                                    this.setState({ tmepState });

                                    setTimeout(() => {
                                        delete tmepState.transcations[key];
                                        this.setState({ tmepState });
                                    }, 3000);
                                };
                                return false;
                            });
                        }
                        if (ret) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;

                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    this.setState({ tmepState });
                                };
                                return false;
                            });

                            var timerOBJ = {};
                            var tempRnum = Math.random();
                            timerOBJ[tempRnum] = setInterval(() => {
                                console.log('i am checking oneClickMinting... =>' + tempRnum);
                                this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        this.setState({
                                            ...this.state,
                                            showOnestep: false,
                                            isMintting: false
                                        });
                                        setTimeout(() => {
                                            this.getMyBalance();
                                            this.getPoolBankTotalStatus();
                                            this.getUserWithdrawBalance();
                                            this.getMaxNumToGenerateOnestep();
                                        }, 3000)
                                        // !!window.ethereum.isImToken
                                        if (!!window.ethereum.isImToken) {
                                            var itemHistory = {
                                                event: 'OneClickMinting',
                                                title: 'Mint ' + this.toThousands(BN.toString(10)) + ' USDx',
                                                transactionHash: ret,
                                                timeStamp: new Date().getTime()
                                            };
                                            var tmphistory = this.state.myHistory;
                                            tmphistory.unshift(itemHistory);
                                            this.setState({
                                                ...this.state,
                                                myHistory: tmphistory
                                            })
                                            var localHistory = JSON.parse(localStorage.getItem(this.state.accountAddress));
                                            localHistory[this.state.netType].history.unshift(itemHistory);
                                            localStorage.setItem(this.state.accountAddress, JSON.stringify(localHistory));
                                        }
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'error',
                                                    msg: 'Transaction failed'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                    }
                                })
                            }, 2000);
                        }
                    }
                )
            }
        )
    }
    showOnestwpFn() {
        this.setState({
            ...this.state,
            showOnestep: !this.state.showOnestep
        })
    }
    closeOnestwpFn() {
        this.setState({
            ...this.state,
            showOnestep: !this.state.showOnestep
        })
    }


    // *** claim ***
    claim() {
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'CLAIM USDx',
        }
        this.setState({ tmepState });
        // get Limit first
        this.contractProtocol.claim.estimateGas(
            0,
            {
                from: this.state.accountAddress
            },
            (err, gasLimit) => {
                this.contractProtocol.claim.sendTransaction(
                    0,
                    {
                        from: this.state.accountAddress,
                        gas: Math.ceil(gasLimit * this.gasRatio),
                        gasPrice: this.state.gasPrice
                    },
                    (err, ret) => {
                        if (err) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;
                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        class: 'error',
                                        msg: 'User reject transaction'
                                    }
                                    this.setState({ tmepState });

                                    setTimeout(() => {
                                        delete tmepState.transcations[key];
                                        this.setState({ tmepState });
                                    }, 3000);
                                };
                                return false;
                            });
                        }
                        if (ret) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;

                            keys.map((key) => {
                                if (tmepState.transcations[key].id === id) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    this.setState({ tmepState });
                                };
                                return false;
                            });

                            var timerOBJ = {};
                            var tempRnum = Math.random();
                            timerOBJ[tempRnum] = setInterval(() => {
                                console.log('i am checking claim USDx... =>' + tempRnum);
                                this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        setTimeout(() => {
                                            this.getMyBalance();
                                            this.getPoolBankTotalStatus();
                                            this.getUserWithdrawBalance();
                                        }, 3000)
                                        // !!window.ethereum.isImToken
                                        if (!!window.ethereum.isImToken) {
                                            var itemHistory = {
                                                event: 'Claim',
                                                title: 'Claim USDx',
                                                transactionHash: ret,
                                                timeStamp: new Date().getTime()
                                            };
                                            var tmphistory = this.state.myHistory;
                                            tmphistory.unshift(itemHistory);
                                            this.setState({
                                                ...this.state,
                                                myHistory: tmphistory
                                            })
                                            var localHistory = JSON.parse(localStorage.getItem(this.state.accountAddress));
                                            localHistory[this.state.netType].history.unshift(itemHistory);
                                            localStorage.setItem(this.state.accountAddress, JSON.stringify(localHistory));
                                        }
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(timerOBJ[tempRnum]);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'error',
                                                    msg: 'Transaction failed'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                    }
                                })
                            }, 2000);
                        }
                    }
                )
            }
        )
    }


    // *** allocateTo ***
    allocateTo(token) {
        if (token === 'DAI') {
            this.allocateToDAI();
        }
        if (token === 'PAX') {
            this.allocateToPAX();
        }
        if (token === 'TUSD') {
            this.allocateToTUSD();
        }
        if (token === 'USDC') {
            this.allocateToUSDC();
        }
        if (token === 'DF') {
            this.allocateToDF();
        }
    }
    allocateToDAI() {
        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Allocate DAI') {
                return;
            }
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Allocate DAI',
        }
        this.setState({ tmepState });
        // get Limit first
        this.contractDAI.allocateTo.estimateGas(
            this.state.accountAddress,
            this.faucetNum * (10 ** this.state.decimalsDAI),
            {
                from: this.state.accountAddress
            },
            (err, gasLimit) => {
                this.contractDAI.allocateTo.sendTransaction(
                    this.state.accountAddress,
                    this.faucetNum * (10 ** this.state.decimalsDAI),
                    {
                        from: this.state.accountAddress,
                        gas: Math.ceil(gasLimit * this.gasRatio),
                        gasPrice: this.state.gasPrice
                    },
                    (err, ret) => {
                        if (err) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;
                            keys.map((key) => {
                                if (tmepState.transcations[key].title === 'Allocate DAI') {
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        class: 'error',
                                        msg: 'User reject transaction'
                                    }
                                    this.setState({ tmepState });

                                    setTimeout(() => {
                                        delete tmepState.transcations[key];
                                        this.setState({ tmepState });
                                    }, 3000);
                                };
                                return false;
                            });
                        }
                        if (ret) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;

                            keys.map((key) => {
                                if (tmepState.transcations[key].title === 'Allocate DAI') {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    this.setState({ tmepState });
                                };
                                return false;
                            });

                            var allocateDAItimer = setInterval(() => {
                                console.log('i am checking Allocate DAI...');
                                this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(allocateDAItimer);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        setTimeout(() => {
                                            this.getMyBalance();
                                            this.getPoolBankTotalStatus();
                                            this.getUserWithdrawBalance();
                                        }, 3000)
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(allocateDAItimer);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'error',
                                                    msg: 'Transaction failed'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                    }
                                })
                            }, 2000);
                        }
                    }
                )
            }
        )
    }
    allocateToPAX() {
        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Allocate PAX') {
                return;
            }
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Allocate PAX',
        }
        this.setState({ tmepState });
        // get Limit first
        this.contractPAX.allocateTo.estimateGas(
            this.state.accountAddress,
            this.faucetNum * (10 ** this.state.decimalsPAX),
            {
                from: this.state.accountAddress,
                gas: this.gasFee
            },
            (err, gasLimit) => {
                this.contractPAX.allocateTo.sendTransaction(
                    this.state.accountAddress,
                    this.faucetNum * (10 ** this.state.decimalsPAX),
                    {
                        from: this.state.accountAddress,
                        gas: Math.ceil(gasLimit * this.gasRatio),
                        gasPrice: this.state.gasPrice
                    },
                    (err, ret) => {
                        if (err) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;
                            keys.map((key) => {
                                if (tmepState.transcations[key].title === 'Allocate PAX') {
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        class: 'error',
                                        msg: 'User reject transaction'
                                    }
                                    this.setState({ tmepState });

                                    setTimeout(() => {
                                        delete tmepState.transcations[key];
                                        this.setState({ tmepState });
                                    }, 3000);
                                };
                                return false;
                            });
                        }
                        if (ret) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;

                            keys.map((key) => {
                                if (tmepState.transcations[key].title === 'Allocate PAX') {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    this.setState({ tmepState });
                                };
                                return false;
                            });

                            var allocatePAXtimer = setInterval(() => {
                                console.log('i am checking Allocate PAX...');
                                this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(allocatePAXtimer);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        setTimeout(() => {
                                            this.getMyBalance();
                                            this.getPoolBankTotalStatus();
                                            this.getUserWithdrawBalance();
                                        }, 3000)
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(allocatePAXtimer);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'error',
                                                    msg: 'Transaction failed'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                    }
                                })
                            }, 2000);
                        }
                    }
                )
            }
        )
    }
    allocateToTUSD() {
        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Allocate TUSD') {
                return;
            }
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Allocate TUSD',
        }
        this.setState({ tmepState });
        // get Limit first
        this.contractTUSD.allocateTo.estimateGas(
            this.state.accountAddress,
            this.faucetNum * (10 ** this.state.decimalsTUSD),
            {
                from: this.state.accountAddress
            },
            (err, gasLimit) => {
                this.contractTUSD.allocateTo.sendTransaction(
                    this.state.accountAddress,
                    this.faucetNum * (10 ** this.state.decimalsTUSD),
                    {
                        from: this.state.accountAddress,
                        gas: Math.ceil(gasLimit * this.gasRatio),
                        gasPrice: this.state.gasPrice
                    },
                    (err, ret) => {
                        if (err) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;
                            keys.map((key) => {
                                if (tmepState.transcations[key].title === 'Allocate TUSD') {
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        class: 'error',
                                        msg: 'User reject transaction'
                                    }
                                    this.setState({ tmepState });

                                    setTimeout(() => {
                                        delete tmepState.transcations[key];
                                        this.setState({ tmepState });
                                    }, 3000);
                                };
                                return false;
                            });
                        }
                        if (ret) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;

                            keys.map((key) => {
                                if (tmepState.transcations[key].title === 'Allocate TUSD') {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    this.setState({ tmepState });
                                };
                                return false;
                            });

                            var allocateTUSDtimer = setInterval(() => {
                                console.log('i am checking Allocate TUSD...');
                                this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(allocateTUSDtimer);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        setTimeout(() => {
                                            this.getMyBalance();
                                            this.getPoolBankTotalStatus();
                                            this.getUserWithdrawBalance();
                                        }, 3000)
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(allocateTUSDtimer);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'error',
                                                    msg: 'Transaction failed'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                    }
                                })
                            }, 2000);
                        }
                    }
                )
            }
        )
    }
    allocateToUSDC() {
        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Allocate USDC') {
                return;
            }
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Allocate USDC',
        }
        this.setState({ tmepState });
        // get Limit first
        this.contractUSDC.allocateTo.estimateGas(
            this.state.accountAddress,
            this.faucetNum * (10 ** this.state.decimalsUSDC),
            {
                from: this.state.accountAddress
            },
            (err, gasLimit) => {
                this.contractUSDC.allocateTo.sendTransaction(
                    this.state.accountAddress,
                    this.faucetNum * (10 ** this.state.decimalsUSDC),
                    {
                        from: this.state.accountAddress,
                        gas: Math.ceil(gasLimit * this.gasRatio),
                        gasPrice: this.state.gasPrice
                    },
                    (err, ret) => {
                        if (err) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;
                            keys.map((key) => {
                                if (tmepState.transcations[key].title === 'Allocate USDC') {
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        class: 'error',
                                        msg: 'User reject transaction'
                                    }
                                    this.setState({ tmepState });

                                    setTimeout(() => {
                                        delete tmepState.transcations[key];
                                        this.setState({ tmepState });
                                    }, 3000);
                                };
                                return false;
                            });
                        }
                        if (ret) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;

                            keys.map((key) => {
                                if (tmepState.transcations[key].title === 'Allocate USDC') {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    this.setState({ tmepState });
                                };
                                return false;
                            });

                            var allocateUSDCtimer = setInterval(() => {
                                console.log('i am checking Allocate USDC...');
                                this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(allocateUSDCtimer);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        setTimeout(() => {
                                            this.getMyBalance();
                                            this.getPoolBankTotalStatus();
                                            this.getUserWithdrawBalance();
                                        }, 3000)
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(allocateUSDCtimer);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'error',
                                                    msg: 'Transaction failed'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                    }
                                })
                            }, 2000);
                        }
                    }
                )
            }
        )
    }
    allocateToDF() {
        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Allocate DF') {
                return;
            }
        }
        const id = Math.random();
        const msg = 'Waiting for transaction signature...';
        const tmepState = this.state;
        tmepState.transcations[id] = {
            id: id,
            msg: msg,
            class: 'inprocess',
            title: 'Allocate DF',
        }
        this.setState({ tmepState });
        // get Limit first
        this.contractDF.allocateTo.estimateGas(
            this.state.accountAddress,
            this.faucetNum * (10 ** this.state.decimalsDF),
            {
                from: this.state.accountAddress
            },
            (err, gasLimit) => {
                this.contractDF.allocateTo.sendTransaction(
                    this.state.accountAddress,
                    this.faucetNum * (10 ** this.state.decimalsDF),
                    {
                        from: this.state.accountAddress,
                        gas: Math.ceil(gasLimit * this.gasRatio),
                        gasPrice: this.state.gasPrice
                    },
                    (err, ret) => {
                        if (err) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;
                            keys.map((key) => {
                                if (tmepState.transcations[key].title === 'Allocate DF') {
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        class: 'error',
                                        msg: 'User reject transaction'
                                    }
                                    this.setState({ tmepState });

                                    setTimeout(() => {
                                        delete tmepState.transcations[key];
                                        this.setState({ tmepState });
                                    }, 3000);
                                };
                                return false;
                            });
                        }
                        if (ret) {
                            const keys = Object.keys(this.state.transcations);
                            const tmepState = this.state;

                            keys.map((key) => {
                                if (tmepState.transcations[key].title === 'Allocate DF') {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    this.setState({ tmepState });
                                };
                                return false;
                            });

                            var allocateDFtimer = setInterval(() => {
                                console.log('i am checking Allocate DF...');
                                this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(allocateDFtimer);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        setTimeout(() => {
                                            this.getMyBalance();
                                            this.getPoolBankTotalStatus();
                                            this.getUserWithdrawBalance();
                                        }, 3000)
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(allocateDFtimer);
                                        const keys = Object.keys(this.state.transcations);
                                        const tmepState = this.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'error',
                                                    msg: 'Transaction failed'
                                                }
                                                this.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    this.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                    }
                                })
                            }, 2000);
                        }
                    }
                )
            }
        )
    }
}

