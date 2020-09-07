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
import abi__usr from '../abi/abi__USR';

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
import icon_right from '../assets/img/icon-right.svg';
import logo__usdx from '../assets/img/USDx.svg';
import icon__left from '../assets/img/icon-one.svg';
import icon__right from '../assets/img/icon-two.svg';

import {
    change__deposite_to_usr,
    click__deposite_to_usr,
    click__deposite_to_usr__approve,
    click__max__deposite_to_usr,
    format_bn,
    get_tokens_status_apy,
    format_num_to_K,
    getDecimals,
    click__mint_max,
    click__redeem_max,
} from '../utils.js';

import { allocateTo } from '../utils-faucet.js';
import { claim } from '../utils-claim.js';
import { approve, deposit, destroy, toGenerateMax } from '../utils-deposit.js';
import { lock } from '../utils-lock.js';
import { withdraw, withdrawOptChange, withdrawNumChange } from '../utils-withdraw.js';



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
            USDConPool: '0.00',
            show__tab: 2,
            value__deposit_to_usr: '',
        }
        if (window.web3) {
            this.Web3 = window.web3;
            this.bn = this.Web3.toBigNumber;

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
                this.addressUSR = addressMap[net]['addressUSR'];


                this.contractDAI = this.Web3.eth.contract(abiTokens).at(this.addressDAI);
                this.contractPAX = this.Web3.eth.contract(abiTokens).at(this.addressPAX);
                this.contractTUSD = this.Web3.eth.contract(abiTokens).at(this.addressTUSD);
                this.contractUSDC = this.Web3.eth.contract(abiTokens).at(this.addressUSDC);

                this.contractDF = this.Web3.eth.contract(abiTokens).at(this.addressDF);

                this.contractUSDx = this.Web3.eth.contract(abiUSDx).at(this.addressUSDx);
                this.contractProtocol = this.Web3.eth.contract(abiProtocol).at(this.addressProtocol);
                this.contractProtocolView = this.Web3.eth.contract(abiProtocolView).at(this.addressProtocolView);

                this.contract_USR = this.Web3.eth.contract(abi__usr).at(this.addressUSR);

                this.contractProtocol.allEvents({ toBlock: 'latest' }).watch((error, result) => {
                    console.log(error, result);
                    if (result && result.args._sender.toLowerCase() === this.state.accountAddress.toLowerCase()) {
                        var itemHistory = result;
                        itemHistory.timeStamp = new Date().getTime();

                        var tmphistory = this.state.myHistory;
                        tmphistory.unshift(itemHistory);

                        this.setState({
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
                this.getGasPrice();
            } else {
                console.log('not connected...');
                return;
            }
        }, 1000 * 15)
    }


    componentDidMount() { }

    render() {
        return (
            <DocuentTitle title='USDx'>
                <React.Fragment>
                    <Notify transcations={this.state.transcations} netType={this.state.netType} />
                    <div className='topTips' style={{ display: this.state.isConnected && this.state.netType === 'Rinkeby' ? 'block' : 'none' }}>
                        <img src={right_net} alt="" />
                        <span>Note: You are currently connected to the Rinkeby Testnet</span>
                    </div>

                    {
                        this.state.isConnected && this.state.netType === 'Kovan' &&
                        <div className='topTips'>
                            <img src={right_net} alt="" />
                            <span>Note: You are currently connected to the Kovan Testnet</span>
                        </div>
                    }

                    {
                        this.state.isConnected && this.state.netType !== 'Rinkeby' && this.state.netType !== 'Main' && this.state.netType !== 'Kovan' &&
                        <div className='topTips redBg'>
                            <img src={error_net} alt="" />
                            <span>USDx is currently only available on Mainnet or the Kovan/Rinkeby Testnet</span>
                        </div>
                    }

                    <Header
                        status={this.state}
                        DisconnectMetamask={() => { this.DisconnectMetamask() }}
                        connectMetamask={() => { this.connectMetamask() }}
                        approve={(v) => { approve(this, v) }}
                        lock={(v) => { lock(this, v) }}
                        allocateTo={(v) => { allocateTo(this, v) }}
                        getMaxNumToGenerateOnestep={() => { this.getMaxNumToGenerateOnestep() }}
                        toGenerateMax={(BN) => { toGenerateMax(this, BN) }}
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

                                <div className="openMeun" onClick={this.showDrawer} style={{ background: 'rgba(34, 44, 60, 1)', position: 'fixed', left: '300px', top: '124px', zIndex: '999', height: '30px', width: '38px', lineHeight: '30px', paddingLeft: '8px', borderRadius: '0 15px 15px 0' }}>
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
                                <div className="openMeun" style={{ background: 'rgba(34, 44, 60, 1)', position: 'fixed', left: '0', top: '124px', zIndex: '999', height: '30px', width: '38px', lineHeight: '30px', paddingLeft: '8px', borderRadius: '0 15px 15px 0' }} onClick={this.showDrawer}>
                                    <img src={meun} alt="" style={{ width: '16px' }} />
                                </div>
                                <div className="tab1">
                                    <div className="tab1__new_title">
                                        <span className="tab1__img"><img src={icon__left} alt="" /></span>
                                        <span className="tab1__txt">Mint USDx, Redeem/Withdraw your constiruent</span>
                                    </div>
                                    <div className="titleInTab">
                                        <div
                                            className={this.state.show__tab === 1 ? "titleInTab_title titleInTab_title__active" : "titleInTab_title"}
                                            onClick={() => { this.handleChange1(1) }}
                                        >
                                            Redeem
                                        </div>
                                        <div
                                            className={this.state.show__tab === 2 ? "titleInTab_title titleInTab_title__active" : "titleInTab_title"}
                                            onClick={() => { this.handleChange1(2) }}
                                        >
                                            Mint
                                        </div>
                                        <div
                                            className={this.state.show__tab === 3 ? "titleInTab_title titleInTab_title__active" : "titleInTab_title"}
                                            onClick={() => { this.handleChange1(3) }}
                                        >
                                            Withdraw
                                        </div>
                                    </div>

                                    <div style={{ display: this.state.show__tab === 2 ? 'block' : 'none' }} className="generate">
                                        <p className="details">Select which constituent you would like to deposit:</p>
                                        <div className="input">
                                            <div
                                                className="maxNum"
                                                onClick={() => { click__mint_max(this) }}
                                            >
                                                MAX
                                            </div>
                                            <input
                                                type="number"
                                                onChange={(val) => { this.depositNumChange(val.target.value) }}
                                                value={this.state.toDepositNum}
                                            />
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
                                                onClick={() => { deposit(this) }}
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
                                                onClick={() => { claim(this) }}
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

                                    <div style={{ display: this.state.show__tab === 1 ? 'block' : 'none' }} className="generate">
                                        <p className="details">How much USDx you would like to reconvert into constituents:</p>
                                        <div className="input">
                                            <div
                                                className="maxNum"
                                                onClick={() => { click__redeem_max(this) }}
                                            >
                                                MAX
                                            </div>
                                            <input
                                                type="number"
                                                onChange={(val) => { this.destroyNumChange(val.target.value) }}
                                                value={this.state.toDestroyNum}
                                            />
                                            <Select className="mySelect" defaultValue="USDx" disabled></Select>
                                        </div>
                                        <div className="clear"></div>
                                        <div className="ButtonWrap ButtonWrapWithdraw">
                                            <Button
                                                onClick={() => { destroy(this) }}
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

                                    <div style={{ display: this.state.show__tab === 3 ? 'block' : 'none' }} className="generate">
                                        <p className="details">Select which constituent you would like to withdraw:</p>
                                        <div className="input">
                                            <div className="maxNum" onClick={() => { this.adjustMaxToWithdraw() }}>MAX</div>
                                            <input type="number" onChange={(val) => { withdrawNumChange(this, val.target.value) }} value={this.state.toWithdrawNum} />
                                            <Select className="mySelect" defaultValue="PAX" onChange={(val) => { withdrawOptChange(this, val) }}>
                                                {/* <Select.Option value="DAI">DAI</Select.Option> */}
                                                <Select.Option value="PAX">PAX</Select.Option>
                                                <Select.Option value="TUSD">TUSD</Select.Option>
                                                <Select.Option value="USDC">USDC</Select.Option>
                                            </Select>
                                        </div>
                                        <div className="clear"></div>
                                        <div className="ButtonWrap ButtonWrapWithdraw">
                                            <Button
                                                onClick={() => { withdraw(this) }}
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

                                <div className="tab1 noRightMargin">
                                    <div className="tab1__new_title">
                                        <span className="tab1__img"><img src={icon__right} alt="" /></span>
                                        <span className="tab1__txt">Deposit your USDx to earn high yield</span>
                                    </div>
                                    <div className="you_have__wrap">
                                        <div className="you_have">
                                            You have
                                            <span className="you_have_balance">
                                                {this.state.you_have ? ' ' + format_num_to_K(format_bn(this.state.you_have, 18, 6)) + ' ' : '...'}
                                            </span>
                                            USDx brewing.
                                        </div>
                                        <div className="apy">
                                            <span className="apy-left">
                                                {'APY: '}
                                            </span>
                                            <span className="apy-right">
                                                {this.state.token_apy ? this.state.token_apy.toFixed(2) + '%' : '...'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="generate nomargin">
                                        <div className="usdx_logo_wrap">
                                            <span className="usdx_logo_wrap__logo">
                                                <img src={logo__usdx} />
                                            </span>
                                            <span className="usdx_logo_wrap__token">
                                                {'USDx'}
                                            </span>
                                        </div>

                                        <div className="input input-spe">
                                            <div
                                                className="maxNum right25"
                                                onClick={() => { click__max__deposite_to_usr(this) }}>
                                                MAX
                                            </div>
                                            <input
                                                type="number"
                                                onChange={(val) => { change__deposite_to_usr(this, val.target.value) }}
                                                value={this.state.value__deposit_to_usr}
                                            />
                                        </div>
                                        <div className="clear"></div>
                                        <div className="ButtonWrap ButtonWrapWithdraw">
                                            {
                                                this.state.is_ready && this.state.approved_to_usr &&
                                                <Button
                                                    onClick={() => { click__deposite_to_usr(this) }}
                                                    variant="contained"
                                                    color="secondary"
                                                    disabled={this.state.enable__deposite_to_usr ? false : true}
                                                    fullWidth={true}
                                                >DEPOSIT
                                                </Button>
                                            }
                                            {
                                                !(this.state.is_ready && this.state.approved_to_usr) &&
                                                <Button
                                                    onClick={() => { click__deposite_to_usr__approve(this) }}
                                                    variant="contained"
                                                    color="secondary"
                                                    disabled={false}
                                                    fullWidth={true}
                                                >ENABLE
                                                </Button>
                                            }

                                        </div>
                                        <div className="link_to_usr">
                                            <a href="https://usr.dforce.network" target="_blank" rel="noopener noreferrer">
                                                Withdraw
                                                <img src={icon_right} alt="" srcset="" />
                                            </a>
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
                                    addressUSDx={this.addressUSDx}
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
                                                <a href='https://discord.gg/Gbtd3MR' target='_blank' rel="noopener noreferrer">
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


    handleChange1 = (num) => {
        console.log(num);
        this.setState({
            show__tab: num
        });
    }


    DisconnectMetamask() {
        this.setState({
            isConnected: false,
            accountAddress: ''
        })
        Cookie.save('isLogin', 'false', { path: '/' });
        window.location.reload();
        return;
    }
    // connect Metamask
    connectMetamask() {
        this.Web3.currentProvider.enable().then(
            res => {
                console.log('you connected.');
                this.setState({
                    isConnected: true,
                    accountAddress: res[0]
                });
                this.getNetType();
                getDecimals(this);
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
                        netTypeColor: '#1abc9c',
                        netType: 'Main'
                    });
                    break;
                case '3':
                    this.setState({
                        netTypeColor: '#FC4E8E',
                        netType: 'Ropsten'
                    });
                    break;
                case '4':
                    this.setState({
                        netTypeColor: '#F5C250',
                        netType: 'Rinkeby'
                    });
                    break;
                case '42':
                    this.setState({
                        netTypeColor: '#715EFB',
                        netType: 'Kovan'
                    });
                    break;
                default:
                    this.setState({
                        netTypeColor: '#fff',
                        netType: 'Unknown'
                    });
            }
        });
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
                    myHistory: historyArr
                })
            }
        }, 3000)
    }


    // getMaxNumToGenerateOnestep
    getMaxNumToGenerateOnestep() {
        this.contractProtocolView.calcMaxMinting.call((err, ret) => {
            // console.log(err, ret);
            if (ret) {
                this.setState({
                    calcMaxMinting: ret
                })
            }
        })
    }

    // getDestroyThreshold
    getDestroyThreshold() {
        this.contractProtocolView.getDestroyThreshold.call((err, ret) => {
            this.setState({
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
                    userMaxToClaim: this.formatNumber(ret, 'USDx'),
                    couldClaim: true
                })
            } else {
                this.setState({
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
                            claimDAI: this.formatNumber(claimNumber[i], 'USDx')
                        })
                    }
                    if (claimAddress[i] === this.addressPAX) {
                        this.setState({
                            claimPAX: this.formatNumber(claimNumber[i], 'USDx')
                        })
                    }
                    if (claimAddress[i] === this.addressTUSD) {
                        this.setState({
                            claimTUSD: this.formatNumber(claimNumber[i], 'USDx')
                        })
                    }
                    if (claimAddress[i] === this.addressUSDC) {
                        this.setState({
                            claimUSDC: this.formatNumber(claimNumber[i], 'USDx')
                        })
                    }
                }
            }
        })
    }




    // *** get price ***
    getGasPrice() {
        this.Web3.eth.getGasPrice((e, r) => {
            // console.log(e, Number(r));
            this.setState({
                gasPrice: Number(r)
            })
        })
    }


    // *** get My Balance ***
    getMyBalance() {
        this.Web3.eth.getBalance(this.state.accountAddress, (err, ret) => {
            this.setState({
                myETH: this.formatNumber(ret, 'ETH')
            });
        });
        this.contractDAI.balanceOf.call(this.state.accountAddress, (err, ret) => {
            this.setState({
                myDAI: this.formatNumber(ret, 'DAI'),
                myDAIOrigin: ret.toString(10)
            });
        });
        this.contractPAX.balanceOf.call(this.state.accountAddress, (err, ret) => {
            this.setState({
                myPAX: this.formatNumber(ret, 'PAX'),
                myPAX__origin: ret
            });
        });
        this.contractTUSD.balanceOf.call(this.state.accountAddress, (err, ret) => {
            this.setState({
                myTUSD: this.formatNumber(ret, 'TUSD'),
                myTUSD__origin: ret
            });
        });
        this.contractUSDC.balanceOf.call(this.state.accountAddress, (err, ret) => {
            this.setState({
                myUSDC: this.formatNumber(ret, 'USDC'),
                myUSDC__origin: ret
            });
        });
        this.contractDF.balanceOf.call(this.state.accountAddress, (err, ret) => {
            this.setState({
                myDF: this.formatNumber(ret, 'DF')
            });
        });
        this.contractUSDx.balanceOf.call(this.state.accountAddress, (err, ret) => {
            // console.log(ret,ret.toString(10));
            this.setState({
                myUSDx: this.formatNumber(ret, 'USDx'),
                myUSDx__origin: ret
            });
        });

        // get usr balance
        this.contract_USR.balanceOfUnderlying.call(this.state.accountAddress, (err, ret) => {
            // console.log(ret, ret.toString(10),format_bn(ret.toString(10),18,6));
            this.setState({
                // myUSDx: this.formatNumber(ret, 'USDx'),
                you_have__origin: ret,
                you_have: ret.toString(10)
            });
        });

        get_tokens_status_apy(this);
    }


    // *** get Pool_Bank_Total Status ***
    getPoolBankTotalStatus() {
        this.contractUSDx.totalSupply.call((err, ret) => {
            this.setState({
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
                            DAIonPool: this.formatNumber(myBalance[i], 'DAI')
                        });
                    }
                    if (addressIDs[i] === this.addressPAX) {
                        this.setState({
                            PAXonPool: this.formatNumber(myBalance[i], 'PAX')
                        });
                    }
                    if (addressIDs[i] === this.addressTUSD) {
                        this.setState({
                            TUSDonPool: this.formatNumber(myBalance[i], 'TUSD')
                        });
                    }
                    if (addressIDs[i] === this.addressUSDC) {
                        this.setState({
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
                            DAIonBank: this.formatNumber(myBalance[i], 'DAI')
                        });
                    }
                    if (addressIDs[i] === this.addressPAX) {
                        this.setState({
                            PAXonBank: this.formatNumber(myBalance[i], 'PAX')
                        });
                    }
                    if (addressIDs[i] === this.addressTUSD) {
                        this.setState({
                            TUSDonBank: this.formatNumber(myBalance[i], 'TUSD')
                        });
                    }
                    if (addressIDs[i] === this.addressUSDC) {
                        this.setState({
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
                            myDAIonPool: this.formatNumber(myBalance[i], 'DAI'),
                            myDAIonPoolOrigin: this.handleMaxWithdraw(myBalance[i].toString(10), 'DAI')
                        })
                    }
                    if (addressIDs[i] === this.addressPAX) {
                        this.setState({
                            myPAXonPool: this.formatNumber(myBalance[i], 'PAX'),
                            myPAXonPoolOrigin: this.handleMaxWithdraw(myBalance[i].toString(10), 'PAX')
                        })
                    }
                    if (addressIDs[i] === this.addressTUSD) {
                        this.setState({
                            myTUSDonPool: this.formatNumber(myBalance[i], 'TUSD'),
                            myTUSDonPoolOrigin: this.handleMaxWithdraw(myBalance[i].toString(10), 'TUSD')
                        })
                    }
                    if (addressIDs[i] === this.addressUSDC) {
                        this.setState({
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
                return this.bn(NumStr.substring(0, NumStr.length - this.state.decimalsDAI) + '.' + NumStr.substring(NumStr.length - this.state.decimalsDAI)).toString(10);
            } else {
                return this.bn(NumStr.substring(0, NumStr.length - this.state.decimalsDAI) + '.' + NumStr.substring(NumStr.length - this.state.decimalsDAI)).toString(10);
            }
        }
        if (token === 'PAX') {
            if (NumStr.length < 18) {
                NumStr = '00000000000000000' + NumStr;
                return this.bn(NumStr.substring(0, NumStr.length - this.state.decimalsPAX) + '.' + NumStr.substring(NumStr.length - this.state.decimalsPAX)).toString(10);
            } else {
                return this.bn(NumStr.substring(0, NumStr.length - this.state.decimalsPAX) + '.' + NumStr.substring(NumStr.length - this.state.decimalsPAX)).toString(10);
            }
        }
        if (token === 'TUSD') {
            if (NumStr.length < 18) {
                NumStr = '00000000000000000' + NumStr;
                return this.bn(NumStr.substring(0, NumStr.length - this.state.decimalsTUSD) + '.' + NumStr.substring(NumStr.length - this.state.decimalsTUSD)).toString(10);
            } else {
                return this.bn(NumStr.substring(0, NumStr.length - this.state.decimalsTUSD) + '.' + NumStr.substring(NumStr.length - this.state.decimalsTUSD)).toString(10);
            }
        }
        if (token === 'USDC') {
            if (NumStr.length < 18) {
                NumStr = '00000000000000000' + NumStr;
                return this.bn(NumStr.substring(0, NumStr.length - this.state.decimalsUSDC) + '.' + NumStr.substring(NumStr.length - this.state.decimalsUSDC)).toString(10);
            } else {
                return this.bn(NumStr.substring(0, NumStr.length - this.state.decimalsUSDC) + '.' + NumStr.substring(NumStr.length - this.state.decimalsUSDC)).toString(10);
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


    // *** check if_approve ***
    checkApprove() {
        this.contractDAI.allowance.call(this.state.accountAddress, this.addressPool, (err, ret) => {
            if (err) {
                this.setState({
                    approvedDAI: false
                });
            }
            if (ret && ret.c[0] > 0) {
                this.setState({
                    approvedDAI: true
                });
            } else {
                this.setState({
                    approvedDAI: false
                });
            }
        });
        this.contractPAX.allowance.call(this.state.accountAddress, this.addressPool, (err, ret) => {
            if (err) {
                this.setState({
                    approvedPAX: false
                });
            }
            if (ret && ret.c[0] > 0) {
                this.setState({
                    approvedPAX: true
                });
            } else {
                this.setState({
                    approvedPAX: false
                });
            }
        });
        this.contractTUSD.allowance.call(this.state.accountAddress, this.addressPool, (err, ret) => {
            if (err) {
                this.setState({
                    approvedTUSD: false
                });
            }
            if (ret && ret.c[0] > 0) {
                this.setState({
                    approvedTUSD: true
                });
            } else {
                this.setState({
                    approvedTUSD: false
                });
            }
        });
        this.contractUSDC.allowance.call(this.state.accountAddress, this.addressPool, (err, ret) => {
            if (err) {
                this.setState({
                    approvedUSDC: false
                });
            }
            if (ret && ret.c[0] > 0) {
                this.setState({
                    approvedUSDC: true
                });
            } else {
                this.setState({
                    approvedUSDC: false
                });
            }
        });
        this.contractDF.allowance.call(this.state.accountAddress, this.addressEngine, (err, ret) => {
            if (err) {
                this.setState({
                    approvedDF: false
                });
            }
            if (ret && ret.c[0] > 0) {
                this.setState({
                    approvedDF: true
                });
            } else {
                this.setState({
                    approvedDF: false
                });
            }
        });
        this.contractUSDx.allowance.call(this.state.accountAddress, this.addressEngine, (err, ret) => {
            if (err) {
                this.setState({
                    approvedUSDx: false
                });
            }
            if (ret && ret.c[0] > 0) {
                this.setState({
                    approvedUSDx: true
                });
            } else {
                this.setState({
                    approvedUSDx: false
                });
            }
        });

        this.contractUSDx.allowance.call(this.state.accountAddress, this.addressUSR, (err, ret) => {
            if (ret && ret.c[0] > 0) {
                this.setState({
                    is_ready: true,
                    approved_to_usr: true
                });
            } else {
                this.setState({
                    is_ready: true,
                    approved_to_usr: false
                });
            }
        });
    }





    // *** adjust Max To Withdraw ***
    adjustMaxToWithdraw() {
        if (this.state.toWithdraw === 'DAI') {
            this.setState({
                toWithdrawNum: this.state.myDAIonPoolOrigin
            })
        }
        if (this.state.toWithdraw === 'PAX') {
            this.setState({
                toWithdrawNum: this.state.myPAXonPoolOrigin
            })
        }
        if (this.state.toWithdraw === 'TUSD') {
            this.setState({
                toWithdrawNum: this.state.myTUSDonPoolOrigin
            })
        }
        if (this.state.toWithdraw === 'USDC') {
            this.setState({
                toWithdrawNum: this.state.myUSDConPoolOrigin
            })
        }

        setTimeout(() => {
            withdrawNumChange(this, this.state.toWithdrawNum);
        }, 500)
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
                    maxGenerateUSDx: this.formatNumber(ret, 'USDx')
                })
            }
        })
    }


    // *** deposit_num ***
    depositNumChange(val) {
        this.setState({
            wanna_to_deposit__max: false,
        })

        if (val === '' || Number(val) === 0) {
            this.setState({
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
                    couldDeposit: true,
                    errTips: false,
                    toDepositNum: val
                }, () => {
                    this.getUSDXForDeposit(address, val * (10 ** tempUnits));
                })
            } else {
                this.setState({
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
                    couldDeposit: true,
                    errTips: false,
                    toDepositNum: val
                }, () => {
                    this.getUSDXForDeposit(address, val * (10 ** tempUnits));
                })
            } else {
                this.setState({
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
                    couldDeposit: true,
                    errTips: false,
                    toDepositNum: val
                }, () => {
                    this.getUSDXForDeposit(address, val * (10 ** tempUnits));
                })
            } else {
                this.setState({
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
                    couldDeposit: true,
                    errTips: false,
                    toDepositNum: val
                }, () => {
                    this.getUSDXForDeposit(address, val * (10 ** tempUnits));
                })
            } else {
                this.setState({
                    couldDeposit: false,
                    errTips: true,
                    toDepositNum: val
                })
            }
        }
    }
    depositOptChange(token) {
        this.setState({
            toDeposit: token,
            toDepositNum: '',
            wanna_to_deposit__max: false,
        }, () => {
            if (!this.state.toDepositNum) {
                return;
            }
            // this.depositNumChange(this.state.toDepositNum);
        })
    }



    // *** destroy_chang ***
    destroyNumChange(val) {
        if (val.length > 16) {
            return;
        }
        if (Number(val) > 0 && this.bn(val).sub(this.bn(this.state.myUSDx)) <= 0) {
            var USDxToDAI = this.bn(val).mul(this.bn(this.state.sectionDAIBurning).div(this.bn(this.state.tatolSectionBurning)));
            var USDxToPAX = this.bn(val).mul(this.bn(this.state.sectionPAXBurning).div(this.bn(this.state.tatolSectionBurning)));
            var USDxToTUSD = this.bn(val).mul(this.bn(this.state.sectionTUSDBurning).div(this.bn(this.state.tatolSectionBurning)));
            var USDxToUSDC = this.bn(val).mul(this.bn(this.state.sectionUSDCBurning).div(this.bn(this.state.tatolSectionBurning)));
            this.setState({
                errTipsDestroy: false,
                couldDestroy: true,
                toDestroyNum: val,
                USDxToDAI: USDxToDAI.toString(10),
                USDxToPAX: USDxToPAX.toString(10),
                USDxToTUSD: USDxToTUSD.toString(10),
                USDxToUSDC: USDxToUSDC.toString(10),
                getDestroyThresholdBool: false
            })
            if (this.bn(val).mod(this.bn(this.state.getDestroyThreshold)).toString(10) !== '0') {
                this.setState({
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
            if (this.bn(val * this.state.feeRate / this.state.dfPrice).sub(this.bn(this.state.myDF)) > 0) {
                this.setState({
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




    showOnestwpFn() {
        this.setState({
            showOnestep: !this.state.showOnestep
        })
    }
    closeOnestwpFn() {
        this.setState({
            showOnestep: !this.state.showOnestep
        })
    }
}
