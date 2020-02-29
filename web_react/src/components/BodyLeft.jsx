// Libraries
import React from "react";
import { Tooltip, Progress, Button } from 'antd';

// images
import dai from '../assets/img/dai.png';
import pax from '../assets/img/pax.png';
import tusd from '../assets/img/tusd.png';
import usdc from '../assets/img/usdc.png';


export default class bodyleft extends React.Component {

    state = { visible: false, placement: 'left' };

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    onChange = e => {
        this.setState({
            placement: e.target.value,
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

    render() {
        return (
            <div className="bodyleft bodyleftOrigin">
                {/* <Button type="primary" onClick={this.showDrawer}>
                    Open
                </Button>
                <Drawer
                    placement={this.state.placement}
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Drawer> */}


                <div className="title">
                    <Tooltip placement="bottomLeft" title='Outstanding constituents pending for conversion due to inventory shortage and allocated USDx to be claimed by contributors of each constituent.'>
                        <Button></Button>
                    </Tooltip>
                    Constituents Pending Pool:
                </div>
                {/* <div className="pool">
                    <div className="leftSection">
                        {this.props.data.sectionDAI ? (this.props.data.sectionDAI * 100 / this.props.data.tatolSection).toFixed() : '-'}%
                    </div>
                    <div className="left">
                        <img src={dai} alt="" />
                        <p className="token">DAI</p>
                    </div>
                    <div className="right">
                        <div className="section">
                            <Tooltip title={'Claimable USDx: ' + this.toThousandsbodyleft(this.props.data.claimDAI.split('.')[0]) + '.' + this.props.data.claimDAI.split('.')[1] + ' / Pending DAI: ' + this.toThousandsbodyleft(this.props.data.DAIonPool.split('.')[0]) + '.' + this.props.data.DAIonPool.split('.')[1]}>
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
                            <span>{this.props.data.DAIonPool ? this.toThousandsbodyleft(this.props.data.DAIonPool.split('.')[0]) : '0'}</span>
                            <span className="sectionDot">{this.props.data.DAIonPool ? '.' + this.props.data.DAIonPool.split('.')[1] : '.00'}</span>
                        </p>
                    </div>
                    <div className="clear"></div>
                </div> */}
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
                            <Tooltip title={'Claimable USDx: ' + this.toThousandsbodyleft(this.props.data.claimPAX.split('.')[0]) + '.' + this.props.data.claimPAX.split('.')[1] + ' / Pending PAX: ' + this.toThousandsbodyleft(this.props.data.PAXonPool.split('.')[0]) + '.' + this.props.data.PAXonPool.split('.')[1]}>
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
                            <span>{this.props.data.PAXonPool ? this.toThousandsbodyleft(this.props.data.PAXonPool.split('.')[0]) : '0'}</span>
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
                            <Tooltip title={'Claimable USDx: ' + this.toThousandsbodyleft(this.props.data.claimTUSD.split('.')[0]) + '.' + this.props.data.claimTUSD.split('.')[1] + ' / Pending TUSD: ' + this.toThousandsbodyleft(this.props.data.TUSDonPool.split('.')[0]) + '.' + this.props.data.TUSDonPool.split('.')[1]}>
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
                            <span>{this.props.data.TUSDonPool ? this.toThousandsbodyleft(this.props.data.TUSDonPool.split('.')[0]) : '0'}</span>
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
                            <Tooltip title={'Claimable USDx: ' + this.toThousandsbodyleft(this.props.data.claimUSDC.split('.')[0]) + '.' + this.props.data.claimUSDC.split('.')[1] + ' / Pending USDC: ' + this.toThousandsbodyleft(this.props.data.USDConPool.split('.')[0]) + '.' + this.props.data.USDConPool.split('.')[1]}>
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
                            <span>{this.props.data.USDConPool ? this.toThousandsbodyleft(this.props.data.USDConPool.split('.')[0]) : '0'}</span>
                            <span className="sectionDot">{this.props.data.USDConPool ? '.' + this.props.data.USDConPool.split('.')[1] : '.00'}</span>
                        </p>
                    </div>
                    <div className="clear"></div>
                </div>

                <div className="totalUSDx">
                    <div className="title">
                        <Tooltip placement="bottomLeft" title='Total USDx minted (always identical to the sum total of collaterals)'>
                            <Button></Button>
                        </Tooltip>
                        Total USDx Outstanding:
                    </div>
                    <div className="usdxNum">
                        <span>{this.props.data.totalSupplyUSDx ? this.toThousandsbodyleft(this.props.data.totalSupplyUSDx.split('.')[0]) : '0'}</span>
                        <span className="sectionDot">{this.props.data.totalSupplyUSDx ? '.' + this.props.data.totalSupplyUSDx.split('.')[1] : '.00'}</span>
                    </div>
                </div>

                <div className="globalpool">
                    <div className="title">
                        <Tooltip placement="bottomLeft" title='Constituents locked as collaterals (the sum total is always idential to the amount of outstanding USDx)'>
                            <Button></Button>
                        </Tooltip>
                        Global Collateral Pool:
                    </div>
                    <div className="sectionToken">
                        <span className="token">PAX</span>
                        <span className="tokenNum">
                            {this.props.data.PAXonBank ? this.toThousandsbodyleft(this.props.data.PAXonBank.split('.')[0]) : '0'}
                            <i>{this.props.data.PAXonBank ? '.' + this.props.data.PAXonBank.split('.')[1] : '.00'}</i>
                        </span>
                    </div>

                    <div className="sectionToken">
                        <span className="token">TUSD</span>
                        <span className="tokenNum">
                            {this.props.data.TUSDonBank ? this.toThousandsbodyleft(this.props.data.TUSDonBank.split('.')[0]) : '0'}
                            <i>{this.props.data.TUSDonBank ? '.' + this.props.data.TUSDonBank.split('.')[1] : '.00'}</i>
                        </span>
                    </div>

                    <div className="sectionToken">
                        <span className="token">USDC</span>
                        <span className="tokenNum">
                            {this.props.data.USDConBank ? this.toThousandsbodyleft(this.props.data.USDConBank.split('.')[0]) : '0'}
                            <i>{this.props.data.USDConBank ? '.' + this.props.data.USDConBank.split('.')[1] : '.00'}</i>
                        </span>
                    </div>
                </div>


                <div className="globalpool">
                    <div className="title">
                        <Tooltip
                            placement="bottomLeft"
                            title='Collaterals reserved as deploying DIP001.'
                        >
                            <Button></Button>
                        </Tooltip>
                        Pool Reserve:
                    </div>
                    <div className="sectionToken">
                        <span className="token">PAX</span>
                        <span className="tokenNum">
                            {this.props.data.PAX_Reserve ? this.toThousandsbodyleft(this.props.data.PAX_Reserve.split('.')[0]) : '0'}
                            <i>{this.props.data.PAX_Reserve ? '.' + this.props.data.PAX_Reserve.split('.')[1] : '.00'}</i>
                        </span>
                    </div>
                    <div className="sectionToken">
                        <span className="token" style={{ fontSize: '14px', width: '135px', lineHeight: '30px', fontSize: '80%', opacity: 0.7 }}>Target Reserve Range</span>
                        <span className="tokenNum" style={{ fontSize: '16px', fontWeight: 400, float: 'right', marginRight: '5px' }}>
                            <i style={{ fontStyle: 'normal', fontSize: '80%', opacity: 0.7, fontWeight: 200 }}>
                                {this.props.data.PAX_Reserve_lower ? this.props.data.PAX_Reserve_lower / 10 + '%' : '0%'}
                                ~
                                {this.props.data.PAX_Reserve_upper ? this.props.data.PAX_Reserve_upper / 10 + '%' : '0%'}
                            </i>
                        </span>
                    </div>
                    <div className="sectionToken" style={{ marginBottom: '10px' }}>
                        <span className="token" style={{ fontSize: '14px', width: '135px', lineHeight: '30px', fontSize: '80%', opacity: 0.7 }}>Current Reserve Ratio</span>
                        <span className="tokenNum" style={{ fontSize: '16px', fontWeight: 400, float: 'right', marginRight: '5px' }}>
                            <i style={{ fontStyle: 'normal', fontSize: '80%', opacity: 0.7, fontWeight: 200 }}>
                                {this.props.data.PAX_Reserve_ratio ? this.props.data.PAX_Reserve_ratio / 10 + '%' : '0%'}
                            </i>
                        </span>
                    </div>


                    <div className="sectionToken">
                        <span className="token">TUSD</span>
                        <span className="tokenNum">
                            {this.props.data.TUSD_Reserve ? this.toThousandsbodyleft(this.props.data.TUSD_Reserve.split('.')[0]) : '0'}
                            <i>{this.props.data.TUSD_Reserve ? '.' + this.props.data.TUSD_Reserve.split('.')[1] : '.00'}</i>
                        </span>
                    </div>
                    <div className="sectionToken">
                        <span className="token" style={{ fontSize: '14px', width: '135px', lineHeight: '30px', fontSize: '80%', opacity: 0.7 }}>Target Reserve Range</span>
                        <span className="tokenNum" style={{ fontSize: '16px', fontWeight: 400, float: 'right', marginRight: '5px' }}>
                            <i style={{ fontStyle: 'normal', fontSize: '80%', opacity: 0.7, fontWeight: 200 }}>
                                {this.props.data.TUSD_Reserve_lower ? this.props.data.TUSD_Reserve_lower / 10 + '%' : '0%'}
                                ~
                                {this.props.data.TUSD_Reserve_upper ? this.props.data.TUSD_Reserve_upper / 10 + '%' : '0%'}
                            </i>
                        </span>
                    </div>
                    <div className="sectionToken" style={{ marginBottom: '10px' }}>
                        <span className="token" style={{ fontSize: '14px', width: '135px', lineHeight: '30px', fontSize: '80%', opacity: 0.7 }}>Current Reserve Ratio</span>
                        <span className="tokenNum" style={{ fontSize: '16px', fontWeight: 400, float: 'right', marginRight: '5px' }}>
                            <i style={{ fontStyle: 'normal', fontSize: '80%', opacity: 0.7, fontWeight: 200 }}>
                                {this.props.data.TUSD_Reserve_ratio ? this.props.data.TUSD_Reserve_ratio / 10 + '%' : '0%'}
                            </i>
                        </span>
                    </div>


                    <div className="sectionToken">
                        <span className="token">USDC</span>
                        <span className="tokenNum">
                            {this.props.data.USDC_Reserve ? this.toThousandsbodyleft(this.props.data.USDC_Reserve.split('.')[0]) : '0'}
                            <i>{this.props.data.USDC_Reserve ? '.' + this.props.data.USDC_Reserve.split('.')[1] : '.00'}</i>
                        </span>
                    </div>
                    <div className="sectionToken">
                        <span className="token" style={{ fontSize: '14px', width: '135px', lineHeight: '30px', fontSize: '80%', opacity: 0.7 }}>Target Reserve Range</span>
                        <span className="tokenNum" style={{ fontSize: '16px', fontWeight: 400, float: 'right', marginRight: '5px' }}>
                            <i style={{ fontStyle: 'normal', fontSize: '80%', opacity: 0.7, fontWeight: 200 }}>
                                {this.props.data.USDC_Reserve_lower ? this.props.data.USDC_Reserve_lower / 10 + '%' : '0%'}
                                ~
                                {this.props.data.USDC_Reserve_upper ? this.props.data.USDC_Reserve_upper / 10 + '%' : '0%'}
                            </i>
                        </span>
                    </div>
                    <div className="sectionToken">
                        <span className="token" style={{ fontSize: '14px', width: '135px', lineHeight: '30px', fontSize: '80%', opacity: 0.7 }}>Current Reserve Ratio</span>
                        <span className="tokenNum" style={{ fontSize: '16px', fontWeight: 400, float: 'right', marginRight: '5px' }}>
                            <i style={{ fontStyle: 'normal', fontSize: '80%', opacity: 0.7, fontWeight: 200 }}>
                                {this.props.data.USDC_Reserve_ratio ? this.props.data.USDC_Reserve_ratio / 10 + '%' : '0%'}
                            </i>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}



