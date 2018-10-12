import { inject } from 'mobx-react';
import React from 'react';

import { RootStore } from '~/stores';

interface BreadcrumbFactoryParams {
  nameExtractor:
    | string
    | ((
        {
          store,
          routeParams,
          path,
        }: { store: RootStore; routeParams: object; path: string }
      ) => string);
  shouldShow?:
    | boolean
    | ((
        { location }: { location: RouteCompProps<any>['location'] }
      ) => boolean);
}

export const breadcrumbFactory = ({
  nameExtractor,
  shouldShow = true,
}: BreadcrumbFactoryParams) =>
  inject('rootStore')(({ rootStore, match, location }) => {
    let name = nameExtractor;
    if (typeof nameExtractor === 'function') {
      name = nameExtractor({
        store: rootStore,
        routeParams: match.params,
        path: match.path,
      });
    }

    let visible = shouldShow;
    if (typeof shouldShow === 'function') {
      visible = shouldShow({ location });
    }

    return visible ? <span>{name}</span> : null;
  });

export const WorkSpaceBreadcrumb = breadcrumbFactory({
  nameExtractor: ({ store, routeParams, path }) => {
    const wsID = routeParams.id;
    const ws = store.workSpaceStore.workSpaceBy(wsID);
    const suffix = path.split('/').pop();
    const name = ws ? ws.name : 'Workspace of no name';
    return `${name} (${suffix})`;
  },
});

export const WorkSpaceDocBreadcrumb = breadcrumbFactory({
  nameExtractor: ({ store, routeParams, path }) => {
    const docID = routeParams.docID;
    const doc = store.workSpaceStore.documentBy(docID);
    return doc ? doc.name : 'Document of no name';
  },
});

export const CodeBookBreadcrumb = breadcrumbFactory({
  nameExtractor: ({ store, routeParams, path }) => {
    const codebookID = routeParams.id;
    const codebook = store.codeBookStore.codeBookBy(codebookID);
    const suffix = path.split('/').pop();
    const name = codebook ? codebook.name : 'CodeBook of no name';
    return `${name} (${suffix})`;
  },
});
