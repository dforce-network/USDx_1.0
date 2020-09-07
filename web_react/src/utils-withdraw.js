export const withdraw = (that) => {
    if (!that.state.couldWithdraw) {
        return;
    }
    var addr;
    var num;
    if (that.state.toWithdraw === 'DAI') {
        addr = that.addressDAI;
        num = that.Web3.toBigNumber(that.state.toWithdrawNum).mul(that.Web3.toBigNumber(10 ** that.state.decimalsDAI));
        withdrawDAI(that, addr, num);
    } else if (that.state.toWithdraw === 'PAX') {
        addr = that.addressPAX;
        num = that.Web3.toBigNumber(that.state.toWithdrawNum).mul(that.Web3.toBigNumber(10 ** that.state.decimalsPAX));
        withdrawPAX(that, addr, num);
    } else if (that.state.toWithdraw === 'TUSD') {
        addr = that.addressTUSD;
        num = that.Web3.toBigNumber(that.state.toWithdrawNum).mul(that.Web3.toBigNumber(10 ** that.state.decimalsTUSD));
        withdrawTUSD(that, addr, num);
    } else if (that.state.toWithdraw === 'USDC') {
        addr = that.addressUSDC;
        num = that.Web3.toBigNumber(that.state.toWithdrawNum).mul(that.Web3.toBigNumber(10 ** that.state.decimalsUSDC));
        withdrawUSDC(that, addr, num);
    }
}


