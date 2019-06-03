// Libraries
import React from "react";


class Item extends React.Component {
    displayName = "Item";

    hideNotification = () => {
        console.log(this.props.id);
        this.props.hideNotification(this.props.id);
    }

    openNewTab = (hash) => {
        if (this.props.netType === 'Main') {
            window.open("https://etherscan.io/tx/" + hash);
        } else {
            window.open("https://" + this.props.netType.toLowerCase() + ".etherscan.io/tx/" + hash);
        }
    }

    render() {
        return (
            React.createElement("div", { className: 'colItem col-' + this.props.classNames },
                React.createElement("button", { className: "close-box", onClick: this.hideNotification }),
                React.createElement("h3", { className: "notification-headline" }, this.props.title),
                // React.createElement("div", { className: "notification-text" }, this.props.msg)
                React.createElement("div", { className: "notification-text" },
                    React.createElement("span", { className: "notification-text" }, this.props.msg),
                    this.props.txhash ?
                        React.createElement("a", { className: "notification-a", onClick: () => {this.openNewTab(this.props.txhash)}}, 'Tx-hash')
                        :
                        null
                )
            )
        )
    }
};


export default class Notify extends React.Component {
    displayName = "Notify";
    key = 0;

    constructor(props) {
        super(props);
        this.state = {};
    }

    hideNotification = (id) => {
        const state = this.props.transcations;
        const keys = Object.keys(state);
        keys.map((key) => {
            if (key === id) {
                delete state[id];
                this.setState(state);
            };
            return false;
        })
    }

    render = () => {
        const state = this.props.transcations;
        const netType = this.props.netType;

        const keys = Object.keys(state);
        const hide = this.hideNotification;
        const els = keys.map(function (key) {
            return React.createElement(Item, {
                id: key,
                key: key,
                classNames: state[key].class,
                title: state[key].title,
                msg: state[key].msg,
                hideNotification: hide,
                txhash: state[key].txhash,
                netType: netType
            })
        });
        return (React.createElement("div", { className: "notifications-container" }, els));
    }
};






