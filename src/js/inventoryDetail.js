/* eslint-disable react/display-name */
/* eslint-disable camelcase */
import React, { Suspense, lazy } from 'react';
const IntlProvider = lazy(() => import('react-intl').then(({ IntlProvider }) => ({
    default: IntlProvider
})));
const GeneralInformation = lazy(() => import('@redhat-cloud-services/frontend-components-inventory-general-info/esm'));
const PatchMan = lazy(() => import('@redhat-cloud-services/frontend-components-inventory-patchman'));
const Advisor = lazy(() => import('@redhat-cloud-services/frontend-components-inventory-insights/esm'));
const Vulnerabilities = lazy(() => import('@redhat-cloud-services/frontend-components-inventory-vulnerabilities/dist/esm'));
const Compliance = lazy(() => import('@redhat-cloud-services/frontend-components-inventory-compliance/esm'));

export const componentsMapper = {
    general_information: (props) => <Suspense fallback="loading">
        <GeneralInformation {...props} />
    </Suspense>,
    advisor: (props) => <Suspense fallback="loading">
        <Advisor {...props} />
    </Suspense>,
    compliance: (props) => <Suspense fallback="loading">
        <IntlProvider locale={navigator.language}>
            <Compliance {...props} />
        </IntlProvider>
    </Suspense>,
    vulnerabilities: (props) => <Suspense fallback="loading">
        <Vulnerabilities {...props}/>
    </Suspense>,
    patch: (props) => <Suspense fallback="loading">
        <PatchMan {...props}/>
    </Suspense>
};
