import { CodeSnapshot } from '~/stores';

export * from './pivotTable';
export * from './checkList';
export * from './apaTable';

export type CodeBookRow = CodeSnapshot & {
  count?: number;
  examples?: string[];
};
