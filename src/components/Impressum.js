import React, { Component } from "react";
import ReactDOM from "react-dom";
import IconButton from "@material-ui/core/IconButton";
import { Email, ContactMail, ContactPhone } from "@material-ui/icons";

import { I18n } from "react-i18next";
import "./Impressum.css";

class Impressum extends Component {

    handleClose() {
        this.props.handleClose();
    }

    getImpressumComponent(t) {
        return <div className="impressumContainer">
            <div>
                <div className="btn-close-impressum" aria-label="Close">
                    <IconButton aria-label="Close" data-dismiss="alert" onClick={() => this.handleClose()}>
                        <svg className="btn-icon"><use xlinkHref='#icon-close'></use></svg>
                    </IconButton>
                </div>

                <h1>{t("title")}</h1>
                <h2>{t("H2_1")}</h2>
                <br />
                <strong>{t("Prop")}</strong> {t("Zoestha UG (haftungsbeschränkt)")}<br />
                <ContactMail className="icon-impressum" /> Fockestr. 23
                        <br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;04275 Leipzig
                        <br />
                <Email className="icon-impressum" /> info@zoestha.de
                    <br />
                <ContactPhone className="icon-impressum" /> 49. 341. 2384083
                <p>{t("Geschäftsführer")} Sébastien Barré
                    <br /> Registergericht: Leipzig, HRB 32943
                    <br /> Ust-IdNr: DE308957906
                </p>
                <p>

                    {/* <strong>{t("Créateur")}</strong> Sébastien Barré<br /> */}
                    <strong>{t("Mise en page / Conception")}</strong> feineinstellung.de / Sébastien Barré<br />
                    <strong>{t("Programmation")}</strong> Zoestha UG (haftungsbeschränkt)<br />
                    <strong>{t("Hébergement")}</strong> STRATO AG Pascalstraße 10 10587 Berlin Allemagne<br />
                    <strong>{t("Hébergement fonds des cartes")}</strong> Klokan Technologies GmbH Hofnerstrasse 98 Unterageri, Zug 6314 Switzerland
                </p>
                <br />

                <h2>{t("H2_2")}</h2>
                <p>{t("utilisation")} </p><br />

                <h2>{t("H2_3")}</h2>
                <p>{t("Le_site")}</p>
                <p>{t("Toutes_les")}</p>
                <br />
                <h2>{t("H2_4")}</h2>
                <p>{t("Le_site2")}</p>
                <br />
                <h2>{t("H2_5")}</h2>
                <p>{t("Sauf_mention")}</p>
                <p>{t("Les_données")}</p>
                <p>{t("Les_données2")}
                    <a target="_blank" rel="noopener noreferrer" href="https://www.etalab.gouv.fr/wp-content/uploads/2017/04/ETALAB-Licence-Ouverte-v2.0.pdf"> pdf</a>
                </p><br />

                <h2>{t("H2_6")}</h2>

                <p>{t("Zoestha2")}</p>
                <p>{t("Zoestha3")}</p>

                <br />
                <h2>{t("H2_7")}</h2>
                <p>{t("Conformément")}</p>
                <br />

                <h2>{t("H2_8")}</h2>
                <p>{t("Lors")}</p>
                <ul>
                    <li>{t("dafficher")}</li>
                    <li>{t("détablir")}</li>
                </ul>

                <p>{t("Lutilisateur")}</p>
                <ul>
                    <li>{t("Sous Internet Explorer")}</li>
                    <li>{t("Sous Firefox")}</li>
                    <li>{t("Sous Safari")}</li>
                    <li>{t("Sous Chrome")}</li>
                </ul>
                <br />
            </div>
        </div>;
    }
    render() {

        return <I18n ns="legal">
            {
                (t) => (
                    ReactDOM.createPortal(this.getImpressumComponent(t), document.getElementById("map"))
                )
            }
        </I18n>;
    }
}
export default Impressum;