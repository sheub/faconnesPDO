import React from "react";

import Star15_961313 from '../assets/Star15_961313.svg'; // villages // plusBeauxVillagesDeFrance
import Star15_14222D from '../assets/Star15_14222D.svg'; // unesco // patrimoinemondialenfrance
import Star15_4AA52C from '../assets/Star15_4AA52C.svg'; // gardens // jardinremarquable
import Star15_19766E from '../assets/Star15_19766E.svg'; // grandsSites // grandSiteDeFrance
import Star15_1F08A6 from '../assets/Star15_1F08A6.svg'; // monuments // monumentsnationaux
import Star15_33BAAB from '../assets/Star15_33BAAB.svg'; // Museums // museesFrance

import Square15_4AA52C from '../assets/Square15_4AA52C.svg'; // parcsjardins 
import Square15_E8EF1F from '../assets/Square15_E8EF1F.svg'; // localpropshop
import Square15_EE8568 from '../assets/Square15_EE8568.svg'; // craftmanShop
import Square15_318CE7 from '../assets/Square15_318CE7.svg'; // OTFrance
import Square15_6B0D0D from '../assets/Square15_6B0D0D.svg'; // WineCelar

const ExpositionColor = "#E12E0E";
const MusiqueColor = "#A52C56";
const ChildrenColor = "#15178A";
const MarchesColor = "#4AA52C";
const VideGreniers = "#007CBF";


function returnImage(layerId) {
    let img = null;
    switch (layerId) {
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
        case "WineCelar":
            img = <img src={Square15_6B0D0D} alt="" className='legend-key' />
            break;
        case "OTFrance":
            img = <img src={Square15_318CE7} alt="" className='legend-key' />
            break;
        case "marches":
            img = <span className="dot" style={{ backgroundColor: MarchesColor }}></span>
            break;
        case "exposition":
            img = <span className="dot" style={{ backgroundColor: ExpositionColor }}></span>
            break;
        case "musique":
            img = <span className="dot" style={{ backgroundColor: MusiqueColor }}></span>
            break;
        case "children":
            img = <span className="dot" style={{ backgroundColor: ChildrenColor }}></span>
            break;
        case "videsgreniers":
            img = <span className="dot" style={{ backgroundColor: VideGreniers }}></span>
            break;

        default:
            img = null;
            break;
    }

    return img;

};

export { returnImage };
