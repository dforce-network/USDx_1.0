import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ChangeDetectorRef } from '@angular/core';

import { ObjTxHashType } from '../../services/types.service';

import { StorageService } from '../services/storage.service';

import { trigger, state, style, animate, transition } from '@angular/animations';

declare const web3: any;

// abi
import { abiProxy } from './abiProxy';
import { abiBank } from './abiBank';
import { abiDFN } from './abiDFN';
import { abiDAI } from './abiDAI';
import { abiPAX } from './abiPAX';
import { abiTUSD } from './abiTUSD';
import { abiPool } from './abiPool';
import { abiData } from './abiData';
import { abiUSDx } from './abiUSDx';
import { abiUSDC } from './abiUSDC';

@Component({
    selector: 'mpr-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [
        trigger('EnterLeave', [
            state('flyIn', style({ transform: 'translateX(0)' })),
            transition(':enter', [style({ transform: 'translateX(100%)' }), animate('0.5s ease-in')]),
            transition(':leave', [animate('0.5s ease-out', style({ transform: 'translateX(100%)' }))])
        ]),
        trigger('fadeIn', [
            state(
                'void',
                style({
                    opacity: 0
                })
            ),
            transition('void <=> *', animate(300))
        ])
    ]
})

export class HomeComponent implements OnInit {
    // abi
    arrDAI = abiDAI;
    arrPAX = abiPAX;
    arrTUSD = abiTUSD;
    arrUSDC = abiUSDC;
    arrDUSD = abiUSDx;
    arrData = abiData;
    arrPool = abiPool;
    arrProxy = abiProxy;
    arrBank = abiBank;
    arrDF = abiDFN;
    // address
    addressDAI = '0x235b370de0b0cd3fb9e987e4957a9db0f1c3dd5a';
    addressPAX = '0x9aa0fa0a4e2634fbbf1b716fcabf8650a8fa330f';
    addressTUSD = '0xebb02dbf58104b93af2a89ae55ef2d7a7be36247';
    addressUSDC = '0x676ce98a3bc9c191903262f887bb312ce20f851f';
    addressDFN = '0xfaacf3d2a2ce1102073038e035d24c1c78b6e9c4';
    addressUSDx = '0x17996ea27d03d68ddc618f9b8f0faf43838acaf6';
    addressProxy = '0x458C21b2F0eEef8Cf97D4a3A36DB89d5343010CE';
    addressBank = '0x28BBEFdE119D3d092FbBD1fb554253F7D3A40149';
    addressConvert = '0xDfBa945139272d484e33DD241A01Dc3Fc739A5f9';
    addressPool = '0xFA82A7522B01A0fAFb1c9cBB651A5d6a8d8963Fc';
    // addressFees = '0xE064d694c6043aE9154287aC96AD1212A70d619E';
    addressData = '0x901069049Ffc67F053c3B77597218FdBEfa3Bb2C';
    // contract
    contractDAI: any;
    contractPAX: any;
    contractTUSD: any;
    contractUSDC: any;
    contractUSDx: any;
    contractDFN: any;
    contractProxy: any;
    contractBank: any;
    contractData: any;
    contractPool: any;

    web3Local: any;
    unitlength = 1000000000000000000;
    unitMax = 0xffffffffffffffffffffffffffffffffffffffffffffffff;
    netType = 'Main Ethereum Network';
    netTypeCode = '1';

    // my balance
    myBalance = {
        myETH: 0.0,
        myDAI: 0.0,
        myPAX: 0.0,
        myTUSD: 0.0,
        myUSDC: 0.0,
        myDUSD: 0.0,
        myDF: 0.0,
        totalSupplyNum: 0.0,

        myETHstr: '0.0000',
        myDAIstr: '0.0000',
        myPAXstr: '0.0000',
        myTUSDstr: '0.0000',
        myUSDCstr: '0.0000',
        myDUSDstr: '0.0000',
        myDFstr: '0.0000',
        totalSupplyNumstr: '0.0000',

        digestedDAI: '0.0000',
        digestedPAX: '0.0000',
        digestedTUSD: '0.0000',
        digestedUSDC: '0.0000',

        totalDAI: 0.0,
        totalPAX: 0.0,
        totalTUSD: 0.0,
        totalUSDC: 0.0,
        totalDAIstr: '0.0000',
        totalPAXstr: '0.0000',
        totalTUSDstr: '0.0000',
        totalUSDCstr: '0.0000',

        myDAIonDUSD: 0.0,
        myPAXonDUSD: 0.0,
        myTUSDonDUSD: 0.0,
        myUSDConDUSD: 0.0,
        myDFonDUSD: 0.0,
        myDAIonDUSDstr: '0.0000',
        myPAXonDUSDstr: '0.0000',
        myTUSDonDUSDstr: '0.0000',
        myUSDConDUSDstr: '0.0000',
        myDFonDUSDstr: '0.0000'
    };

    checkLockStatus = {
        DAIislock: false,
        PAXislock: false,
        TUSDislock: false,
        USDCislock: false,
        DFislock: false,
        USDxislock: false
    };

    events: any;

    DUSDwannaBackExpected = false;
    destroyBtnCouldActive = false;
    generateExpectedYourBalance = false;
    generateBtnCouldActive = false;
    withdrawExpectedYourBalance = false;
    withdrawBtnCouldActive = false;
    feeDFDespositActive = false;

    showRightInfo = false;
    walletAccount: string;
    walletFullAccount: string;

    destroyNum: number;

    withdrawInputNum: number;
    generateInputNum: number;
    feeDFInputNum: number;
    KTTK99numToDUSD: number;

    destroyNumtoDAI = '0.0000';
    destroyNumtoPAX = '0.0000';
    destroyNumtoTUSD = '0.0000';
    destroyNumtoUSDC = '0.0000';
    intStrNum: string;
    dotStrNum: string;

    msg: string;
    msgTitle: string;
    showTips = false;
    TipsType = 'inprogress';

    SelectedStrAddress = this.addressDAI;
    SelectedStrAddress1 = this.addressDAI;
    tempStr = 'DAI';
    tempStr1 = 'DAI';

    waitGenerate: boolean;
    waitDepositDF: boolean;
    waitDestroy: boolean;
    toBurn: boolean;
    toBurn1: boolean;

    maxGenerateDUSD: number;
    nowWithdrawStr = 'DAI';

    destroyFeeNum: number;
    destroyFeeNumStr = '0.0000';

    timer: any;

    txHashArr: ObjTxHashType[];
    showSideBar: boolean;
    showHisttory: boolean;

    willSendTokenStr: string;
    willSendNum: number;
    willSendToAddress: string;
    willSendBtnCouldClick = false;
    willSendNumErr = false;
    rightAddress: boolean;

    history = [];
    DUSDhistory = [];
    Withdrawhistory = [];
    defaultShowNumLeft = 5;
    defaultShowNumRight = 5;

    sectionDAI: number;
    sectionPAX: number;
    sectionUSDC: number;
    sectionTUSD: number;
    tatolSection = 0;

    constructor(private _clipboardService: ClipboardService, public ref: ChangeDetectorRef, public storage: StorageService) {
        if (web3) {
            this.web3Local = web3;
        }
    }

    ngOnInit() {
        this.txHashArr = [];

        this.contractDAI = this.web3Local.eth.contract(this.arrDAI).at(this.addressDAI);
        this.contractPAX = this.web3Local.eth.contract(this.arrPAX).at(this.addressPAX);
        this.contractTUSD = this.web3Local.eth.contract(this.arrTUSD).at(this.addressTUSD);
        this.contractUSDC = this.web3Local.eth.contract(this.arrUSDC).at(this.addressUSDC);
        this.contractUSDx = this.web3Local.eth.contract(this.arrDUSD).at(this.addressUSDx);
        this.contractDFN = this.web3Local.eth.contract(this.arrDF).at(this.addressDFN);
        this.contractProxy = this.web3Local.eth.contract(this.arrProxy).at(this.addressProxy);
        this.contractBank = this.web3Local.eth.contract(this.arrBank).at(this.addressBank);
        this.contractData = this.web3Local.eth.contract(this.arrData).at(this.addressData);
        this.contractPool = this.web3Local.eth.contract(this.arrPool).at(this.addressPool);

        this.web3Local.version.getNetwork((err, ret) => {
            if (ret === '1') {
                this.netType = 'Main Ethereum Network';
                this.netTypeCode = '1';
            } else if (ret === '3') {
                this.netType = 'Ropsten Test Network';
                this.netTypeCode = '3';
            } else if (ret === '42') {
                this.netType = 'Kovan Test Network';
                this.netTypeCode = '42';
            } else if (ret === '4') {
                this.netType = 'Rinkeby Test Network';
                this.netTypeCode = '4';
            } else {
                this.netType = 'Unknown Test Network';
                this.netTypeCode = 'Unknown';
            }
        });

        // get the Token section
        this.contractData.mintSectionPosition.call((err, ret) => {
            // console.log(err, ret.toFixed());
            if (ret) {
                this.contractData.sectionToken.call(ret.toFixed(), (e, r) => {
                    // console.log(e, r); r: [addr, addr, addr, addr]
                    if (r) {
                        for (let i = 0; i < r.length; i++) {
                            this.contractData.collateralWeight.call(ret.toFixed(), r[i], (error, result) => {
                                // console.log(r[i], ':', result.toFixed() / (10 ** 18));
                                if (r[i] === this.addressDAI) {
                                    this.sectionDAI = result.toFixed() / (10 ** 18);
                                    this.tatolSection = this.tatolSection + this.sectionDAI;
                                    // console.log(this.tatolSection);
                                }
                                if (r[i] === this.addressPAX) {
                                    this.sectionPAX = result.toFixed() / (10 ** 18);
                                    this.tatolSection = this.tatolSection + this.sectionPAX;
                                    // console.log(this.tatolSection);
                                }
                                if (r[i] === this.addressUSDC) {
                                    this.sectionUSDC = result.toFixed() / (10 ** 18);
                                    this.tatolSection = this.tatolSection + this.sectionUSDC;
                                    // console.log(this.tatolSection);
                                }
                                if (r[i] === this.addressTUSD) {
                                    this.sectionTUSD = result.toFixed() / (10 ** 18);
                                    this.tatolSection = this.tatolSection + this.sectionTUSD;
                                    // console.log(this.tatolSection);
                                }
                            });
                        }
                    }
                });
            }
        });

        // USDx events
        this.events = this.contractUSDx.allEvents({ toBlock: 'latest' });
        this.events.watch((error, result) => {
            console.log('DUSD events ---', error, result);

            if (this.history && this.history.length > 0) {
                for (let i = 0; i < this.history.length; i++) {
                    if (result.transactionHash === this.history[i].transactionHash && result.event === this.history[i].event) {
                        return false;
                    }
                }
            }
            const nowTime = this.getNowTime();
            // events about my account (Withdraw Deposit)
            if (result.args.user === this.walletFullAccount) {
                this.history.unshift({
                    transactionHash: result.transactionHash,
                    amount: result.args.amount.div(10 ** 18),
                    event: result.event,
                    token: result.args.token,
                    timestamp: nowTime
                });
                // console.log(JSON.stringify(this.history));
                this.storage.setItem('history', JSON.stringify(this.history));
            }

            // events about my account (Transfer)
            if (result.args.to === this.walletFullAccount) {
                this.history.unshift({
                    transactionHash: result.transactionHash,
                    amount: result.args.tokens.div(10 ** 18),
                    event: result.event,
                    token: 'DUSD',
                    timestamp: nowTime
                });
                // console.log(JSON.stringify(this.history));
                this.storage.setItem('history', JSON.stringify(this.history));
            }

            this.refreshAllStatus(); // refresh all
        });

        // timer get status
        this.timer = setInterval(() => {
            if (this.txHashArr.length === 0) {
                return console.log('000000000');
            } else {
                for (let i = 0; i < this.txHashArr.length; i++) {
                    if (!this.txHashArr[i].showTips && this.txHashArr[i].transactionHash.length !== 66) {
                        this.txHashArr.splice(i, 1);
                    }
                }
                console.log('11111111111');
                for (let i = 0; i < this.txHashArr.length; i++) {
                    this.web3Local.eth.getTransactionReceipt(this.txHashArr[i].transactionHash, (err, data) => {
                        if (err) {
                            return console.log('no such transaction');
                        }
                        console.log(data);
                        // transaction error
                        if (data && data.status === '0x0') {
                            const msgtitle = this.txHashArr[i].msgTitle;
                            this.txHashArr[i] = {
                                showTips: true,
                                TipsType: 'error',
                                msgTitle: msgtitle,
                                msg: 'Transaction failed',
                                transactionHash: ''
                            };
                            setTimeout(() => {
                                this.txHashArr[i].showTips = false;
                                this.ng2Apply();
                            }, 3000);
                        }
                    });
                }

            }
        }, 5000);

        // getHistory
        this.history = JSON.parse(this.storage.getItem('history'));
        if (this.history === null) {
            this.history = [];
        }
        this.refHistory();
    }

