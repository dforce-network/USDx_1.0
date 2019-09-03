// Libraries
import React from "react";

// images
import withdraw from "../assets/img/history_withdraw.png";
import destroy from "../assets/img/history_destroy.png";
import claim from "../assets/img/history_claim.png";
import deposit from "../assets/img/history_deposit.png";
import mintage from "../assets/img/history_mintage.png";



export default class History extends React.Component {
    constructor() {
        super();
        this.timeZoom = new Date().getTimezoneOffset() * 60 * 1000;
    }

    // openOnnewTab
    openOnnewTab(val) {
        if (this.props.data.netType === 'Main') {
            window.open("https://etherscan.io/tx/" + val);
        } else {
            window.open("https://" + this.props.data.netType.toLowerCase() + ".etherscan.io/tx/" + val);
        }
    }

    // format number
    formatNumber(val, token) {
        var originStr = '';

        if (token === 'USDx') {
            originStr = (this.props.web3.toBigNumber(val).div(10 ** this.props.data.decimalsUSDx)).toString(10);
        } else if (token === 'DAI') {
            originStr = (this.props.web3.toBigNumber(val).div(10 ** this.props.data.decimalsDAI)).toString(10);
        } else if (token === 'PAX') {
            originStr = (this.props.web3.toBigNumber(val).div(10 ** this.props.data.decimalsPAX)).toString(10);
        } else if (token === 'TUSD') {
            originStr = (this.props.web3.toBigNumber(val).div(10 ** this.props.data.decimalsTUSD)).toString(10);
        } else if (token === 'USDC') {
            originStr = (this.props.web3.toBigNumber(val).div(10 ** this.props.data.decimalsUSDC)).toString(10);
        } else if (token === '') {
            // if (BNr.toFixed() < (10 ** 10) && BNr.toFixed() > 0) {
            //     return '0.00';
            // }
            // originStr = BNr.toString(10);
            originStr = (this.props.web3.toBigNumber(val).div(10 ** this.props.data.decimalsUSDx)).toString(10);
        }


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

    toThousands(str) {
        var num = str;
        var re = /\d{3}$/;
        var result = '';

        while ( re.test(num) ) {
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
            <div className="history">
                <div className="leftTitle">HISTORY</div>
                <ul>
                    {
                        this.props.data.myHistory.map(
                            (item, index) => {
                                if (window.ethereum.isImToken) {
                                    return false;
                                }


                                if (item.event === 'Deposit') {
                                    var token = '';
                                    if (item.args._tokenID === this.props.addressDAI) {
                                        token = 'DAI';
                                    }
                                    if (item.args._tokenID === this.props.addressPAX) {
                                        token = 'PAX';
                                    }
                                    if (item.args._tokenID === this.props.addressTUSD) {
                                        token = 'TUSD';
                                    }
                                    if (item.args._tokenID === this.props.addressUSDC) {
                                        token = 'USDC';
                                    }
                                    var temNum = this.formatNumber(item.args._amount, token);
                                    var temNum1 = this.formatNumber(item.args._balance, '');

                                    return <li key={index}>
                                        <img src={deposit} alt='' />
                                        <p className="time">
                                            <span className='span1'>{(new Date(item.timeStamp - this.timeZoom).toGMTString()).replace(/GMT/g, '')}</span>
                                            <span className='span2' onClick={() => { this.openOnnewTab(item.transactionHash) }}>
                                                <i>{item.transactionHash.substring(0, 6) + '...' + item.transactionHash.substring(item.transactionHash.length - 4)}</i>
                                            </span>
                                        </p>
                                        <p className="event">{item.event} {this.toThousands(temNum.split('.')[0]) + '.' + temNum.split('.')[1]} {token}, generate {this.toThousands(temNum1.split('.')[0]) + '.' + temNum1.split('.')[1]} USDx.</p>
                                    </li>
                                }


                                if (item.event === 'Destroy') {
                                    var temNum2 = this.formatNumber(item.args._amount, 'USDx');
                                    return <li key={index}>
                                        <img src={destroy} alt='' />
                                        <p className="time">
                                            <span className='span1'>{(new Date(item.timeStamp - this.timeZoom).toGMTString()).replace(/GMT/g, '')}</span>
                                            <span className='span2' onClick={() => { this.openOnnewTab(item.transactionHash) }}>
                                                <i>{item.transactionHash.substring(0, 6) + '...' + item.transactionHash.substring(item.transactionHash.length - 4)}</i>
                                            </span>
                                        </p>
                                        <p className="event">{item.event} {this.toThousands(temNum2.split('.')[0]) + '.' + temNum2.split('.')[1]} USDx.</p>
                                    </li>
                                }


                                if (item.event === 'Claim') {
                                    if (item.args._balance === '0') {
                                        return false;
                                    } else {
                                        var temNum3 = this.formatNumber(item.args._balance, 'USDx');
                                        return <li key={index}>
                                            <img src={claim} alt='' />
                                            <p className="time">
                                                <span className='span1'>{(new Date(item.timeStamp - this.timeZoom).toGMTString()).replace(/GMT/g, '')}</span>
                                                <span className='span2' onClick={() => { this.openOnnewTab(item.transactionHash) }}>
                                                    <i>{item.transactionHash.substring(0, 6) + '...' + item.transactionHash.substring(item.transactionHash.length - 4)}</i>
                                                </span>
                                            </p>
                                            <p className="event">{item.event} {this.toThousands(temNum3.split('.')[0]) + '.' + temNum3.split('.')[1]} USDx.</p>
                                        </li>
                                    }
                                }


                                if (item.event === 'Withdraw') {
                                    if (item.args._amount === '0') {
                                        return;
                                    }

                                    var token1 = '';
                                    if (item.args._tokenID === this.props.addressDAI) {
                                        token1 = 'DAI';
                                    }
                                    if (item.args._tokenID === this.props.addressPAX) {
                                        token1 = 'PAX';
                                    }
                                    if (item.args._tokenID === this.props.addressTUSD) {
                                        token1 = 'TUSD';
                                    }
                                    if (item.args._tokenID === this.props.addressUSDC) {
                                        token1 = 'USDC';
                                    }
                                    var temNum4 = this.formatNumber(item.args._amount, token1);
                                    return <li key={index}>
                                        <img src={withdraw} alt='' />
                                        <p className="time">
                                            <span className='span1'>{(new Date(item.timeStamp - this.timeZoom).toGMTString()).replace(/GMT/g, '')}</span>
                                            <span className='span2' onClick={() => { this.openOnnewTab(item.transactionHash) }}>
                                                <i>{item.transactionHash.substring(0, 6) + '...' + item.transactionHash.substring(item.transactionHash.length - 4)}</i></span> </p>
                                        <p className="event">{item.event} {this.toThousands(temNum4.split('.')[0]) + '.' + temNum4.split('.')[1]} {token1}.</p>
                                    </li>
                                }


                                if (item.event === 'OneClickMinting') {
                                    if (item.args._amount === '0') {
                                        return;
                                    }
                                    var temNum5 = this.formatNumber(item.args._amount, 'USDx');
                                    return <li key={index}>
                                        <img src={mintage} alt='' />
                                        <p className="time">
                                            <span className='span1'>{(new Date(item.timeStamp - this.timeZoom).toGMTString()).replace(/GMT/g, '')}</span>
                                            <span className='span2' onClick={() => { this.openOnnewTab(item.transactionHash) }}>
                                                <i>{item.transactionHash.substring(0, 6) + '...' + item.transactionHash.substring(item.transactionHash.length - 4)}</i></span> </p>
                                        <p className="event">Mint {this.toThousands(temNum5.split('.')[0]) + '.' + temNum5.split('.')[1]} USDx.</p>
                                    </li>
                                }
                            }
                        )
                    }
                </ul>

                <ul style={{ display: window.ethereum.isImToken ? 'block' : 'none' }}>
                    <li>history...</li>
                    {
                        this.props.data.myHistory.map(
                            (item, index) => {
                                if (item.event === 'Deposit') {
                                    return <li key={index}>
                                        <img src={deposit} alt='' />
                                        <p className="time">
                                            <span className='span1'>{(new Date(item.timeStamp - this.timeZoom).toGMTString()).replace(/GMT/g, '')}</span>
                                            <span className='span2' onClick={() => { this.openOnnewTab(item.transactionHash) }}>
                                                <i>{item.transactionHash.substring(0, 6) + '...' + item.transactionHash.substring(item.transactionHash.length - 4)}</i>
                                            </span>
                                        </p>
                                        <p className="event">{item.title}</p>
                                    </li>
                                }


                                if (item.event === 'Destroy') {
                                    return <li key={index}>
                                        <img src={destroy} alt='' />
                                        <p className="time">
                                            <span className='span1'>{(new Date(item.timeStamp - this.timeZoom).toGMTString()).replace(/GMT/g, '')}</span>
                                            <span className='span2' onClick={() => { this.openOnnewTab(item.transactionHash) }}>
                                                <i>{item.transactionHash.substring(0, 6) + '...' + item.transactionHash.substring(item.transactionHash.length - 4)}</i>
                                            </span>
                                        </p>
                                        <p className="event">{item.title}</p>
                                    </li>
                                }


                                if (item.event === 'Claim') {
                                    if (item.args._balance === '0') {
                                        return false;
                                    } else {
                                        return <li key={index}>
                                            <img src={claim} alt='' />
                                            <p className="time">
                                                <span className='span1'>{(new Date(item.timeStamp - this.timeZoom).toGMTString()).replace(/GMT/g, '')}</span>
                                                <span className='span2' onClick={() => { this.openOnnewTab(item.transactionHash) }}>
                                                    <i>{item.transactionHash.substring(0, 6) + '...' + item.transactionHash.substring(item.transactionHash.length - 4)}</i>
                                                </span>
                                            </p>
                                            <p className="event">{item.title}</p>
                                        </li>
                                    }
                                }


                                if (item.event === 'Withdraw') {
                                    if (item.args._amount === '0') {
                                        return;
                                    }
                                    return <li key={index}>
                                        <img src={withdraw} alt='' />
                                        <p className="time">
                                            <span className='span1'>{(new Date(item.timeStamp - this.timeZoom).toGMTString()).replace(/GMT/g, '')}</span>
                                            <span className='span2' onClick={() => { this.openOnnewTab(item.transactionHash) }}>
                                                <i>{item.transactionHash.substring(0, 6) + '...' + item.transactionHash.substring(item.transactionHash.length - 4)}</i>
                                            </span>
                                        </p>
                                        <p className="event">{item.title}</p>
                                    </li>
                                }


                                if (item.event === 'OneClickMinting') {
                                    if (item.args._amount === '0') {
                                        return;
                                    }
                                    return <li key={index}>
                                        <img src={mintage} alt='' />
                                        <p className="time">
                                            <span className='span1'>{(new Date(item.timeStamp - this.timeZoom).toGMTString()).replace(/GMT/g, '')}</span>
                                            <span className='span2' onClick={() => { this.openOnnewTab(item.transactionHash) }}>
                                                <i>{item.transactionHash.substring(0, 6) + '...' + item.transactionHash.substring(item.transactionHash.length - 4)}</i>
                                            </span>
                                        </p>
                                        <p className="event">{item.title}</p>
                                    </li>
                                }
                            }
                        )
                    }
                </ul>
            </div>
        )
    }
}


