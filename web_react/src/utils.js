export const click__redeem_max=(that)=>{
    // console.log(that.state.myUSDx);
    // console.log(that.state.myUSDx__origin.toString(10));

    that.destroyNumChange(that.state.myUSDx);
}


export const click__mint_max = (that) => {
    console.log(that.state.toDeposit);
    console.log(that.state.toDepositNum);
    if (that.state.toDeposit === 'PAX') {
        console.log(that.state.myPAX__origin.toString(10));
        that.setState({
            couldDeposit: true,
            toDepositNum: that.formatNumber(that.state.myPAX__origin, 'PAX'),
            wanna_to_deposit__max: true,
            wanna_to_deposit: that.state.myPAX__origin,
        })
    }
    if (that.state.toDeposit === 'TUSD') {
        console.log(that.state.myTUSD__origin.toString(10));
        that.setState({
            couldDeposit: true,
            toDepositNum: that.formatNumber(that.state.myTUSD__origin, 'TUSD'),
            wanna_to_deposit__max: true,
            wanna_to_deposit: that.state.myTUSD__origin,
        })
    }
    if (that.state.toDeposit === 'USDC') {
        console.log(that.state.myUSDC__origin.toString(10));
        that.setState({
            couldDeposit: true,
            toDepositNum: that.formatNumber(that.state.myUSDC__origin, 'USDC'),
            wanna_to_deposit__max: true,
            wanna_to_deposit: that.state.myUSDC__origin,
        })
    }
}


export const change__deposite_to_usr = (that, value, cur_decimals = 18) => {
    if (!that.state.approved_to_usr) {
        return false;
    }

    if (!value || Number(value) === 0) {
        return that.setState({
            value__deposit_to_usr: '',
            value__deposit_to_usr__bn: '',
            enable__deposite_to_usr: false,
        })
    }

    var amount_bn;
    var temp_value = value;
    if (temp_value.indexOf('.') > 0) {
        var sub_num = temp_value.length - temp_value.indexOf('.') - 1;
        temp_value = temp_value.substr(0, temp_value.indexOf('.')) + temp_value.substr(value.indexOf('.') + 1);
        amount_bn = that.bn(temp_value).mul(that.bn(10 ** (cur_decimals - sub_num)));
    } else {
        amount_bn = that.bn(value).mul(that.bn(10 ** cur_decimals));
    }

    that.setState({
        value__deposit_to_usr: value,
        value__deposit_to_usr__bn: amount_bn,
        enable__deposite_to_usr: true,
    }, () => {
        // console.log(value, amount_bn.toString(10));
        console.log(amount_bn.gt(that.state.myUSDx__origin));

        if (amount_bn.gt(that.state.myUSDx__origin)) {
            click__max__deposite_to_usr(that);
        }
    })
}


export const click__max__deposite_to_usr = (that) => {
    if (!that.state.approved_to_usr) {
        return false;
    }
    console.log('max');
    that.setState({
        value__deposit_to_usr: format_bn(that.state.myUSDx__origin.toString(10), 18, 2),
        value__deposit_to_usr__bn: that.state.myUSDx__origin,
        enable__deposite_to_usr: true,
    })
}


export const format_bn = (numStr, decimals, decimalPlace = decimals) => {
    numStr = numStr.toLocaleString().replace(/,/g, '');
    // decimals = decimals.toString();

    // var str = (10 ** decimals).toLocaleString().replace(/,/g, '').slice(1);
    var str = Number(`1e+${decimals}`).toLocaleString().replace(/,/g, '').slice(1);

    var res = (numStr.length > decimals ?
        numStr.slice(0, numStr.length - decimals) + '.' + numStr.slice(numStr.length - decimals) :
        '0.' + str.slice(0, str.length - numStr.length) + numStr).replace(/(0+)$/g, "");

    res = res.slice(-1) === '.' ? res + '00' : res;

    if (decimalPlace === 0)
        return res.slice(0, res.indexOf('.'));

    var length = res.indexOf('.') + 1 + decimalPlace;
    return res.slice(0, length >= res.length ? res.length : length);
    // return res.slice(-1) == '.' ? res + '00' : res;
}


