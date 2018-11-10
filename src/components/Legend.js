import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { returnImage } from "../utils/displayUtils";

class Legend extends Component {

    LegendItem(item) {


        const { t } = this.props;


        return (
            <div id={"lgn" + item.idLayer}>
                {returnImage(item.idLayer)}
                {/* {this.returnImage(item)} */}
                <span id={"lgnSpan" + item.idLayer} style={{ color: item.symbolColor }}>
                    {t("maplayerids." + item.idLayer)}
                </span>
            </div>
        )
    }


    render() {
        const items = this.props.legendItems;
        if ((typeof (items) !== "undefined") && items.length) {
            return (
                <div className='map-overlay' id='legend'>
                    {
                        items.map((member) => {
                            return this.LegendItem(member);
                        })
                    }
                </div>)
        }
        return null;
    }
}

Legend.propTypes = {
    legendItems: PropTypes.array,
};

export default translate("translations")(Legend);