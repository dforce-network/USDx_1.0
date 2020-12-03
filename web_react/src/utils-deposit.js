import Cookie from 'react-cookies';



export const deposit = (that) => {
    if (!that.state.couldDeposit) {
        return;
    }
    var addr;
    var num;
    if (that.state.toDeposit === 'DAI') {
        addr = that.addressDAI;
        num = that.Web3.toBigNumber(that.state.toDepositNum).mul(that.Web3.toBigNumber(10 ** that.state.decimalsDAI));
        depositDAI(that, addr, num);
    } else if (that.state.toDeposit === 'PAX') {
        addr = that.addressPAX;
        num = that.Web3.toBigNumber(that.state.toDepositNum).mul(that.Web3.toBigNumber(10 ** that.state.decimalsPAX));
        depositPAX(that, addr, num);
    } else if (that.state.toDeposit === 'TUSD') {
        addr = that.addressTUSD;
        num = that.Web3.toBigNumber(that.state.toDepositNum).mul(that.Web3.toBigNumber(10 ** that.state.decimalsTUSD));
        depositTUSD(that, addr, num);
    } else if (that.state.toDeposit === 'USDC') {
        addr = that.addressUSDC;
        num = that.Web3.toBigNumber(that.state.toDepositNum).mul(that.Web3.toBigNumber(10 ** that.state.decimalsUSDC));
        depositUSDC(that, addr, num);
    }
}

