export const claim = (that) => {
    const id = Math.random();
    const msg = 'Waiting for transaction signature...';
    const tmepState = that.state;
    tmepState.transcations[id] = {
        id: id,
        msg: msg,
        class: 'inprocess',
        title: 'CLAIM USDx',
    }
    that.setState({ tmepState });
    // get Limit first
    that.contractProtocol.claim.estimateGas(
        0,
        {
            from: that.state.accountAddress
        },
        (err, gasLimit) => {
            that.contractProtocol.claim.sendTransaction(
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
                            console.log('i am checking claim USDx... =>' + tempRnum);
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
                                    setTimeout(() => {
                                        that.getMyBalance();
                                        that.getPoolBankTotalStatus();
                                        that.getUserWithdrawBalance();
                                    }, 3000)
                                    // !!window.ethereum.isImToken
                                    if (!!window.ethereum.isImToken) {
                                        var itemHistory = {
                                            event: 'Claim',
                                            title: 'Claim USDx',
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