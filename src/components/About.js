import React, { Component } from "react";
import ReactDOM from 'react-dom';
// import "./css/About.css";
// import EmailIcon from "@material-ui/icons/Email";
// import ContactMailIcon from "@material-ui/icons/ContactMail";


class About extends Component {

    handleClose(){
        this.props.handleClose();
    }

    getAboutComponent() {
        return <div className="aboutContainer">
            <div >
                <button type="button" className="btn-close" data-dismiss="alert" aria-label="Close" onClick={() => this.handleClose()}><span aria-hidden="true">&times;</span></button>
            </div>
        </div>
    }
    render() {
        return ReactDOM.createPortal(this.getAboutComponent(), document.getElementById('map'));
    }
}
export default About;