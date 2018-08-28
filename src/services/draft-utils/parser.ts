import { ContentState, EditorState } from 'draft-js';

export const createEditorStateWithText = ({
  text,
  decorator,
  delimiter,
}: {
  text: string;
  decorator?: any;
  delimiter?: string;
}) => {
  return EditorState.createWithContent(
    ContentState.createFromText(text, delimiter),
    decorator
  );
};
