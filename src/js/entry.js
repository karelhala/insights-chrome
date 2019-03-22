import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { appNavClick } from './redux/actions';
import { spinUpStore } from './redux-config';
import * as actionTypes from './redux/action-types';
import loadInventory from './inventory';
import loadRemediations from './remediations';
import asyncObject from './async-loader';

// used for translating event names exposed publicly to internal event names
const PUBLIC_EVENTS = {
    APP_NAVIGATION: fn => ({
        on: actionTypes.APP_NAV_CLICK,
        callback: ({ data }) => {
            if (data.id !== undefined || data.event) {
                fn({ navId: data.id, domEvent: data.event });
            }
        }
    })
};

export function chromeInit(libjwt) {
    const { store, middlewareListener, actions } = spinUpStore();

    libjwt.initPromise.then(() => actions.userLogIn(libjwt.jwt.getUserInfo()));
    // public API actions
    const { identifyApp, appNav, appNavClick } = actions;
    libjwt.initPromise.then(() => {
        loadChrome();
    });
    return {
        identifyApp: (data) => identifyApp(data, store.getState().chrome.globalNav),
        navigation: appNav,
        appNavClick: appNavClick,
        on: (type, callback) => {
            if (!PUBLIC_EVENTS.hasOwnProperty(type)) {
                throw new Error(`Unknown event type: ${type}`);
            }

            return middlewareListener.addNew(PUBLIC_EVENTS[type](callback));
        },
        $internal: { store },
        loadInventory,
        experimental: {
            loadRemediations
        },
        async: asyncObject

    };
}

export function bootstrap(libjwt, initFunc) {
    return {
        chrome: {
            auth: {
                getUser: () => { return libjwt.initPromise.then(libjwt.jwt.getUserInfo); },
                logout: () => { libjwt.jwt.logoutAllTabs(); }
            },
            isProd: window.location.host === 'access.redhat.com',
            init: initFunc
        },
        loadInventory,

        experimental: {
            loadRemediations
        },
        async: asyncObject
    };
}

function loadChrome() {
    import('./App/index').then(
        ({ Header, Sidenav }) => {
            const store = insights.chrome.$internal.store;
            const chromeState = store.getState().chrome;
            let defaultActive = {};
            if (chromeState && !chromeState.appNav && chromeState.globalNav) {
                const activeApp = chromeState.globalNav.find(item => item.active);
                if (activeApp && activeApp.hasOwnProperty('subItems')) {
                    defaultActive = activeApp.subItems.find(
                        subItem => location.pathname.split('/').find(item => item === subItem.id)
                    ) || activeApp.subItems.find(subItem => subItem.default);
                }
            }

            store.dispatch(appNavClick(defaultActive));
            render(
                <Provider store={store}>
                    <Header />
                </Provider>,
                document.querySelector('header')
            );

            if (document.querySelector('aside')) {
                render(
                    <Provider store={store}>
                        <Sidenav />
                    </Provider>,
                    document.querySelector('aside')
                );
            }
        }
    );
}

;
