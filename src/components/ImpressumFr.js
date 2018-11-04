import React, { Component } from "react";
import ReactDOM from 'react-dom';
import "./Impressum.css";
import EmailIcon from "@material-ui/icons/Email";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
import IconButton from '@material-ui/core/IconButton';




class Impressum extends Component {

    handleClose() {
        this.props.handleClose();
    }

    getImpressumComponent() {
        return <div className="impressumContainer">
        <div>
            <div className="btn-close-impressum" aria-label="Close">
              <IconButton aria-label="Close" data-dismiss="alert" onClick={() => this.handleClose()}>
                <svg className="btn-icon"><use xlinkHref='#icon-close'></use></svg>
              </IconButton>
            </div>

                <h1>INFORMATIONS LÉGALES :</h1>
                <h2>1. PRÉSENTATION DU SITE.</h2>
                <br />
                <strong>Propriétaire:</strong> Zoestha UG (haftungsbeschränkt)<br />
                <ContactMailIcon style={{ color: "black", fontSize: "16px", verticalAlign: "-3px" }} /> Fockestr. 23
                        <br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;04275 Leipzig
                        <br />
                <EmailIcon style={{ color: "black", fontSize: "16px", verticalAlign: "-3px" }} /> info@zoestha.de
                    <br />
                <ContactPhoneIcon style={{ color: "black", fontSize: "16px", verticalAlign: "-3px" }} /> 49. 341. 2384083
                <p>Geschäftsführer: Sébastien Barré
                    <br /> Registergericht: Leipzig, HRB 32943
                    <br /> Ust-IdNr: DE308957906
                    </p><p>

                    <strong>Créateur :</strong> Sébastien Barré<br />
                    <strong>Responsable de la publication :</strong> Sébastien Barré – info@zoestha.de<br />
                    <strong>Programmation :</strong> Sébastien Barré – info@zoestha.de<br />
                    <strong>Hébergeur :</strong> STRATO AG Pascalstraße 10 10587 Berlin Allemagne<br />
                    <strong>Hébergement fonds des cartes :</strong> Klokan Technologies GmbH Hofnerstrasse 98 Unterageri, Zug 6314 Switzerland
                </p>
                <br />

                <h2>2. CONDITIONS GÉNÉRALES D’UTILISATION DU SITE ET DES SERVICES PROPOSÉS.</h2>
                    <p>
                        L’utilisation du site lieuxdits.de implique l’acceptation pleine et entière des conditions générales d’utilisation ci-après décrites. 
                        Ces conditions d’utilisation sont susceptibles d’être modifiées ou complétées à tout moment, les utilisateurs du site lieuxdits.de sont
                        donc invités à les consulter de manière régulière.

                        Ce site est normalement accessible à tout moment aux utilisateurs. Une interruption pour raison de maintenance technique peut être toutefois 
                        décidée par Zoestha, qui s’efforcera alors de communiquer préalablement aux utilisateurs les dates et heures de l’intervention.

                        Le site lieuxdits.de est mis à jour régulièrement par Sébastien Barré. De la même façon, les mentions légales peuvent être modifiées à tout moment : 
                        elles s’imposent néanmoins à l’utilisateur qui est invité à s’y référer le plus souvent possible afin d’en prendre connaissance.
                    </p>
                <br />
                
                <h2>3. DESCRIPTION DES SERVICES FOURNIS.</h2>
                <p>
                    Le site lieuxdits.de a pour objet de fournir une information touristique et locale en France metropolitaine.
                    Zoestha s’efforce de fournir sur le site lieuxdits.de des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu’elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
    
                    Tous les informations indiquées sur le site lieuxdits.de sont données à titre indicatif, et sont susceptibles d’évoluer. Par ailleurs, les renseignements figurant sur le site lieuxdits.de ne sont pas exhaustifs. Ils sont donnés sous réserve de modifications ayant été apportées depuis leur mise en ligne.
                </p>
                <br />
                <h2>4. LIMITATIONS CONTRACTUELLES SUR LES DONNÉES TECHNIQUES.</h2>
                <p>
                Le site Internet ne pourra être tenu responsable de dommages matériels liés à l’utilisation du site. De plus, l’utilisateur du site s’engage à accéder au site en utilisant un matériel récent, ne contenant pas de virus et avec un navigateur de dernière génération mis-à-jour.
                </p>
                <br />
                <h2>5. LICENCE</h2>
                <p>
                Sauf mention contraire l'ensemble des éléments accessibles sur le site sont placés sous Licence Creative Commons Paternité-Partage des Conditions Initiales à l'Identique (Creative Commons Attribution-ShareAlike license (CC-BY-SA))<br />

                Les données utilisées par l’API de la Base Adresse Nationale (https://adresse.data.gouv.fr/api) pour le géocodage sont sous licence ODbL.<br />

                Les données fournis par la base DataTourisme sont placés sous Licence Ouverte V 2.0 disponible pour téléchargement au format pdf sur le site etalab.gouv.fr 
                <a href="https://www.etalab.gouv.fr/wp-content/uploads/2017/04/ETALAB-Licence-Ouverte-v2.0.pdf" rel="noopener">Fichier pdf</a>

                </p>
                <br />

                <h2>6. LIMITATIONS DE RESPONSABILITÉ.</h2>
                <p>
                    
                Zoestha ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l’utilisateur, lors de l’accès au site lieuxdits.de,
                 et résultant soit de l’utilisation d’un matériel ne répondant pas aux spécifications indiquées au point 4, soit de l’apparition d’un bug ou d’une incompatibilité.
                
                Zoestha ne pourra également être tenu responsable des dommages indirects (tels par exemple qu’une perte de marché ou perte d’une chance) consécutifs à 
                l’utilisation du site lieuxdits.de.
                </p>
                <br />
                
                <h2>7. GESTION DES DONNÉES PERSONNELLES.</h2>
                <p>
                    Conformément aux dispositions de la loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, aucune information personnelle
                    n'est collectée ou cédée à des tiers.
                    Le site n'est pas déclaré à la CNIL car il ne recueille pas d'informations personnelles.
                </p>
                <br />

                <h2>8.  UTILISATION DE TÉMOINS DE CONNEXION (« COOKIES »)</h2>
                <p>
                    Lors de la consultation du lieuxdits.de, des témoins de connexions, dits « cookies », sont déposés sur votre ordinateur, votre mobile ou votre tablette.
                    Ces cookies permettent essentiellement à lieuxdits.de :
                </p>
                    <ul>
                    <li>d'afficher, lors de votre première visite, le bandeau signalant la présence de cookies et la faculté que vous avez de les accepter ou de les refuser ;</li>
                    <li>d'établir des mesures statistiques de fréquentation et d'utilisation du site. Pour information, le tiers émetteur, Mapbox Inc, est également soumis
                         à la loi informatique et libertés</li>
                    </ul>
                
                <p>
                    L’utilisateur peut configurer son navigateur pour refuser l’installation des cookies :

                    Sous Internet Explorer : onglet outil (pictogramme en forme de rouage en haut a droite) / options internet. Cliquez sur Confidentialité et
                    choisissez Bloquer tous les cookies. Validez sur Ok.
                    Sous Firefox : en haut de la fenêtre du navigateur, cliquez sur le bouton Firefox, puis aller dans l'onglet Options. Cliquer sur l'onglet Vie privée.
                     Paramétrez les Règles de conservation sur : utiliser les paramètres personnalisés pour l'historique. Enfin décochez-la pour désactiver les cookies.
                    Sous Safari : Cliquez en haut à droite du navigateur sur le pictogramme de menu (symbolisé par un rouage). Sélectionnez Paramètres. Cliquez sur Afficher
                     les paramètres avancés. Dans la section "Confidentialité", cliquez sur Paramètres de contenu. Dans la section "Cookies", vous pouvez bloquer les cookies.
                    Sous Chrome : Cliquez en haut à droite du navigateur sur le pictogramme de menu (symbolisé par trois lignes horizontales). Sélectionnez Paramètres.
                    Cliquez sur Afficher les paramètres avancés. Dans la section "Confidentialité", cliquez sur préférences. Dans l'onglet "Confidentialité",
                    vous pouvez bloquer les cookies.
                </p>
                <br />

                {/* <h2><strong>Impressum (Deutsch Sprachigenraum)</strong></h2>
                Verantwortlich für die Website: Sébastien Barré
                    <br /> Design: Julia Günther - <a href="https://feineinstellung.de" target="_blank" rel="noopener noreferrer">www.feineinstellung.de</a>
                <br /> Programmierung: Sébastien Barré
                    <br />
                <p><strong> Haftung für Inhalte</strong></p>
                <p>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
                <p><strong> Datenschutz</strong></p>
                <p>Die Nutzung unserer Webseite ist in der Regel ohne eine Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten
                    (beispielsweise Name, Anschrift oder E-Mail-Adresse) erhoben werden, erfolgt dies – soweit es möglich ist– immer auf freiwilliger Basis.
                    Wir geben Ihre Daten ohne Ihre ausdrückliche Zustimmung nicht an Dritte weiter. Außerdem weisen wir Sie darauf hin, dass die Datenübertragung
                    im Internet (wie beispielsweise bei der Kommunikation über E-Mail) Sicherheitslücken aufweisen kann. Denn ein lückenloser Schutz der Daten
                    vor dem Zugriff durch Dritte ist nicht möglich. Wir widersprechen hiermit ausdrücklich der Nutzung von im Rahmen der Impressumspflicht
                    veröffentlichten Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien.
                    Die Betreiber dieser Seiten behalten sich ausdrücklich vor, im Fall der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-Mails,
                     rechtliche Schritte einzuleiten.
                     </p> */}
        </div>
    </div>
    }
    render() {
        return ReactDOM.createPortal(this.getImpressumComponent(), document.getElementById('map'));
    }
}
export default Impressum;