// Libraries
import React from "react";
import DocumentTitle from "react-document-title";

class Help extends React.Component {
    render() {
        return (
            <DocumentTitle title="11111111111111111111">
                <div className="full-width-page">
                    <div className="wrapper">
                        <main className="main-column fullwidth help-page">
                            <div>
                                <header className="col">
                                    <h1 className="typo-h1">Help</h1>
                                </header>
                                <div className="row">
                                    <div className="col col-2 col-extra-padding">
                                        <h2 className="typo-h2 ">FAQ</h2>
                                        <h3 className="typo-h3 typo-white">First steps</h3>
                                        <ul className="typo-cl bullets">
                                            <li>How do I get MKR tokens?</li>
                                            <li>How do I get MKR tokens?</li>
                                            <li>How do I get MKR tokens?</li>
                                            <li>How do I get MKR tokens?</li>
                                        </ul>
                                    </div>
                                    <div className="col col-2 col-extra-padding" style={{ paddingLeft: "2.5em" }}>
                                        <h2 className="typo-h2">&nbsp;</h2>
                                        <h3 className="typo-h3 typo-white">Most asked questions</h3>
                                        <ul className="typo-cl bullets">
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </DocumentTitle>
        )
    }
}

export default Help;