const withdrawDAI = (that, addr, num) => {
    var str1;
    var str2;
    if (num.div(10 ** that.state.decimalsDAI).toString(10).indexOf('.') > 0) {
        str1 = that.toThousands(num.div(10 ** that.state.decimalsDAI).toString(10).split('.')[0]);
        str2 = '.' + num.div(10 ** that.state.decimalsDAI).toString(10).split('.')[1];
    } else {
        str1 = that.toThousands(num.div(10 ** that.state.decimalsDAI).toString(10));
        str2 = '';
    }
    const id = Math.random();
    const msg = 'Waiting for transaction signature...';
    const tmepState = that.state;
    tmepState.transcations[id] = {
        id: id,
        msg: msg,
        class: 'inprocess',
        title: 'Withdraw ' + str1 + str2 + ' DAI',
    }
    that.setState({ tmepState });
    // get Limit first
    that.contractProtocol.withdraw.estimateGas(
        addr,
        0,
        num,
        {
            from: that.state.accountAddress
        },
        (err, gasLimit) => {
            that.contractProtocol.withdraw.sendTransaction(
                addr,
                0,
                num,
                {
                    from: that.state.accountAddress,
                    gas: Math.ceil(gasLimit * that.gasRatio),
                    gasPrice: that.state.gasPrice
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(that.state.transcations);
                        const tmepState = that.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].id === id) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error',
                                    msg: 'User reject transaction'
                                }
                                that.setState({ tmepState });

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    that.setState({ tmepState });
                                }, 3000);
                            };
                            return false;
                        });
                    }
                    if (ret) {
                        const keys = Object.keys(that.state.transcations);
                        const tmepState = that.state;

                        keys.map((key) => {
                            if (tmepState.transcations[key].id === id) {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                that.setState({ tmepState });
                            };
                            return false;
                        });

                        var timerOBJ = {};
                        var tempRnum = Math.random();
                        timerOBJ[tempRnum] = setInterval(() => {
                            console.log('i am checking withdraw DAI... =>' + tempRnum);
                            that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(timerOBJ[tempRnum]);
                                    const keys = Object.keys(that.state.transcations);
                                    const tmepState = that.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction succeeded'
                                            }
                                            tmepState.toWithdrawNum = '';
                                            tmepState.couldWithdraw = false;
                                            that.setState({ tmepState });

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                that.setState({ tmepState });
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                    setTimeout(() => {
                                        that.getMyBalance();
                                        that.getPoolBankTotalStatus();
                                        that.getUserWithdrawBalance();
                                    }, 3000)
                                    // !!window.ethereum.isImToken
                                    if (!!window.ethereum.isImToken) {
                                        var itemHistory = {
                                            event: 'Withdraw',
                                            title: 'Withdraw ' + str1 + str2 + ' DAI',
                                            transactionHash: ret,
                                            timeStamp: new Date().getTime()
                                        };
                                        var tmphistory = that.state.myHistory;
                                        tmphistory.unshift(itemHistory);
                                        that.setState({
                                            ...that.state,
                                            myHistory: tmphistory
                                        })
                                        var localHistory = JSON.parse(localStorage.getItem(that.state.accountAddress));
                                        localHistory[that.state.netType].history.unshift(itemHistory);
                                        localStorage.setItem(that.state.accountAddress, JSON.stringify(localHistory));
                                    }
                                }
                                if (data && data.status === '0x0') {
                                    clearInterval(timerOBJ[tempRnum]);
                                    const keys = Object.keys(that.state.transcations);
                                    const tmepState = that.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'error',
                                                msg: 'Transaction failed'
                                            }
                                            that.setState({ tmepState });

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                that.setState({ tmepState });
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
const withdrawPAX = (that, addr, num) => {
    var str1;
    var str2;
    if (num.div(10 ** that.state.decimalsPAX).toString(10).indexOf('.') > 0) {
        str1 = that.toThousands(num.div(10 ** that.state.decimalsPAX).toString(10).split('.')[0]);
        str2 = '.' + num.div(10 ** that.state.decimalsPAX).toString(10).split('.')[1];
    } else {
        str1 = that.toThousands(num.div(10 ** that.state.decimalsPAX).toString(10));
        str2 = '';
    }
    const id = Math.random();
    const msg = 'Waiting for transaction signature...';
    const tmepState = that.state;
    tmepState.transcations[id] = {
        id: id,
        msg: msg,
        class: 'inprocess',
        title: 'Withdraw ' + str1 + str2 + ' PAX',
    }
    that.setState({ tmepState });
    // get Limit first
    that.contractProtocol.withdraw.estimateGas(
        addr,
        0,
        num,
        {
            from: that.state.accountAddress
        },
        (err, gasLimit) => {
            that.contractProtocol.withdraw.sendTransaction(
                addr,
                0,
                num,
                {
                    from: that.state.accountAddress,
                    gas: Math.ceil(gasLimit * that.gasRatio),
                    gasPrice: that.state.gasPrice
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(that.state.transcations);
                        const tmepState = that.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].id === id) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error',
                                    msg: 'User reject transaction'
                                }
                                that.setState({ tmepState });

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    that.setState({ tmepState });
                                }, 3000);
                            };
                            return false;
                        });
                    }
                    if (ret) {
                        const keys = Object.keys(that.state.transcations);
                        const tmepState = that.state;

                        keys.map((key) => {
                            if (tmepState.transcations[key].id === id) {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                that.setState({ tmepState });
                            };
                            return false;
                        });

                        var timerOBJ = {};
                        var tempRnum = Math.random();
                        timerOBJ[tempRnum] = setInterval(() => {
                            console.log('i am checking withdraw PAX... =>' + tempRnum);
                            that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(timerOBJ[tempRnum]);
                                    const keys = Object.keys(that.state.transcations);
                                    const tmepState = that.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction succeeded'
                                            }
                                            tmepState.toWithdrawNum = '';
                                            tmepState.couldWithdraw = false;
                                            that.setState({ tmepState });

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                that.setState({ tmepState });
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                    setTimeout(() => {
                                        that.getMyBalance();
                                        that.getPoolBankTotalStatus();
                                        that.getUserWithdrawBalance();
                                    }, 3000)
                                    // !!window.ethereum.isImToken
                                    if (!!window.ethereum.isImToken) {
                                        var itemHistory = {
                                            event: 'Withdraw',
                                            title: 'Withdraw ' + str1 + str2 + ' PAX',
                                            transactionHash: ret,
                                            timeStamp: new Date().getTime()
                                        };
                                        var tmphistory = that.state.myHistory;
                                        tmphistory.unshift(itemHistory);
                                        that.setState({
                                            ...that.state,
                                            myHistory: tmphistory
                                        })
                                        var localHistory = JSON.parse(localStorage.getItem(that.state.accountAddress));
                                        localHistory[that.state.netType].history.unshift(itemHistory);
                                        localStorage.setItem(that.state.accountAddress, JSON.stringify(localHistory));
                                    }
                                }
                                if (data && data.status === '0x0') {
                                    clearInterval(timerOBJ[tempRnum]);
                                    const keys = Object.keys(that.state.transcations);
                                    const tmepState = that.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'error',
                                                msg: 'Transaction failed'
                                            }
                                            that.setState({ tmepState });

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                that.setState({ tmepState });
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
const withdrawTUSD = (that, addr, num) => {
    var str1;
    var str2;
    if (num.div(10 ** that.state.decimalsTUSD).toString(10).indexOf('.') > 0) {
        str1 = that.toThousands(num.div(10 ** that.state.decimalsTUSD).toString(10).split('.')[0]);
        str2 = '.' + num.div(10 ** that.state.decimalsTUSD).toString(10).split('.')[1];
    } else {
        str1 = that.toThousands(num.div(10 ** that.state.decimalsTUSD).toString(10));
        str2 = '';
    }
    const id = Math.random();
    const msg = 'Waiting for transaction signature...';
    const tmepState = that.state;
    tmepState.transcations[id] = {
        id: id,
        msg: msg,
        class: 'inprocess',
        title: 'Withdraw ' + str1 + str2 + ' TUSD',
    }
    that.setState({ tmepState });
    // get Limit first
    that.contractProtocol.withdraw.estimateGas(
        addr,
        0,
        num,
        {
            from: that.state.accountAddress
        },
        (err, gasLimit) => {
            that.contractProtocol.withdraw.sendTransaction(
                addr,
                0,
                num,
                {
                    from: that.state.accountAddress,
                    gas: Math.ceil(gasLimit * that.gasRatio),
                    gasPrice: that.state.gasPrice
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(that.state.transcations);
                        const tmepState = that.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].id === id) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error',
                                    msg: 'User reject transaction'
                                }
                                that.setState({ tmepState });

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    that.setState({ tmepState });
                                }, 3000);
                            };
                            return false;
                        });
                    }
                    if (ret) {
                        const keys = Object.keys(that.state.transcations);
                        const tmepState = that.state;

                        keys.map((key) => {
                            if (tmepState.transcations[key].id === id) {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                that.setState({ tmepState });
                            };
                            return false;
                        });

                        var timerOBJ = {};
                        var tempRnum = Math.random();
                        timerOBJ[tempRnum] = setInterval(() => {
                            console.log('i am checking withdraw TUSD... =>' + tempRnum);
                            that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(timerOBJ[tempRnum]);
                                    const keys = Object.keys(that.state.transcations);
                                    const tmepState = that.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction succeeded'
                                            }
                                            tmepState.toWithdrawNum = '';
                                            tmepState.couldWithdraw = false;
                                            that.setState({ tmepState });

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                that.setState({ tmepState });
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                    setTimeout(() => {
                                        that.getMyBalance();
                                        that.getPoolBankTotalStatus();
                                        that.getUserWithdrawBalance();
                                    }, 3000)
                                    // !!window.ethereum.isImToken
                                    if (!!window.ethereum.isImToken) {
                                        var itemHistory = {
                                            event: 'Withdraw',
                                            title: 'Withdraw ' + str1 + str2 + ' TUSD',
                                            transactionHash: ret,
                                            timeStamp: new Date().getTime()
                                        };
                                        var tmphistory = that.state.myHistory;
                                        tmphistory.unshift(itemHistory);
                                        that.setState({
                                            ...that.state,
                                            myHistory: tmphistory
                                        })
                                        var localHistory = JSON.parse(localStorage.getItem(that.state.accountAddress));
                                        localHistory[that.state.netType].history.unshift(itemHistory);
                                        localStorage.setItem(that.state.accountAddress, JSON.stringify(localHistory));
                                    }
                                }
                                if (data && data.status === '0x0') {
                                    clearInterval(timerOBJ[tempRnum]);
                                    const keys = Object.keys(that.state.transcations);
                                    const tmepState = that.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'error',
                                                msg: 'Transaction failed'
                                            }
                                            that.setState({ tmepState });

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                that.setState({ tmepState });
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
const withdrawUSDC = (that, addr, num) => {
    var str1;
    var str2;
    if (num.div(10 ** that.state.decimalsUSDC).toString(10).indexOf('.') > 0) {
        str1 = that.toThousands(num.div(10 ** that.state.decimalsUSDC).toString(10).split('.')[0]);
        str2 = '.' + num.div(10 ** that.state.decimalsUSDC).toString(10).split('.')[1];
    } else {
        str1 = that.toThousands(num.div(10 ** that.state.decimalsUSDC).toString(10));
        str2 = '';
    }
    const id = Math.random();
    const msg = 'Waiting for transaction signature...';
    const tmepState = that.state;
    tmepState.transcations[id] = {
        id: id,
        msg: msg,
        class: 'inprocess',
        title: 'Withdraw ' + str1 + str2 + ' USDC',
    }
    that.setState({ tmepState });
    // get Limit first
    that.contractProtocol.withdraw.estimateGas(
        addr,
        0,
        num,
        {
            from: that.state.accountAddress
        },
        (err, gasLimit) => {
            that.contractProtocol.withdraw.sendTransaction(
                addr,
                0,
                num,
                {
                    from: that.state.accountAddress,
                    gas: Math.ceil(gasLimit * that.gasRatio),
                    gasPrice: that.state.gasPrice
                },
                (err, ret) => {
                    if (err) {
                        const keys = Object.keys(that.state.transcations);
                        const tmepState = that.state;
                        keys.map((key) => {
                            if (tmepState.transcations[key].id === id) {
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    class: 'error',
                                    msg: 'User reject transaction'
                                }
                                that.setState({ tmepState });

                                setTimeout(() => {
                                    delete tmepState.transcations[key];
                                    that.setState({ tmepState });
                                }, 3000);
                            };
                            return false;
                        });
                    }
                    if (ret) {
                        const keys = Object.keys(that.state.transcations);
                        const tmepState = that.state;

                        keys.map((key) => {
                            if (tmepState.transcations[key].id === id) {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                that.setState({ tmepState });
                            };
                            return false;
                        });

                        var timerOBJ = {};
                        var tempRnum = Math.random();
                        timerOBJ[tempRnum] = setInterval(() => {
                            console.log('i am checking withdraw USDC... =>' + tempRnum);
                            that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(timerOBJ[tempRnum]);
                                    const keys = Object.keys(that.state.transcations);
                                    const tmepState = that.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'success',
                                                msg: 'Transaction succeeded'
                                            }
                                            tmepState.toWithdrawNum = '';
                                            tmepState.couldWithdraw = false;
                                            that.setState({ tmepState });

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                that.setState({ tmepState });
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                    setTimeout(() => {
                                        that.getMyBalance();
                                        that.getPoolBankTotalStatus();
                                        that.getUserWithdrawBalance();
                                    }, 3000)
                                    // !!window.ethereum.isImToken
                                    if (!!window.ethereum.isImToken) {
                                        var itemHistory = {
                                            event: 'Withdraw',
                                            title: 'Withdraw ' + str1 + str2 + ' USDC',
                                            transactionHash: ret,
                                            timeStamp: new Date().getTime()
                                        };
                                        var tmphistory = that.state.myHistory;
                                        tmphistory.unshift(itemHistory);
                                        that.setState({
                                            ...that.state,
                                            myHistory: tmphistory
                                        })
                                        var localHistory = JSON.parse(localStorage.getItem(that.state.accountAddress));
                                        localHistory[that.state.netType].history.unshift(itemHistory);
                                        localStorage.setItem(that.state.accountAddress, JSON.stringify(localHistory));
                                    }
                                }
                                if (data && data.status === '0x0') {
                                    clearInterval(timerOBJ[tempRnum]);
                                    const keys = Object.keys(that.state.transcations);
                                    const tmepState = that.state;
                                    keys.map((key) => {
                                        if (tmepState.transcations[key].txhash === ret) {
                                            tmepState.transcations[key] = {
                                                ...tmepState.transcations[key],
                                                class: 'error',
                                                msg: 'Transaction failed'
                                            }
                                            that.setState({ tmepState });

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                that.setState({ tmepState });
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


export const withdrawOptChange = (that, token) => {
    that.setState({
        toWithdraw: token
    }, () => {
        if (!that.state.toWithdrawNum) {
            return;
        }
        withdrawNumChange(that, that.state.toWithdrawNum);
    })
}

export const withdrawNumChange = (that, val) => {
    if (val.length > 20) {
        return;
    }
    if (that.state.toWithdraw === 'DAI') {
        if (Number(val) > 0 && Number(val) <= Number(that.state.myDAIonPoolOrigin)) {
            that.setState({
                errTipsWithdraw: false,
                couldWithdraw: true,
                toWithdrawNum: val
            })
        } else {
            that.setState({
                errTipsWithdraw: true,
                couldWithdraw: false,
                toWithdrawNum: val
            })
            if (val === '' || Number(val) === 0) {
                that.setState({
                    errTipsWithdraw: false,
                    couldWithdraw: false,
                    toWithdrawNum: val
                })
            }
        }
    }
    if (that.state.toWithdraw === 'PAX') {
        if (Number(val) > 0 && Number(val) <= Number(that.state.myPAXonPoolOrigin)) {
            that.setState({
                errTipsWithdraw: false,
                couldWithdraw: true,
                toWithdrawNum: val
            })
        } else {
            that.setState({
                errTipsWithdraw: true,
                couldWithdraw: false,
                toWithdrawNum: val
            })
            if (val === '' || Number(val) === 0) {
                that.setState({
                    errTipsWithdraw: false,
                    couldWithdraw: false,
                    toWithdrawNum: val
                })
            }
        }
    }
    if (that.state.toWithdraw === 'TUSD') {
        if (Number(val) > 0 && Number(val) <= Number(that.state.myTUSDonPoolOrigin)) {
            that.setState({
                errTipsWithdraw: false,
                couldWithdraw: true,
                toWithdrawNum: val
            })
        } else {
            that.setState({
                errTipsWithdraw: true,
                couldWithdraw: false,
                toWithdrawNum: val
            })
            if (val === '' || Number(val) === 0) {
                that.setState({
                    errTipsWithdraw: false,
                    couldWithdraw: false,
                    toWithdrawNum: val
                })
            }
        }
    }
    if (that.state.toWithdraw === 'USDC') {
        if (Number(val) > 0 && Number(val) <= Number(that.state.myUSDConPoolOrigin)) {
            that.setState({
                errTipsWithdraw: false,
                couldWithdraw: true,
                toWithdrawNum: val
            })
        } else {
            that.setState({
                errTipsWithdraw: true,
                couldWithdraw: false,
                toWithdrawNum: val
            })
            if (val === '' || Number(val) === 0) {
                that.setState({
                    errTipsWithdraw: false,
                    couldWithdraw: false,
                    toWithdrawNum: val
                })
            }
        }
    }
}