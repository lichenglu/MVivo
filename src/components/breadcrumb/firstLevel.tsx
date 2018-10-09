import React from 'react';

interface WorkSpaceBreadcrumbProps extends RouteCompProps<{ id: string }> {}

export const FirstLevelFactory = ({ name }: { name: string }) => (
  props: WorkSpaceBreadcrumbProps
) => {
  const isFirstLevel = props.location.pathname.split('/').length <= 2;
  return isFirstLevel ? null : <span>{name}</span>;
};
