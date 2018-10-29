import React, { Component } from "react";
import { translate } from "react-i18next";

import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import DatePicker from "material-ui-pickers/DatePicker";
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";

import frLocale from "date-fns/locale/fr";
import format from 'date-fns/format';


class LocalizedUtilsFR extends DateFnsUtils {
    getDatePickerHeaderText(date) {
        return format(date, 'EEE d MMM', { locale: this.locale  });
    }
}
class LocalizedUtils extends DateFnsUtils {
    getDateTimePickerHeaderText(date) {
        return format(date, 'MM do', { locale: this.locale });
    }
}

class MyDatePicker extends Component {

    render() {
        const { t, i18n } = this.props;
        const {dateFrom, dateTo} = this.props.state;

        let LocalUtils = LocalizedUtils;
        let localParam = null;
        if (i18n.language === "fr") {
            LocalUtils = LocalizedUtilsFR;
            localParam = frLocale;
        }

        return (

            <div>
                <div style={{ backgroundColor: "#eceded", width: "50%", padding: "6px", float: "left" }} >
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

                <div style={{ backgroundColor: "#eceded", width: "50%", padding: "6px", float: "right" }}>
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
        );
    }
}
export default translate("translations")(MyDatePicker);