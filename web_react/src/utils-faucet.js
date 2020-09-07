export const allocateTo = (that, token) => {
    console.log(token)
    if (token === 'DAI') {
        allocateToDAI(that);
    }
    if (token === 'PAX') {
        allocateToPAX(that);
    }
    if (token === 'TUSD') {
        allocateToTUSD(that);
    }
    if (token === 'USDC') {
        allocateToUSDC(that);
    }
    if (token === 'DF') {
        allocateToDF(that);
    }
}


const allocateToDAI = (that) => {
    const keys = Object.keys(that.state.transcations);
    for (var i = 0; i < keys.length; i++) {
        if (that.state.transcations[keys[i]].title === 'Allocate DAI') {
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
        title: 'Allocate DAI',
    }
    that.setState({ tmepState });
    // get Limit first
    that.contractDAI.allocateTo.estimateGas(
        that.state.accountAddress,
        that.faucetNum * (10 ** that.state.decimalsDAI),
        {
            from: that.state.accountAddress
        },
        (err, gasLimit) => {
            that.contractDAI.allocateTo.sendTransaction(
                that.state.accountAddress,
                that.faucetNum * (10 ** that.state.decimalsDAI),
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
                            if (tmepState.transcations[key].title === 'Allocate DAI') {
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
                            if (tmepState.transcations[key].title === 'Allocate DAI') {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                that.setState({ tmepState });
                            };
                            return false;
                        });

                        var allocateDAItimer = setInterval(() => {
                            console.log('i am checking Allocate DAI...');
                            that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(allocateDAItimer);
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
                                    setTimeout(() => {
                                        that.getMyBalance();
                                        that.getPoolBankTotalStatus();
                                        that.getUserWithdrawBalance();
                                    }, 3000)
                                }
                                if (data && data.status === '0x0') {
                                    clearInterval(allocateDAItimer);
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
const allocateToPAX = (that) => {
    const keys = Object.keys(that.state.transcations);
    for (var i = 0; i < keys.length; i++) {
        if (that.state.transcations[keys[i]].title === 'Allocate PAX') {
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
        title: 'Allocate PAX',
    }
    that.setState({ tmepState });
    // get Limit first
    that.contractPAX.allocateTo.estimateGas(
        that.state.accountAddress,
        that.faucetNum * (10 ** that.state.decimalsPAX),
        {
            from: that.state.accountAddress,
            gas: that.gasFee
        },
        (err, gasLimit) => {
            that.contractPAX.allocateTo.sendTransaction(
                that.state.accountAddress,
                that.faucetNum * (10 ** that.state.decimalsPAX),
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
                            if (tmepState.transcations[key].title === 'Allocate PAX') {
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
                            if (tmepState.transcations[key].title === 'Allocate PAX') {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                that.setState({ tmepState });
                            };
                            return false;
                        });

                        var allocatePAXtimer = setInterval(() => {
                            console.log('i am checking Allocate PAX...');
                            that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(allocatePAXtimer);
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
                                    setTimeout(() => {
                                        that.getMyBalance();
                                        that.getPoolBankTotalStatus();
                                        that.getUserWithdrawBalance();
                                    }, 3000)
                                }
                                if (data && data.status === '0x0') {
                                    clearInterval(allocatePAXtimer);
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
const allocateToTUSD = (that) => {
    const keys = Object.keys(that.state.transcations);
    for (var i = 0; i < keys.length; i++) {
        if (that.state.transcations[keys[i]].title === 'Allocate TUSD') {
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
        title: 'Allocate TUSD',
    }
    that.setState({ tmepState });
    // get Limit first
    that.contractTUSD.allocateTo.estimateGas(
        that.state.accountAddress,
        that.faucetNum * (10 ** that.state.decimalsTUSD),
        {
            from: that.state.accountAddress
        },
        (err, gasLimit) => {
            that.contractTUSD.allocateTo.sendTransaction(
                that.state.accountAddress,
                that.faucetNum * (10 ** that.state.decimalsTUSD),
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
                            if (tmepState.transcations[key].title === 'Allocate TUSD') {
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
                            if (tmepState.transcations[key].title === 'Allocate TUSD') {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                that.setState({ tmepState });
                            };
                            return false;
                        });

                        var allocateTUSDtimer = setInterval(() => {
                            console.log('i am checking Allocate TUSD...');
                            that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(allocateTUSDtimer);
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
                                    setTimeout(() => {
                                        that.getMyBalance();
                                        that.getPoolBankTotalStatus();
                                        that.getUserWithdrawBalance();
                                    }, 3000)
                                }
                                if (data && data.status === '0x0') {
                                    clearInterval(allocateTUSDtimer);
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
const allocateToUSDC = (that) => {
    const keys = Object.keys(that.state.transcations);
    for (var i = 0; i < keys.length; i++) {
        if (that.state.transcations[keys[i]].title === 'Allocate USDC') {
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
        title: 'Allocate USDC',
    }
    that.setState({ tmepState });
    // get Limit first
    that.contractUSDC.allocateTo.estimateGas(
        that.state.accountAddress,
        that.faucetNum * (10 ** that.state.decimalsUSDC),
        {
            from: that.state.accountAddress
        },
        (err, gasLimit) => {
            that.contractUSDC.allocateTo.sendTransaction(
                that.state.accountAddress,
                that.faucetNum * (10 ** that.state.decimalsUSDC),
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
                            if (tmepState.transcations[key].title === 'Allocate USDC') {
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
                            if (tmepState.transcations[key].title === 'Allocate USDC') {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                that.setState({ tmepState });
                            };
                            return false;
                        });

                        var allocateUSDCtimer = setInterval(() => {
                            console.log('i am checking Allocate USDC...');
                            that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(allocateUSDCtimer);
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
                                    setTimeout(() => {
                                        that.getMyBalance();
                                        that.getPoolBankTotalStatus();
                                        that.getUserWithdrawBalance();
                                    }, 3000)
                                }
                                if (data && data.status === '0x0') {
                                    clearInterval(allocateUSDCtimer);
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
const allocateToDF = (that) => {
    const keys = Object.keys(that.state.transcations);
    for (var i = 0; i < keys.length; i++) {
        if (that.state.transcations[keys[i]].title === 'Allocate DF') {
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
        title: 'Allocate DF',
    }
    that.setState({ tmepState });
    // get Limit first
    that.contractDF.allocateTo.estimateGas(
        that.state.accountAddress,
        that.faucetNum * (10 ** that.state.decimalsDF),
        {
            from: that.state.accountAddress
        },
        (err, gasLimit) => {
            that.contractDF.allocateTo.sendTransaction(
                that.state.accountAddress,
                that.faucetNum * (10 ** that.state.decimalsDF),
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
                            if (tmepState.transcations[key].title === 'Allocate DF') {
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
                            if (tmepState.transcations[key].title === 'Allocate DF') {
                                tmepState.transcations[key].txhash = ret;
                                tmepState.transcations[key] = {
                                    ...tmepState.transcations[key],
                                    msg: 'Waiting for confirmation...'
                                }
                                that.setState({ tmepState });
                            };
                            return false;
                        });

                        var allocateDFtimer = setInterval(() => {
                            console.log('i am checking Allocate DF...');
                            that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                if (data && data.status === '0x1') {
                                    clearInterval(allocateDFtimer);
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
                                    setTimeout(() => {
                                        that.getMyBalance();
                                        that.getPoolBankTotalStatus();
                                        that.getUserWithdrawBalance();
                                    }, 3000)
                                }
                                if (data && data.status === '0x0') {
                                    clearInterval(allocateDFtimer);
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