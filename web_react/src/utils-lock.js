export const lock = (that, token) => {
    const keys = Object.keys(that.state.transcations);
    for (var i = 0; i < keys.length; i++) {
        if (that.state.transcations[keys[i]].title === 'Lock ' + token) {
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
        title: 'Lock ' + token,
    }
    that.setState({ tmepState });

    // witch token to be locked
    if (token === 'DAI') {
        that.contractDAI.approve.estimateGas(
            that.addressPool,
            0,
            {
                from: that.state.accountAddress
            },
            (err, gasLimit) => {
                that.contractDAI.approve.sendTransaction(
                    that.addressPool,
                    0,
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
                                if (tmepState.transcations[key].title === 'Lock ' + token) {
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
                                if (tmepState.transcations[key].title === 'Lock ' + token) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    that.setState({ tmepState });
                                };
                                return false;
                            });

                            var lockDAItimer = setInterval(() => {
                                console.log('i am checking lock DAI...');
                                that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(lockDAItimer);
                                        that.setState({
                                            ...that.state,
                                            approvedDAI: false
                                        });
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
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(lockDAItimer);
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
            0,
            {
                from: that.state.accountAddress
            },
            (err, gasLimit) => {
                that.contractPAX.approve.sendTransaction(
                    that.addressPool,
                    0,
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
                                if (tmepState.transcations[key].title === 'Lock ' + token) {
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
                                if (tmepState.transcations[key].title === 'Lock ' + token) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    that.setState({ tmepState });
                                };
                                return false;
                            });

                            var lockPAXtimer = setInterval(() => {
                                console.log('i am checking lock PAX...');
                                that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(lockPAXtimer);
                                        that.setState({
                                            ...that.state,
                                            approvedPAX: false
                                        });
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
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(lockPAXtimer);
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
            0,
            {
                from: that.state.accountAddress
            },
            (err, gasLimit) => {
                that.contractTUSD.approve.sendTransaction(
                    that.addressPool,
                    0,
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
                                if (tmepState.transcations[key].title === 'Lock ' + token) {
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
                                if (tmepState.transcations[key].title === 'Lock ' + token) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    that.setState({ tmepState });
                                };
                                return false;
                            });

                            var lockTUSDtimer = setInterval(() => {
                                console.log('i am checking lock TUSD...');
                                that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(lockTUSDtimer);
                                        that.setState({
                                            ...that.state,
                                            approvedTUSD: false
                                        });
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
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(lockTUSDtimer);
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
            0,
            {
                from: that.state.accountAddress
            },
            (err, gasLimit) => {
                that.contractUSDC.approve.sendTransaction(
                    that.addressPool,
                    0,
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
                                if (tmepState.transcations[key].title === 'Lock ' + token) {
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
                                if (tmepState.transcations[key].title === 'Lock ' + token) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    that.setState({ tmepState });
                                };
                                return false;
                            });

                            var lockUSDCtimer = setInterval(() => {
                                console.log('i am checking lock USDC...');
                                that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(lockUSDCtimer);
                                        that.setState({
                                            ...that.state,
                                            approvedUSDC: false
                                        });
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
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(lockUSDCtimer);
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
            0,
            {
                from: that.state.accountAddress
            },
            (err, gasLimit) => {
                that.contractDF.approve.sendTransaction(
                    that.addressEngine,
                    0,
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
                                if (tmepState.transcations[key].title === 'Lock ' + token) {
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
                                if (tmepState.transcations[key].title === 'Lock ' + token) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    that.setState({ tmepState });
                                };
                                return false;
                            });

                            var lockDFtimer = setInterval(() => {
                                console.log('i am checking lock DF...');
                                that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(lockDFtimer);
                                        that.setState({
                                            ...that.state,
                                            approvedDF: false
                                        });
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
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(lockDFtimer);
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
            0,
            {
                from: that.state.accountAddress
            },
            (err, gasLimit) => {
                that.contractUSDx.approve.sendTransaction(
                    that.addressEngine,
                    0,
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
                                if (tmepState.transcations[key].title === 'Lock ' + token) {
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
                                if (tmepState.transcations[key].title === 'Lock ' + token) {
                                    tmepState.transcations[key].txhash = ret;
                                    tmepState.transcations[key] = {
                                        ...tmepState.transcations[key],
                                        msg: 'Waiting for confirmation...'
                                    }
                                    that.setState({ tmepState });
                                };
                                return false;
                            });

                            var lockUSDxtimer = setInterval(() => {
                                console.log('i am checking lock USDx...');
                                that.Web3.eth.getTransactionReceipt(ret, (err, data) => {
                                    if (data && data.status === '0x1') {
                                        clearInterval(lockUSDxtimer);
                                        that.setState({
                                            ...that.state,
                                            approvedUSDx: false
                                        });
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
                                    }
                                    if (data && data.status === '0x0') {
                                        clearInterval(lockUSDxtimer);
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