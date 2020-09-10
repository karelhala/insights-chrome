import React from 'react';
import { Nav } from '@patternfly/react-core/dist/js/components/Nav/Nav';
import  { NavItem } from '@patternfly/react-core/dist/js/components/Nav/NavItem';
import { NavExpandable } from '@patternfly/react-core/dist/js/components/Nav/NavExpandable';
import { NavList } from '@patternfly/react-core/dist/js/components/Nav/NavList';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { appNavClick, clearActive } from '../../redux/actions';
import NavigationItem from './NavigationItem';

import './Navigation.scss';

const basepath = document.baseURI;

const extraLinks = {
    insights: [{
        title: 'Subscription Watch',
        link: './subscriptions/'
    }, {
        url: 'https://access.redhat.com/documentation/en-us/red_hat_insights/',
        title: 'Documentation'
    }],
    subscriptions: [{
        url: 'https://access.redhat.com/products/subscription-central',
        title: 'Documentation'
    }],
    'cost-management': [{
        url: 'https://access.redhat.com/documentation/en-us/openshift_container_platform/#category-cost-management',
        title: 'Documentation'
    }],
    ansible: [{
        url: 'https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/',
        title: 'Documentation'
    }],
    openshift: [{
        title: 'Support Cases',
        link: 'https://access.redhat.com/support/cases'
    }, {
        title: 'Cluster Manager Feedback',
        link: 'mailto:ocm-feedback@redhat.com'
    }, {
        title: 'Red Hat Marketplace',
        link: 'https://marketplace.redhat.com'
    }, {
        url: 'https://docs.openshift.com/dedicated/4/',
        title: 'Documentation'
    }]
};

const Navigation = ({
    settings,
    activeApp,
    activeLocation,
    onNavigate,
    onClearActive,
    activeGroup,
    appId
}) => {
    const onClick = (event, item, parent) => {
        const isMetaKey = (event.ctrlKey || event.metaKey || event.which === 2);
        let url = `${basepath}${activeLocation || ''}`;

        // always redirect if in subNav and current or new navigation has reload
        if (parent?.active) {
            const activeLevel = settings.find(({ id }) => id === appId);
            const activeItem = activeLevel?.subItems?.find?.(({ id }) => id === activeGroup);
            if (item.reload || activeItem?.reload) {
                url = `${url}/${item.reload || `${appId}/${item.id}`}`;
                isMetaKey ? window.open(url) : window.location.href = url;
            }
        }

        // If in SPA do not perform redirect
        if ((item.group && activeGroup === item.group) || parent?.active) {
            if (isMetaKey) {
                window.open(`${url}/${item.id}`);
            } else {
                !parent?.active && onClearActive();
                onNavigate(item, event);
            }
        } else {
            const itemUrl = `${parent?.id ? `/${parent.id}` : ''}/${item.id}`;
            url = `${url}${item.reload || itemUrl}`;
            console.log(url, itemUrl);
            isMetaKey ? window.open(url) : window.location.href = url;
        }
    };

    return (
        <Nav aria-label="Insights Global Navigation" data-ouia-safe="true">
            <NavList>
                {settings?.map((item, key) => (
                    item.subItems ? <NavExpandable
                        title={item.title}
                        ouia-nav-group={item.id}
                        itemID={item.id}
                        key={key}
                        isActive={item.active}
                        isExpanded={item.active}>
                        {
                            item.subItems.map((subItem, subKey) => <NavigationItem
                                ignoreCase={subItem.ignoreCase}
                                itemID={subItem.reload || subItem.id}
                                ouia-nav-item={subItem.reload || subItem.id}
                                key={subKey}
                                title={subItem.title}
                                parent={`${activeLocation}${item.id ? `/${item.id}` : ''}`}
                                isActive={item.active && subItem.id === activeApp}
                                onClick={event => onClick(event, subItem, item)}
                            />)
                        }
                    </NavExpandable> : <NavigationItem
                        ignoreCase={item.ignoreCase}
                        itemID={item.id}
                        ouia-nav-item={item.id}
                        key={key}
                        title={item.title}
                        parent={activeLocation}
                        isActive={item.active || item.id === activeApp}
                        onClick={event => onClick(event, item)}
                    />
                ))}
                {extraLinks[activeLocation]?.map?.((item, key) => (
                    <NavItem
                        key={key}
                        to={item.url}
                        target='_blank'
                        rel='noopener noreferrer'>
                        {item.title}
                    </NavItem>
                ))}
            </NavList>
        </Nav>
    );
};

Navigation.propTypes = {
    appId: PropTypes.string,
    settings: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            title: PropTypes.string,
            ignoreCase: PropTypes.bool,
            subItems: () => Navigation.propTypes.settings
        })
    ),
    activeApp: PropTypes.string,
    navHidden: PropTypes.bool,
    activeLocation: PropTypes.string,
    onNavigate: PropTypes.func,
    onClearActive: PropTypes.func,
    activeGroup: PropTypes.string
};

function stateToProps({ chrome: { globalNav, activeApp, navHidden, activeLocation, activeGroup, appId } }) {
    return ({ settings: globalNav, activeApp, navHidden, activeLocation, activeGroup, appId });
}

export function dispatchToProps(dispatch) {
    return {
        onNavigate: (item, event) => dispatch(appNavClick(item, event)),
        onClearActive: () => dispatch(clearActive())
    };
}

export default connect(stateToProps, dispatchToProps)(Navigation);
