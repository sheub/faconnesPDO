import React, { Component } from "react";
import ReactDOM from 'react-dom';
import IconButton from '@material-ui/core/IconButton';
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

                <h1><strong>A propos de faconnes.de</strong></h1>
                Le site faconnes.de regroupe des données locales et touristiques de plusieurs sources disponibles en licence ouverte 
                et les mets à disposition de l'utilisateur sous la forme d'une carte interactive.
                Présentations des rubriques:

                <h2><strong>Village : </strong></h2>
                Villages faisant parti de l'association <i>Plus beaux villages de France.</i><br />
                <h2><strong>Unesco :</strong></h2>
                Site instcrit sur la liste du patrimoine mondial de l'unesco.<br />
                <h2><strong>Musées :</strong></h2>
                Liste des musées de France au 31.12.2017<br />
                Coordonnées postale (Adresse, Ville, CP), Téléphone, Site web, Fermeture annuelle, Période d'ouverture, Jours nocturnes.<br />
                Jeu de données disponible sur le site <a target="_new" href="https://www.data.gouv.fr/en/datasets/liste-et-localisation-des-musees-de-france/#_" rel="noopener">data.gouv.fr/</a>

                <h2><strong>Jardins Remarquables :</strong></h2> Le label <i>Jardin remarquable</i> est délivré par le ministère de la Culture français avec le
                     concours du Conseil national des parcs et jardins (la liste présentée sur faconnes.de est non exhaustive).
                <h2><strong>Grands Sites : </strong></h2>  Le label <i>Grand Site de France</i> est décerné par le ministère de la Transition écologique et solidaire.
                    Il vise à promouvoir la bonne conservation et la mise en valeur des sites naturels classés français de grande notoriété et de très
                    forte fréquentation. La liste de faconnes.de présente également les membres du réseau <i>Grand Site de France</i> n'ayant pas encore recu le label.

                <h2><strong>Monuments : </strong></h2> Édifice géré par le centre des monuments nationaux qui ouvre à la visite près de 100 monuments propriétés de l'état.
                Les données présentées dans les rubriques <i>Parcs &amp; Jardins</i>, <i>Commerce local</i>, <i>Atelier artisanal</i> ainsi que l'ensemble des rubriques du
                groupe <strong>Agenda</strong> (<i>Expositions, Musique &amp; Spectacles</i>, <i>Children's Corner</i>, <i>Marchés</i>, et <i>Vide-greniers</i>)
                proviennent de la plateforme DataTourisme. Elles sont mises à jours quotidiennement.<br />
            </div>
        </div>
    }
    render() {
        return ReactDOM.createPortal(this.getAboutComponent(), document.getElementById('map'));
    }
}
export default About;
