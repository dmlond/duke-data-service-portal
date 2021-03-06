import React from 'react';
import ReactDOM from 'react-dom'
import Router from 'react-router';
import routes from './routes';

require('es6-promise').polyfill();

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

let appRouter = Router.create({
    routes: routes,
    location: Router.HashLocation
});

appRouter.run((Handler, state) => {
    ReactDOM.render(<Handler routerPath={state.path} appRouter={appRouter}/>, document.body)
});