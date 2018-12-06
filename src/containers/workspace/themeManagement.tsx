import { inject, observer } from 'mobx-react';
import React from 'react';
import { Helmet } from 'react-helmet';

import { RootStore, ThemeModel } from '~/stores/root-store';

// components
import { DraggyBoard } from '~/components/draggy';

// utils
import { routeConstants } from '~/lib/constants';
import { convertCodesToDraggable } from '~/transforms';

interface ThemeManagementProps extends RouteCompProps<{ id: string }> {
  rootStore: RootStore;
}

@inject('rootStore')
@observer
class ThemeManagement extends React.Component<ThemeManagementProps, {}> {
  get codeBook() {
    return this.workSpace ? this.workSpace.codeBook : null;
  }

  get workSpace() {
    const workSpaceID = this.props.match.params.id;
    return this.props.rootStore.workSpaceStore.workSpaceBy(workSpaceID);
  }

  get themes() {
    if (this.workSpace && this.workSpace.codeBook) {
      const { themeList } = this.workSpace.codeBook;
      if (themeList.length > 0) {
        return this.workSpace.codeBook.themeList.map(
          ({ id, name, children }) => ({
            id,
            title: name,
            children: convertCodesToDraggable(children),
          })
        );
      }
    }
    return [];
  }

  public onCreateTheme = () => {
    if (this.workSpace && this.codeBook) {
      const theme = ThemeModel.create({
        name: `Theme ${this.workSpace.codeBook!.themeList.length + 1}`,
        definition: 'Theme definition',
      });
      this.props.rootStore.codeBookStore.createThemeAndAddTo(
        this.codeBook.id,
        theme
      );
    }
  };

  public onDragEnd = result => {
    if (!this.codeBook) return;
    const { destination, draggableId, source } = result;
    if (!destination) return;

    const { droppableId, index } = destination;
    const { droppableId: originalParentId, index: originalIdx } = source;
    const target = this.codeBook.themes.get(droppableId);
    const beingDragged = this.codeBook.codes.get(draggableId);

    const originalZone = this.codeBook.themes.get(originalParentId);

    if (result.type === 'COLUMN') {
      this.codeBook.reorderTheme(originalIdx, index);
      return;
    }

    if (!target) {
      return;
    }

    target.adopt([beingDragged]);

    if (droppableId !== originalParentId && originalZone) {
      originalZone.abandon([draggableId]);
      target.insert(beingDragged, index);
    } else {
      target.reorder(originalIdx, index);
    }
  };

  public render(): JSX.Element | null {
    console.log(this.themes);
    return (
      <React.Fragment>
        <Helmet>
          <title>WorkSpace - doc management</title>
        </Helmet>
        <DraggyBoard
          columns={this.themes}
          onDragEnd={this.onDragEnd}
          onCreate={this.onCreateTheme}
        />
      </React.Fragment>
    );
  }
}

export { ThemeManagement };
