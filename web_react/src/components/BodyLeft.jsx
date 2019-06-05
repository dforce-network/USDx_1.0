// Libraries
import React from "react";

import { Tooltip, Progress } from 'antd';

// images
import dai from '../assets/img/dai.png';
import pax from '../assets/img/pax.png';
import tusd from '../assets/img/tusd.png';
import usdc from '../assets/img/usdc.png';


export default class Header extends React.Component {
    render() {
        return (
            <div className="bodyleft">
                <div className="title">Constituents Pending Pool:</div>
                <div className="pool">
                    <div className="leftSection">
                        {this.props.data.sectionDAI ? (this.props.data.sectionDAI * 100 / this.props.data.tatolSection).toFixed() : '-'}%
                    </div>
                    <div className="left">
                        <img src={dai} alt="" />
                        <p className="token">DAI</p>
                    </div>
                    <div className="right">
                        <div className="section">
                            <Tooltip title={'Claimable USDx: ' + this.props.data.claimDAI + ' / Pending DAI: ' + this.props.data.DAIonPool}>
                                <Progress
                                    percent={100}
                                    successPercent={
                                        (this.props.data.claimDAI && this.props.data.claimDAI > 0) ?
                                            ((this.props.data.claimDAI / (Number(this.props.data.DAIonPool) + Number(this.props.data.claimDAI))).toFixed(2) * 100) < 5 ?
                                                '5'
                                                :
                                                Number(this.props.data.DAIonPool) === 0 ?
                                                    '100'
                                                    :
                                                    (this.props.data.claimDAI / (Number(this.props.data.DAIonPool) + Number(this.props.data.claimDAI))).toFixed(2) * 100 >= 95 ?
                                                        '95'
                                                        :
                                                        (this.props.data.claimDAI / (Number(this.props.data.DAIonPool) + Number(this.props.data.claimDAI))).toFixed(2) * 100    
                                            :
                                            '0'
                                    }
                                    showInfo={false}
                                />
                            </Tooltip>
                        </div>
                        <p className="sectionNum">
                            <span>{this.props.data.DAIonPool ? this.props.data.DAIonPool.split('.')[0] : '0'}</span>
                            <span className="sectionDot">{this.props.data.DAIonPool ? '.' + this.props.data.DAIonPool.split('.')[1] : '.00'}</span>
                        </p>
                    </div>
                    <div className="clear"></div>
                </div>
                <div className="pool poolColor2">
                    <div className="leftSection">
                        {this.props.data.sectionPAX ? (this.props.data.sectionPAX * 100 / this.props.data.tatolSection).toFixed() : '-'}%
                    </div>
                    <div className="left">
                        <img src={pax} alt="" />
                        <p className="token">PAX</p>
                    </div>
                    <div className="right">
                        <div className="section">
                            <Tooltip title={'Claimable USDx: ' + this.props.data.claimPAX + ' / Pending PAX: ' + this.props.data.PAXonPool}>
                                <Progress
                                    successPercent={
                                        (this.props.data.claimPAX && this.props.data.claimPAX > 0) ?
                                            ((this.props.data.claimPAX / (Number(this.props.data.PAXonPool) + Number(this.props.data.claimPAX))).toFixed(2) * 100) < 5 ?
                                                '5'
                                                :
                                                Number(this.props.data.PAXonPool) === 0 ?
                                                    '100'
                                                    :
                                                    (this.props.data.claimPAX / (Number(this.props.data.PAXonPool) + Number(this.props.data.claimPAX))).toFixed(2) * 100 >= 95 ?
                                                        '95'
                                                        :
                                                        (this.props.data.claimPAX / (Number(this.props.data.PAXonPool) + Number(this.props.data.claimPAX))).toFixed(2) * 100
                                            :
                                            '0'
                                    }
                                    percent={100}
                                    showInfo={false}
                                />
                            </Tooltip>
                        </div>
                        <p className="sectionNum">
                            <span>{this.props.data.PAXonPool ? this.props.data.PAXonPool.split('.')[0] : '0'}</span>
                            <span className="sectionDot">{this.props.data.PAXonPool ? '.' + this.props.data.PAXonPool.split('.')[1] : '.00'}</span>
                        </p>
                    </div>
                    <div className="clear"></div>
                </div>
                <div className="pool poolColor4">
                    <div className="leftSection">
                        {this.props.data.sectionTUSD ? (this.props.data.sectionTUSD * 100 / this.props.data.tatolSection).toFixed() : '-'}%
                    </div>
                    <div className="left">
                        <img src={tusd} alt="" />
                        <p className="token">TUSD</p>
                    </div>
                    <div className="right">
                        <div className="section">
                            <Tooltip title={'Claimable USDx: ' + this.props.data.claimTUSD + ' / Pending TUSD: ' + this.props.data.TUSDonPool}>
                                <Progress
                                    successPercent={
                                        (this.props.data.claimTUSD && this.props.data.claimTUSD > 0) ?
                                            ((this.props.data.claimTUSD / (Number(this.props.data.TUSDonPool) + Number(this.props.data.claimTUSD))).toFixed(2) * 100) < 5 ?
                                                '5'
                                                :
                                                Number(this.props.data.TUSDonPool) === 0 ?
                                                    '100'
                                                    :
                                                    (this.props.data.claimTUSD / (Number(this.props.data.TUSDonPool) + Number(this.props.data.claimTUSD))).toFixed(2) * 100 >= 95 ?
                                                        '95'
                                                        :
                                                        (this.props.data.claimTUSD / (Number(this.props.data.TUSDonPool) + Number(this.props.data.claimTUSD))).toFixed(2) * 100
                                            :
                                            '0'
                                    }
                                    percent={100}
                                    showInfo={false}
                                />
                            </Tooltip>
                        </div>
                        <p className="sectionNum">
                            <span>{this.props.data.TUSDonPool ? this.props.data.TUSDonPool.split('.')[0] : '0'}</span>
                            <span className="sectionDot">{this.props.data.TUSDonPool ? '.' + this.props.data.TUSDonPool.split('.')[1] : '.00'}</span>
                        </p>
                    </div>
                    <div className="clear"></div>
                </div>
                <div className="pool poolColor3">
                    <div className="leftSection">
                        {this.props.data.sectionUSDC ? (this.props.data.sectionUSDC * 100 / this.props.data.tatolSection).toFixed() : '-'}%
                    </div>
                    <div className="left">
                        <img src={usdc} alt="" />
                        <p className="token">USDC</p>
                    </div>
                    <div className="right">
                        <div className="section">
                            <Tooltip title={'Claimable USDx: ' + this.props.data.claimUSDC + ' / Pending USDC: ' + this.props.data.USDConPool}>
                                <Progress
                                    percent={100}
                                    showInfo={false}
                                    successPercent={
                                        (this.props.data.claimUSDC && this.props.data.claimUSDC > 0) ?
                                            ((this.props.data.claimUSDC / (Number(this.props.data.USDConPool) + Number(this.props.data.claimUSDC))).toFixed(2) * 100) < 5 ?
                                                '5'
                                                :
                                                Number(this.props.data.USDConPool) === 0 ?
                                                    '100'
                                                    :
                                                    (this.props.data.claimUSDC / (Number(this.props.data.USDConPool) + Number(this.props.data.claimUSDC))).toFixed(2) * 100 >= 95 ?
                                                        '95'
                                                        :
                                                        (this.props.data.claimUSDC / (Number(this.props.data.USDConPool) + Number(this.props.data.claimUSDC))).toFixed(2) * 100
                                            :
                                            '0'
                                    }
                                />
                            </Tooltip>
                        </div>
                        <p className="sectionNum">
                            <span>{this.props.data.USDConPool ? this.props.data.USDConPool.split('.')[0] : '0'}</span>
                            <span className="sectionDot">{this.props.data.USDConPool ? '.' + this.props.data.USDConPool.split('.')[1] : '.00'}</span>
                        </p>
                    </div>
                    <div className="clear"></div>
                </div>

                <div className="totalUSDx">
                    <div className="title">Total USDx Outstanding:</div>
                    <div className="usdxNum">
                        <span>{this.props.data.totalSupplyUSDx ? this.props.data.totalSupplyUSDx.split('.')[0] : '0'}</span>
                        <span className="sectionDot">{this.props.data.totalSupplyUSDx ? '.' + this.props.data.totalSupplyUSDx.split('.')[1] : '.00'}</span>
                    </div>
                </div>

                <div className="globalpool">
                    <div className="title">Global Collateral Pool:</div>
                    <div className="sectionToken">
                        <span className="token">DAI</span>
                        <span className="tokenNum">
                            {this.props.data.DAIonBank ? this.props.data.DAIonBank.split('.')[0] : '0'}
                            <i>{this.props.data.DAIonBank ? '.' + this.props.data.DAIonBank.split('.')[1] : '.00'}</i>
                        </span>
                    </div>
                    <div className="sectionToken">
                        <span className="token">PAX</span>
                        <span className="tokenNum">
                            {this.props.data.PAXonBank ? this.props.data.PAXonBank.split('.')[0] : '0'}
                            <i>{this.props.data.PAXonBank ? '.' + this.props.data.PAXonBank.split('.')[1] : '.00'}</i>
                        </span>
                    </div>
                    <div className="sectionToken">
                        <span className="token">TUSD</span>
                        <span className="tokenNum">
                            {this.props.data.TUSDonBank ? this.props.data.TUSDonBank.split('.')[0] : '0'}
                            <i>{this.props.data.TUSDonBank ? '.' + this.props.data.TUSDonBank.split('.')[1] : '.00'}</i>
                        </span>
                    </div>
                    <div className="sectionToken">
                        <span className="token">USDC</span>
                        <span className="tokenNum">
                            {this.props.data.USDConBank ? this.props.data.USDConBank.split('.')[0] : '0'}
                            <i>{this.props.data.USDConBank ? '.' + this.props.data.USDConBank.split('.')[1] : '.00'}</i>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}



