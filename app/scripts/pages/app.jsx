import React from 'react';
import { RouteHandler } from 'react-router';
import Header from '../components/globalComponents/header.jsx';
import Footer from '../components/globalComponents/footer.jsx';
import LeftMenu from '../components/globalComponents/leftMenu.jsx';
import Search from '../components/globalComponents/search.jsx';
import MainStore from '../stores/mainStore';
import MainActions from '../actions/mainActions';
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import Snackbar from 'material-ui/lib/snackbar';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import MyRawTheme from '../theme/customTheme.js';

let zIndex = {
    zIndex: {
        popover: 5001,
        layer: 5000
    }
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appConfig: MainStore.appConfig
        };
        this.handleResize = this.handleResize.bind(this);
    }

    getChildContext() {
        return {
            muiTheme: getMuiTheme(MyRawTheme, zIndex)
        };
    }

    componentDidMount() {
        ProjectActions.getScreenSize(window.innerHeight, window.innerWidth);
        window.addEventListener('resize', this.handleResize);
        this.unsubscribe = MainStore.listen(state => this.setState(state));
        this.showToasts();
        let app = new Framework7();
        new Framework7().addView('.view-main', {dynamicNavbar: true});
        let device = {
            android: app.device.android,
            ipad: app.device.ipad,
            iphone: app.device.iphone
        };
        ProjectActions.getDeviceType(device)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        this.unsubscribe();
        new Framework7().closePanel();
    }

    componentDidUpdate(prevProps, prevState) {
        this.showToasts();
    }

    handleResize(e) {
        ProjectActions.getScreenSize(window.innerHeight, window.innerWidth);
    }

    createLoginUrl() {
        return this.state.appConfig.authServiceUri + "/authenticate?client_id=" +
            this.state.appConfig.serviceId + "&state=" + this.state.appConfig.securityState;
    }

    render() {
        let content = <RouteHandler {...this.props} {...this.state}/>;
        let toasts = null;
        if (this.state.appConfig.apiToken) {
            if (this.props.routerPath !== '/login' && !this.state.currentUser) {
                MainActions.getCurrentUser();
            }
            if (localStorage.getItem('redirectTo') !== null) {
                setTimeout(() => {
                    localStorage.removeItem('redirectTo');
                }, 10000);
            }
        }
        if (this.state.toasts) {
            toasts = this.state.toasts.map(obj => {
                return <Snackbar key={obj.ref} ref={obj.ref} message={obj.msg} autoHideDuration={3000}
                                 onRequestClose={this.handleRequestClose.bind(this)}
                                 open={true} style={styles.toast}/>
            });
        }
        if (!this.state.appConfig.apiToken && !this.state.appConfig.isLoggedIn && this.props.routerPath !== '/login') {
            if (location.hash != '' && location.hash != '#/login') {
                let redUrl = location.href;
                if (typeof(Storage) !== 'undefined') {
                    localStorage.setItem('redirectTo', redUrl);
                } else {
                    this.props.appRouter.transitionTo('/login')
                }
            }
            this.props.appRouter.transitionTo('/login')
        }
        return (
            <span>
                <div className="statusbar-overlay"></div>
                <div className="panel-overlay"></div>
                {!this.state.appConfig.apiToken ? '' : <LeftMenu {...this.props}/>}
                <div className="views">
                    <div className="view view-main">
                        <Header {...this.props} {...this.state}/>
                        <div className="pages navbar-through toolbar-through">
                            <div data-page="index" className="page">
                                {!this.state.appConfig.apiToken ? '' : <Search {...this.props} {...this.state} />}
                                <div className="searchbar-overlay"></div>
                                <div className="page-content">
                                    {content}
                                    {toasts}
                                    <div className="content-block searchbar-not-found">
                                        <div className="content-block-inner">Nothing Found</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer {...this.props} {...this.state}/>
                </div>
            </span>
        );
    }

    handleRequestClose() {
        // Avoids error when toasts time out
    }

    showToasts() {
        if (this.state.toasts) {
            this.state.toasts.map(obj => {
                setTimeout(() => MainActions.removeToast(obj.ref), 2500);
            });
        }
    }
}

var styles = {
    cancelSearch: {
        top: 10,
        right: '23%',
        padding: 10
    },
    loginWrapper: {
        width: '90vw',
        height: 'auto',
        textAlign: 'center',
        margin: '0 auto',
        marginTop: 50,
        padding: 10
    },
    searchBar: {
        width: '50vw',
        margin: '0 auto',
        fontSize: '.9em',
        display: 'block',
        input: {
            marginBottom: 10
        }
    },
    themeColor: {
        backgroundColor: '#235F9C'
    },
    toast: {
        position: 'absolute',
        bottom: 20,
        left: 0
    }
};

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};

export default App;