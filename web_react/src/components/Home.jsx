// Libraries
import React from 'react';
import DocuentTitle from 'react-document-title';
import Cookie from 'react-cookies';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


import 'antd/dist/antd.css';
// import { Spin } from 'antd';
import { Select } from 'antd';

// abi
import abiTokens from '../abi/abiTokens';
// import abiDAI from '../abi/abiDAI';
// import abiPAX from '../abi/abiPAX';
// import abiTUSD from '../abi/abiTUSD';
// import abiUSDC from '../abi/abiUSDC';

// import abiDF from '../abi/abiDF';
import abiUSDx from '../abi/abiUSDx';
import abiStore from '../abi/abiStore';
import abiProtocol from '../abi/abiProtocol';

// components
import Notify from './Notify';
import Header from './Header';
import Welcome from './Welcome';
import BodyLeft from './BodyLeft';

// images
import doubt from '../assets/img/doubt.png';
import exchangeTo from '../assets/img/exchangeTo.png';
import exchangeBack from '../assets/img/exchangeBack.png';



export default class Home extends React.Component {
    addressDAI = '0xf494e07dfdbce883bf699cedf818fde2fa432db4';
    addressPAX = '0x561b11000e95ac053eccec5bcefdc37e16c2491b';
    addressTUSD = '0x25470030aa105bca679752e5c5e482c295de2b68';
    addressUSDC = '0xbc34e50f589e389c507e0213501114bd2e70b1d7';
    addressDF = '0x4AF82b7C2F049574C9fc742A896DAbEA379b7d51';
    addressUSDx = '0x29d1980bDe9A71eBd47FE7cdef14640DC731BAA5';

    addressProtocol = '0x555bd8A39524635C725b62b28602cF52184C8CAE';
    addressCollateral = '0x049b6B20826366897965592cabc24C35cDB69fe5';
    addressEngine = '0xC7135d5F772FD9fD1e1780A401552fA15ee52E60';
    addressPool = '0xA90B0e780f9eCb78D9bc4fE951E4A7A698b90b24';
    addressStore = '0x1E3b33c17C93a7B541186413239Fac77A475b91C';
    units = 10 ** 18;
    tatolSection = 0;
    tatolSectionBurning = 0;

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
        this.state = {
            transcations: {},
            toDeposit: 'DAI',
            toDepositNum: '',
            toWithdraw: 'DAI',
            toWithdrawNum: '',
            toDestroyNum: '',
            tab1: true
        }
        if (window.web3) {
            this.Web3 = window.web3;
            this.contractDAI = this.Web3.eth.contract(abiTokens).at(this.addressDAI);
            this.contractPAX = this.Web3.eth.contract(abiTokens).at(this.addressPAX);
            this.contractTUSD = this.Web3.eth.contract(abiTokens).at(this.addressTUSD);
            this.contractUSDC = this.Web3.eth.contract(abiTokens).at(this.addressUSDC);

            this.contractDF = this.Web3.eth.contract(abiTokens).at(this.addressDF);

            this.contractUSDx = this.Web3.eth.contract(abiUSDx).at(this.addressUSDx);
            this.contractProtocol = this.Web3.eth.contract(abiProtocol).at(this.addressProtocol);
            this.contractStore = this.Web3.eth.contract(abiStore).at(this.addressStore);
        } else {
            alert ('pls install metamask first.');
        }