const depositDAI = (that, addr, num) => {
    if (!that.state.approvedDAI) {
        that.setState({
            fromDepositDAI: true
        });
        approve(that, 'DAI');
        return;
    }
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
        title: 'Deposit ' + str1 + str2 + ' DAI',
    }
    that.setState({ tmepState });
    // get Limit first
    that.contractProtocol.deposit.estimateGas(
        addr,
        0,
        num,
        {
            from: that.state.accountAddress
        },
        (err, gasLimit) => {
            // console.log(err, gasLimit);
            that.contractProtocol.deposit.sendTransaction(
                addr,
                0,
                num,
                {
                    from: that.state.accountAddress,
                    gas: Math.ceil(gasLimit * 1.2),
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
                            console.log('i am checking deposit DAI... =>' + tempRnum);
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
                                            tmepState.toDepositNum = '';
                                            tmepState.couldDeposit = false;
                                            tmepState.maxGenerateUSDx = '';
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
                                            event: 'Deposit',
                                            title: 'Deposit ' + str1 + str2 + ' DAI',
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
const depositPAX = (that, addr, num) => {
    if (!that.state.approvedPAX) {
        that.setState({
            fromDepositPAX: true
        });
        approve(that, 'PAX');
        return;
    }
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
        title: 'Deposit ' + str1 + str2 + ' PAX',
    }
    that.setState({ tmepState });
    // get Limit first
    that.contractProtocol.deposit.estimateGas(
        addr,
        0,
        that.state.wanna_to_deposit__max ? that.state.wanna_to_deposit : num,
        {
            from: that.state.accountAddress
        },
        (err, gasLimit) => {
            that.contractProtocol.deposit.sendTransaction(
                addr,
                0,
                that.state.wanna_to_deposit__max ? that.state.wanna_to_deposit : num,
                {
                    from: that.state.accountAddress,
                    gas: Math.ceil(gasLimit * 1.2),
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
                            console.log('i am checking deposit PAX... =>' + tempRnum);
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
                                            tmepState.toDepositNum = '';
                                            tmepState.couldDeposit = false;
                                            tmepState.maxGenerateUSDx = '';
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
                                            event: 'Deposit',
                                            title: 'Deposit ' + str1 + str2 + ' PAX',
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
const depositTUSD = (that, addr, num) => {
    if (!that.state.approvedTUSD) {
        that.setState({
            fromDepositTUSD: true
        });
        approve(that, 'TUSD');
        return;
    }
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
        title: 'Deposit ' + str1 + str2 + ' TUSD',
    }
    that.setState({ tmepState });
    // get Limit first
    that.contractProtocol.deposit.estimateGas(
        addr,
        0,
        that.state.wanna_to_deposit__max ? that.state.wanna_to_deposit : num,
        {
            from: that.state.accountAddress
        },
        (err, gasLimit) => {
            that.contractProtocol.deposit.sendTransaction(
                addr,
                0,
                that.state.wanna_to_deposit__max ? that.state.wanna_to_deposit : num,
                {
                    from: that.state.accountAddress,
                    gas: Math.ceil(gasLimit * 1.2),
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
                            console.log('i am checking deposit TUSD... =>' + tempRnum);
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
                                            tmepState.toDepositNum = '';
                                            tmepState.couldDeposit = false;
                                            tmepState.maxGenerateUSDx = '';
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
                                            event: 'Deposit',
                                            title: 'Deposit ' + str1 + str2 + ' TUSD',
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
const depositUSDC = (that, addr, num) => {
    if (!that.state.approvedUSDC) {
        that.setState({
            fromDepositUSDC: true
        });
        approve(that, 'USDC');
        return;
    }
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
        title: 'Deposit ' + str1 + str2 + ' USDC',
    }
    that.setState({ tmepState });
    // get Limit first
    that.contractProtocol.deposit.estimateGas(
        addr,
        0,
        that.state.wanna_to_deposit__max ? that.state.wanna_to_deposit : num,
        {
            from: that.state.accountAddress
        },
        (err, gasLimit) => {
            that.contractProtocol.deposit.sendTransaction(
                addr,
                0,
                that.state.wanna_to_deposit__max ? that.state.wanna_to_deposit : num,
                {
                    from: that.state.accountAddress,
                    gas: Math.ceil(gasLimit * 1.2),
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
                            console.log('i am checking deposit USDC... =>' + tempRnum);
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
                                            tmepState.toDepositNum = '';
                                            tmepState.couldDeposit = false;
                                            tmepState.maxGenerateUSDx = '';
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
                                            event: 'Deposit',
                                            title: 'Deposit ' + str1 + str2 + ' USDC',
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




export const approve = (that, token) => {
    if (!that.state.isConnected) {
        return;
    }

    Cookie.save('curAccount', that.state.accountAddress, { path: '/' });

    const keys = Object.keys(that.state.transcations);
    for (var i = 0; i < keys.length; i++) {
        if (that.state.transcations[keys[i]].title === 'Approve ' + token) {
            return;
        }
    }

    const id = Math.random();
    const msg = 'Waiting for transaction signature...';
    const tmepState = that.state;
    tmepState.transcations[id] = {
        id: id,
        msg: msg,
        class: 'inprocess',
        title: 'Approve ' + token
    }
    that.setState({ tmepState });

    // witch token to be approved
    if (token === 'DAI') {
        that.contractDAI.approve.estimateGas(
            that.addressPool,
            -1,
            {
                from: that.state.accountAddress
            },
            (err, gasLimit) => {
                that.contractDAI.approve.sendTransaction(
                    that.addressPool,
                    -1,
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
                                if (tmepState.transcations[key].title === 'Approve ' + token) {
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
                                if (tmepState.transcations[key].title === 'Approve ' + token) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    that.setState({ tmepState });
                                };
                                return false;
                            });

                            var approveDAItimer = setInterval(() => {
                                console.log('i am checking approve DAI...');
                                that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(approveDAItimer);
                                        if (Cookie.load('curAccount') === that.state.accountAddress) {
                                            that.setState({
                                                ...that.state,
                                                approvedDAI: true
                                            });
                                        }
                                        const keys = Object.keys(that.state.transcations);
                                        const tmepState = that.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                that.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    that.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        if (that.state.fromDepositDAI) {
                                            if (Cookie.load('curAccount') === that.state.accountAddress) {
                                                that.setState({
                                                    ...that.state,
                                                    fromDepositDAI: false
                                                });
                                                setTimeout(() => {
                                                    that.deposit();
                                                }, 4000)
                                            } else {
                                                return false;
                                            }
                                        }
                                        if (that.state.fromGenerateMax) {
                                            if (Cookie.load('curAccount') === that.state.accountAddress) {
                                                that.setState({
                                                    ...that.state,
                                                    fromGenerateMax: false
                                                });
                                                setTimeout(() => {
                                                    that.toGenerateMax(that.state.toGenerateMaxNum);
                                                }, 4000)
                                            } else {
                                                return false;
                                            }
                                        }
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(approveDAItimer);
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
                );
            }
        )
    } else if (token === 'PAX') {
        that.contractPAX.approve.estimateGas(
            that.addressPool,
            -1,
            {
                from: that.state.accountAddress
            },
            (err, gasLimit) => {
                that.contractPAX.approve.sendTransaction(
                    that.addressPool,
                    -1,
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
                                if (tmepState.transcations[key].title === 'Approve ' + token) {
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
                                if (tmepState.transcations[key].title === 'Approve ' + token) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    that.setState({ tmepState });
                                };
                                return false;
                            });

                            var approvePAXtimer = setInterval(() => {
                                console.log('i am checking approve PAX...');
                                that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(approvePAXtimer);
                                        if (Cookie.load('curAccount') === that.state.accountAddress) {
                                            that.setState({
                                                ...that.state,
                                                approvedPAX: true
                                            });
                                        }
                                        const keys = Object.keys(that.state.transcations);
                                        const tmepState = that.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                that.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    that.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        if (that.state.fromDepositPAX) {
                                            if (Cookie.load('curAccount') === that.state.accountAddress) {
                                                that.setState({
                                                    ...that.state,
                                                    fromDepositPAX: false
                                                });
                                                setTimeout(() => {
                                                    that.deposit();
                                                }, 4000)
                                            } else {
                                                return false;
                                            }
                                        }
                                        if (that.state.fromGenerateMax) {
                                            if (Cookie.load('curAccount') === that.state.accountAddress) {
                                                that.setState({
                                                    ...that.state,
                                                    fromGenerateMax: false
                                                });
                                                setTimeout(() => {
                                                    that.toGenerateMax(that.state.toGenerateMaxNum);
                                                }, 4000)
                                            } else {
                                                return false;
                                            }
                                        }
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(approvePAXtimer);
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
                );
            }
        )
    } else if (token === 'TUSD') {
        that.contractTUSD.approve.estimateGas(
            that.addressPool,
            -1,
            {
                from: that.state.accountAddress
            },
            (err, gasLimit) => {
                that.contractTUSD.approve.sendTransaction(
                    that.addressPool,
                    -1,
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
                                if (tmepState.transcations[key].title === 'Approve ' + token) {
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
                                if (tmepState.transcations[key].title === 'Approve ' + token) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    that.setState({ tmepState });
                                };
                                return false;
                            });

                            var approveTUSDtimer = setInterval(() => {
                                console.log('i am checking approve TUSD...');
                                that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(approveTUSDtimer);
                                        if (Cookie.load('curAccount') === that.state.accountAddress) {
                                            that.setState({
                                                ...that.state,
                                                approvedTUSD: true
                                            });
                                        }
                                        const keys = Object.keys(that.state.transcations);
                                        const tmepState = that.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                that.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    that.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        if (that.state.fromDepositTUSD) {
                                            if (Cookie.load('curAccount') === that.state.accountAddress) {
                                                that.setState({
                                                    ...that.state,
                                                    fromDepositTUSD: false
                                                });
                                                setTimeout(() => {
                                                    that.deposit();
                                                }, 4000)
                                            } else {
                                                return false;
                                            }
                                        }
                                        if (that.state.fromGenerateMax) {
                                            if (Cookie.load('curAccount') === that.state.accountAddress) {
                                                that.setState({
                                                    ...that.state,
                                                    fromGenerateMax: false
                                                });
                                                setTimeout(() => {
                                                    that.toGenerateMax(that.state.toGenerateMaxNum);
                                                }, 4000)
                                            } else {
                                                return false;
                                            }
                                        }
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(approveTUSDtimer);
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
                );
            }
        )
    } else if (token === 'USDC') {
        that.contractUSDC.approve.estimateGas(
            that.addressPool,
            -1,
            {
                from: that.state.accountAddress
            },
            (err, gasLimit) => {
                that.contractUSDC.approve.sendTransaction(
                    that.addressPool,
                    -1,
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
                                if (tmepState.transcations[key].title === 'Approve ' + token) {
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
                                if (tmepState.transcations[key].title === 'Approve ' + token) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    that.setState({ tmepState });
                                };
                                return false;
                            });

                            var approveUSDCtimer = setInterval(() => {
                                console.log('i am checking approve USDC...');
                                that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(approveUSDCtimer);
                                        if (Cookie.load('curAccount') === that.state.accountAddress) {
                                            that.setState({
                                                ...that.state,
                                                approvedUSDC: true
                                            });
                                        }
                                        const keys = Object.keys(that.state.transcations);
                                        const tmepState = that.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                that.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    that.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        if (that.state.fromDepositUSDC) {
                                            if (Cookie.load('curAccount') === that.state.accountAddress) {
                                                that.setState({
                                                    ...that.state,
                                                    fromDepositUSDC: false
                                                });
                                                setTimeout(() => {
                                                    that.deposit();
                                                }, 4000)
                                            } else {
                                                return false;
                                            }
                                        }
                                        if (that.state.fromGenerateMax) {
                                            if (Cookie.load('curAccount') === that.state.accountAddress) {
                                                that.setState({
                                                    ...that.state,
                                                    fromGenerateMax: false
                                                });
                                                setTimeout(() => {
                                                    that.toGenerateMax(that.state.toGenerateMaxNum);
                                                }, 4000)
                                            } else {
                                                return false;
                                            }
                                        }
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(approveUSDCtimer);
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
                );
            }
        )
    } else if (token === 'DF') {
        that.contractDF.approve.estimateGas(
            that.addressEngine,
            -1,
            {
                from: that.state.accountAddress
            },
            (err, gasLimit) => {
                that.contractDF.approve.sendTransaction(
                    that.addressEngine,
                    -1,
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
                                if (tmepState.transcations[key].title === 'Approve ' + token) {
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
                                if (tmepState.transcations[key].title === 'Approve ' + token) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    that.setState({ tmepState });
                                };
                                return false;
                            });

                            var approveDFtimer = setInterval(() => {
                                console.log('i am checking approve DF...');
                                that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(approveDFtimer);
                                        if (Cookie.load('curAccount') === that.state.accountAddress) {
                                            that.setState({
                                                ...that.state,
                                                approvedDF: true
                                            });
                                        }
                                        const keys = Object.keys(that.state.transcations);
                                        const tmepState = that.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                that.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    that.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        if (that.state.fromDestroy1) {
                                            if (Cookie.load('curAccount') === that.state.accountAddress) {
                                                that.setState({
                                                    ...that.state,
                                                    fromDestroy1: false
                                                });
                                                setTimeout(() => {
                                                    that.destroy();
                                                }, 4000)
                                            } else {
                                                return false;
                                            }
                                        }
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(approveDFtimer);
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
                );
            }
        )
    } else if (token === 'USDx') {
        that.contractUSDx.approve.estimateGas(
            that.addressEngine,
            -1,
            {
                from: that.state.accountAddress
            },
            (err, gasLimit) => {
                that.contractUSDx.approve.sendTransaction(
                    that.addressEngine,
                    -1,
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
                                if (tmepState.transcations[key].title === 'Approve ' + token) {
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
                                if (tmepState.transcations[key].title === 'Approve ' + token) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    that.setState({ tmepState });
                                };
                                return false;
                            });

                            var approveUSDxtimer = setInterval(() => {
                                console.log('i am checking approve USDx...');
                                that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(approveUSDxtimer);
                                        if (Cookie.load('curAccount') === that.state.accountAddress) {
                                            that.setState({
                                                ...that.state,
                                                approvedUSDx: true
                                            });
                                        }
                                        const keys = Object.keys(that.state.transcations);
                                        const tmepState = that.state;
                                        keys.map((key) => {
                                            if (tmepState.transcations[key].txhash === ret) {
                                                tmepState.transcations[key] = {
                                                    ...tmepState.transcations[key],
                                                    class: 'success',
                                                    msg: 'Transaction succeeded'
                                                }
                                                that.setState({ tmepState });

                                                setTimeout(() => {
                                                    delete tmepState.transcations[key];
                                                    that.setState({ tmepState });
                                                }, 3000);
                                            };
                                            return false;
                                        })
                                        if (that.state.fromDestroy2) {
                                            if (Cookie.load('curAccount') === that.state.accountAddress) {
                                                that.setState({
                                                    ...that.state,
                                                    fromDestroy2: false
                                                });
                                                setTimeout(() => {
                                                    that.destroy();
                                                }, 4000)
                                            } else {
                                                return false;
                                            }
                                        }
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(approveUSDxtimer);
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
                );
            }
        )
    }
}


export const destroy = (that) => {
    if (!that.state.couldDestroy) {
        return;
    }

    if (!that.state.approvedDF) {
        that.setState({
            fromDestroy1: true
        });
        approve(that, 'DF');
        return;
    }

    if (!that.state.approvedUSDx) {
        that.setState({
            fromDestroy2: true
        });
        approve(that, 'USDx');
        return;
    }

    const id = Math.random();
    const msg = 'Waiting for transaction signature...';
    const tmepState = that.state;
    var str1;
    var str2;
    if (that.state.toDestroyNum.indexOf('.') > 0) {
        str1 = that.toThousands(that.state.toDestroyNum.split('.')[0]);
        str2 = '.' + that.state.toDestroyNum.split('.')[1];
    } else {
        str1 = that.toThousands(that.state.toDestroyNum);
        str2 = '';
    }
    tmepState.transcations[id] = {
        id: id,
        msg: msg,
        class: 'inprocess',
        title: 'Reconvert ' + str1 + str2 + ' USDx',
    }
    that.setState({ tmepState });
    that.contractProtocol.destroy.estimateGas(
        0,
        that.Web3.toBigNumber(that.state.toDestroyNum).mul(that.Web3.toBigNumber(10 ** 18)),
        {
            from: that.state.accountAddress
        },
        (err, gasLimit) => {
            that.contractProtocol.destroy.sendTransaction(
                0,
                that.Web3.toBigNumber(that.state.toDestroyNum).mul(that.Web3.toBigNumber(10 ** 18)),
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
                            console.log('i am checking Reconvert USDx... =>' + tempRnum);
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
                                            tmepState.toDestroyNum = '';
                                            tmepState.couldDestroy = false;
                                            tmepState.USDxToDAI = tmepState.USDxToPAX = tmepState.USDxToTUSD = tmepState.USDxToUSDC = '';
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
                                            event: 'Destroy',
                                            title: 'Destroy ' + str1 + str2 + ' USDx',
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


export const toGenerateMax = (that, BN) => {
    that.setState({
        toGenerateMaxNum: BN,
        isMintting: true
    });

    if (!that.state.approvedDAI) {
        that.setState({
            fromGenerateMax: true
        });
        approve(that, 'DAI');
        return;
    }
    if (!that.state.approvedPAX) {
        that.setState({
            fromGenerateMax: true
        });
        approve(that, 'PAX');
        return;
    }
    if (!that.state.approvedTUSD) {
        that.setState({
            fromGenerateMax: true
        });
        approve(that, 'TUSD');
        return;
    }
    if (!that.state.approvedUSDC) {
        that.setState({
            fromGenerateMax: true
        });
        approve(that, 'USDC');
        return;
    }

    const id = Math.random();
    const msg = 'Waiting for transaction signature...';
    const tmepState = that.state;
    tmepState.transcations[id] = {
        id: id,
        msg: msg,
        class: 'inprocess',
        title: 'Mintage ' + that.toThousands(BN.toString(10)) + ' USDx',
    }
    that.setState({ tmepState });
    // get Limit first
    that.contractProtocol.oneClickMinting.estimateGas(
        0,
        BN.mul(that.Web3.toBigNumber(10 ** 18)),
        {
            from: that.state.accountAddress
        },
        (err, gasLimit) => {
            // console.log('0000000000000000',err,  BN.mul(that.Web3.toBigNumber(10 ** 18)), gasLimit, that.state.gasPrice)
            that.contractProtocol.oneClickMinting.sendTransaction(
                0,
                BN.mul(that.Web3.toBigNumber(10 ** 18)),
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
                            console.log('i am checking oneClickMinting... =>' + tempRnum);
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
                                            that.setState({ tmepState });

                                            setTimeout(() => {
                                                delete tmepState.transcations[key];
                                                that.setState({ tmepState });
                                            }, 3000);
                                        };
                                        return false;
                                    })
                                    that.setState({
                                        ...that.state,
                                        showOnestep: false,
                                        isMintting: false
                                    });
                                    setTimeout(() => {
                                        that.getMyBalance();
                                        that.getPoolBankTotalStatus();
                                        that.getUserWithdrawBalance();
                                        that.getMaxNumToGenerateOnestep();
                                    }, 3000)
                                    // !!window.ethereum.isImToken
                                    if (!!window.ethereum.isImToken) {
                                        var itemHistory = {
                                            event: 'OneClickMinting',
                                            title: 'Mint ' + that.toThousands(BN.toString(10)) + ' USDx',
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