    // connect metamask
    connect() {
        this.web3Local.currentProvider.enable().then(
            res => {
                // console.log(res); ["0x08f12aabc699bbaf57d135ba56f44d00e9663951"]
                this.showRightInfo = true;
                this.walletAccount = res[0].substring(0, 8) + '...' + res[0].substring(res[0].length - 6);
                this.walletFullAccount = res[0];
                this.refreshAllStatus();
            },
            err => {
                console.log(err); // 'User rejected provider access'
                alert('you have click cancel button, and cancel the connect');
            }
        );
    }

    // click to copy
    copyToClipboard(txt: string) {
        this._clipboardService.copyFromContent(txt);
        console.log(txt);
    }

    feeDFChange() {
        if (this.feeDFInputNum > this.myBalance.myDF) {
            this.feeDFDespositActive = false;
        } else {
            this.feeDFDespositActive = true;
        }
    }

    depositDF() {
        this.waitDepositDF = true;
        if (!this.feeDFDespositActive) {
            this.waitDepositDF = true;
            return false;
        }

        if (!this.checkLockStatus.DFislock) {
            this.approveDF();
            return;
        }

        this.waitGenerate = false;
        this.contractUSDx.depositFeeToken.sendTransaction(
            this.addressDFN,
            this.feeDFInputNum * this.unitlength,
            {
                from: this.walletFullAccount,
                gas: 3000000
            },
            function(err, ret) {
                console.log(err, ret);
            }
        );
    }

    withdrawDF() {}

    // withdraw All DAI
    withdrawAllDAI() {
        this.nowWithdrawStr = 'DAI';
        this.tempStr = 'DAI';
        this.SelectedStrAddress = this.addressDAI;
        if (this.myBalance.myDAIonDUSD > 0) {
            this.withdrawBtnCouldActive = true;
            this.withdrawInputNum = this.myBalance.myDAIonDUSD;
        } else {
            this.withdrawBtnCouldActive = false;
            this.withdrawInputNum = undefined;
            return;
        }
    }
    // withdraw All PAX
    withdrawAllPAX() {
        this.nowWithdrawStr = 'PAX';
        this.tempStr = 'PAX';
        this.SelectedStrAddress = this.addressPAX;
        if (this.myBalance.myPAXonDUSD > 0) {
            this.withdrawBtnCouldActive = true;
            this.withdrawInputNum = this.myBalance.myPAXonDUSD;
        } else {
            this.withdrawBtnCouldActive = false;
            this.withdrawInputNum = undefined;
            return;
        }
    }
    // withdraw All TUSD
    withdrawAllTUSD() {
        this.nowWithdrawStr = 'TUSD';
        this.tempStr = 'TUSD';
        this.SelectedStrAddress = this.addressTUSD;
        if (this.myBalance.myTUSDonDUSD > 0) {
            this.withdrawBtnCouldActive = true;
            this.withdrawInputNum = this.myBalance.myTUSDonDUSD;
        } else {
            this.withdrawBtnCouldActive = false;
            this.withdrawInputNum = undefined;
            return;
        }
    }
    // withdraw All USDC
    withdrawAllUSDC() {
        this.nowWithdrawStr = 'USDC';
        this.tempStr = 'USDC';
        this.SelectedStrAddress = this.addressUSDC;
        if (this.myBalance.myUSDConDUSD > 0) {
            this.withdrawBtnCouldActive = true;
            this.withdrawInputNum = this.myBalance.myUSDConDUSD;
        } else {
            this.withdrawBtnCouldActive = false;
            this.withdrawInputNum = undefined;
            return;
        }
    }

    // refresh all status
    refreshAllStatus() {
        this.refreshMyAccount();
        this.checkIfApproved();
        this.refHistory();
    }

    // check if approved
    checkIfApproved() {
        // alert(111)
        this.contractDAI.allowance.call(this.walletFullAccount, this.addressPool, (err, ret) => {
            this.checkLockStatus.DAIislock = false;
            if (err) {
                this.checkLockStatus.DAIislock = false;
            }
            if (ret && ret.c[0] > 0) {
                this.checkLockStatus.DAIislock = true;
            }
        });
        this.contractPAX.allowance.call(this.walletFullAccount, this.addressPool, (err, ret) => {
            this.checkLockStatus.PAXislock = false;
            if (err) {
                this.checkLockStatus.PAXislock = false;
            }
            if (ret && ret.c[0] > 0) {
                this.checkLockStatus.PAXislock = true;
            }
        });
        this.contractTUSD.allowance.call(this.walletFullAccount, this.addressPool, (err, ret) => {
            this.checkLockStatus.TUSDislock = false;
            if (err) {
                this.checkLockStatus.TUSDislock = false;
            }
            if (ret && ret.c[0] > 0) {
                this.checkLockStatus.TUSDislock = true;
            }
        });
        this.contractUSDC.allowance.call(this.walletFullAccount, this.addressPool, (err, ret) => {
            this.checkLockStatus.USDCislock = false;
            if (err) {
                this.checkLockStatus.USDCislock = false;
            }
            if (ret && ret.c[0] > 0) {
                this.checkLockStatus.USDCislock = true;
            }
        });

        // todo [curry]
        this.contractDFN.allowance.call(this.walletFullAccount, this.addressConvert, (err, ret) => {
            this.checkLockStatus.DFislock = false;
            if (err) {
                this.checkLockStatus.DFislock = false;
            }
            if (ret && ret.c[0] > 0) {
                this.checkLockStatus.DFislock = true;
            }
        });

        this.contractUSDx.allowance.call(this.walletFullAccount, this.addressConvert, (err, ret) => {
            this.checkLockStatus.USDxislock = false;
            if (err) {
                this.checkLockStatus.USDxislock = false;
            }
            if (ret && ret.c[0] > 0) {
                this.checkLockStatus.USDxislock = true;
            }
        });
    }

