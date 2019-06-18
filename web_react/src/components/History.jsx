// Libraries
import React from "react";

// images
import withdraw from "../assets/img/withdraw.png";
import destroy from "../assets/img/destroy.png";
import claim from "../assets/img/claim.png";
import deposit from "../assets/img/deposit.png";



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
        // if (val.toFixed() < (10 ** 15) && val.toFixed() > 0) {
        //     return '0.00';
        // }

        // let originStr = (val / (10 ** 10) / (10 ** 8)).toString();

        // if (originStr.indexOf('.') > 0) {
        //     originStr = originStr.substr(0, originStr.indexOf('.') + 3);
        //     if (originStr.length >= 12) {
        //         return originStr = originStr.substr(0, 11);
        //     } else {
        //         return originStr;
        //     }
        // } else {
        //     return originStr + '.00';
        // }
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

    render() {
        return (
            <div className="history">
                <div className="leftTitle">HISTORY</div>
                <ul>
                    {
                        this.props.data.myHistory.map(
                            (item, index) => {
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
                                        <p className="event">{item.event} {temNum} {token}, generate {temNum1} USDx.</p>
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
                                        <p className="event">{item.event} {temNum2} USDx.</p>
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
                                            <p className="event">{item.event} {temNum3} USDx.</p>
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
                                        <p className="event">{item.event} {temNum4} {token1}.</p>
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


