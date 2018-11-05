import React, { Component } from "react";
import ReactDOM from 'react-dom';
import IconButton from '@material-ui/core/IconButton';
import { Trans } from 'react-i18next';

import "./Impressum.css";

class About extends Component {

    handleClose() {
        this.props.handleClose();
    }

    getAboutComponent() {
        return <div className="impressumContainer">
            <div>
                <div className="btn-close-impressum" aria-label="Close">
                    <IconButton aria-label="Close" data-dismiss="alert" onClick={() => this.handleClose()}>
                        <svg className="btn-icon"><use xlinkHref='#icon-close'></use></svg>
                    </IconButton>
                </div>

                <Trans ns={'about'}>
                The faconnes de
                </Trans>
                <Trans ns={'about'}>
                title
                </Trans>
            </div>
        </div>

    }
    render() {
        return ReactDOM.createPortal(this.getAboutComponent(), document.getElementById('map'));
    }
}
export default About;