export const click__deposite_to_usr = (that,) => {
    var num = that.state.value__deposit_to_usr__bn;
    var str1;
    var str2;

    if (num.div(10 ** 18).toString(10).indexOf('.') > 0) {
        str1 = that.toThousands(num.div(10 ** 18).toString(10).split('.')[0]);
        str2 = '.' + num.div(10 ** 18).toString(10).split('.')[1];
    } else {
        str1 = that.toThousands(num.div(10 ** 18).toString(10));
        str2 = '.00';
    }
    const id = Math.random();
    const msg = 'Waiting for transaction signature...';
    const tmepState = that.state;
    tmepState.transcations[id] = {
        id: id,
        msg: msg,
        class: 'inprocess',
        title: 'Deposit ' + str1 + str2 + ' USDx',
    }
    that.setState({ tmepState });
    // get Limit first
    that.contract_USR.mint.estimateGas(that.state.accountAddress, num, { from: that.state.accountAddress }, (err, gasLimit) => {
        // console.log(err, gasLimit);
        that.contract_USR.mint.sendTransaction(that.state.accountAddress, num,
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
                        console.log('checking deposit USDx to USR... =>' + tempRnum);
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

                                // !!window.ethereum.isImToken
                                var itemHistory = {
                                    event: 'Deposit-usr',
                                    title: 'Deposit ' + str1 + str2 + ' USDx',
                                    transactionHash: ret,
                                    timeStamp: new Date().getTime(),
                                    title_num: str1 + str2,
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


export const click__deposite_to_usr__approve = (that, token = 'USDx') => {
    let max_num = that.bn(2).pow(that.bn(256)).sub(that.bn(1));

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

    that.contractUSDx.approve.estimateGas(that.addressUSR, max_num, {
        from: that.state.accountAddress
    }, (err, gasLimit) => {
        that.contractUSDx.approve.sendTransaction(
            that.addressUSR,
            max_num,
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
                                that.setState({
                                    approved_to_usr: true
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


export const get_tokens_status_apy = (that) => {
    let url_apy = "https://usr.dforce.network/api/v1/baseInfo/";

    fetch(url_apy).then(res => res.text())
        .then((data) => {
            if (!(data && Object.keys(data).length > 0)) {
                return console.log('no data return...');
            }

            data = JSON.parse(data);
            // console.log(data)

            that.setState({
                token_apy: data.apy,
            })
        })
        .catch(err => {
            console.log(err)
        })
}


export const format_num_to_K = (str_num) => {
    var part_a = str_num.split('.')[0];
    var part_b = str_num.split('.')[1];

    var reg = /\d{1,3}(?=(\d{3})+$)/g;
    part_a = (part_a + '').replace(reg, '$&,');

    return part_a + '.' + part_b;
}


// *****  *****  *****  *****  *****  *****  *****  *****  *****  *****  ***** 

export const getDecimals = (that) => {
    that.contractDAI.decimals.call((err, ret) => {
        that.setState({
            decimalsDAI: ret.toFixed()
        })
    })
    that.contractPAX.decimals.call((err, ret) => {
        that.setState({
            decimalsPAX: ret.toFixed()
        })
    })
    that.contractTUSD.decimals.call((err, ret) => {
        that.setState({
            decimalsTUSD: ret.toFixed()
        })
    })
    that.contractUSDC.decimals.call((err, ret) => {
        that.setState({
            decimalsUSDC: ret.toFixed()
        })
    })
    that.contractUSDx.decimals.call((err, ret) => {
        that.setState({
            decimalsUSDx: ret.toFixed()
        })
    })
    that.contractDF.decimals.call((err, ret) => {
        that.setState({
            decimalsDF: ret.toFixed()
        })
    })

    setTimeout(() => {
        getTokenSection(that);
        getTokenBurningSection(that);
    }, 2000);
}


const getTokenSection = (that) => {
    that.contractProtocolView.getMintingSection.call((err, ret) => {
        if (ret) {
            var addressArry = ret[0];
            var secArry = ret[1];
            that.tatolSection = 0;

            for (let i = 0; i < addressArry.length; i++) {
                if (addressArry[i].toLowerCase() === that.addressDAI) {
                    that.sectionDAI = secArry[i].div(10 ** 18).toFixed();
                    that.tatolSection = Number(that.tatolSection) + Number(that.sectionDAI);
                    that.setState({
                        ...that.state,
                        sectionDAI: that.sectionDAI,
                        tatolSection: that.tatolSection
                    })
                }
                if (addressArry[i].toLowerCase() === that.addressPAX) {
                    that.sectionPAX = secArry[i].div(10 ** 18).toFixed();
                    that.tatolSection = Number(that.tatolSection) + Number(that.sectionPAX);
                    that.setState({
                        ...that.state,
                        sectionPAX: that.sectionPAX,
                        tatolSection: that.tatolSection
                    })
                }
                if (addressArry[i].toLowerCase() === that.addressUSDC) {
                    that.sectionUSDC = secArry[i].div(10 ** 18).toFixed();
                    that.tatolSection = Number(that.tatolSection) + Number(that.sectionUSDC);
                    that.setState({
                        ...that.state,
                        sectionUSDC: that.sectionUSDC,
                        tatolSection: that.tatolSection
                    })
                }
                if (addressArry[i].toLowerCase() === that.addressTUSD) {
                    that.sectionTUSD = secArry[i].div(10 ** 18).toFixed();
                    that.tatolSection = Number(that.tatolSection) + Number(that.sectionTUSD);
                    that.setState({
                        ...that.state,
                        sectionTUSD: that.sectionTUSD,
                        tatolSection: that.tatolSection
                    })
                }
            }
        }
    })
}
const getTokenBurningSection = (that) => {
    that.tatolSectionBurning = 0;
    that.contractProtocolView.getBurningSection.call((err, ret) => {
        if (ret) {
            var addrArry = ret[0];
            var sectionArry = ret[1];

            for (let i = 0; i < addrArry.length; i++) {
                if (addrArry[i].toLowerCase() === that.addressDAI) {
                    that.sectionDAIBurning = sectionArry[i].div(10 ** 16).toFixed();
                    that.tatolSectionBurning = Number(that.tatolSectionBurning) + Number(that.sectionDAIBurning);
                    that.setState({
                        ...that.state,
                        sectionDAIBurning: that.sectionDAIBurning,
                        tatolSectionBurning: that.tatolSectionBurning
                    })
                }
                if (addrArry[i].toLowerCase() === that.addressPAX) {
                    that.sectionPAXBurning = sectionArry[i].div(10 ** 16).toFixed();
                    that.tatolSectionBurning = Number(that.tatolSectionBurning) + Number(that.sectionPAXBurning);
                    that.setState({
                        ...that.state,
                        sectionPAXBurning: that.sectionPAXBurning,
                        tatolSectionBurning: that.tatolSectionBurning
                    })
                }
                if (addrArry[i].toLowerCase() === that.addressTUSD) {
                    that.sectionTUSDBurning = sectionArry[i].div(10 ** 16).toFixed();
                    that.tatolSectionBurning = Number(that.tatolSectionBurning) + Number(that.sectionTUSDBurning);
                    that.setState({
                        ...that.state,
                        sectionTUSDBurning: that.sectionTUSDBurning,
                        tatolSectionBurning: that.tatolSectionBurning
                    })
                }
                if (addrArry[i].toLowerCase() === that.addressUSDC) {
                    that.sectionUSDCBurning = sectionArry[i].div(10 ** 16).toFixed();
                    that.tatolSectionBurning = Number(that.tatolSectionBurning) + Number(that.sectionUSDCBurning);
                    that.setState({
                        ...that.state,
                        sectionUSDCBurning: that.sectionUSDCBurning,
                        tatolSectionBurning: that.tatolSectionBurning
                    })
                }
            }
        }
    })
}