import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

import Star15_961313 from '../assets/Star15_961313.svg'; // villages // plusBeauxVillagesDeFrance
import Star15_14222D from '../assets/Star15_14222D.svg'; // unesco // patrimoinemondialenfrance
import Star15_4AA52C from '../assets/Star15_4AA52C.svg'; // gardens // jardinremarquable
import Star15_19766E from '../assets/Star15_19766E.svg'; // grandsSites // grandSiteDeFrance
import Star15_1F08A6 from '../assets/Star15_1F08A6.svg'; // monuments // monumentsnationaux
import Star15_33BAAB from '../assets/Star15_33BAAB.svg'; // Museums // museesFrance

import Square15_4AA52C from '../assets/Square15_4AA52C.svg'; // parcsjardins 
import Square15_E8EF1F from '../assets/Square15_E8EF1F.svg'; // localpropshop
import Square15_EE8568 from '../assets/Square15_EE8568.svg'; // craftmanShop


class Legend extends Component {

    returnImage(item) {
        let img = null;
        switch (item.idLayer) {
            case "plusBeauxVillagesDeFrance":
                img = <img src={Star15_961313} alt="" className='legend-key' />
                break;
            case "patrimoinemondialenfrance":
                img = <img src={Star15_14222D} alt="" className='legend-key' />
                break;
            case "jardinremarquable":
                img = <img src={Star15_4AA52C} alt="" className='legend-key' />
                break;
            case "grandSiteDeFrance":
                img = <img src={Star15_19766E} alt="" className='legend-key' />
                break;
            case "monumentsnationaux":
                img = <img src={Star15_1F08A6} alt="" className='legend-key' />
                break;
            case "museesFrance":
                img = <img src={Star15_33BAAB} alt="" className='legend-key' />
                break;
            case "parcsjardins":
                img = <img src={Square15_4AA52C} alt="" className='legend-key' />
                break;
            case "localproductshop":
                img = <img src={Square15_E8EF1F} alt="" className='legend-key' />
                break;
            case "craftmanshop":
                img = <img src={Square15_EE8568} alt="" className='legend-key' />
                break;
            case "marches":
            case "exposition":
            case "musique":
            case "children":
            case "videsgreniers":
                img = <span class="dot" style={{ backgroundColor: item.symbolColor }}></span>
                break;
                
            default:
                img = null;
                break;
        }

        return img;

    }

    LegendItem(item) {


        const { t } = this.props;

        return (
            <div id={"lgn" + item.idLayer}>

                {this.returnImage(item)}

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