import { Icon, message, Upload } from 'antd';
import mammoth from 'mammoth';
import React from 'react';
import styled from 'styled-components';

const Dragger = Upload.Dragger;

function getBase64(file: Blob) {
  return new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') res(reader.result);
    });
    reader.addEventListener('error', err => rej(err));
    reader.readAsText(file, 'UTF-8');
  });
}

function getArrayBuffer(file: Blob) {
  return new Promise<ArrayBuffer>((res, rej) => {
    const reader = new FileReader();
    reader.addEventListener('load', loadEvent => {
      if (loadEvent && loadEvent.target) {
        const arrayBuffer = loadEvent.target.result;
        res(arrayBuffer);
      }
    });
    reader.addEventListener('error', err => rej(err));
    reader.readAsArrayBuffer(file);
  });
}

interface UploaderProps {
  onCompleteUpload: (
    data: { text: string; name: string },
    options: { isHTML: boolean }
  ) => void;
}

interface UploaderState {
  loading: boolean;
}

const StyledDragger = styled(Dragger)`
  &&&&& .anticon-inbox {
    font-size: 4rem;
  }

  @media (min-width: 500px) {
    &&&&& .anticon-inbox {
      font-size: 6rem;
    }
  }

  @media (min-width: 960px) {
    &&&&& .anticon-inbox {
      font-size: 8rem;
    }
  }
`;

const WORDS = ['docx', 'doc'];

export default class Uploader extends React.PureComponent<
  UploaderProps,
  UploaderState
> {
  public state = {
    loading: false,
  };

  public handleChange = async (info: AntUploadChangeParam) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done' && info.file.originFileObj) {
      const extension = info.file.originFileObj.name.split('.').pop() as string;

      this.setState({
        loading: false,
      });

      let result: string;
      let isHTML = false;
      if (WORDS.includes(extension)) {
        const arrayBuffer = await getArrayBuffer(info.file.originFileObj);
        const res = await mammoth.convertToHtml({ arrayBuffer });
        result = res.value;
        isHTML = true;
      } else {
        // Get this url from response in real world.
        result = await getBase64(info.file.originFileObj);
      }

      this.props.onCompleteUpload(
        {
          text: result,
          name: info.file.originFileObj ? info.file.originFileObj.name : 'N/A',
        },
        { isHTML }
      );
    } else if (status === 'error') {
      this.setState({
        loading: false,
      });
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  public render() {
    return (
      <StyledDragger
        name="file"
        action="//jsonplaceholder.typicode.com/posts/"
        onChange={this.handleChange}
      >
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Currently, the app only accepts text file with extension of ".txt" and
          ".docx" WITHOUT images
        </p>
      </StyledDragger>
    );
  }
}
