import { Text, TextVariants } from '@patternfly/react-core';
import React, { Fragment } from 'react';

import AllServicesLink from './AllServicesLink';
import { AllServicesGroup } from './allServicesLinks';

export type AllServicesGroupProps = AllServicesGroup;
const AllServicesGroup = ({ title, links }: AllServicesGroupProps) => {
  return (
    <Fragment>
      <Text component={TextVariants.p} className="pf-u-pt-xs pf-u-font-weight-bold">
        {title}
      </Text>
      {links.map((link, index) => (
        <AllServicesLink key={index} {...link} />
      ))}
    </Fragment>
  );
};

export default AllServicesGroup;
