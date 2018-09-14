import React, { Component } from "react";
import ReactDOM from 'react-dom';
import "./css/Impressum.css";
import EmailIcon from "@material-ui/icons/Email";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";



class Impressum extends Component {

    handleClose() {
        this.props.handleClose();
    }

    getImpressumComponent() {
        return <div className="impressumContainer">
            <div >
                <button type="button" className="btn-close-impressum" data-dismiss="alert" aria-label="Close" onClick={() => this.handleClose()}><span aria-hidden="true">&times;</span></button>
                <h1>Zoestha UG (haftungsbeschränkt)</h1>
                <br />
                <ContactMailIcon style={{ color: "black", fontSize: "16px", verticalAlign: "-3px" }} /> Fockestr. 23
                        <br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;04275 Leipzig
                        <br />
                <EmailIcon style={{ color: "black", fontSize: "16px", verticalAlign: "-3px" }} /> info@zoestha.de
                    <br />
                <ContactPhoneIcon style={{ color: "black", fontSize: "16px", verticalAlign: "-3px" }} /> 49. 341. 2384083
                <p>Geschäftsführer: Sébastien Barré
                    <br /> Registergericht: Leipzig, HRB 32943
                    <br /> Ust-IdNr: DE308957906</p>

                <p><strong>Website</strong></p>
                Verantwortlich für die Website: Sébastien Barré
                    <br /> Design: Julia Günther - <a href="https://feineinstellung.de" target="_blank" rel="noopener noreferrer">www.feineinstellung.de</a>
                <br /> Programmierung: Sébastien Barré
                    <br />
                <p><strong> Haftung für Inhalte</strong></p>
                <p>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
                <p><strong> Datenschutz</strong></p>
                <p>Die Nutzung unserer Webseite ist in der Regel ohne eine Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adresse) erhoben werden, erfolgt dies – soweit es möglich ist– immer auf freiwilliger Basis. Wir geben Ihre Daten ohne Ihre ausdrückliche Zustimmung nicht an Dritte weiter. Außerdem weisen wir Sie darauf hin, dass die Datenübertragung im Internet (wie beispielsweise bei der Kommunikation über E-Mail) Sicherheitslücken aufweisen kann. Denn ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich. Wir widersprechen hiermit ausdrücklich der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien. Die Betreiber dieser Seiten behalten sich ausdrücklich vor, im Fall der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-Mails, rechtliche Schritte einzuleiten.</p>
            </div>
        </div>
    }
    render() {
        return ReactDOM.createPortal(this.getImpressumComponent(), document.getElementById('map'));
    }
}
export default Impressum;
