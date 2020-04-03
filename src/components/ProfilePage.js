import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";

import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import { I18n } from "react-i18next";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import isEqual from "lodash/isEqual";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";

import CssBaseline from "@material-ui/core/CssBaseline";

import "./Impressum.css";

const styles = theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper
  },
  heroContent: {
    maxWidth: 600,
    margin: "0 auto",
    padding: `${theme.spacing(8)}px 0 ${theme.spacing(6)}px`
  },

  layout: {
    width: "auto",
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(1020 + theme.spacing(3) * 2)]: {
      width: 1020,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  cardGrid: {
    padding: `${theme.spacing(8)}px 0`
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  // footer: {
  //   backgroundColor: theme.palette.background.paper,
  //   padding: theme.spacing(6)
  // },
  addressLayout: {
    whiteSpace: "normal",
    letterSpacing: "-1px",
    color: "gray",
    marginTop: "12px"
  }
});

class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userFavoritePlaces: this.props.userFavoritePlaces,
      profilePageOpen: true
    };
  }

  handleClose = () => {
    this.props.handleClose();
  };

  RenderAddress(props, classes) {
    let street_address,
      postal_code,
      address_locality = null;
    if (props.street_address || props.postal_code) {
      street_address = props.street_address;
      postal_code = props.postal_code;
      address_locality = props.address_locality;
    } else if (props.adr || props.cp) {
      street_address = props.adr;
      postal_code = props.cp;
      address_locality = props.ville;
    }

    return (
      <div className={classes.addressLayout}>
        {street_address}
        <br />
        {postal_code} {address_locality}
      </div>
    );
  }

  RenderDateTime(t, lng, properties) {
    if (properties.valid_from) {
      let eventStart = new Date(properties.valid_from);
      let eventEnd = new Date(properties.valid_through);
      let options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      };

      if (eventStart.getDate() === eventEnd.getDate())
        return (
          <div className="datePopup">
            {t("myplaceinfo.le")} {eventStart.toLocaleDateString(lng, options)}
          </div>
        );
      else {
        return (
          <div className="datePopup">
            {t("myplaceinfo.from")}{" "}
            {eventStart.toLocaleDateString(lng, options)}
            <br />
            {t("myplaceinfo.to")} {eventEnd.toLocaleDateString(lng, options)}
          </div>
        );
      }
    }
    return null;
  }

  handleClickRemoveLocation = infoPlace => {
    this.state.userFavoritePlaces.splice(
      this.state.userFavoritePlaces.findIndex(e => isEqual(e, infoPlace)),
      1
    );
  };

  renderPlace(place, props, classes) {
    const lang = props.i18n.language;
    const { t } = props;

    var info = { abstract: "abstract", label: "label", property_id: place.properties.property_id };
    switch (lang) {
    case "fr":
      info.abstract = place.properties.abstract_fr
        ? place.properties.abstract_fr
        : place.properties.abstract_en;
      info.label = place.properties.label_fr
        ? place.properties.label_fr
        : place.properties.label_en;
      info.link = place.properties.wikipedia_fr
        ? place.properties.wikipedia_fr
        : place.properties.wikipedia_en;
      break;
    case "en":
      info.abstract = place.properties.abstract_en
        ? place.properties.abstract_en
        : place.properties.abstract_fr;
      info.label = place.properties.label_en
        ? place.properties.label_en
        : place.properties.label_fr;
      info.link = place.properties.wikipedia_fr
        ? place.properties.wikipedia_fr
        : place.properties.wikipedia_en;
      break;
    default:
      info.abstract = place.properties.abstract_en
        ? place.properties.abstract_en
        : place.properties.abstract_fr;
      info.label = place.properties.label_en
        ? place.properties.label_en
        : place.properties.label_fr;
      info.link = place.properties.wikipedia_fr
        ? place.properties.wikipedia_fr
        : place.properties.wikipedia_en;
    }

    var image = place.properties.thumbnail
      ? place.properties.thumbnail
      : "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"; // eslint-disable-line max-len


    return (
      <Grid item key={info.property_id} sm={6} md={4} lg={3}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.cardMedia}
            image={image}
            title={info.label}
          />
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h5" component="h2">
              {info.label}
            </Typography>
            <Typography>{info.abstract}</Typography>
            <div>{this.RenderDateTime(t, lang, place.properties, classes)}</div>
            <div>{this.RenderAddress(place.properties, classes)}</div>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              View
            </Button>
            <Button
              size="small"
              color="primary"
              onClick={() => this.handleClickRemoveLocation(place)}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  }

  getProfilePage(t, props) {
    const { fullScreen, classes } = props;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={this.state.profilePageOpen}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="xl"
      >
        <CssBaseline />
        <DialogTitle id="form-dialog-title">Profile Page</DialogTitle>
        <DialogContent>
          <div className="btn-close-impressum" aria-label="Close">
            <IconButton
              aria-label="Close"
              data-dismiss="alert"
              onClick={() => this.handleClose()}
            >
              <svg className="btn-icon">
                <use xlinkHref="#icon-close"></use>
              </svg>
            </IconButton>
          </div>
          <div className={classes.heroUnit}>
            <div className={classes.heroContent}>
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                My favorite places
              </Typography>
              <Typography
                variant="h6"
                align="center"
                color="textSecondary"
                paragraph
              >
                Something short and leading about the collection below—its
                contents, the creator, etc. Make it short and sweet, but not too
                short so folks don&apos;t simply skip over it entirely.
              </Typography>
            </div>
          </div>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            {/* End hero unit */}
            <Grid container spacing={4}>
              {this.state.userFavoritePlaces.map(place =>
                this.renderPlace(place, this.props, classes)
              )}
            </Grid>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  render() {
    return (
      <I18n ns="about">
        {t =>
          ReactDOM.createPortal(
            this.getProfilePage(t, this.props),
            document.getElementById("map")
          )
        }
      </I18n>
    );
  }
}

ProfilePage.propTypes = {
  classes: PropTypes.object.isRequired,
  userFavoritePlaces: PropTypes.array,
  languageSet: PropTypes.string,
  fullScreen: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
  return {
    userFavoritePlaces: state.app.userFavoritePlaces
  };
};

export default connect(mapStateToProps)(
  withMobileDialog({ breakpoint: "xs" })(
    translate("translations")(withStyles(styles)(ProfilePage))
  )
);
