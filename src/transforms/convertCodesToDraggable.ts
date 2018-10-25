import { CodeSnapshot } from '~/stores';

export const convertCodesToDraggable = (codes: CodeSnapshot[]) =>
  codes.map(code => convertCodeToDraggable(code));

export const convertCodeToDraggable = (code: CodeSnapshot) => ({
  id: code.id,
  content: code.name,
  color: code.bgColor,
  description: code.definition,
});
