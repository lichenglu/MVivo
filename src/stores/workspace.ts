import { values } from 'mobx';
import { types } from "mobx-state-tree"

import { CodeBookModel } from './codebook';
import { assignUUID } from './utils';

export const DocumentModel = types.model('Document', {
    id: types.identifier,
    name: types.string,
    text: types.string,
}) 
.preProcessSnapshot(assignUUID)

export const WorkSpaceModel = types.model('WorkSpace', {
    codeBook: types.maybe(types.reference(CodeBookModel)),
    document: types.maybe(types.reference(DocumentModel)),
    id: types.identifier,
    name: types.string,
}) 
.preProcessSnapshot(assignUUID)

export const WorkSpaceStore = types.model('WorkSpaceStore', {
    currentWorkSpace: types.maybe(types.reference(WorkSpaceModel)),
    documents: types.optional(types.map(DocumentModel), {}),
    workSpaces: types.optional(types.map(WorkSpaceModel), {}),
})
.views(self => ({
    get workSpaceList() {
        return values(self.workSpaces)
    },
    get safeCurrentWorkSpace() {
        // If there is a selected workspace, then we prioritize it
        // if not, and there is/are workspaces, then we return the first
        // one
        if (self.currentWorkSpace) {
            return self.currentWorkSpace
        }
        if (this.workSpaceList.length > 0) {
            return this.workSpaceList[0]
        }
    }
}))
.actions(self => ({
    createDocument(data: DocumentSnapshot) {
        const document = WorkSpaceModel.create(data);
        self.documents.put(document)
    }
}))

export type Document = typeof DocumentModel.Type
export type WorkSpace = typeof WorkSpaceModel.Type
export type DocumentSnapshot = typeof DocumentModel.SnapshotType;
export type WorkSpaceSnapshot = typeof WorkSpaceModel.SnapshotType;