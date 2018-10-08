/* @preserve
 * https://github.com/klokantech/openmaptiles-language
 * (c) 2018 Klokan Technologies GmbH
 */
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

function OMPLanguage(options) {
  options = Object.assign({}, options);
  if (!(this instanceof OMPLanguage)) {
    throw new Error('OMPLanguage needs to be called with the new keyword');
  }

  this.setLanguage = this.setLanguage.bind(this);
}

function langFallbackDecorate (style, cfg) {
    var layers = style.layers;
    var lf = cfg['layer-filter'];
    var decorators = cfg['decorators'];
    var lfProp = lf[1];
    var lfValues = lf.slice(2);

    for (var i = layers.length-1; i >= 0; i--) {
      var layer = layers[i];
      if(!(
          lf[0] === 'in'
          && lfProp==='layout.text-field'
          && layer.layout && layer.layout['text-field']
          && lfValues.indexOf(layer.layout['text-field'])>=0
      )) {
        continue;
      }
      for (var j = decorators.length-1; j >= 0; j--) {
        var decorator = decorators[j];
        var postfix = decorator['layer-name-postfix'] || '';
        postfix = postfix.replace(/(^-+|-+$)/g, '');

        if(j>0) {
          var newLayer = JSON.parse(JSON.stringify(layer));
          layers.splice(i+1, 0, newLayer);
        } else {
          newLayer = layer;
        }
        newLayer.id += postfix ? '-'+postfix : '';
        newLayer.layout['text-field'] = decorator['layout.text-field'];
        if(newLayer.layout['symbol-placement']==='line') {
          newLayer.layout['text-field'] =
              newLayer.layout['text-field'].replace('\n', ' ');
        }
        var filterPart = decorator['filter-all-part'].concat();
        if(!newLayer.filter) {
          newLayer.filter = filterPart;
        } else if(newLayer.filter[0]==='all') {
          newLayer.filter.push(filterPart);
        } else {
          newLayer.filter = [
            'all',
            newLayer.filter,
            filterPart
          ];
        }
      }
    }
  }

  var setStyleMutex = false;
  var origSetStyle = mapboxgl.Map.prototype.setStyle;

  OMPLanguage.prototype.setStyle = function() {
    origSetStyle.apply(this, arguments);

    if (!setStyleMutex) {
      if (this.styleUndecorated) {
        this.styleUndecorated = undefined;
      }
      this.once('styledata', function() {
        if (this.languageOptions) {
          this.setLanguage(
            this.languageOptions.language,
            this.languageOptions.noAlt
          );
        }
      }.bind(this));
    }
  };

  function setLanguage (map, styleUndecorated, language, noAlt) {
    // let languageOptions = {
    //   language: language,
    //   noAlt: noAlt
    // };
    // let styleUndecorated;
    //   try {
    //     styleUndecorated = map.getStyle();
    //   } catch (e) {}

    if (!styleUndecorated) {
      return;
    }

    var isNonlatin = [
      'ar', 'hy', 'be', 'bg', 'zh', 'ka', 'el', 'he',
      'ja', 'ja_kana', 'kn', 'kk', 'ko', 'mk', 'ru', 'sr',
      'th', 'uk'
    ].indexOf(language) >= 0;

    let style = JSON.parse(JSON.stringify(styleUndecorated));
    var langCfg = {
      "layer-filter": [
        "in",
        "layout.text-field",
        "{name}",
        "{name_de}",
        "{name_en}",
        "{name:latin}",
        "{name:latin} {name:nonlatin}",
        "{name:latin}\n{name:nonlatin}"
      ],
      "decorators": [
        {
          "layout.text-field": "{name:latin}" + (noAlt ? "" : "\n{name:nonlatin}"),
          "filter-all-part": [
            "!has",
            "name:" + language
          ]
        },
        {
          "layer-name-postfix": language,
          "layout.text-field": "{name:" + language + "}" + (noAlt ? "" : "\n{name:" + (isNonlatin ? 'latin' : 'nonlatin') + "}"),
          "filter-all-part": [
            "has",
            "name:" + language
          ]
        }
      ]
    };
    if (language === 'native') {
      langCfg['decorators'] = [
        {
          "layout.text-field": "{name}",
          "filter-all-part": ["all"]
        }
      ];
    }
    langFallbackDecorate(style, langCfg);

    setStyleMutex = true;
    map.setStyle(style);
    setStyleMutex = false;
  };

  OMPLanguage.prototype.autodetectLanguage = function(opt_fallback) {
    mapboxgl.Map.setLanguage(navigator.language.split('-')[0] || opt_fallback || 'native');
  };
  


  export {OMPLanguage, setLanguage};