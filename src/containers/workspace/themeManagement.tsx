import { inject, observer } from 'mobx-react';
import React from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { Helmet } from 'react-helmet';

import { RootStore, Theme, ThemeModel } from '~/stores/root-store';

// components
import { DraggyBoard } from '~/components/draggy';

// utils
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
      const { themeList, codeList } = this.workSpace.codeBook;
      if (themeList.length > 0) {
        return this.workSpace.codeBook.themeList.map(
          ({ id, name, children }) => {
            return {
              id,
              title: name,
              editable:
                this.workSpace.codeBook.firstLevelTheme &&
                this.workSpace.codeBook.firstLevelTheme.id !== id,
              children: convertCodesToDraggable(children),
            };
          }
        );
      }
    }
    return [];
  }

  // // orphanedCodes means codes newly created after some themes have been created
  // // we need to automatically put these codes into the theme with the id
  // // first_level_theme
  // get orphanedCodes() {
  //   if (this.workSpace && this.workSpace.codeBook) {
  //     return this.workSpace.codeBook.codeList
  //       .filter(
  //         code => !this.props.rootStore.codeBookStore.getParentFromTree(code.id)
  //       )
  //       .map(code => this.props.rootStore.codeBookStore.codes.get(code.id))
  //       .filter(code => !!code);
  //   }
  //   return [];
  // }

  public onCreateTheme = ({
    name,
    definition,
    id,
  }: {
    name?: string;
    definition?: string;
    id?: string;
  } = {}) => {
    if (this.workSpace && this.codeBook) {
      const theme = ThemeModel.create({
        definition: definition || 'Theme definition',
        name: name || `Theme ${this.workSpace.codeBook!.nextThemeNumber + 1}`,
        id,
      });
      this.props.rootStore.codeBookStore.createThemeAndAddTo(
        this.codeBook.id,
        theme
      );
    }
  };

  public handleThemeColAction = ({
    key,
    columnID,
  }: AntClickParam & { columnID: string }) => {
    switch (key) {
      case 'delete':
        this.onDeleteTheme(columnID);
        break;
      default:
        console.log('[handleThemeColAction] unknown action');
    }
  };

  public onDeleteTheme = (themeID: string) => {
    if (!this.codeBook) return;
    this.props.rootStore.codeBookStore.removeThemeOf(this.codeBook.id, themeID);
    this.props.rootStore.codeBookStore.removeTheme(themeID);
  };

  public onDragEnd = (result: DropResult) => {
    if (!this.codeBook) return;
    const { destination, draggableId, source } = result;
    if (!destination) return;

    const { droppableId, index } = destination;
    const { droppableId: originalParentId, index: originalIdx } = source;
    const target = this.codeBook.themes.get(droppableId);
    const beingDragged = this.codeBook.codes.get(draggableId);

    const originalZone = this.codeBook.themes.get(originalParentId);

    // if moving a column
    if (result.type === 'COLUMN') {
      this.codeBook.reorderTheme(originalIdx, index);
      return;
    }

    // if the user is not dropping in a theme, and the user is not reordering a column
    if (!target) {
      return;
    }

    if (!beingDragged) {
      return;
    }

    // theme adopts the code
    target.adopt([beingDragged]);

    if (droppableId !== originalParentId && originalZone) {
      originalZone.abandon([beingDragged]);
      target.insert(beingDragged, index);
    } else {
      target.reorder(originalIdx, index);
    }
  };

  public render(): JSX.Element | null {
    return (
      <React.Fragment>
        <Helmet>
          <title>WorkSpace - doc management</title>
        </Helmet>
        <DraggyBoard
          columns={this.themes}
          onDragEnd={this.onDragEnd}
          onCreate={this.onCreateTheme}
          onTriggerAction={this.handleThemeColAction}
        />
      </React.Fragment>
    );
  }
}

export { ThemeManagement };
