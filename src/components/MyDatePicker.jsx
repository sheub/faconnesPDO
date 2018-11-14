import React, { Component } from "react";
import { translate } from "react-i18next";
import { MuiThemeProvider, createMuiTheme, withStyles} from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from "material-ui-pickers";

import DateFnsUtils from "@date-io/date-fns";
import frLocale from "date-fns/locale/fr";
import format from 'date-fns/format';
import "./fonts/MI/style.css";


class LocalizedUtilsFR extends DateFnsUtils {
    getDatePickerHeaderText(date) {
        return format(date, 'EEE d MMM', { locale: this.locale });
    }
}
class LocalizedUtils extends DateFnsUtils {
    getDateTimePickerHeaderText(date) {
        return format(date, 'MM do', { locale: this.locale });
    }
}

const powderBlue = "#b0e0e6";
const otherbackgroundColor = "#345f874";
const materialTheme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },

    palette:
    {
        primary: {
            main: "#14222D",
        },
        secondary: {
            main: "#9CB2C0",
        }
    },

    overrides: {

        MuiFormLabel: {
            root: {
                color: powderBlue,
            },
        },
        MuiInputBase: {
            input: {
                color: powderBlue,
            },
        },
        MuiPickersCalendar: {
            transitionContainer: {
                minHeight: 180,
            },
        },
        MuiPickersModal: {
            dialog:{
            width: "310px",
            minHeight: 355,
            },
        },
    },
});

const styles = () => ({
    containersClass: {
        backgroundColor: otherbackgroundColor,
        width: "50%",
        padding: "6px"
    },

});

class MyDatePicker extends Component {

    render() {
        const { classes } = this.props;
        const { t, i18n } = this.props;
        const { dateFrom, dateTo } = this.props.state;

        let LocalUtils = LocalizedUtils;
        let localParam = null;
        if (i18n.language === "fr") {
            LocalUtils = LocalizedUtilsFR;
            localParam = frLocale;
        }

        return (

            <MuiThemeProvider theme={materialTheme}>
                <div>
                <div className={classes.containersClass} style={{ float: "left" }} >
                        <MuiPickersUtilsProvider utils={LocalUtils} locale={localParam} >
                            <DatePicker
                                style={{ maxWidth: "100%", textAlign: "center" }}
                                label={t("drawer.startfrom")}
                                value={dateFrom}
                                minDate={Date()}
                                format={t("drawer.dateformat")}
                                disablePast={true}
                                onChange={this.props.dateChange}
                            />
                        </MuiPickersUtilsProvider>
                    </div>

                    <div className={classes.containersClass} style={{ float: "right" }}>
                        <MuiPickersUtilsProvider utils={LocalUtils} locale={localParam}>
                            <DatePicker
                                label={t("drawer.lastuntil")}
                                style={{ maxWidth: "100%", textAlign: "center" }}
                                value={dateTo}
                                minDate={dateFrom}
                                format={t("drawer.dateformat")}
                                onChange={this.props.dateToChange}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}
export default withStyles(styles)(translate("translations")(MyDatePicker));