import React, { Component } from "react";
import ReactDOM from 'react-dom';
import IconButton from '@material-ui/core/IconButton';
import { I18n, Trans } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

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
                    <Typography variant="h4" gutterBottom><strong>About faconnes</strong></Typography>

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
                <Typography variant="h5" gutterBottom>Presentations of the headings</Typography>
                </Trans>

                <div className="list-about-headings">
                    <div>
                        <Trans ns={'about'}>
                            <Typography variant="h6" gutterBottom>Beautifful Villages</Typography>
                        </Trans>
                        <Trans ns={'about'}>
                            Villages belonging to the association <i>Plus beaux villages de France</i>
                        </Trans>

                        <Trans ns={'about'}>
                            <Typography variant="h6" gutterBottom>Unesco</Typography> Site inscribed on unesco's World Heritage List
                        </Trans>
                    </div>
                    <Trans ns={'about'}>
                        <Typography variant="h6" gutterBottom>Museum</Typography>
                    </Trans>

                    <Typography variant="h6" gutterBottom>{t("RemarkableGardens")}</Typography> {t("RemarkableGardens1")}

                    <Trans ns={'about'}>
                        <Typography variant="h6" gutterBottom>Grands Sites</Typography>
                    </Trans>
                    <Trans ns={'about'}>
                        <Typography variant="h6" gutterBottom>National Monuments</Typography>
                    </Trans>
                    <br />
                </div>


                <div style={{ marginTop: "7px" }}>
                    <Trans ns={'about'}>
                        <Typography variant="h5" gutterBottom>DataTourism</Typography>
                    </Trans>
                    <Trans ns={'about'}>
                        The data presented in the headings <i>Parks and Gardens</i>, <i>Local trade</i>, <i>Craft workshop</i> as well as all the headings of the group <strong>Agenda</strong> (<i>Exhibitions, Music and Shows</i>, <i>Children's Corner</i>, <i>Markets</i>, and <i>Vide-greniers</i>) come from the DataTourism platform
                        {/* The data presented in the headings       <i>Parks &amp; Gardens</i>, <i>Local trade</i>,     <i>Craft workshop</i> as well as all the headings of the group <strong>Agenda</strong> (      <i>Exhibitions, Music &amp; Shows</i>,          <i>Children's Corner</i>, <i>Markets</i>, and <i>Vide-greniers</i>) come from the DataTourism platform.  */}
                        {/* Les données présentées dans les rubriques <i>Parcs et Jardins</i>, <i>Commerce local</i>, <i>Atelier artisanal</i> ainsi que l'ensemble des rubriques du groupe <strong>Agenda</strong> (<i>Expositions, Musique et Spectacles</i>, <i>Children's Corner</i>, <i>Marchés</i>, et <i>Vide-greniers</i>) proviennent de la plateforme DATATourisme. Données originales téléchargées sur */}
                    </Trans>
                    <Trans ns={'about'}>
                        <a target='_new' href='http://www.datatourisme.fr/les-acteurs/producteurs/' rel='noopener'>DataTourism_link</a>
                    </Trans>
                    <Trans ns={'about'}>
                        They are updated daily
                    </Trans>
                </div>

                <div style={{ marginTop: "7px" }}>
                    <Typography variant="h5" gutterBottom>Mise en cache des informations</Typography>
                    
                    <Trans ns={'about'}>
                        Offline maps
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