        setInterval(() => {
            if (!this.Web3.eth.coinbase) {
                return;
            }
            if (Cookie.load('isLogin') === 'false') {
                console.log('i am out')
                return;
            }
            if (this.state.accountAddress !== this.Web3.eth.coinbase) {
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
            }else {
                console.log('not connected...');
                return;
            }
        }, 1000 * 15)
    }

    componentWillMount () {}
    componentDidMount () {}
    render () {
        return (
            <DocuentTitle title='USDX portal'>
                <React.Fragment>
                    {/* <Welcome ifShow={this.state.isConnected} connectMetamask={()=>{this.connectMetamask()}}/> */}
                    <Notify transcations={this.state.transcations}/>
                    <Header
                        status={this.state}
                        DisconnectMetamask={()=>{this.DisconnectMetamask()}}
                        connectMetamask={()=>{this.connectMetamask()}}
                        approve={(v)=>{this.approve(v)}}
                        lock={(v)=>{this.lock(v)}}
                        allocateTo={(v)=>{this.allocateTo(v)}}
                    />
                    <MuiThemeProvider theme={this.theme}>
                    <div className="body">
                        <BodyLeft data={this.state}/>
                        <div className="bodyright">
                                <div className="tab1">
                                    <div className="titleInTab">
                                        <div className="leftTitle">EXCHANGE</div>
                                        <div className="rightIcon">
                                            <IconButton color="inherit" onClick={()=>{this.handleChange1()}}>
                                                <img src={exchangeTo} alt="" style={{display: this.state.tab1? 'block' : 'none'}}/>
                                                <img src={exchangeBack} alt="" style={{display: !this.state.tab1? 'block' : 'none'}}/>
                                            </IconButton>
                                        </div>
                                        <div className="clear"></div>
                                    </div>
                                    <div style={{ display: this.state.tab1? 'block' : 'none' }} className="generate">
                                        <p className="details">Select which constituent would you like to deposit ?</p>
                                        <div className="input">
                                            <input type="number" onChange={(val) => { this.depositNumChange(val.target.value) }} value={this.state.toDepositNum} />
                                            <Select className="mySelect" defaultValue="DAI" onChange={(val) => { this.setState({ ...this.state, toDeposit: val }) }}>
                                                <Select.Option value="DAI">DAI</Select.Option>
                                                <Select.Option value="PAX">PAX</Select.Option>
                                                <Select.Option value="TUSD">TUSD</Select.Option>
                                                <Select.Option value="USDC">USDC</Select.Option>
                                            </Select>
                                        </div>
                                        <div className="myBalanceOnPool myBalanceOnPoolMax">
                                            Max USDX available to generate: 
                                            <span>
                                                <i>{this.state.maxGenerateUSDx ? this.state.maxGenerateUSDx.split('.')[0] : '0'}</i>
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
                                                CONVERT
                                            </Button>
                                        </div>
                                        <div className="diverLine"></div>
                                        <div className="claim">
                                            Maximal USDX to claim:
                                            <span>
                                                <i>{this.state.userMaxToClaim? this.state.userMaxToClaim.split('.')[0] : '0'}</i>
                                                {this.state.userMaxToClaim? '.' + this.state.userMaxToClaim.split('.')[1] : '.00'}
                                            </span>
                                        </div>
                                        <div className="ButtonWrap marginTop10 marginMax">
                                            <Button
                                                onClick={() => { this.claim() }}
                                                variant="contained"
                                                color="secondary"
                                                // disabled={this.state.couldDeposit ? false : true}
                                                fullWidth={true}
                                            >
                                                CLAIM
                                            </Button>
                                        </div>
                                        <div className="errtips" style={{ display: this.state.errTips ? 'block' : 'none' }}>
                                            <h4>Reminder</h4>
                                            The amount of {this.state.toDeposit} to be deposit exceeds your current balance.
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: !this.state.tab1 ? 'block' : 'none' }} className="generate">
                                        <p className="details">How much USDX would you like to disaggregate?</p>
                                        <div className="input">
                                            <input type="number" onChange={(val) => { this.destroyNumChange(val.target.value) }} value={this.state.toDestroyNum} />
                                            <Select className="mySelect" defaultValue="USDX" disabled></Select>
                                        </div>
                                        <div className="clear"></div>
                                        <div className="ButtonWrap ButtonWrapWithdraw">
                                            <Button
                                                onClick={() => { this.destroy() }}
                                                variant="contained"
                                                color="secondary"
                                                disabled={this.state.couldDestroy ? false : true}
                                                fullWidth={true}
                                            >DESTROY
                                            </Button>
                                        </div>
                                        <div className="tips tipsMax">
                                            <div className="imgWrap">
                                                <img src={doubt} alt="" />
                                                <div className="detials">When you proceed destroying USDX, certain amount of DF coin is going to charge for brassage. The current fee is 5DF.</div>
                                            </div>
                                            DF fee needed:
                                            <span>
                                                <i>{this.state.couldDestroy ? (this.state.toDestroyNum * this.state.feeRate / this.state.dfPrice).toFixed(2).toString().split('.')[0] : '0'}</i>
                                                {this.state.couldDestroy ? '.' + (this.state.toDestroyNum * this.state.feeRate / this.state.dfPrice).toFixed(2).toString().split('.')[1] : '.00'}
                                            </span>
                                        </div>
                                        <div className="errtips" style={{ display: this.state.errTipsDestroy ? 'block' : 'none' }}>
                                            {/* <div className="errtips"> */}
                                            <h4>Reminder</h4>
                                            The amount of destroy to be deposit exceeds your current balance.
                                        </div>
                                        <div className="myBalanceOnPoolSection">
                                            <div className="title">How much constituents expect to generate ?</div>
                                            <p className='partToken'>
                                                <span>DAI</span>
                                                <span className='right'>
                                                    {this.state.USDxToDAI ? this.state.USDxToDAI.split('.')[0] : '0'}
                                                    <i>{this.state.USDxToDAI ? '.' + this.state.USDxToDAI.split('.')[1] : '.00'}</i>
                                                </span>
                                            </p>
                                            <p className='partToken marginR marginl'>
                                                <span>PAX</span>
                                                <span className='right'>
                                                    {this.state.USDxToPAX ? this.state.USDxToPAX.split('.')[0] : '0'}
                                                    <i>{this.state.USDxToPAX ? '.' + this.state.USDxToPAX.split('.')[1] : '.00'}</i>
                                                </span>
                                            </p>
                                            <p className='partToken'>
                                                <span>TUSD</span>
                                                <span className='right'>
                                                    {this.state.USDxToTUSD ? this.state.USDxToTUSD.split('.')[0] : '0'}
                                                    <i>{this.state.USDxToTUSD ? '.' + this.state.USDxToTUSD.split('.')[1] : '.00'}</i>
                                                </span>
                                            </p>
                                            <p className='partToken marginl'>
                                                <span>USDC</span>
                                                <span className='right'>
                                                    {this.state.USDxToUSDC ? this.state.USDxToUSDC.split('.')[0] : '0'}
                                                    <i>{this.state.USDxToUSDC ? '.' + this.state.USDxToUSDC.split('.')[1] : '.00'}</i>
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
                                        <p className="details">Select which constituent would you like to withdraw ?</p>
                                        <div className="input">
                                            <input type="number" onChange={(val) => { this.withdrawNumChange(val.target.value) }} value={this.state.toWithdrawNum} />
                                            <Select className="mySelect" defaultValue="DAI" onChange={(val) => { this.setState({ ...this.state, toWithdraw: val }) }}>
                                                <Select.Option value="DAI">DAI</Select.Option>
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
                                            The amount of {this.state.toWithdraw} to be deposit exceeds your current balance.
                                                </div>
                                        <div className="myBalanceOnPoolSection">
                                            <div className="title">Withdraw Constituents:</div>
                                            <p className='partToken'>
                                                <span>DAI</span>
                                                <span className='right'>
                                                    {this.state.myDAIonPool ? this.state.myDAIonPool.split('.')[0] : '0'}
                                                    <i>{this.state.myDAIonPool ? '.' + this.state.myDAIonPool.split('.')[1] : '.00'}</i>
                                                </span>
                                            </p>
                                            <p className='partToken marginl'>
                                                <span>PAX</span>
                                                <span className='right'>
                                                    {this.state.myPAXonPool ? this.state.myPAXonPool.split('.')[0] : '0'}
                                                    <i>{this.state.myPAXonPool ? '.' + this.state.myPAXonPool.split('.')[1] : '.00'}</i>
                                                </span>
                                            </p>
                                            <p className='partToken'>
                                                <span>TUSD</span>
                                                <span className='right'>
                                                    {this.state.myTUSDonPool ? this.state.myTUSDonPool.split('.')[0] : '0'}
                                                    <i>{this.state.myTUSDonPool ? '.' + this.state.myTUSDonPool.split('.')[1] : '.00'}</i>
                                                </span>
                                            </p>
                                            <p className='partToken marginl'>
                                                <span>USDC</span>
                                                <span className='right'>
                                                    {this.state.myUSDConPool ? this.state.myUSDConPool.split('.')[0] : '0'}
                                                    <i>{this.state.myUSDConPool ? '.' + this.state.myUSDConPool.split('.')[1] : '.00'}</i>
                                                </span>
                                            </p>
                                            <div className="clear"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="clear"></div>
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
    DisconnectMetamask () {
        this.setState({
            isConnected: false,
            accountAddress: ''
        })
        Cookie.save('isLogin', 'false', { path: '/' });
        window.location.reload();
        return;
    }
    // connectMetamask
    connectMetamask () {
        this.Web3.currentProvider.enable().then(
            res => {
                console.log('you connected.');
                this.setState({
                    ...this.state,
                    isConnected: true,
                    accountAddress: res[0]
                });
                this.getNetType();
                this.getMyBalance();
                this.getPoolBankTotalStatus();
                this.getUserWithdrawBalance();
                this.checkApprove();
                this.getTokenSection();
                this.getTokenBurningSection();
                this.getUserMaxToClaim();
                this.getPrice();
                this.getFeeRate();
                this.getColMaxClaim();
                this.getUserWithdrawBalance();
                Cookie.save('isLogin', 'true', { path: '/' });
            },
            err => {
                console.log(err);
                this.DisconnectMetamask();
                alert('cancel the connection');
            }
        );
    }


    // getNetType
    getNetType () {
        this.Web3.version.getNetwork((err, net) => {
            switch (net) {
                case '1':
                    this.setState({
                        ...this.state,
                        netTypeColor: '#1abc9c',
                        netType: 'MainNet'
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


    // get the Token section
    getTokenSection () {
        this.contractProtocol.getMintingSection.call((err, ret) => {
            // console.log(ret[0])
            // console.log(ret[1])
            if (ret) {
                var addressArry = ret[0];
                var secArry = ret[1];

                for (let i = 0; i < addressArry.length; i++) {
                    if (addressArry[i] === this.addressDAI) {
                        this.sectionDAI = secArry[i].toFixed() / (10 ** 7);
                        this.tatolSection = this.tatolSection + this.sectionDAI;
                        this.setState({
                            ...this.state,
                            sectionDAI: this.sectionDAI,
                            tatolSection: this.tatolSection
                        })
                    }
                    if (addressArry[i] === this.addressPAX) {
                        this.sectionPAX = secArry[i].toFixed() / (10 ** 7);
                        this.tatolSection = this.tatolSection + this.sectionPAX;
                        this.setState({
                            ...this.state,
                            sectionPAX: this.sectionPAX,
                            tatolSection: this.tatolSection
                        })
                    }
                    if (addressArry[i] === this.addressUSDC) {
                        this.sectionUSDC = secArry[i].toFixed() / (10 ** 7);
                        this.tatolSection = this.tatolSection + this.sectionUSDC;
                        this.setState({
                            ...this.state,
                            sectionUSDC: this.sectionUSDC,
                            tatolSection: this.tatolSection
                        })
                    }
                    if (addressArry[i] === this.addressTUSD) {
                        this.sectionTUSD = secArry[i].toFixed() / (10 ** 7);
                        this.tatolSection = this.tatolSection + this.sectionTUSD;
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
    getTokenBurningSection () {
        this.contractProtocol.getBurningSection.call((err, ret) => {
            // console.log(err, ret);
            if (ret) {
                var addrArry = ret[0];
                var sectionArry = ret[1];

                for (let i = 0; i < addrArry.length; i++) {
                    if (addrArry[i] === this.addressDAI) {
                        this.sectionDAIBurning = sectionArry[i].toFixed() / (10 ** 7);
                        this.tatolSectionBurning = this.tatolSectionBurning + this.sectionDAIBurning;
                        this.setState({
                            ...this.state,
                            sectionDAIBurning: this.sectionDAIBurning,
                            tatolSectionBurning: this.tatolSectionBurning
                        })
                    }
                    if (addrArry[i] === this.addressPAX) {
                        this.sectionPAXBurning = sectionArry[i].toFixed() / (10 ** 7);
                        this.tatolSectionBurning = this.tatolSectionBurning + this.sectionPAXBurning;
                        this.setState({
                            ...this.state,
                            sectionPAXBurning: this.sectionPAXBurning,
                            tatolSectionBurning: this.tatolSectionBurning
                        })
                    }
                    if (addrArry[i] === this.addressTUSD) {
                        this.sectionTUSDBurning = sectionArry[i].toFixed() / (10 ** 7);
                        this.tatolSectionBurning = this.tatolSectionBurning + this.sectionTUSDBurning;
                        this.setState({
                            ...this.state,
                            sectionTUSDBurning: this.sectionTUSDBurning,
                            tatolSectionBurning: this.tatolSectionBurning
                        })
                    }
                    if (addrArry[i] === this.addressUSDC) {
                        this.sectionUSDCBurning = sectionArry[i].toFixed() / (10 ** 7);
                        this.tatolSectionBurning = this.tatolSectionBurning + this.sectionUSDCBurning;
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
    // getUserMaxToClaim
    getUserMaxToClaim () {
        this.contractProtocol.getUserMaxToClaim.call((err, ret)=>{
            // console.log(err, ret);
            if (ret) {
                this.setState({
                    ...this.state,
                    userMaxToClaim: this.formatNumber(ret)
                })
            }
        })
    }
    // getPrice
    getPrice () {
        this.contractProtocol.getPrice.call(0, (err, ret)=>{
            // console.log(err, ret);
            if (ret) {
                this.setState({
                    ...this.state,
                    dfPrice: this.formatNumber(ret)
                })
            }
        })
    }
    // getFeeRate
    getFeeRate () {
        this.contractProtocol.getFeeRate.call(1, (err, ret)=>{
            // console.log(err, ret);
            if (ret) {
                this.setState({
                    ...this.state,
                    feeRate: ret/10000
                })
            }
        })
    }
    // getColMaxClaim
    getColMaxClaim () {
        this.contractProtocol.getColMaxClaim.call((err, ret)=>{
            // console.log(err, ret);
            if (ret) {
                var claimAddress = ret[0];
                var claimNumber = ret[1];

                for (let i = 0; i < claimAddress.length; i++) {
                    if (claimAddress[i] === this.addressDAI) {
                        this.setState({
                            ...this.state,
                            claimDAI: this.formatNumber(claimNumber[i])
                        })
                    }
                    if (claimAddress[i] === this.addressPAX) {
                        this.setState({
                            ...this.state,
                            claimPAX: this.formatNumber(claimNumber[i])
                        })
                    }
                    if (claimAddress[i] === this.addressTUSD) {
                        this.setState({
                            ...this.state,
                            claimTUSD: this.formatNumber(claimNumber[i])
                        })
                    }
                    if (claimAddress[i] === this.addressUSDC) {
                        this.setState({
                            ...this.state,
                            claimUSDC: this.formatNumber(claimNumber[i])
                        })
                    }
                }
            }
        })
    }
    // getUserWithdrawBalance
    getUserWithdrawBalance () {
        this.contractProtocol.getUserWithdrawBalance.call((err, ret)=>{
            // console.log(err, ret);
            if (ret) {
                var addressIDs = ret[0];
                var myBalance = ret[1];

                for (let i = 0; i < addressIDs.length; i++) {
                    if (addressIDs[i] === this.addressDAI) {
                        this.setState({
                            ...this.state,
                            myDAIonPool: this.formatNumber(myBalance[i])
                        })
                    }
                    if (addressIDs[i] === this.addressPAX) {
                        this.setState({
                            ...this.state,
                            myPAXonPool: this.formatNumber(myBalance[i])
                        })
                    }
                    if (addressIDs[i] === this.addressTUSD) {
                        this.setState({
                            ...this.state,
                            myTUSDonPool: this.formatNumber(myBalance[i])
                        })
                    }
                    if (addressIDs[i] === this.addressUSDC) {
                        this.setState({
                            ...this.state,
                            myUSDConPool: this.formatNumber(myBalance[i])
                        })
                    }
                }
            }
        })
    }



    // var num = new BN((amount * 10 ** 18).toLocaleString().replace(/,/g,''))
    // getMyBalance
    getMyBalance () {
        this.Web3.eth.getBalance(this.state.accountAddress, (err, ret) => {
            this.setState({
                ...this.state,
                myETH: this.formatNumber(ret)
            });
        });
        this.contractDAI.balanceOf.call(this.state.accountAddress, (err, ret) => {
            // console.log('-----DAI-----', ret)
            // console.log('-----DAI--.toFixed()/ (10 ** 18)---', ret.toFixed() / (10 ** 18))
            // console.log('-----DAI--.toFixed()---', ret.toFixed())
            this.setState({
                ...this.state,
                myDAI: this.formatNumber(ret)
            });
        });
        this.contractPAX.balanceOf.call(this.state.accountAddress, (err, ret) => {
            // console.log('-------PAX---', ret)
            this.setState({
                ...this.state,
                myPAX: this.formatNumber(ret)
            });
        });
        this.contractTUSD.balanceOf.call(this.state.accountAddress, (err, ret) => {
            // console.log('-----TUSD-----', ret)
            this.setState({
                ...this.state,
                myTUSD: this.formatNumber(ret)
            });
        });
        this.contractUSDC.balanceOf.call(this.state.accountAddress, (err, ret) => {
            // console.log('----USDC-----', ret)
            this.setState({
                ...this.state,
                myUSDC: this.formatNumber(ret)
            });
        });
        this.contractDF.balanceOf.call(this.state.accountAddress, (err, ret) => {
            // console.log('-----DF-----', ret)
            this.setState({
                ...this.state,
                myDF: this.formatNumber(ret)
            });
        });
        this.contractUSDx.balanceOf.call(this.state.accountAddress, (err, ret) => {
            // console.log(ret)
            this.setState({
                ...this.state,
                myUSDx: this.formatNumber(ret)
            });
        });
    }
    // getPoolBankTotalStatus
    getPoolBankTotalStatus () {
        this.contractUSDx.totalSupply.call((err, ret) => {
            this.setState({
                ...this.state,
                totalSupplyUSDx: this.formatNumber(ret)
            });
        });

        this.contractDAI.balanceOf.call(this.addressPool, (err, ret) => {
            this.setState({
                ...this.state,
                DAIonPool: this.formatNumber(ret)
            });
        });
        this.contractPAX.balanceOf.call(this.addressPool, (err, ret) => {
            this.setState({
                ...this.state,
                PAXonPool: this.formatNumber(ret)
            });
        });
        this.contractTUSD.balanceOf.call(this.addressPool, (err, ret) => {
            this.setState({
                ...this.state,
                TUSDonPool: this.formatNumber(ret)
            });
        });
        this.contractUSDC.balanceOf.call(this.addressPool, (err, ret) => {
            this.setState({
                ...this.state,
                USDConPool: this.formatNumber(ret)
            });
        });

        this.contractDAI.balanceOf.call(this.addressCollateral, (err, ret) => {
            this.setState({
                ...this.state,
                DAIonBank: this.formatNumber(ret)
            });
        });
        this.contractPAX.balanceOf.call(this.addressCollateral, (err, ret) => {
            this.setState({
                ...this.state,
                PAXonBank: this.formatNumber(ret)
            });
        });
        this.contractTUSD.balanceOf.call(this.addressCollateral, (err, ret) => {
            this.setState({
                ...this.state,
                TUSDonBank: this.formatNumber(ret)
            });
        });
        this.contractUSDC.balanceOf.call(this.addressCollateral, (err, ret) => {
            this.setState({
                ...this.state,
                USDConBank: this.formatNumber(ret)
            });
        });
    }
    // getMyBalanceOnPool
    // getMyBalanceOnPool () {
    //     this.contractStore.getDepositorBalance.call(this.state.accountAddress, this.addressDAI, (err, ret) => {
    //         this.setState({
    //             ...this.state,
    //             myDAIonPool: this.formatNumber(ret)
    //         });
    //     });
    //     this.contractStore.getDepositorBalance.call(this.state.accountAddress, this.addressPAX, (err, ret) => {
    //         this.setState({
    //             ...this.state,
    //             myPAXonPool: this.formatNumber(ret)
    //         });
    //     });
    //     this.contractStore.getDepositorBalance.call(this.state.accountAddress, this.addressTUSD, (err, ret) => {
    //         this.setState({
    //             ...this.state,
    //             myTUSDonPool: this.formatNumber(ret)
    //         });
    //     });
    //     this.contractStore.getDepositorBalance.call(this.state.accountAddress, this.addressUSDC, (err, ret) => {
    //         this.setState({
    //             ...this.state,
    //             myUSDConPool: this.formatNumber(ret)
    //         });
    //     });
    // }


    // format number
    formatNumber (BNr) {
        if (BNr.toFixed() < (10 ** 15) && BNr.toFixed() > 0) {
            return '0.00';
        }

        let originStr = (BNr.toFixed() / (10 ** 10) / (10 ** 8)).toString();

        if ( originStr.indexOf('.') > 0 ) {
            originStr = originStr.substr(0, originStr.indexOf('.') + 3);
            if (originStr.length >= 12) {
                return originStr = originStr.substr(0, 11);
            } else {
                return originStr;
            }
        } else {
            return originStr + '.00';
        }
    }


    // check approve
    checkApprove () {
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
            }
        });
    }


    // Approve token
    approve (token) {
        if (!this.state.isConnected) {
            return;
        }

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
        this.setState({tmepState});

        // witch token to be approved
        if (token === 'DAI') {
            this.contractDAI.approve.sendTransaction(
                this.addressPool,
                -1,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
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
                                    msg: 'Approve ' + token + ' error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
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
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var approveDAItimer = setInterval(() => {
                            console.log('i am checking approve DAI...');
                            this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(approveDAItimer);
                                    this.setState({
                                        ...this.state,
                                        approvedDAI: true
                                    });
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                    if (this.state.fromDepositDAI) {
                                        this.setState({
                                            ...this.state,
                                            fromDepositDAI: false
                                        });
                                        setTimeout(() => {
                                            this.deposit();
                                        }, 4000)
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
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
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
        } else if (token === 'PAX') {
            this.contractPAX.approve.sendTransaction(
                this.addressPool,
                -1,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
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
                                    msg: 'Approve ' + token + ' error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
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
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var approvePAXtimer = setInterval(() => {
                            console.log('i am checking approve PAX...');
                            this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(approvePAXtimer);
                                    this.setState({
                                        ...this.state,
                                        approvedPAX: true
                                    });
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                    if (this.state.fromDepositPAX) {
                                        this.setState({
                                            ...this.state,
                                            fromDepositPAX: false
                                        });
                                        setTimeout(() => {
                                            this.deposit();
                                        }, 4000)
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
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
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
        } else if (token === 'TUSD') {
            this.contractTUSD.approve.sendTransaction(
                this.addressPool,
                -1,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
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
                                    msg: 'Approve ' + token + ' error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
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
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var approveTUSDtimer = setInterval(() => {
                            console.log('i am checking approve TUSD...');
                            this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(approveTUSDtimer);
                                    this.setState({
                                        ...this.state,
                                        approvedTUSD: true
                                    });
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                    if (this.state.fromDepositTUSD) {
                                        this.setState({
                                            ...this.state,
                                            fromDepositTUSD: false
                                        });
                                        setTimeout(() => {
                                            this.deposit();
                                        }, 4000)
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
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
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
        } else if (token === 'USDC') {
            this.contractUSDC.approve.sendTransaction(
                this.addressPool,
                -1,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
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
                                    msg: 'Approve ' + token + ' error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
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
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var approveUSDCtimer = setInterval(() => {
                            console.log('i am checking approve USDC...');
                            this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(approveUSDCtimer);
                                    this.setState({
                                        ...this.state,
                                        approvedUSDC: true
                                    });
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                    if (this.state.fromDepositUSDC) {
                                        this.setState({
                                            ...this.state,
                                            fromDepositUSDC: false
                                        });
                                        setTimeout(() => {
                                            this.deposit();
                                        }, 4000)
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
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
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
        } else if (token === 'DF') {
            this.contractDF.approve.sendTransaction(
                this.addressEngine,
                -1,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
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
                                    msg: 'Approve ' + token + ' error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
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
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var approveDFtimer = setInterval(() => {
                            console.log('i am checking approve DF...');
                            this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(approveDFtimer);
                                    this.setState({
                                        ...this.state,
                                        approvedDF: true
                                    });
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                    if (this.state.fromDestroy1) {
                                        this.setState({
                                            ...this.state,
                                            fromDestroy1: false
                                        });
                                        setTimeout(() => {
                                            this.destroy();
                                        }, 4000)
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
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
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
        } else if (token === 'USDX') {
            this.contractUSDx.approve.sendTransaction(
                this.addressEngine,
                -1,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
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
                                    msg: 'Approve ' + token + ' error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
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
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var approveUSDxtimer = setInterval(() => {
                            console.log('i am checking approve USDX...');
                            this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(approveUSDxtimer);
                                    this.setState({
                                        ...this.state,
                                        approvedUSDx: true
                                    });
                                    const keys = Object.keys(this.state.transcations);
                                    const tmepState = this.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                    if (this.state.fromDestroy2) {
                                        this.setState({
                                            ...this.state,
                                            fromDestroy2: false
                                        });
                                        setTimeout(() => {
                                            this.destroy();
                                        }, 4000)
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
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
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
        
    }
    // Lock token
    lock (token) {
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
        this.setState({tmepState});

        // witch token to be locked
        if (token === 'DAI') {
            this.contractDAI.approve.sendTransaction(
                this.addressPool,
                0,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Lock ' + token) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
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
                                this.setState({tmepState});
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
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
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
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
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
        } else if (token === 'PAX') {
            this.contractPAX.approve.sendTransaction(
                this.addressPool,
                0,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Lock ' + token) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
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
                                this.setState({tmepState});
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
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
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
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
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
        } else if (token === 'TUSD') {
            this.contractTUSD.approve.sendTransaction(
                this.addressPool,
                0,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Lock ' + token) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
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
                                this.setState({tmepState});
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
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
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
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
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
        } else if (token === 'USDC') {
            this.contractUSDC.approve.sendTransaction(
                this.addressPool,
                0,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Lock ' + token) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
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
                                this.setState({tmepState});
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
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
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
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
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
        } else if (token === 'DF') {
            this.contractDF.approve.sendTransaction(
                this.addressEngine,
                0,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Lock ' + token) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
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
                                this.setState({tmepState});
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
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
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
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
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
        } else if (token === 'USDX') {
            this.contractUSDx.approve.sendTransaction(
                this.addressEngine,
                0,
                {
                    from: this.state.accountAddress,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(this.state.transcations);
                        const tmepState = this.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].title === 'Lock ' + token) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error'
                                }
                                this.setState({tmepState});

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    this.setState({tmepState});
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
                                this.setState({tmepState});
                            };
                            return false;
                        });

                        var lockUSDxtimer = setInterval(() => {
                            console.log('i am checking lock USDX...');
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
                                                msg: 'Transaction success'
                                            }
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
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
                                            this.setState({tmepState});

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                this.setState({tmepState});
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
    }


    // withdraw number check
    withdrawNumChange (val) {
        if (val.length > 16) {
            return;
        }
        if (this.state.toWithdraw === 'DAI') {
            if (Number(val) > 0 && Number(val) <= Number(this.state.myDAIonPool)) {
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
                if (val === '') {
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
            if (Number(val) > 0 && Number(val) <= Number(this.state.myPAXonPool)) {
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
                if (val === '') {
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
            if (Number(val) > 0 && Number(val) <= Number(this.state.myTUSDonPool)) {
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
                if (val === '') {
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
            if (Number(val) > 0 && Number(val) <= Number(this.state.myUSDConPool)) {
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
                if (val === '') {
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
    // withdraw
    withdraw () {
        if (!this.state.couldWithdraw) {
            return;
        }

        var addr;
        var num = this.state.toWithdrawNum * this.units;
        if (this.state.toWithdraw === 'DAI') {
            addr = this.addressDAI;
            this.withdrawDAI(addr, num);
        } else if (this.state.toWithdraw === 'PAX') {
            addr = this.addressPAX;
            this.withdrawPAX(addr, num);
        } else if (this.state.toWithdraw === 'TUSD') {
            addr = this.addressTUSD;
            this.withdrawTUSD(addr, num);
        } else if (this.state.toWithdraw === 'USDC') {
            addr = this.addressUSDC;
            this.withdrawUSDC(addr, num);
        }
    }
    // withdrawDAI
    withdrawDAI (addr, num) {
        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Withdraw DAI') {
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
            title: 'Withdraw DAI',
        }
        this.setState({tmepState});
        this.contractProtocol.withdraw.sendTransaction(
            addr,
            0,
            num,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Withdraw DAI') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Withdraw DAI') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var withdrawDAItimer = setInterval(() => {
                        console.log('i am checking withdraw DAI...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(withdrawDAItimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        tmepState.toWithdrawNum = '';
                                        tmepState.couldWithdraw = false;
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
                                clearInterval(withdrawDAItimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
    // withdrawPAX
    withdrawPAX (addr, num) {
        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Withdraw PAX') {
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
            title: 'Withdraw PAX',
        }
        this.setState({tmepState});
        this.contractProtocol.withdraw.sendTransaction(
            addr,
            0,
            num,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Withdraw PAX') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Withdraw PAX') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var withdrawPAXtimer = setInterval(() => {
                        console.log('i am checking withdraw PAX...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(withdrawPAXtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        tmepState.toWithdrawNum = '';
                                        tmepState.couldWithdraw = false;
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
                                clearInterval(withdrawPAXtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
    // withdrawTUSD
    withdrawTUSD (addr, num) {
        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Withdraw TUSD') {
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
            title: 'Withdraw TUSD',
        }
        this.setState({tmepState});
        this.contractProtocol.withdraw.sendTransaction(
            addr,
            0,
            num,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Withdraw TUSD') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Withdraw TUSD') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var withdrawTUSDtimer = setInterval(() => {
                        console.log('i am checking withdraw TUSD...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(withdrawTUSDtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        tmepState.toWithdrawNum = '';
                                        tmepState.couldWithdraw = false;
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
                                clearInterval(withdrawTUSDtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
    // withdrawUSDC
    withdrawUSDC (addr, num) {
        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Withdraw USDC') {
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
            title: 'Withdraw USDC',
        }
        this.setState({tmepState});
        this.contractProtocol.withdraw.sendTransaction(
            addr,
            0,
            num,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Withdraw USDC') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Withdraw USDC') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var withdrawUSDCtimer = setInterval(() => {
                        console.log('i am checking withdraw USDC...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(withdrawUSDCtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        tmepState.toWithdrawNum = '';
                                        tmepState.couldWithdraw = false;
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
                                clearInterval(withdrawUSDCtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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

    // getUSDXForDeposit
    getUSDXForDeposit (tokenID, amount) {
        this.contractProtocol.getUSDXForDeposit.call(tokenID, amount, (err, ret)=>{
            console.log(err, ret);
            if (ret) {
                this.setState({
                    ...this.state,
                    maxGenerateUSDx: this.formatNumber(ret)
                })
            }
        })
    }
    // deposit number check
    depositNumChange (val) {
        if (val.length > 16) {
            return;
        }
        var address = this.addressDAI;

        if (this.state.toDeposit === 'DAI') {
            address = this.addressDAI;
            if (Number(val) > 0 && Number(val) <= Number(this.state.myDAI)) {
                this.setState({
                    ...this.state,
                    couldDeposit: true,
                    toDepositNum: val
                })
            } else {
                this.setState({
                    ...this.state,
                    couldDeposit: false,
                    toDepositNum: val
                })
            }
        }
        if (this.state.toDeposit === 'PAX') {
            address = this.addressPAX;
            if (Number(val) > 0 && Number(val) <= Number(this.state.myPAX)) {
                this.setState({
                    ...this.state,
                    couldDeposit: true,
                    toDepositNum: val
                })
            } else {
                this.setState({
                    ...this.state,
                    couldDeposit: false,
                    toDepositNum: val
                })
            }
        }
        if (this.state.toDeposit === 'TUSD') {
            address = this.addressTUSD;
            if (Number(val) > 0 && Number(val) <= Number(this.state.myTUSD)) {
                this.setState({
                    ...this.state,
                    couldDeposit: true,
                    toDepositNum: val
                })
            } else {
                this.setState({
                    ...this.state,
                    couldDeposit: false,
                    toDepositNum: val
                })
            }
        }
        if (this.state.toDeposit === 'USDC') {
            address = this.addressUSDC;
            if (Number(val) > 0 && Number(val) <= Number(this.state.myUSDC)) {
                this.setState({
                    ...this.state,
                    couldDeposit: true,
                    toDepositNum: val
                })
            } else {
                this.setState({
                    ...this.state,
                    couldDeposit: false,
                    toDepositNum: val
                })
            }
        }

        this.getUSDXForDeposit(address, val * this.units);

        // if (this.state.toDeposit === 'DAI') {
        //     if (Number(val) > 0 && Number(val) <= Number(this.state.myDAI)) {
        //         var num0 = (Number(this.state.DAIonPool) + Number(val)) / this.sectionDAI;
        //         var num1 = this.state.PAXonPool / this.sectionPAX;
        //         var num2 = this.state.TUSDonPool / this.sectionTUSD;
        //         var num3 = this.state.USDConPool / this.sectionUSDC;
        //         var numMin0 = Math.min(num0, num1, num2, num3);
        //         var maxGenerateDUSx0 = numMin0 >= 1 ? numMin0 * this.sectionDAI - this.state.DAIonPool : 0;
        //         this.setState({
        //             ...this.state,
        //             errTips: false,
        //             couldDeposit: true,
        //             toDepositNum: val,
        //             maxGenerateUSDx: maxGenerateDUSx0
        //         })
        //     } else {
        //         this.setState({
        //             ...this.state,
        //             errTips: true,
        //             couldDeposit: false,
        //             toDepositNum: val,
        //             maxGenerateUSDx: ''
        //         })
        //         if (val === '') {
        //             this.setState({
        //                 ...this.state,
        //                 errTips: false,
        //                 couldDeposit: false,
        //                 toDepositNum: val,
        //                 maxGenerateUSDx: ''
        //             })
        //         }
        //     }
        // }
        // if (this.state.toDeposit === 'PAX') {
        //     if (Number(val) > 0 && Number(val) <= Number(this.state.myPAX)) {
        //         var num01 = this.state.DAIonPool / this.sectionDAI;
        //         var num11 = (Number(this.state.PAXonPool) + Number(val)) / this.sectionPAX ;
        //         var num21 = this.state.TUSDonPool / this.sectionTUSD;
        //         var num31 = this.state.USDConPool / this.sectionUSDC;
        //         var numMin1 = Math.min(num01, num11, num21, num31);
        //         var maxGenerateDUSx1 = numMin1 >= 1 ? numMin1 * this.sectionPAX - this.state.PAXonPool : 0;
        //         this.setState({
        //             ...this.state,
        //             errTips: false,
        //             couldDeposit: true,
        //             toDepositNum: val,
        //             maxGenerateUSDx: maxGenerateDUSx1
        //         })
        //     } else {
        //         this.setState({
        //             ...this.state,
        //             errTips: true,
        //             couldDeposit: false,
        //             toDepositNum: val,
        //             maxGenerateUSDx: ''
        //         })
        //         if (val === '') {
        //             this.setState({
        //                 ...this.state,
        //                 errTips: false,
        //                 couldDeposit: false,
        //                 toDepositNum: val,
        //                 maxGenerateUSDx: ''
        //             })
        //         }
        //     }
        // }
        // if (this.state.toDeposit === 'TUSD') {
        //     if (Number(val) > 0 && Number(val) <= Number(this.state.myTUSD)) {
        //         var num02 = this.state.DAIonPool / this.sectionDAI;
        //         var num12 = this.state.PAXonPool / this.sectionPAX;
        //         var num22 = (Number(this.state.TUSDonPool) + Number(val)) / this.sectionTUSD;
        //         var num32 = this.state.USDConPool / this.sectionUSDC;
        //         var numMin2 = Math.min(num02, num12, num22, num32);
        //         var maxGenerateDUSx2 = numMin2 >= 1 ? numMin2 * this.sectionTUSD - this.state.TUSDonPool : 0;
        //         this.setState({
        //             ...this.state,
        //             errTips: false,
        //             couldDeposit: true,
        //             toDepositNum: val,
        //             maxGenerateUSDx: maxGenerateDUSx2
        //         })
        //     } else {
        //         this.setState({
        //             ...this.state,
        //             errTips: true,
        //             couldDeposit: false,
        //             toDepositNum: val,
        //             maxGenerateUSDx: ''
        //         })
        //         if (val === '') {
        //             this.setState({
        //                 ...this.state,
        //                 errTips: false,
        //                 couldDeposit: false,
        //                 toDepositNum: val,
        //                 maxGenerateUSDx: ''
        //             })
        //         }
        //     }
        // }
        // if (this.state.toDeposit === 'USDC') {
        //     if (Number(val) > 0 && Number(val) <= Number(this.state.myUSDC)) {
        //         var num03 = this.state.DAIonPool / this.sectionDAI;
        //         var num13 = this.state.PAXonPool / this.sectionPAX;
        //         var num23 = this.state.TUSDonPool / this.sectionTUSD;
        //         var num33 = (Number(this.state.USDConPool) + Number(val)) / this.sectionUSDC;
        //         var numMin3 = Math.min(num03, num13, num23, num33);
        //         var maxGenerateDUSx3 = numMin3 >= 1 ? numMin3 * this.sectionUSDC - this.state.USDConPool : 0;
        //         this.setState({
        //             ...this.state,
        //             errTips: false,
        //             couldDeposit: true,
        //             toDepositNum: val,
        //             maxGenerateUSDx: maxGenerateDUSx3
        //         })
        //     } else {
        //         this.setState({
        //             ...this.state,
        //             errTips: true,
        //             couldDeposit: false,
        //             toDepositNum: val,
        //             maxGenerateUSDx: ''
        //         })
        //         if (val === '') {
        //             this.setState({
        //                 ...this.state,
        //                 errTips: false,
        //                 couldDeposit: false,
        //                 toDepositNum: val,
        //                 maxGenerateUSDx: ''
        //             })
        //         }
        //     }
        // }
    }
    // deposit
    deposit () {
        if (!this.state.couldDeposit) {
            return;
        }

        var addr;
        var num = this.state.toDepositNum * this.units;
        if (this.state.toDeposit === 'DAI') {
            addr = this.addressDAI;
            this.depositDAI(addr, num);
        } else if (this.state.toDeposit === 'PAX') {
            addr = this.addressPAX;
            this.depositPAX(addr, num);
        } else if (this.state.toDeposit === 'TUSD') {
            addr = this.addressTUSD;
            this.depositTUSD(addr, num);
        } else if (this.state.toDeposit === 'USDC') {
            addr = this.addressUSDC;
            this.depositUSDC(addr, num);
        }
    }
    // deposit DAI
    depositDAI (addr, num) {
        if (!this.state.approvedDAI) {
            this.setState({
                ...this.state,
                fromDepositDAI: true
            });
            this.approve('DAI');
            return;
        }

        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Deposit DAI') {
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
            title: 'Deposit DAI',
        }
        this.setState({tmepState});
        this.contractProtocol.deposit.sendTransaction(
            addr,
            0,
            num,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Deposit DAI') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Deposit DAI') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var depositDAItimer = setInterval(() => {
                        console.log('i am checking deposit DAI...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(depositDAItimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        tmepState.toDepositNum = '';
                                        tmepState.couldDeposit = false;
                                        tmepState.maxGenerateUSDx = '';
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
                                clearInterval(depositDAItimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
    // deposit PAX
    depositPAX (addr, num) {
        if (!this.state.approvedPAX) {
            this.setState({
                ...this.state,
                fromDepositPAX: true
            });
            this.approve('PAX');
            return;
        }

        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Deposit PAX') {
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
            title: 'Deposit PAX',
        }
        this.setState({tmepState});
        this.contractProtocol.deposit.sendTransaction(
            addr,
            0,
            num,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Deposit PAX') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Deposit PAX') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var depositPAXtimer = setInterval(() => {
                        console.log('i am checking deposit PAX...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(depositPAXtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        tmepState.toDepositNum = '';
                                        tmepState.couldDeposit = false;
                                        tmepState.maxGenerateUSDx = '';
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
                                clearInterval(depositPAXtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
    // deposit TUSD
    depositTUSD (addr, num) {
        if (!this.state.approvedTUSD) {
            this.setState({
                ...this.state,
                fromDepositTUSD: true
            });
            this.approve('TUSD');
            return;
        }

        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Deposit TUSD') {
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
            title: 'Deposit TUSD',
        }
        this.setState({tmepState});
        this.contractProtocol.deposit.sendTransaction(
            addr,
            0,
            num,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Deposit TUSD') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Deposit TUSD') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var depositTUSDtimer = setInterval(() => {
                        console.log('i am checking deposit TUSD...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(depositTUSDtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        tmepState.toDepositNum = '';
                                        tmepState.couldDeposit = false;
                                        tmepState.maxGenerateUSDx = '';
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
                                clearInterval(depositTUSDtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
    // deposit USDC
    depositUSDC (addr, num) {
        if (!this.state.approvedUSDC) {
            this.setState({
                ...this.state,
                fromDepositUSDC: true
            });
            this.approve('USDC');
            return;
        }

        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Deposit USDC') {
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
            title: 'Deposit USDC',
        }
        this.setState({tmepState});
        this.contractProtocol.deposit.sendTransaction(
            addr,
            0,
            num,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Deposit USDC') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Deposit USDC') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var depositUSDCtimer = setInterval(() => {
                        console.log('i am checking deposit USDC...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(depositUSDCtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        tmepState.toDepositNum = '';
                                        tmepState.couldDeposit = false;
                                        tmepState.maxGenerateUSDx = '';
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
                                clearInterval(depositUSDCtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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


    // destroy number check
    destroyNumChange (val) {
        if (val.length > 16) {
            return;
        }
        if (Number(val) > 0 && Number(val) <= Number(this.state.myUSDx)) {
            var USDxToDAI = this.formatNumber(val * (this.state.sectionDAIBurning / this.state.tatolSectionBurning) * this.units);
            var USDxToPAX = this.formatNumber(val * (this.state.sectionPAXBurning / this.state.tatolSectionBurning) * this.units);
            var USDxToTUSD = this.formatNumber(val * (this.state.sectionTUSDBurning / this.state.tatolSectionBurning) * this.units);
            var USDxToUSDC = this.formatNumber(val * (this.state.sectionUSDCBurning / this.state.tatolSectionBurning) * this.units);

            this.setState({
                ...this.state,
                errTipsDestroy: false,
                couldDestroy: true,
                toDestroyNum: val,
                USDxToDAI: USDxToDAI,
                USDxToPAX: USDxToPAX,
                USDxToTUSD: USDxToTUSD,
                USDxToUSDC: USDxToUSDC
            })
        } else {
            this.setState({
                ...this.state,
                errTipsDestroy: true,
                couldDestroy: false,
                toDestroyNum: val,
                USDxToDAI: '',
                USDxToPAX: '',
                USDxToTUSD: '',
                USDxToUSDC: ''
            })
            if (val === '') {
                this.setState({
                    ...this.state,
                    errTipsDestroy: false,
                    couldDestroy: false,
                    toDestroyNum: val,
                    USDxToDAI: '',
                    USDxToPAX: '',
                    USDxToTUSD: '',
                    USDxToUSDC: ''
                })
            }
        }
    }
    // destroy
    destroy () {
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
            this.approve('USDX');
            return;
        }

        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'Destroy USDX') {
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
            title: 'Destroy USDX',
        }
        this.setState({tmepState});
        this.contractProtocol.destroy.sendTransaction(
            0,
            this.state.toDestroyNum * this.units,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Destroy USDX') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Destroy USDX') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var destroyUSDxtimer = setInterval(() => {
                        console.log('i am checking destroy USDX...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(destroyUSDxtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        tmepState.toDestroyNum = '';
                                        tmepState.couldDestroy = false;
                                        tmepState.USDxToDAI = tmepState.USDxToPAX = tmepState.USDxToTUSD = tmepState.USDxToUSDC = '';
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
                                clearInterval(destroyUSDxtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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

    // claim
    claim () {
        const keys = Object.keys(this.state.transcations);
        for (var i = 0; i < keys.length; i++) {
            if (this.state.transcations[keys[i]].title === 'CLAIM USDX') {
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
            title: 'CLAIM USDX',
        }
        this.setState({tmepState});
        this.contractProtocol.claim.sendTransaction(
            0,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'CLAIM USDX') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
                            }, 3000);
                        };
                        return false;
                    });
                }
                if (ret) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;

                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'CLAIM USDX') {
                            tmepState.transcations[key].txhash = ret;
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                msg: 'Waiting for confirmation...'
                            }
                            this.setState({tmepState});
                        };
                        return false;
                    });

                    var claimUSDxtimer = setInterval(() => {
                        console.log('i am checking claim USDX...');
                        this.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                            if (data && data.status === '0x1') {
                                clearInterval(claimUSDxtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'success',
                                            msg: 'Transaction success'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
                                clearInterval(claimUSDxtimer);
                                const keys = Object.keys(this.state.transcations);
                                const tmepState = this.state;
                                keys.map((key) => {
                                    if (tmepState.transcations[key].txhash === ret) {
                                        tmepState.transcations[key] = {
                                            ...tmepState.transcations[key],
                                            class: 'error',
                                            msg: 'Transaction failed'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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



    // faucet Token
    allocateTo (token) {
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

    // allocateToDAI
    allocateToDAI () {
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
        this.setState({tmepState});
        this.contractDAI.allocateTo.sendTransaction(
            this.state.accountAddress,
            500 * this.units,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Allocate DAI') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
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
                            this.setState({tmepState});
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
                                            msg: 'Transaction success'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
    // allocateToPAX
    allocateToPAX () {
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
        this.setState({tmepState});
        this.contractPAX.allocateTo.sendTransaction(
            this.state.accountAddress,
            500 * this.units,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Allocate PAX') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
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
                            this.setState({tmepState});
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
                                            msg: 'Transaction success'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
    // allocateToTUSD
    allocateToTUSD () {
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
        this.setState({tmepState});
        this.contractTUSD.allocateTo.sendTransaction(
            this.state.accountAddress,
            500 * this.units,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Allocate TUSD') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
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
                            this.setState({tmepState});
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
                                            msg: 'Transaction success'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
    // allocateToUSDC
    allocateToUSDC () {
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
        this.setState({tmepState});
        this.contractUSDC.allocateTo.sendTransaction(
            this.state.accountAddress,
            500 * this.units,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Allocate USDC') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
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
                            this.setState({tmepState});
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
                                            msg: 'Transaction success'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
    // allocateToDF
    allocateToDF () {
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
        this.setState({tmepState});
        this.contractDF.allocateTo.sendTransaction(
            this.state.accountAddress,
            500 * this.units,
            {
                from: this.state.accountAddress,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    const keys = Object.keys(this.state.transcations);
                    const tmepState = this.state;
                    keys.map((key) => {
                        if (tmepState.transcations[key].title === 'Allocate DF') {
                            tmepState.transcations[key] = {
                                ...tmepState.transcations[key],
                                class: 'error'
                            }
                            this.setState({tmepState});

                            setTimeout(() => {
                                delete tmepState.transcations[key];
                                this.setState({tmepState});
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
                            this.setState({tmepState});
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
                                            msg: 'Transaction success'
                                        }
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
                                        this.setState({tmepState});

                                        setTimeout(() => {
                                            delete tmepState.transcations[key];
                                            this.setState({tmepState});
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
}














