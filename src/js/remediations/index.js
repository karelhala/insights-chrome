import React from 'react';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import LoadingFallback from '../utils/loading-fallback';

export default async function loadRemediation() {
  return {
    // eslint-disable-next-line react/display-name
    RemediationWizard: () => <AsyncComponent appName="remediations" module="./RemediationButton" fallback={LoadingFallback} />,
  };
}
