import { ClickParam } from "antd/lib/menu";
import { UploadChangeParam } from "antd/lib/upload";
import { RouteComponentProps } from "react-router-dom";

declare global {
    type AntClickParam = ClickParam
    type AntUploadChangeParam = UploadChangeParam
    type RouteCompProps<P> = RouteComponentProps<P>
}