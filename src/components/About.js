import React, { Component } from "react";
import ReactDOM from 'react-dom';
import IconButton from '@material-ui/core/IconButton';
import { I18n, Trans } from 'react-i18next';

import "./Impressum.css";

class About extends Component {

    handleClose() {
        this.props.handleClose();
    }

    getAboutComponent(t) {
        return <div className="impressumContainer">
            <div>
                <div className="btn-close-impressum" aria-label="Close">
                    <IconButton aria-label="Close" data-dismiss="alert" onClick={() => this.handleClose()}>
                        <svg className="btn-icon"><use xlinkHref='#icon-close'></use></svg>
                    </IconButton>
                </div>

                <Trans ns={'about'}>
                    <h1><strong>About faconnes</strong></h1>
                </Trans>

                <Trans ns={'about'}>
                    The faconnes de
                </Trans>
                <br />
                <Trans ns={'about'}>
                    Information from three categories is provided
                </Trans>
                <br />
                <ul className="list-about" >
                    <li><strong>{t("LandscapeCulture")} </strong> {t("LandscapeCulture1")}</li>
                    <li><strong>{t("LocalMarketsShops")} </strong> {t("LocalMarketsShops1")}</li>
                    <li><strong>{t("EventsLeisure")} </strong> {t("EventsLeisure1")}</li>
                </ul>
                <Trans ns={'about'}>
                    <strong>Presentations of the headings</strong>
                </Trans>

                <div>
                    <Trans ns={'about'}>
                        <h2><strong>Beautifful Villages</strong></h2>
                    </Trans>
                    <Trans ns={'about'}>
                        Villages belonging to the association <i>Plus beaux villages de France</i>
                    </Trans>
                </div>

                <div>
                    <Trans ns={'about'}>
                        <h2><strong>Unesco</strong></h2> Site inscribed on unesco's World Heritage List
                    </Trans>
                </div>
                <Trans ns={'about'}>
                    <h2><strong>Museum</strong></h2>
                </Trans>

                <h2><strong>{t("RemarkableGardens")}</strong></h2> {t("RemarkableGardens1")}
                {/* <Trans ns={'about'}>
                    <h2><strong>Remarkable Gardens</strong></h2> The label <i>Remarkable Garden</i> is issued by the French Ministry of Culture with the assistance of the Conseil national des parcs et jardins (the list presented is not exhaustive)
                </Trans> */}
                <Trans ns={'about'}>
                    <h2><strong>Grands Sites</strong></h2>
                </Trans>
                <Trans ns={'about'}>
                    <h2><strong>National Monuments</strong></h2>
                </Trans>
                <br />
                <div style={{ marginTop: "7px" }}>
                    <Trans ns={'about'}>
                        The data presented
                    </Trans>
                    <Trans ns={'about'}>
                        They are updated daily
                </Trans>
                </div>


            </div>
        </div>

    }
    render() {

        return <I18n ns="about">
            {
                (t) => (
                    ReactDOM.createPortal(this.getAboutComponent(t), document.getElementById('map')))
            }
        </I18n>
    }
}
export default About;
