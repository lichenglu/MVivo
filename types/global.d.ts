import { ClickParam } from 'antd/lib/menu';
import { UploadChangeParam } from 'antd/lib/upload';
import {
  AutoCompleteProps,
  DataSourceItemType,
  DataSourceItemObject,
} from 'antd/lib/auto-complete';
import { RouteComponentProps } from 'react-router-dom';

declare global {
  type AntClickParam = ClickParam;
  type AntUploadChangeParam = UploadChangeParam;
  type AntAutoCompleteOption =
    | string
    | string[]
    | { key: string; label: string | React.ReactNode }
    | Array<{ key: string; label: string | React.ReactNode }>;
  type AntDataSourceItemType = DataSourceItemType;
  type AntDataSourceItemObject = DataSourceItemObject;
  type AntAutoCompleteProps = AutoCompleteProps;
  type RouteCompProps<P> = RouteComponentProps<P>;
  type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
}