    // LOCK or UNLOCK
    // DAI
    approveDAI() {
        if (this.checkLockStatus.DAIislock) {
            const TempNum = this.txHashArr.length;
            this.txHashArr[TempNum] = {
                showTips: true,
                TipsType: 'inprogress',
                msgTitle: 'Lock DAI',
                msg: 'Waiting for transaction signature...',
                transactionHash: ''
            };
            this.contractDAI.approve.sendTransaction(
                this.addressPool,
                0,
                {
                    from: this.walletFullAccount,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle === 'Lock DAI') {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'error',
                                    msgTitle: 'Lock DAI error',
                                    msg: err.message,
                                    transactionHash: ''
                                };
                                setTimeout(() => {
                                    this.txHashArr[i].showTips = false;
                                    this.ng2Apply();
                                }, 3000);
                            }
                        }
                    }
                    if (ret) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle === 'Lock DAI') {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'inprogress',
                                    msgTitle: 'Lock DAI',
                                    msg: 'Waiting for confirmation...',
                                    transactionHash: ret
                                };
                            }
                        }
                        const eventsDAI = this.contractDAI.allEvents({ toBlock: 'latest' }, (error, result) => {
                            if (result) {
                                for (let i = 0; i < this.txHashArr.length; i++) {
                                    if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                        this.txHashArr[i] = {
                                            showTips: true,
                                            TipsType: 'success',
                                            msgTitle: 'Lock DAI',
                                            msg: 'Transaction success',
                                            transactionHash: ''
                                        };
                                        this.checkIfApproved();
                                        setTimeout(() => {
                                            this.txHashArr[i].showTips = false;
                                            this.ng2Apply();
                                        }, 3000);
                                        eventsDAI.stopWatching();
                                    }
                                }
                            }
                        });
                    }
                }
            );
            return false;
        }
        const tempNum = this.txHashArr.length;
        this.txHashArr[tempNum] = {
            showTips: true,
            TipsType: 'inprogress',
            msgTitle: 'Unlock DAI',
            msg: 'Waiting for transaction signature...',
            transactionHash: ''
        };
        this.contractDAI.approve.sendTransaction(
            this.addressPool,
            this.unitMax * this.unitlength,
            {
                from: this.walletFullAccount,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    for (let i = 0; i < this.txHashArr.length; i++) {
                        if (this.txHashArr[i].msgTitle === 'Unlock DAI') {
                            this.txHashArr[i] = {
                                showTips: true,
                                TipsType: 'error',
                                msgTitle: 'Unlock DAI error',
                                msg: err.message,
                                transactionHash: ''
                            };
                            setTimeout(() => {
                                this.txHashArr[i].showTips = false;
                                this.ng2Apply();
                            }, 3000);
                        }
                    }
                }
                if (ret) {
                    for (let i = 0; i < this.txHashArr.length; i++) {
                        if (this.txHashArr[i].msgTitle === 'Unlock DAI') {
                            this.txHashArr[i] = {
                                showTips: true,
                                TipsType: 'inprogress',
                                msgTitle: 'Unlock DAI',
                                msg: 'Waiting for confirmation...',
                                transactionHash: ret
                            };
                        }
                    }
                    const eventsDAI = this.contractDAI.allEvents({ toBlock: 'latest' }, (error, result) => {
                        if (result) {
                            for (let i = 0; i < this.txHashArr.length; i++) {
                                if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                    this.txHashArr[i] = {
                                        showTips: true,
                                        TipsType: 'success',
                                        msgTitle: 'Unlock DAI',
                                        msg: 'Transaction success',
                                        transactionHash: ''
                                    };
                                    if (this.waitGenerate) {
                                        setTimeout(() => {
                                            this.txHashArr.splice(i, 1);
                                            this.ng2Apply();
                                        }, 1000);
                                        setTimeout(() => {
                                            this.generateDUSD();
                                        }, 3000);
                                    } else if (this.waitDestroy) {
                                        setTimeout(() => {
                                            this.txHashArr.splice(i, 1);
                                            this.ng2Apply();
                                        }, 1000);
                                        setTimeout(() => {
                                            this.destroyDUSD();
                                        }, 3000);
                                    } else {
                                        setTimeout(() => {
                                            this.txHashArr[i].showTips = false;
                                            this.ng2Apply();
                                        }, 3000);
                                    }
                                    this.checkIfApproved();
                                    eventsDAI.stopWatching();
                                }
                            }
                        }
                    });
                }
            }
        );
    }
    // PAX
    approvePAX() {
        if (this.checkLockStatus.PAXislock) {
            const TempNum = this.txHashArr.length;
            this.txHashArr[TempNum] = {
                showTips: true,
                TipsType: 'inprogress',
                msgTitle: 'Lock PAX',
                msg: 'Waiting for transaction signature...',
                transactionHash: ''
            };
            this.contractPAX.approve.sendTransaction(
                this.addressPool,
                0,
                {
                    from: this.walletFullAccount,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle === 'Lock PAX') {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'error',
                                    msgTitle: 'Lock PAX error',
                                    msg: err.message,
                                    transactionHash: ''
                                };
                                setTimeout(() => {
                                    this.txHashArr[i].showTips = false;
                                    this.ng2Apply();
                                }, 3000);
                            }
                        }
                    }
                    if (ret) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle === 'Lock PAX') {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'inprogress',
                                    msgTitle: 'Lock PAX',
                                    msg: 'Waiting for confirmation...',
                                    transactionHash: ret
                                };
                            }
                        }
                        const eventsPAX = this.contractPAX.allEvents({ toBlock: 'latest' }, (error, result) => {
                            if (result) {
                                for (let i = 0; i < this.txHashArr.length; i++) {
                                    if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                        this.txHashArr[i] = {
                                            showTips: true,
                                            TipsType: 'success',
                                            msgTitle: 'Lock PAX',
                                            msg: 'Transaction success',
                                            transactionHash: ''
                                        };
                                        this.checkIfApproved();
                                        setTimeout(() => {
                                            this.txHashArr[i].showTips = false;
                                            this.ng2Apply();
                                        }, 3000);
                                        eventsPAX.stopWatching();
                                    }
                                }
                            }
                        });
                    }
                }
            );
            return false;
        }
        const tempNum = this.txHashArr.length;
        this.txHashArr[tempNum] = {
            showTips: true,
            TipsType: 'inprogress',
            msgTitle: 'Unlock PAX',
            msg: 'Waiting for transaction signature...',
            transactionHash: ''
        };
        this.contractPAX.approve.sendTransaction(
            this.addressPool,
            this.unitMax * this.unitlength,
            {
                from: this.walletFullAccount,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    for (let i = 0; i < this.txHashArr.length; i++) {
                        if (this.txHashArr[i].msgTitle === 'Unlock PAX') {
                            this.txHashArr[i] = {
                                showTips: true,
                                TipsType: 'error',
                                msgTitle: 'Unlock PAX error',
                                msg: err.message,
                                transactionHash: ''
                            };
                            setTimeout(() => {
                                this.txHashArr[i].showTips = false;
                                this.ng2Apply();
                            }, 3000);
                        }
                    }
                }
                if (ret) {
                    for (let i = 0; i < this.txHashArr.length; i++) {
                        if (this.txHashArr[i].msgTitle === 'Unlock PAX') {
                            this.txHashArr[i] = {
                                showTips: true,
                                TipsType: 'inprogress',
                                msgTitle: 'Unlock PAX',
                                msg: 'Waiting for confirmation...',
                                transactionHash: ret
                            };
                        }
                    }
                    const eventsPAX = this.contractPAX.allEvents({ toBlock: 'latest' }, (error, result) => {
                        if (result) {
                            for (let i = 0; i < this.txHashArr.length; i++) {
                                if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                    this.txHashArr[i] = {
                                        showTips: true,
                                        TipsType: 'success',
                                        msgTitle: 'Unlock PAX',
                                        msg: 'Transaction success',
                                        transactionHash: ''
                                    };
                                    if (this.waitGenerate) {
                                        setTimeout(() => {
                                            this.txHashArr.splice(i, 1);
                                            this.ng2Apply();
                                        }, 1000);
                                        setTimeout(() => {
                                            this.generateDUSD();
                                        }, 3000);
                                    } else if (this.waitDestroy) {
                                        setTimeout(() => {
                                            this.txHashArr.splice(i, 1);
                                            this.ng2Apply();
                                        }, 1000);
                                        setTimeout(() => {
                                            this.destroyDUSD();
                                        }, 3000);
                                    } else {
                                        setTimeout(() => {
                                            this.txHashArr[i].showTips = false;
                                            this.ng2Apply();
                                        }, 3000);
                                    }
                                    this.checkIfApproved();
                                    eventsPAX.stopWatching();
                                }
                            }
                        }
                    });
                }
            }
        );
    }
    // TUSD
    approveTUSD() {
        if (this.checkLockStatus.TUSDislock) {
            const TempNum = this.txHashArr.length;
            this.txHashArr[TempNum] = {
                showTips: true,
                TipsType: 'inprogress',
                msgTitle: 'Lock TUSD',
                msg: 'Waiting for transaction signature...',
                transactionHash: ''
            };
            this.contractTUSD.approve.sendTransaction(
                this.addressPool,
                0,
                {
                    from: this.walletFullAccount,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle === 'Lock TUSD') {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'error',
                                    msgTitle: 'Lock TUSD error',
                                    msg: err.message,
                                    transactionHash: ''
                                };
                                setTimeout(() => {
                                    this.txHashArr[i].showTips = false;
                                    this.ng2Apply();
                                }, 3000);
                            }
                        }
                    }
                    if (ret) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle === 'Lock TUSD') {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'inprogress',
                                    msgTitle: 'Lock TUSD',
                                    msg: 'Waiting for confirmation...',
                                    transactionHash: ret
                                };
                            }
                        }
                        const eventsTUSD = this.contractTUSD.allEvents({ toBlock: 'latest' }, (error, result) => {
                            if (result) {
                                for (let i = 0; i < this.txHashArr.length; i++) {
                                    if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                        this.txHashArr[i] = {
                                            showTips: true,
                                            TipsType: 'success',
                                            msgTitle: 'Lock TUSD',
                                            msg: 'Transaction success',
                                            transactionHash: ''
                                        };
                                        this.checkIfApproved();
                                        setTimeout(() => {
                                            this.txHashArr[i].showTips = false;
                                            this.ng2Apply();
                                        }, 3000);
                                        eventsTUSD.stopWatching();
                                    }
                                }
                            }
                        });
                    }
                }
            );
            return false;
        }
        const tempNum = this.txHashArr.length;
        this.txHashArr[tempNum] = {
            showTips: true,
            TipsType: 'inprogress',
            msgTitle: 'Unlock TUSD',
            msg: 'Waiting for transaction signature...',
            transactionHash: ''
        };
        this.contractTUSD.approve.sendTransaction(
            this.addressPool,
            this.unitMax * this.unitlength,
            {
                from: this.walletFullAccount,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    for (let i = 0; i < this.txHashArr.length; i++) {
                        if (this.txHashArr[i].msgTitle === 'Unlock TUSD') {
                            this.txHashArr[i] = {
                                showTips: true,
                                TipsType: 'error',
                                msgTitle: 'Unlock TUSD error',
                                msg: err.message,
                                transactionHash: ''
                            };
                            setTimeout(() => {
                                this.txHashArr[i].showTips = false;
                                this.ng2Apply();
                            }, 3000);
                        }
                    }
                }
                if (ret) {
                    for (let i = 0; i < this.txHashArr.length; i++) {
                        this.txHashArr[i] = {
                            showTips: true,
                            TipsType: 'inprogress',
                            msgTitle: 'Unlock TUSD',
                            msg: 'Waiting for confirmation...',
                            transactionHash: ret
                        };
                    }
                    const eventsTUSD = this.contractTUSD.allEvents({ toBlock: 'latest' }, (error, result) => {
                        if (result) {
                            for (let i = 0; i < this.txHashArr.length; i++) {
                                if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                    this.txHashArr[i] = {
                                        showTips: true,
                                        TipsType: 'success',
                                        msgTitle: 'Unlock TUSD',
                                        msg: 'Transaction success',
                                        transactionHash: ''
                                    };
                                    if (this.waitGenerate) {
                                        setTimeout(() => {
                                            this.txHashArr.splice(i, 1);
                                            this.ng2Apply();
                                        }, 1000);
                                        setTimeout(() => {
                                            this.generateDUSD();
                                        }, 3000);
                                    } else if (this.waitDestroy) {
                                        setTimeout(() => {
                                            this.txHashArr.splice(i, 1);
                                            this.ng2Apply();
                                        }, 1000);
                                        setTimeout(() => {
                                            this.destroyDUSD();
                                        }, 3000);
                                    } else {
                                        setTimeout(() => {
                                            this.txHashArr[i].showTips = false;
                                            this.ng2Apply();
                                        }, 3000);
                                    }
                                    this.checkIfApproved();
                                    eventsTUSD.stopWatching();
                                }
                            }
                        }
                    });
                }
            }
        );
    }
    // USDC
    approveUSDC() {
        if (this.checkLockStatus.USDCislock) {
            const TempNum = this.txHashArr.length;
            this.txHashArr[TempNum] = {
                showTips: true,
                TipsType: 'inprogress',
                msgTitle: 'Lock USDC',
                msg: 'Waiting for transaction signature...',
                transactionHash: ''
            };
            this.contractUSDC.approve.sendTransaction(
                this.addressPool,
                0,
                {
                    from: this.walletFullAccount,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle === 'Lock USDC') {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'error',
                                    msgTitle: 'Lock USDC error',
                                    msg: err.message,
                                    transactionHash: ''
                                };
                                setTimeout(() => {
                                    this.txHashArr[i].showTips = false;
                                    this.ng2Apply();
                                }, 3000);
                            }
                        }
                    }
                    if (ret) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle === 'Lock USDC') {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'inprogress',
                                    msgTitle: 'Lock USDC',
                                    msg: 'Waiting for confirmation...',
                                    transactionHash: ret
                                };
                            }
                        }
                        const eventsUSDC = this.contractUSDC.allEvents({ toBlock: 'latest' }, (error, result) => {
                            if (result) {
                                for (let i = 0; i < this.txHashArr.length; i++) {
                                    if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                        this.txHashArr[i] = {
                                            showTips: true,
                                            TipsType: 'success',
                                            msgTitle: 'Lock USDC',
                                            msg: 'Transaction success',
                                            transactionHash: ''
                                        };
                                        this.checkIfApproved();
                                        setTimeout(() => {
                                            this.txHashArr[i].showTips = false;
                                            this.ng2Apply();
                                        }, 3000);
                                        eventsUSDC.stopWatching();
                                    }
                                }
                            }
                        });
                    }
                }
            );
            return false;
        }
        const tempNum = this.txHashArr.length;
        this.txHashArr[tempNum] = {
            showTips: true,
            TipsType: 'inprogress',
            msgTitle: 'Unlock USDC',
            msg: 'Waiting for transaction signature...',
            transactionHash: ''
        };
        this.contractUSDC.approve.sendTransaction(
            this.addressPool,
            this.unitMax * this.unitlength,
            {
                from: this.walletFullAccount,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    for (let i = 0; i < this.txHashArr.length; i++) {
                        if (this.txHashArr[i].msgTitle === 'Unlock USDC') {
                            this.txHashArr[i] = {
                                showTips: true,
                                TipsType: 'error',
                                msgTitle: 'Unlock USDC error',
                                msg: err.message,
                                transactionHash: ''
                            };
                            setTimeout(() => {
                                this.txHashArr[i].showTips = false;
                                this.ng2Apply();
                            }, 3000);
                        }
                    }
                }
                if (ret) {
                    for (let i = 0; i < this.txHashArr.length; i++) {
                        if (this.txHashArr[i].msgTitle === 'Unlock USDC') {
                            this.txHashArr[i] = {
                                showTips: true,
                                TipsType: 'inprogress',
                                msgTitle: 'Unlock USDC',
                                msg: 'Waiting for confirmation...',
                                transactionHash: ret
                            };
                        }
                    }
                    const eventsUSDC = this.contractUSDC.allEvents({ toBlock: 'latest' }, (error, result) => {
                        if (result) {
                            for (let i = 0; i < this.txHashArr.length; i++) {
                                if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                    this.txHashArr[i] = {
                                        showTips: true,
                                        TipsType: 'success',
                                        msgTitle: 'Unlock USDC',
                                        msg: 'Transaction success',
                                        transactionHash: ''
                                    };
                                    if (this.waitGenerate) {
                                        setTimeout(() => {
                                            this.txHashArr.splice(i, 1);
                                            this.ng2Apply();
                                        }, 1000);
                                        setTimeout(() => {
                                            this.generateDUSD();
                                        }, 3000);
                                    } else if (this.waitDestroy) {
                                        setTimeout(() => {
                                            this.txHashArr.splice(i, 1);
                                            this.ng2Apply();
                                        }, 1000);
                                        setTimeout(() => {
                                            this.destroyDUSD();
                                        }, 3000);
                                    } else {
                                        setTimeout(() => {
                                            this.txHashArr[i].showTips = false;
                                            this.ng2Apply();
                                        }, 3000);
                                    }
                                    this.checkIfApproved();
                                    eventsUSDC.stopWatching();
                                }
                            }
                        }
                    });
                }
            }
        );
    }
    // todo [curry]
    // DF
    approveDF() {
        if (this.checkLockStatus.DFislock) {
            const TempNum = this.txHashArr.length;
            this.txHashArr[TempNum] = {
                showTips: true,
                TipsType: 'inprogress',
                msgTitle: 'Lock DF',
                msg: 'Waiting for transaction signature...',
                transactionHash: ''
            };
            this.contractDFN.approve.sendTransaction(
                this.addressConvert,
                0,
                {
                    from: this.walletFullAccount,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle === 'Lock DF') {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'error',
                                    msgTitle: 'Lock DF error',
                                    msg: err.message,
                                    transactionHash: ''
                                };
                                setTimeout(() => {
                                    this.txHashArr[i].showTips = false;
                                    this.ng2Apply();
                                }, 3000);
                            }
                        }
                    }
                    if (ret) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle === 'Lock DF') {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'inprogress',
                                    msgTitle: 'Lock DF',
                                    msg: 'Waiting for confirmation...',
                                    transactionHash: ret
                                };
                            }
                        }
                        const eventsDF = this.contractDFN.allEvents({ toBlock: 'latest' }, (error, result) => {
                            if (result) {
                                for (let i = 0; i < this.txHashArr.length; i++) {
                                    if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                        this.txHashArr[i] = {
                                            showTips: true,
                                            TipsType: 'success',
                                            msgTitle: 'Lock DF',
                                            msg: 'Transaction success',
                                            transactionHash: ''
                                        };
                                        this.checkIfApproved();
                                        setTimeout(() => {
                                            this.txHashArr[i].showTips = false;
                                            this.ng2Apply();
                                        }, 3000);
                                        eventsDF.stopWatching();
                                    }
                                }
                            }
                        });
                    }
                }
            );
            return false;
        }
        const tempNum = this.txHashArr.length;
        this.txHashArr[tempNum] = {
            showTips: true,
            TipsType: 'inprogress',
            msgTitle: 'Unlock DF',
            msg: 'Waiting for transaction signature...',
            transactionHash: ''
        };
        this.contractDFN.approve.sendTransaction(
            this.addressConvert,
            this.unitMax * this.unitlength,
            {
                from: this.walletFullAccount,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    for (let i = 0; i < this.txHashArr.length; i++) {
                        if (this.txHashArr[i].msgTitle === 'Unlock DF') {
                            this.txHashArr[i] = {
                                showTips: true,
                                TipsType: 'error',
                                msgTitle: 'Unlock DF error',
                                msg: err.message,
                                transactionHash: ''
                            };
                            setTimeout(() => {
                                this.txHashArr[i].showTips = false;
                                this.ng2Apply();
                            }, 3000);
                        }
                    }
                }
                if (ret) {
                    for (let i = 0; i < this.txHashArr.length; i++) {
                        if (this.txHashArr[i].msgTitle === 'Unlock DF') {
                            this.txHashArr[i] = {
                                showTips: true,
                                TipsType: 'inprogress',
                                msgTitle: 'Unlock DF',
                                msg: 'Waiting for confirmation...',
                                transactionHash: ret
                            };
                        }
                    }
                    const eventsDF = this.contractDFN.allEvents({ toBlock: 'latest' }, (error, result) => {
                        if (result) {
                            for (let i = 0; i < this.txHashArr.length; i++) {
                                if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                    this.txHashArr[i] = {
                                        showTips: true,
                                        TipsType: 'success',
                                        msgTitle: 'Unlock DF',
                                        msg: 'Transaction success',
                                        transactionHash: ''
                                    };
                                    if (this.waitGenerate) {
                                        setTimeout(() => {
                                            this.txHashArr.splice(i, 1);
                                            this.ng2Apply();
                                        }, 1000);
                                        setTimeout(() => {
                                            this.generateDUSD();
                                        }, 3000);
                                    } else if (this.waitDestroy) {
                                        setTimeout(() => {
                                            this.txHashArr.splice(i, 1);
                                            this.ng2Apply();
                                        }, 1000);
                                        setTimeout(() => {
                                            this.destroyDUSD();
                                        }, 3000);
                                    } else if (this.toBurn) {
                                        setTimeout(() => {
                                            this.txHashArr.splice(i, 1);
                                            this.ng2Apply();
                                            this.toBurn = false;
                                        }, 1000);
                                        setTimeout(() => {
                                            this.destroyDUSD();
                                        }, 3000);
                                    } else {
                                        setTimeout(() => {
                                            this.txHashArr[i].showTips = false;
                                            this.ng2Apply();
                                        }, 3000);
                                    }
                                    this.checkIfApproved();
                                    eventsDF.stopWatching();
                                }
                            }
                        }
                    });
                }
            }
        );
    }

    // USDx
    approveUSDx() {
        if (this.checkLockStatus.USDxislock) {
            const TempNum = this.txHashArr.length;
            this.txHashArr[TempNum] = {
                showTips: true,
                TipsType: 'inprogress',
                msgTitle: 'Lock USDx',
                msg: 'Waiting for transaction signature...',
                transactionHash: ''
            };
            this.contractUSDx.approve.sendTransaction(
                this.addressConvert,
                0,
                {
                    from: this.walletFullAccount,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle === 'Lock USDx') {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'error',
                                    msgTitle: 'Lock USDx error',
                                    msg: err.message,
                                    transactionHash: ''
                                };
                                setTimeout(() => {
                                    this.txHashArr[i].showTips = false;
                                    this.ng2Apply();
                                }, 3000);
                            }
                        }
                    }
                    if (ret) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle === 'Lock USDx') {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'inprogress',
                                    msgTitle: 'Lock USDx',
                                    msg: 'Waiting for confirmation...',
                                    transactionHash: ret
                                };
                            }
                        }
                        const eventsUSDx = this.contractUSDx.allEvents({ toBlock: 'latest' }, (error, result) => {
                            if (result) {
                                for (let i = 0; i < this.txHashArr.length; i++) {
                                    if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                        this.txHashArr[i] = {
                                            showTips: true,
                                            TipsType: 'success',
                                            msgTitle: 'Lock USDx',
                                            msg: 'Transaction success',
                                            transactionHash: ''
                                        };
                                        this.checkIfApproved();
                                        setTimeout(() => {
                                            this.txHashArr[i].showTips = false;
                                            this.ng2Apply();
                                        }, 3000);
                                        eventsUSDx.stopWatching();
                                    }
                                }
                            }
                        });
                    }
                }
            );
            return false;
        }
        const tempNum = this.txHashArr.length;
        this.txHashArr[tempNum] = {
            showTips: true,
            TipsType: 'inprogress',
            msgTitle: 'Unlock USDx',
            msg: 'Waiting for transaction signature...',
            transactionHash: ''
        };
        this.contractUSDx.approve.sendTransaction(
            this.addressConvert,
            this.unitMax * this.unitlength,
            {
                from: this.walletFullAccount,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    for (let i = 0; i < this.txHashArr.length; i++) {
                        if (this.txHashArr[i].msgTitle === 'Unlock USDx') {
                            this.txHashArr[i] = {
                                showTips: true,
                                TipsType: 'error',
                                msgTitle: 'Unlock USDx error',
                                msg: err.message,
                                transactionHash: ''
                            };
                            setTimeout(() => {
                                this.txHashArr[i].showTips = false;
                                this.ng2Apply();
                            }, 3000);
                        }
                    }
                }
                if (ret) {
                    for (let i = 0; i < this.txHashArr.length; i++) {
                        if (this.txHashArr[i].msgTitle === 'Unlock USDx') {
                            this.txHashArr[i] = {
                                showTips: true,
                                TipsType: 'inprogress',
                                msgTitle: 'Unlock USDx',
                                msg: 'Waiting for confirmation...',
                                transactionHash: ret
                            };
                        }
                    }
                    const eventsUSDx = this.contractUSDx.allEvents({ toBlock: 'latest' }, (error, result) => {
                        if (result) {
                            for (let i = 0; i < this.txHashArr.length; i++) {
                                if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                    this.txHashArr[i] = {
                                        showTips: true,
                                        TipsType: 'success',
                                        msgTitle: 'Unlock USDx',
                                        msg: 'Transaction success',
                                        transactionHash: ''
                                    };
                                    if (this.waitDestroy) {
                                        setTimeout(() => {
                                            this.txHashArr.splice(i, 1);
                                            this.ng2Apply();
                                        }, 1000);
                                        setTimeout(() => {
                                            this.destroyDUSD();
                                        }, 3000);
                                    } else if (this.toBurn1) {
                                        setTimeout(() => {
                                            this.txHashArr.splice(i, 1);
                                            this.ng2Apply();
                                            this.toBurn1 = false;
                                        }, 1000);
                                        setTimeout(() => {
                                            this.destroyDUSD();
                                        }, 3000);
                                    } else {
                                        setTimeout(() => {
                                            this.txHashArr[i].showTips = false;
                                            this.ng2Apply();
                                        }, 3000);
                                    }
                                    this.checkIfApproved();
                                    eventsUSDx.stopWatching();
                                }
                            }
                        }
                    });
                }
            }
        );
    }


    // Generate DUSD
    // generate num change
    generateInputChange() {
        if (this.tempStr1 === 'DAI') {
            if (this.generateInputNum === null || this.generateInputNum === undefined || this.generateInputNum < 0.000000000000000001) {
                this.generateExpectedYourBalance = false;
                this.generateBtnCouldActive = false;
                return false;
            }
            if (this.generateInputNum > this.myBalance.myDAI) {
                this.generateExpectedYourBalance = true;
                this.generateBtnCouldActive = false;
                return false;
            } else {
                this.generateExpectedYourBalance = false;
                this.generateBtnCouldActive = true;
                if (this.myBalance.totalPAX < 0.0001 || this.myBalance.totalTUSD < 0.0001 || this.myBalance.totalUSDC < 0.0001) {
                    this.maxGenerateDUSD = 0.0;
                } else {
                    // tslint:disable-next-line:radix
                    const num0 = parseInt(((this.myBalance.totalDAI / (10 ** 18) + this.generateInputNum) / this.sectionDAI).toString());
                    // tslint:disable-next-line:radix
                    const num1 = parseInt((this.myBalance.totalPAX / (this.sectionPAX * 10 ** 18)).toString());
                    // tslint:disable-next-line:radix
                    const num2 = parseInt((this.myBalance.totalTUSD / (this.sectionTUSD * 10 ** 18)).toString());
                    // tslint:disable-next-line:radix
                    const num3 = parseInt((this.myBalance.totalUSDC / (this.sectionUSDC * 10 ** 18)).toString());
                    const numMin = Math.min(num0, num1, num2, num3);
                    this.maxGenerateDUSD = numMin ? numMin * this.sectionDAI - this.myBalance.totalDAI / (10 ** 18) : 0;
                }
            }
        }
        if (this.tempStr1 === 'PAX') {
            if (this.generateInputNum === null || this.generateInputNum === undefined || this.generateInputNum < 0.000000000000000001) {
                this.generateExpectedYourBalance = false;
                this.generateBtnCouldActive = false;
                return false;
            }
            if (this.generateInputNum > this.myBalance.myPAX) {
                this.generateExpectedYourBalance = true;
                this.generateBtnCouldActive = false;
                return false;
            } else {
                this.generateExpectedYourBalance = false;
                this.generateBtnCouldActive = true;
                if (this.myBalance.totalDAI < 0.0001 || this.myBalance.totalTUSD < 0.0001 || this.myBalance.totalUSDC < 0.0001) {
                    this.maxGenerateDUSD = 0.0;
                } else {
                    // tslint:disable-next-line:radix
                    const num0 = parseInt((this.myBalance.totalDAI / (this.sectionDAI * 10 ** 18)).toString());
                    // tslint:disable-next-line:radix
                    const num1 = parseInt(((this.myBalance.totalPAX / (10 ** 18) + this.generateInputNum ) / this.sectionPAX ).toString());
                    // tslint:disable-next-line:radix
                    const num2 = parseInt((this.myBalance.totalTUSD / (this.sectionTUSD * 10 ** 18)).toString());
                    // tslint:disable-next-line:radix
                    const num3 = parseInt((this.myBalance.totalUSDC / (this.sectionUSDC * 10 ** 18)).toString());
                    const numMin = Math.min(num0, num1, num2, num3);
                    this.maxGenerateDUSD = numMin ? numMin * this.sectionPAX - this.myBalance.totalPAX / (10 ** 18) : 0;
                }
            }
        }
        if (this.tempStr1 === 'TUSD') {
            if (this.generateInputNum === null || this.generateInputNum === undefined || this.generateInputNum < 0.000000000000000001) {
                this.generateExpectedYourBalance = false;
                this.generateBtnCouldActive = false;
                return false;
            }
            if (this.generateInputNum > this.myBalance.myTUSD) {
                this.generateExpectedYourBalance = true;
                this.generateBtnCouldActive = false;
                return false;
            } else {
                this.generateExpectedYourBalance = false;
                this.generateBtnCouldActive = true;
                if (this.myBalance.totalDAI < 0.0001 || this.myBalance.totalPAX < 0.0001 || this.myBalance.totalUSDC < 0.0001) {
                    this.maxGenerateDUSD = 0.0;
                } else {
                    // tslint:disable-next-line:radix
                    const num0 = parseInt((this.myBalance.totalDAI / (this.sectionDAI * 10 ** 18)).toString());
                    // tslint:disable-next-line:radix
                    const num1 = parseInt((this.myBalance.totalPAX / (this.sectionPAX * 10 ** 18)).toString());
                    // tslint:disable-next-line:radix
                    const num2 = parseInt(((this.myBalance.totalTUSD / (10 ** 18) + this.generateInputNum) / this.sectionTUSD ).toString());
                    // tslint:disable-next-line:radix
                    const num3 = parseInt((this.myBalance.totalUSDC / (this.sectionUSDC * 10 ** 18)).toString());
                    const numMin = Math.min(num0, num1, num2, num3);
                    this.maxGenerateDUSD = numMin ? numMin * this.sectionTUSD - this.myBalance.totalTUSD / (10 ** 18) : 0;
                }
            }
        }
        if (this.tempStr1 === 'USDC') {
            if (this.generateInputNum === null || this.generateInputNum === undefined || this.generateInputNum < 0.000000000000000001) {
                this.generateExpectedYourBalance = false;
                this.generateBtnCouldActive = false;
                return false;
            }
            if (this.generateInputNum > this.myBalance.myUSDC) {
                this.generateExpectedYourBalance = true;
                this.generateBtnCouldActive = false;
                return false;
            } else {
                this.generateExpectedYourBalance = false;
                this.generateBtnCouldActive = true;
                if (this.myBalance.totalDAI < 0.0001 || this.myBalance.totalPAX < 0.0001 || this.myBalance.totalTUSD < 0.0001) {
                    this.maxGenerateDUSD = 0.0;
                } else {
                    // tslint:disable-next-line:radix
                    const num0 = parseInt((this.myBalance.totalDAI / (this.sectionDAI * 10 ** 18)).toString());
                    // tslint:disable-next-line:radix
                    const num1 = parseInt((this.myBalance.totalPAX / (this.sectionPAX * 10 ** 18)).toString());
                    // tslint:disable-next-line:radix
                    const num2 = parseInt((this.myBalance.totalTUSD / (this.sectionTUSD * 10 ** 18)).toString());
                    // tslint:disable-next-line:radix
                    const num3 = parseInt(((this.myBalance.totalUSDC / (10 ** 18) + this.generateInputNum) / this.sectionUSDC ).toString());
                    const numMin = Math.min(num0, num1, num2, num3);
                    this.maxGenerateDUSD = numMin ? numMin * this.sectionUSDC - this.myBalance.totalUSDC / (10 ** 18) : 0;
                }
            }
        }
    }
    // Generate token change
    generateDUSDChanged(str) {
        if (str === 'DAI') {
            this.SelectedStrAddress1 = this.addressDAI;
            this.tempStr1 = 'DAI';
        }
        if (str === 'PAX') {
            this.SelectedStrAddress1 = this.addressPAX;
            this.tempStr1 = 'PAX';
        }
        if (str === 'TUSD') {
            this.SelectedStrAddress1 = this.addressTUSD;
            this.tempStr1 = 'TUSD';
        }
        if (str === 'USDC') {
            this.SelectedStrAddress1 = this.addressUSDC;
            this.tempStr1 = 'USDC';
        }

        this.generateInputChange();
    }
    // Generate
    generateDUSD() {
        this.waitGenerate = true;
        if (!this.generateBtnCouldActive) {
            this.waitGenerate = false;
            return false;
        }

        if (this.tempStr1 === 'DAI') {
            if (!this.checkLockStatus.DAIislock) {
                this.approveDAI();
                return;
            }
        }
        if (this.tempStr1 === 'PAX') {
            if (!this.checkLockStatus.PAXislock) {
                this.approvePAX();
                return;
            }
        }
        if (this.tempStr1 === 'TUSD') {
            if (!this.checkLockStatus.TUSDislock) {
                this.approveTUSD();
                return;
            }
        }
        if (this.tempStr1 === 'USDC') {
            if (!this.checkLockStatus.USDCislock) {
                this.approveUSDC();
                return;
            }
        }
        this.waitGenerate = false;
        const tempNum1 = this.txHashArr.length;
        // console.log(this.txHashArr);
        // console.log(this.txHashArr.length);
        this.txHashArr[tempNum1] = {
            showTips: true,
            TipsType: 'inprogress',
            msgTitle: 'Deposit ' + this.generateInputNum + ' ' + this.tempStr1,
            msg: 'Waiting for transaction signature...',
            transactionHash: ''
        };
        this.contractProxy.deposit.sendTransaction(
            this.SelectedStrAddress1,
            this.generateInputNum * this.unitlength,
            {
                from: this.walletFullAccount,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    for (let i = 0; i < this.txHashArr.length; i++) {
                        if (this.txHashArr[i].msgTitle.match('Deposit')) {
                            this.txHashArr[i] = {
                                showTips: true,
                                TipsType: 'error',
                                msgTitle: 'Deposit ' + this.tempStr1 + ' error',
                                msg: err.message,
                                transactionHash: ''
                            };
                            setTimeout(() => {
                                this.txHashArr[i].showTips = false;
                                this.ng2Apply();
                            }, 3000);
                        }
                    }
                }
                if (ret) {
                    for (let i = 0; i < this.txHashArr.length; i++) {
                        if (this.txHashArr[i].msgTitle.match('Deposit')) {
                            this.txHashArr[i] = {
                                showTips: true,
                                TipsType: 'inprogress',
                                msgTitle: 'Deposit ' + this.generateInputNum + ' ' + this.tempStr1,
                                msg: 'Waiting for confirmation...',
                                transactionHash: ret
                            };
                        }
                    }
                    // [curry]
                    const eventsDUSD = this.contractProxy.allEvents({ toBlock: 'latest' }, (error, result) => {
                        if (result) {
                            for (let i = 0; i < this.txHashArr.length; i++) {
                                if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                    const msgTitle = this.txHashArr[i].msgTitle;
                                    this.txHashArr[i] = {
                                        showTips: true,
                                        TipsType: 'success',
                                        msgTitle: msgTitle,
                                        msg: 'Transaction success',
                                        transactionHash: ''
                                    };
                                    this.generateInputNum = undefined;
                                    this.maxGenerateDUSD = undefined;
                                    this.generateInputChange();
                                    setTimeout(() => {
                                        this.txHashArr[i].showTips = false;
                                        this.ng2Apply();
                                    }, 3000);
                                    this.refreshAllStatus();
                                    eventsDUSD.stopWatching();
                                }
                            }
                        }
                    });
                }
            }
        );
    }

    // Withdraw
    // Withdraw token change
    withdrawTokenChanged(str) {
        if (str === 'DAI') {
            this.SelectedStrAddress = this.addressDAI;
            this.tempStr = 'DAI';
        }
        if (str === 'PAX') {
            this.SelectedStrAddress = this.addressPAX;
            this.tempStr = 'PAX';
        }
        if (str === 'TUSD') {
            this.SelectedStrAddress = this.addressTUSD;
            this.tempStr = 'TUSD';
        }
        if (str === 'USDC') {
            this.SelectedStrAddress = this.addressUSDC;
            this.tempStr = 'USDC';
        }

        this.withdrawNumChange();
    }
    // Withdraw num change
    withdrawNumChange() {
        if (this.tempStr === 'DAI') {
            if (this.withdrawInputNum === null || this.withdrawInputNum === undefined || this.withdrawInputNum < 0.000000000000000001) {
                this.withdrawExpectedYourBalance = false;
                this.withdrawBtnCouldActive = false;
                return false;
            }
            if (this.withdrawInputNum > this.myBalance.myDAIonDUSD) {
                this.withdrawExpectedYourBalance = true;
                this.withdrawBtnCouldActive = false;
                return false;
            } else {
                this.withdrawExpectedYourBalance = false;
                this.withdrawBtnCouldActive = true;
            }
        }
        if (this.tempStr === 'PAX') {
            if (this.withdrawInputNum === null || this.withdrawInputNum === undefined || this.withdrawInputNum < 0.000000000000000001) {
                this.withdrawExpectedYourBalance = false;
                this.withdrawBtnCouldActive = false;
                return false;
            }
            if (this.withdrawInputNum > this.myBalance.myPAXonDUSD) {
                this.withdrawExpectedYourBalance = true;
                this.withdrawBtnCouldActive = false;
                return false;
            } else {
                this.withdrawExpectedYourBalance = false;
                this.withdrawBtnCouldActive = true;
            }
        }
        if (this.tempStr === 'TUSD') {
            if (this.withdrawInputNum === null || this.withdrawInputNum === undefined || this.withdrawInputNum < 0.000000000000000001) {
                this.withdrawExpectedYourBalance = false;
                this.withdrawBtnCouldActive = false;
                return false;
            }
            if (this.withdrawInputNum > this.myBalance.myTUSDonDUSD) {
                this.withdrawExpectedYourBalance = true;
                this.withdrawBtnCouldActive = false;
                return false;
            } else {
                this.withdrawExpectedYourBalance = false;
                this.withdrawBtnCouldActive = true;
            }
        }
        if (this.tempStr === 'USDC') {
            if (this.withdrawInputNum === null || this.withdrawInputNum === undefined || this.withdrawInputNum < 0.000000000000000001) {
                this.withdrawExpectedYourBalance = false;
                this.withdrawBtnCouldActive = false;
                return false;
            }
            if (this.withdrawInputNum > this.myBalance.myUSDConDUSD) {
                this.withdrawExpectedYourBalance = true;
                this.withdrawBtnCouldActive = false;
                return false;
            } else {
                this.withdrawExpectedYourBalance = false;
                this.withdrawBtnCouldActive = true;
            }
        }
    }
    // Withdraw
    withdrawMyTokenSelected() {
        if (!this.withdrawBtnCouldActive) {
            return false;
        }
        const tempNum1 = this.txHashArr.length;
        this.txHashArr[tempNum1] = {
            showTips: true,
            TipsType: 'inprogress',
            msgTitle: 'Withdraw ' + this.withdrawInputNum + ' ' + this.tempStr,
            msg: 'Waiting for transaction signature...',
            transactionHash: ''
        };
        // [curry]
        this.contractProxy.withdraw.sendTransaction(
            this.SelectedStrAddress,
            this.withdrawInputNum * this.unitlength,
            {
                from: this.walletFullAccount,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    for (let i = 0; i < this.txHashArr.length; i++) {
                        if (this.txHashArr[i].msgTitle.match('Withdraw')) {
                            this.txHashArr[i] = {
                                showTips: true,
                                TipsType: 'error',
                                msgTitle: 'Withdraw ' + this.tempStr + ' error',
                                msg: err.message,
                                transactionHash: ''
                            };
                            setTimeout(() => {
                                this.txHashArr[i].showTips = false;
                                this.ng2Apply();
                            }, 3000);
                        }
                    }
                }
                if (ret) {
                    for (let i = 0; i < this.txHashArr.length; i++) {
                        if (this.txHashArr[i].msgTitle.match('Withdraw')) {
                            this.txHashArr[i] = {
                                showTips: true,
                                TipsType: 'inprogress',
                                msgTitle: 'Withdraw ' + this.withdrawInputNum + ' ' + this.tempStr,
                                msg: 'Waiting for confirmation...',
                                transactionHash: ret
                            };
                        }
                    }
                    const eventsDUSD = this.contractProxy.allEvents({ toBlock: 'latest' }, (error, result) => {
                        if (result) {
                            for (let i = 0; i < this.txHashArr.length; i++) {
                                if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                    const msgTitle = this.txHashArr[i].msgTitle;
                                    this.txHashArr[i] = {
                                        showTips: true,
                                        TipsType: 'success',
                                        msgTitle: msgTitle,
                                        msg: 'Transaction success',
                                        transactionHash: ''
                                    };
                                    this.withdrawInputNum = undefined;
                                    this.withdrawNumChange();
                                    setTimeout(() => {
                                        this.txHashArr[i].showTips = false;
                                        this.ng2Apply();
                                    }, 3000);
                                    this.refreshAllStatus();
                                    eventsDUSD.stopWatching();
                                }
                            }
                        }
                    });
                }
            }
        );
    }

    // Destroy DUSD
    // Destroy num change
    destroyChange() {
        if (this.destroyNum === null || this.destroyNum === undefined || this.destroyNum < 0.000000000000000001) {
            this.DUSDwannaBackExpected = false;
            this.destroyBtnCouldActive = false;
            this.destroyFeeNumStr = '0.0000';
            this.destroyNumtoDAI = '0.0000';
            this.destroyNumtoPAX = '0.0000';
            this.destroyNumtoTUSD = '0.0000';
            this.destroyNumtoUSDC = '0.0000';
            return false;
        }
        if (this.destroyNum > this.myBalance.myDUSD) {
            this.DUSDwannaBackExpected = true;
            this.destroyBtnCouldActive = false;
            return false;
        } else {
            this.DUSDwannaBackExpected = false;
            this.destroyBtnCouldActive = true;
        }
        this.destroyNumtoDAI = this.formatNumber((this.destroyNum * this.sectionDAI) / this.tatolSection);
        this.destroyNumtoPAX = this.formatNumber((this.destroyNum * this.sectionPAX) / this.tatolSection);
        this.destroyNumtoTUSD = this.formatNumber((this.destroyNum * this.sectionTUSD) / this.tatolSection);
        this.destroyNumtoUSDC = this.formatNumber((this.destroyNum * this.sectionUSDC) / this.tatolSection);
        // this.destroyFeeNumStr = this.formatNumber((this.destroyNum * 5) / 1000);
        this.destroyFeeNumStr = '5';
    }
    // Destroy
    destroyDUSD() {
        if (!this.destroyBtnCouldActive) {
            return false;
        }
        if (!this.checkLockStatus.DFislock) {
            this.toBurn = true;
            this.approveDF();
            return false;
        }
        if (!this.checkLockStatus.USDxislock) {
            this.toBurn1 = true;
            this.approveUSDx();
            return false;
        }
        const tempNum = this.txHashArr.length;
        this.txHashArr[tempNum] = {
            showTips: true,
            TipsType: 'inprogress',
            msgTitle: 'Destroy ' + this.destroyNum + ' DUSD',
            msg: 'Waiting for transaction signature...',
            transactionHash: ''
        };
        this.contractProxy.destroy.sendTransaction(
            this.destroyNum * this.unitlength,
            {
                from: this.walletFullAccount,
                gas: 3000000
            },
            (err, ret) => {
                if (err) {
                    for (let i = 0; i < this.txHashArr.length; i++) {
                        if (this.txHashArr[i].msgTitle.match('Destroy')) {
                            this.txHashArr[i] = {
                                showTips: true,
                                TipsType: 'error',
                                msgTitle: 'Destroy DUSD error',
                                msg: err.message,
                                transactionHash: ''
                            };
                            setTimeout(() => {
                                this.txHashArr[i].showTips = false;
                                this.ng2Apply();
                            }, 3000);
                        }
                    }
                }
                if (ret) {
                    for (let i = 0; i < this.txHashArr.length; i++) {
                        if (this.txHashArr[i].msgTitle.match('Destroy')) {
                            this.txHashArr[i] = {
                                showTips: true,
                                TipsType: 'inprogress',
                                msgTitle: 'Destroy ' + this.destroyNum + ' DUSD',
                                msg: 'Waiting for confirmation...',
                                transactionHash: ret
                            };
                        }
                    }
                    // [curry] to change contractProxy
                    const eventsDUSD = this.contractUSDx.allEvents({ toBlock: 'latest' }, (error, result) => {
                        if (result) {
                            for (let i = 0; i < this.txHashArr.length; i++) {
                                if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                    const msgTitle = this.txHashArr[i].msgTitle;
                                    this.txHashArr[i] = {
                                        showTips: true,
                                        TipsType: 'success',
                                        msgTitle: msgTitle,
                                        msg: 'Transaction success',
                                        transactionHash: ''
                                    };
                                    this.destroyNum = undefined;
                                    this.destroyChange();
                                    setTimeout(() => {
                                        this.txHashArr[i].showTips = false;
                                        this.ng2Apply();
                                    }, 3000);
                                    this.refreshAllStatus();
                                    eventsDUSD.stopWatching();
                                }
                            }
                        }
                    });
                }
            }
        );
    }

    // format number
    formatNumber(num) {
        const strNum = num.toString();
        const arrNum = strNum.split('.');
        if (arrNum.length > 1) {
            if (arrNum[1].length === 0) {
                return arrNum[0] + '.0000';
            } else if (arrNum[1].length === 1) {
                return arrNum[0] + '.' + arrNum[1] + '000';
            } else if (arrNum[1].length === 2) {
                return arrNum[0] + '.' + arrNum[1] + '00';
            } else if (arrNum[1].length === 3) {
                return arrNum[0] + '.' + arrNum[1] + '0';
            } else if (arrNum[1].length === 4) {
                return arrNum[0] + '.' + arrNum[1];
            } else if (arrNum[1].length > 4) {
                return arrNum[0] + '.' + arrNum[1].substring(0, 4);
            }
        } else {
            return arrNum[0] + '.0000';
        }
    }

    formatBalanceNum(ret) {
        // return (ret.toFixed() / (10 ** 18)).toString();
        // console.log(typeof(ret), ret)
        // if (ret === '0') {
        //     return ret;
        // }
        const originStr = (ret.toFixed() / (10 ** 18)).toString();
        let outputStr = '';
        if ( originStr.indexOf('.') > 0 ) {
            outputStr = originStr.substr(0, originStr.indexOf('.') + 5);
            if (outputStr.length >= 12) {
                return outputStr = outputStr.substr(0, 11);
            } else {
                return outputStr;
            }
        } else {
            return originStr;
        }
    }

    // refresh my account
    refreshMyAccount() {
        this.web3Local.eth.getBalance(this.walletFullAccount, (err, ret) => {
            this.myBalance.myETH = ret.toFixed();
            this.myBalance.myETHstr = this.formatBalanceNum(ret);
        });
        this.contractDAI.balanceOf.call(this.walletFullAccount, (err, ret) => {
            this.myBalance.myDAI = ret.toFixed(); // number balance
            this.myBalance.myDAIstr = this.formatBalanceNum(ret);
        });
        this.contractPAX.balanceOf.call(this.walletFullAccount, (err, ret) => {
            this.myBalance.myPAX = ret.toFixed();
            this.myBalance.myPAXstr = this.formatBalanceNum(ret);
        });
        this.contractTUSD.balanceOf.call(this.walletFullAccount, (err, ret) => {
            this.myBalance.myTUSD = ret.toFixed();
            this.myBalance.myTUSDstr = this.formatBalanceNum(ret);
        });
        this.contractUSDC.balanceOf.call(this.walletFullAccount, (err, ret) => {
            this.myBalance.myUSDC = ret.toFixed();
            this.myBalance.myUSDCstr = this.formatBalanceNum(ret);
        });
        this.contractDFN.balanceOf.call(this.walletFullAccount, (err, ret) => {
            this.myBalance.myDF = ret.toFixed();
            this.myBalance.myDFstr = this.formatBalanceNum(ret);
        });
        this.contractUSDx.balanceOf.call(this.walletFullAccount, (err, ret) => {
            this.myBalance.myDUSD = ret.toFixed() / (10 ** 18);
            this.myBalance.myDUSDstr = this.formatBalanceNum(ret);
        });
        // totalSupply
        this.contractUSDx.totalSupply.call((err, ret) => {
            this.myBalance.totalSupplyNum = ret.toFixed();
            this.myBalance.totalSupplyNumstr = this.formatBalanceNum(ret);
        });
        // --**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**
        // --**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**--**

        this.contractDAI.balanceOf.call(this.addressPool, (err, ret) => {
            this.myBalance.totalDAI = ret.toFixed();
            this.myBalance.totalDAIstr = this.formatBalanceNum(ret);
        });
        this.contractPAX.balanceOf.call(this.addressPool, (err, ret) => {
            this.myBalance.totalPAX = ret.toFixed();
            this.myBalance.totalPAXstr = this.formatBalanceNum(ret);
        });
        this.contractTUSD.balanceOf.call(this.addressPool, (err, ret) => {
            this.myBalance.totalTUSD = ret.toFixed();
            this.myBalance.totalTUSDstr = this.formatBalanceNum(ret);
        });
        this.contractUSDC.balanceOf.call(this.addressPool, (err, ret) => {
            this.myBalance.totalUSDC = ret.toFixed();
            this.myBalance.totalUSDCstr = this.formatBalanceNum(ret);
        });



        this.contractDAI.balanceOf.call(this.addressBank, (err, ret) => {
            this.myBalance.digestedDAI = this.formatBalanceNum(ret);
        });
        this.contractPAX.balanceOf.call(this.addressBank, (err1, ret1) => {
            this.myBalance.digestedPAX = this.formatBalanceNum(ret1);
        });
        this.contractTUSD.balanceOf.call(this.addressBank, (err1, ret1) => {
            this.myBalance.digestedTUSD = this.formatBalanceNum(ret1);
        });
        this.contractUSDC.balanceOf.call(this.addressBank, (err1, ret1) => {
            this.myBalance.digestedUSDC = this.formatBalanceNum(ret1);
        });

        // refresh my surplus
        this.contractData.balanceOfTokens.call(this.addressDAI, this.walletFullAccount, (err, ret) => {
            this.myBalance.myDAIonDUSD = ret.toFixed() / (10 ** 18);
            this.myBalance.myDAIonDUSDstr = this.formatBalanceNum(ret);
        });
        this.contractData.balanceOfTokens.call(this.addressPAX, this.walletFullAccount, (err, ret) => {
            this.myBalance.myPAXonDUSD = ret.toFixed() / (10 ** 18);
            this.myBalance.myPAXonDUSDstr = this.formatBalanceNum(ret);
        });
        this.contractData.balanceOfTokens.call(this.addressTUSD, this.walletFullAccount, (err, ret) => {
            this.myBalance.myTUSDonDUSD = ret.toFixed() / (10 ** 18);
            this.myBalance.myTUSDonDUSDstr = this.formatBalanceNum(ret);
        });
        this.contractData.balanceOfTokens.call(this.addressUSDC, this.walletFullAccount, (err, ret) => {
            this.myBalance.myUSDConDUSD = ret.toFixed() / (10 ** 18);
            this.myBalance.myUSDConDUSDstr = this.formatBalanceNum(ret);
        });

        this.ng2Apply();
    }
    // to apply
    ng2Apply() {
        this.ref.markForCheck();
        this.ref.detectChanges();
    }

    // send DAI
    sendDAI() {
        this.willSendTokenStr = 'DAI';
        this.showSideBar = true;
    }
    sendPAX() {
        this.willSendTokenStr = 'PAX';
        this.showSideBar = true;
    }
    sendETH() {
        this.willSendTokenStr = 'ETH';
        this.showSideBar = true;
    }
    sendTUSD() {
        this.willSendTokenStr = 'TUSD';
        this.showSideBar = true;
    }
    sendUSDC() {
        this.willSendTokenStr = 'USDC';
        this.showSideBar = true;
    }
    sendDF() {
        this.willSendTokenStr = 'DF';
        this.showSideBar = true;
    }
    sendDUSD() {
        this.willSendTokenStr = 'DUSD';
        this.showSideBar = true;
    }
    // sendNumChange
    sendNumChange() {
        if (this.willSendNum === null || this.willSendNum === undefined || this.willSendNum < 0.000000000000000001) {
            this.willSendBtnCouldClick = false;
            this.willSendNumErr = false;
            return false;
        }
        if (this.willSendTokenStr === 'ETH') {
            if (this.willSendNum * 10 ** 18 > this.myBalance.myETH) {
                this.willSendBtnCouldClick = false;
                this.willSendNumErr = true;
                return false;
            } else {
                this.willSendBtnCouldClick = true;
                this.willSendNumErr = false;
            }
        }
        if (this.willSendTokenStr === 'DAI') {
            if (this.willSendNum > this.myBalance.myDAI) {
                this.willSendBtnCouldClick = false;
                this.willSendNumErr = true;
                return false;
            } else {
                this.willSendBtnCouldClick = true;
                this.willSendNumErr = false;
            }
        }
        if (this.willSendTokenStr === 'PAX') {
            if (this.willSendNum > this.myBalance.myPAX) {
                this.willSendBtnCouldClick = false;
                this.willSendNumErr = true;
                return false;
            } else {
                this.willSendBtnCouldClick = true;
                this.willSendNumErr = false;
            }
        }
        if (this.willSendTokenStr === 'TUSD') {
            if (this.willSendNum > this.myBalance.myTUSD) {
                this.willSendBtnCouldClick = false;
                this.willSendNumErr = true;
                return false;
            } else {
                this.willSendBtnCouldClick = true;
                this.willSendNumErr = false;
            }
        }
        if (this.willSendTokenStr === 'USDC') {
            if (this.willSendNum > this.myBalance.myUSDC) {
                this.willSendBtnCouldClick = false;
                this.willSendNumErr = true;
                return false;
            } else {
                this.willSendBtnCouldClick = true;
                this.willSendNumErr = false;
            }
        }
        if (this.willSendTokenStr === 'DF') {
            if (this.willSendNum > this.myBalance.myDF) {
                this.willSendBtnCouldClick = false;
                this.willSendNumErr = true;
                return false;
            } else {
                this.willSendBtnCouldClick = true;
                this.willSendNumErr = false;
            }
        }
        if (this.willSendTokenStr === 'DUSD') {
            if (this.willSendNum > this.myBalance.myDUSD) {
                this.willSendBtnCouldClick = false;
                this.willSendNumErr = true;
                return false;
            } else {
                this.willSendBtnCouldClick = true;
                this.willSendNumErr = false;
            }
        }
    }
    // sendAddrChange
    sendAddrChange() {
        if (this.web3Local.isAddress(this.willSendToAddress)) {
            this.rightAddress = true;
        } else {
            this.rightAddress = false;
        }
    }
    // sendAssets
    sendAssets() {
        if (!this.willSendBtnCouldClick || !this.rightAddress) {
            return false;
        }
        if (this.willSendTokenStr === 'DAI') {
            const tempNum1 = this.txHashArr.length;
            this.txHashArr[tempNum1] = {
                showTips: true,
                TipsType: 'inprogress',
                msgTitle: 'Send ' + this.willSendNum + ' ' + this.willSendTokenStr,
                msg: 'Waiting for transaction signature...',
                transactionHash: ''
            };
            this.contractDAI.transfer.sendTransaction(
                this.willSendToAddress,
                this.willSendNum * this.unitlength,
                {
                    from: this.walletFullAccount,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle.match('Send')) {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'error',
                                    msgTitle: 'Send ' + this.willSendTokenStr + ' error',
                                    msg: err.message,
                                    transactionHash: ''
                                };
                                setTimeout(() => {
                                    this.txHashArr[i].showTips = false;
                                    this.ng2Apply();
                                }, 3000);
                            }
                        }
                    }
                    if (ret) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle.match('Send')) {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'inprogress',
                                    msgTitle: 'Send ' + this.willSendNum + ' ' + this.willSendTokenStr,
                                    msg: 'Waiting for confirmation...',
                                    transactionHash: ret
                                };
                            }
                        }
                        const eventsDAI = this.contractDAI.allEvents({ toBlock: 'latest' }, (error, result) => {
                            if (result) {
                                for (let i = 0; i < this.txHashArr.length; i++) {
                                    if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                        const msgTitle = this.txHashArr[i].msgTitle;
                                        this.txHashArr[i] = {
                                            showTips: true,
                                            TipsType: 'success',
                                            msgTitle: msgTitle,
                                            msg: 'Transaction success',
                                            transactionHash: ''
                                        };
                                        this.willSendNum = undefined;
                                        this.sendNumChange();
                                        this.willSendToAddress = '';
                                        this.showSideBar = false;
                                        setTimeout(() => {
                                            this.txHashArr[i].showTips = false;
                                            this.ng2Apply();
                                        }, 3000);
                                        this.refreshAllStatus();
                                        eventsDAI.stopWatching();
                                    }
                                }
                            }
                        });
                    }
                }
            );
        }
        if (this.willSendTokenStr === 'PAX') {
            const tempNum1 = this.txHashArr.length;
            this.txHashArr[tempNum1] = {
                showTips: true,
                TipsType: 'inprogress',
                msgTitle: 'Send ' + this.willSendNum + ' ' + this.willSendTokenStr,
                msg: 'Waiting for transaction signature...',
                transactionHash: ''
            };
            this.contractPAX.transfer.sendTransaction(
                this.willSendToAddress,
                this.willSendNum * this.unitlength,
                {
                    from: this.walletFullAccount,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle.match('Send')) {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'error',
                                    msgTitle: 'Send ' + this.willSendTokenStr + ' error',
                                    msg: err.message,
                                    transactionHash: ''
                                };
                                setTimeout(() => {
                                    this.txHashArr[i].showTips = false;
                                    this.ng2Apply();
                                }, 3000);
                            }
                        }
                    }
                    if (ret) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle.match('Send')) {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'inprogress',
                                    msgTitle: 'Send ' + this.willSendNum + ' ' + this.willSendTokenStr,
                                    msg: 'Waiting for confirmation...',
                                    transactionHash: ret
                                };
                            }
                        }
                        const eventsPAX = this.contractPAX.allEvents({ toBlock: 'latest' }, (error, result) => {
                            if (result) {
                                for (let i = 0; i < this.txHashArr.length; i++) {
                                    if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                        const msgTitle = this.txHashArr[i].msgTitle;
                                        this.txHashArr[i] = {
                                            showTips: true,
                                            TipsType: 'success',
                                            msgTitle: msgTitle,
                                            msg: 'Transaction success',
                                            transactionHash: ''
                                        };
                                        this.willSendNum = undefined;
                                        this.sendNumChange();
                                        this.willSendToAddress = '';
                                        this.showSideBar = false;
                                        setTimeout(() => {
                                            this.txHashArr[i].showTips = false;
                                            this.ng2Apply();
                                        }, 3000);
                                        this.refreshAllStatus();
                                        eventsPAX.stopWatching();
                                    }
                                }
                            }
                        });
                    }
                }
            );
        }
        if (this.willSendTokenStr === 'TUSD') {
            const tempNum1 = this.txHashArr.length;
            this.txHashArr[tempNum1] = {
                showTips: true,
                TipsType: 'inprogress',
                msgTitle: 'Send ' + this.willSendNum + ' ' + this.willSendTokenStr,
                msg: 'Waiting for transaction signature...',
                transactionHash: ''
            };
            this.contractTUSD.transfer.sendTransaction(
                this.willSendToAddress,
                this.willSendNum * this.unitlength,
                {
                    from: this.walletFullAccount,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle.match('Send')) {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'error',
                                    msgTitle: 'Send ' + this.willSendTokenStr + ' error',
                                    msg: err.message,
                                    transactionHash: ''
                                };
                                setTimeout(() => {
                                    this.txHashArr[i].showTips = false;
                                    this.ng2Apply();
                                }, 3000);
                            }
                        }
                    }
                    if (ret) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle.match('Send')) {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'inprogress',
                                    msgTitle: 'Send ' + this.willSendNum + ' ' + this.willSendTokenStr,
                                    msg: 'Waiting for confirmation...',
                                    transactionHash: ret
                                };
                            }
                        }
                        const eventsTUSD = this.contractTUSD.allEvents({ toBlock: 'latest' }, (error, result) => {
                            if (result) {
                                for (let i = 0; i < this.txHashArr.length; i++) {
                                    if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                        const msgTitle = this.txHashArr[i].msgTitle;
                                        this.txHashArr[i] = {
                                            showTips: true,
                                            TipsType: 'success',
                                            msgTitle: msgTitle,
                                            msg: 'Transaction success',
                                            transactionHash: ''
                                        };
                                        this.willSendNum = undefined;
                                        this.sendNumChange();
                                        this.willSendToAddress = '';
                                        this.showSideBar = false;
                                        setTimeout(() => {
                                            this.txHashArr[i].showTips = false;
                                            this.ng2Apply();
                                        }, 3000);
                                        this.refreshAllStatus();
                                        eventsTUSD.stopWatching();
                                    }
                                }
                            }
                        });
                    }
                }
            );
        }
        if (this.willSendTokenStr === 'USDC') {
            const tempNum1 = this.txHashArr.length;
            this.txHashArr[tempNum1] = {
                showTips: true,
                TipsType: 'inprogress',
                msgTitle: 'Send ' + this.willSendNum + ' ' + this.willSendTokenStr,
                msg: 'Waiting for transaction signature...',
                transactionHash: ''
            };
            this.contractUSDC.transfer.sendTransaction(
                this.willSendToAddress,
                this.willSendNum * this.unitlength,
                {
                    from: this.walletFullAccount,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle.match('Send')) {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'error',
                                    msgTitle: 'Send ' + this.willSendTokenStr + ' error',
                                    msg: err.message,
                                    transactionHash: ''
                                };
                                setTimeout(() => {
                                    this.txHashArr[i].showTips = false;
                                    this.ng2Apply();
                                }, 3000);
                            }
                        }
                    }
                    if (ret) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle.match('Send')) {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'inprogress',
                                    msgTitle: 'Send ' + this.willSendNum + ' ' + this.willSendTokenStr,
                                    msg: 'Waiting for confirmation...',
                                    transactionHash: ret
                                };
                            }
                        }
                        const eventsUSDC = this.contractUSDC.allEvents({ toBlock: 'latest' }, (error, result) => {
                            if (result) {
                                for (let i = 0; i < this.txHashArr.length; i++) {
                                    if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                        const msgTitle = this.txHashArr[i].msgTitle;
                                        this.txHashArr[i] = {
                                            showTips: true,
                                            TipsType: 'success',
                                            msgTitle: msgTitle,
                                            msg: 'Transaction success',
                                            transactionHash: ''
                                        };
                                        this.willSendNum = undefined;
                                        this.sendNumChange();
                                        this.willSendToAddress = '';
                                        this.showSideBar = false;
                                        setTimeout(() => {
                                            this.txHashArr[i].showTips = false;
                                            this.ng2Apply();
                                        }, 3000);
                                        this.refreshAllStatus();
                                        eventsUSDC.stopWatching();
                                    }
                                }
                            }
                        });
                    }
                }
            );
        }
        if (this.willSendTokenStr === 'DUSD') {
            const tempNum1 = this.txHashArr.length;
            this.txHashArr[tempNum1] = {
                showTips: true,
                TipsType: 'inprogress',
                msgTitle: 'Send ' + this.willSendNum + ' ' + this.willSendTokenStr,
                msg: 'Waiting for transaction signature...',
                transactionHash: ''
            };
            this.contractProxy.transfer.sendTransaction(
                this.willSendToAddress,
                this.willSendNum * this.unitlength,
                {
                    from: this.walletFullAccount,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle.match('Send')) {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'error',
                                    msgTitle: 'Send ' + this.willSendTokenStr + ' error',
                                    msg: err.message,
                                    transactionHash: ''
                                };
                                setTimeout(() => {
                                    this.txHashArr[i].showTips = false;
                                    this.ng2Apply();
                                }, 3000);
                            }
                        }
                    }
                    if (ret) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle.match('Send')) {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'inprogress',
                                    msgTitle: 'Send ' + this.willSendNum + ' ' + this.willSendTokenStr,
                                    msg: 'Waiting for confirmation...',
                                    transactionHash: ret
                                };
                            }
                        }
                        const eventsDUSD = this.contractUSDx.allEvents({ toBlock: 'latest' }, (error, result) => {
                            if (result) {
                                for (let i = 0; i < this.txHashArr.length; i++) {
                                    if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                        const msgTitle = this.txHashArr[i].msgTitle;
                                        this.txHashArr[i] = {
                                            showTips: true,
                                            TipsType: 'success',
                                            msgTitle: msgTitle,
                                            msg: 'Transaction success',
                                            transactionHash: ''
                                        };
                                        this.willSendNum = undefined;
                                        this.sendNumChange();
                                        this.willSendToAddress = '';
                                        this.showSideBar = false;
                                        setTimeout(() => {
                                            this.txHashArr[i].showTips = false;
                                            this.ng2Apply();
                                        }, 3000);
                                        this.refreshAllStatus();
                                        eventsDUSD.stopWatching();
                                    }
                                }
                            }
                        });
                    }
                }
            );
        }
        if (this.willSendTokenStr === 'DF') {
            const tempNum1 = this.txHashArr.length;
            this.txHashArr[tempNum1] = {
                showTips: true,
                TipsType: 'inprogress',
                msgTitle: 'Send ' + this.willSendNum + ' ' + this.willSendTokenStr,
                msg: 'Waiting for transaction signature...',
                transactionHash: ''
            };
            this.contractDFN.transfer.sendTransaction(
                this.willSendToAddress,
                this.willSendNum * this.unitlength,
                {
                    from: this.walletFullAccount,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle.match('Send')) {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'error',
                                    msgTitle: 'Send ' + this.willSendTokenStr + ' error',
                                    msg: err.message,
                                    transactionHash: ''
                                };
                                setTimeout(() => {
                                    this.txHashArr[i].showTips = false;
                                    this.ng2Apply();
                                }, 3000);
                            }
                        }
                    }
                    if (ret) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle.match('Send')) {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'inprogress',
                                    msgTitle: 'Send ' + this.willSendNum + ' ' + this.willSendTokenStr,
                                    msg: 'Waiting for confirmation...',
                                    transactionHash: ret
                                };
                            }
                        }
                        const eventsDF = this.contractDFN.allEvents({ toBlock: 'latest' }, (error, result) => {
                            if (result) {
                                for (let i = 0; i < this.txHashArr.length; i++) {
                                    if (this.txHashArr[i].transactionHash === result.transactionHash) {
                                        const msgTitle = this.txHashArr[i].msgTitle;
                                        this.txHashArr[i] = {
                                            showTips: true,
                                            TipsType: 'success',
                                            msgTitle: msgTitle,
                                            msg: 'Transaction success',
                                            transactionHash: ''
                                        };
                                        this.willSendNum = undefined;
                                        this.sendNumChange();
                                        this.willSendToAddress = '';
                                        this.showSideBar = false;
                                        setTimeout(() => {
                                            this.txHashArr[i].showTips = false;
                                            this.ng2Apply();
                                        }, 3000);
                                        this.refreshAllStatus();
                                        eventsDF.stopWatching();
                                    }
                                }
                            }
                        });
                    }
                }
            );
        }
        if (this.willSendTokenStr === 'ETH') {
            const tempNum1 = this.txHashArr.length;
            this.txHashArr[tempNum1] = {
                showTips: true,
                TipsType: 'inprogress',
                msgTitle: 'Send ' + this.willSendNum + ' ' + this.willSendTokenStr,
                msg: 'Waiting for transaction signature...',
                transactionHash: ''
            };
            this.web3Local.eth.sendTransaction(
                {
                    from: this.walletFullAccount,
                    to: this.willSendToAddress,
                    value: this.willSendNum * this.unitlength,
                    gas: 3000000
                },
                (err, ret) => {
                    if (err) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle.match('Send')) {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'error',
                                    msgTitle: 'Send ' + this.willSendTokenStr + ' error',
                                    msg: err.message,
                                    transactionHash: ''
                                };
                                setTimeout(() => {
                                    this.txHashArr[i].showTips = false;
                                    this.ng2Apply();
                                }, 3000);
                            }
                        }
                    }
                    if (ret) {
                        for (let i = 0; i < this.txHashArr.length; i++) {
                            if (this.txHashArr[i].msgTitle.match('Send')) {
                                this.txHashArr[i] = {
                                    showTips: true,
                                    TipsType: 'inprogress',
                                    msgTitle: 'Send ' + this.willSendNum + ' ' + this.willSendTokenStr,
                                    msg: 'Waiting for confirmation...',
                                    transactionHash: ret
                                };
                            }
                        }
                        const timerETH = setInterval(() => {
                            this.web3Local.eth.getTransactionReceipt(ret, (error, data) => {
                                if (error) {
                                    clearInterval(timerETH);
                                }
                                if (data && data.status === '0x1') {
                                    for (let i = 0; i < this.txHashArr.length; i++) {
                                        if (this.txHashArr[i].transactionHash === ret) {
                                            this.txHashArr[i] = {
                                                showTips: true,
                                                TipsType: 'success',
                                                msgTitle: 'Send ' + this.willSendNum + ' ' + this.willSendTokenStr,
                                                msg: 'Transaction success',
                                                transactionHash: ''
                                            };
                                            this.willSendNum = undefined;
                                            this.sendNumChange();
                                            this.willSendToAddress = '';
                                            this.showSideBar = false;
                                            setTimeout(() => {
                                                this.txHashArr[i].showTips = false;
                                                this.ng2Apply();
                                            }, 3000);
                                            this.refreshAllStatus();
                                            clearInterval(timerETH);
                                        }
                                    }
                                }
                            });
                        }, 1000);
                    }
                }
            );
        }
    }
    // emptyInput
    emptyInput() {
        this.willSendNum = undefined;
        this.willSendBtnCouldClick = false;
        this.willSendNumErr = false;
        this.willSendToAddress = '';
    }

    // getNowTime
    getNowTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
        const date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
        const hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
        const minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
        return year + '-' + month + '-' + date + '  ' + hour + ':' + minute;
    }

    // fnShowHistory
    fnShowHistory() {
        if (!this.showRightInfo) {
            return false;
        }
        this.showHisttory = true;
    }

    // refHistory
    refHistory() {
        this.DUSDhistory = [];
        this.Withdrawhistory = [];
        if (this.history && this.history.length > 0) {
            for (let i = 0; i < this.history.length; i++) {
                if (this.history[i].event === 'Withdraw') {
                    this.Withdrawhistory.push(this.history[i]);
                } else {
                    this.DUSDhistory.push(this.history[i]);
                }
            }
        }
    }
}



