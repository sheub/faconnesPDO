import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { I18n, Trans } from 'react-i18next';
import Map from './Map';
import MyDrawer from "./MyDrawer";
import Search from './Search';
import Directions from './Directions';
import { setStateFromURL } from '../actions/index';

class App extends Component {

  componentWillMount() {
    this.props.setStateFromURL();
  }

  render() {
    var moveOnLoad = !this.props.url
      .split('/')
      .filter(e => e.startsWith('+') || e.startsWith('@'))
      .length;

    return (
      <I18n ns="translations">
        {
          (t, { i18n }) => (
            <div className='root'>

              {/* <div className="App-header">
                <h2>{t('title')}</h2>
                <button onClick={() => i18n.changeLanguage('de')}>de</button>
                <button onClick={() => i18n.changeLanguage('en')}>en</button>
              </div>
              <div className="App-intro">
                <Trans i18nKey="description.part1">
                  To get started, edit <code>src/App.js</code> and save to reload.
                </Trans>
              </div>
              <div>{t('description.part2')}</div> */}

              <MyDrawer />
              <div className='mapCont'>
                <Map moveOnLoad={moveOnLoad} />
                <div className='relative m12 m24-mm w420-mm flex-parent flex-parent--column'>
                  {
                    (this.props.mode === 'directions')
                      ? <Directions />
                      : <Search />
                  }
                </div>
              </div>
            </div>
          )
        }
      </I18n>
    );
  }
}

App.propTypes = {
  mode: PropTypes.string,
  route: PropTypes.object,
  routeStatus: PropTypes.string,
  setStateFromURL: PropTypes.func,
  url: PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    mode: state.app.mode,
    route: state.app.route,
    routeStatus: state.app.routeStatus,
    url: state.router.location.pathname
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setStateFromURL: () => dispatch(setStateFromURL())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
