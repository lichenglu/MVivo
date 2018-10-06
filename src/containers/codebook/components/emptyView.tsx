import React from 'react';

import EmptyPlaceholder from '~/components/emptyPlaceholder';

export default (props: any) => (
  <EmptyPlaceholder
    description={
      'You do not have any code book created. Please Create one to get CODED!'
    }
    {...props}
  />
);
