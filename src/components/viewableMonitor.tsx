import Observer from '@researchgate/react-intersection-observer';
import React, { Component } from 'react';

interface ViewableMonitorProps {
  tag: React.ElementType;
  children: ({
    isIntersecting,
  }: {
    isIntersecting: boolean;
  }) => React.ElementType | null;
}

export class ViewableMonitor extends Component<ViewableMonitorProps> {
  public static defaultProps = {
    tag: 'div',
  };

  public state = {
    isIntersecting: false,
  };

  public handleChange = ({ isIntersecting }: { isIntersecting: boolean }) => {
    this.setState({ isIntersecting });
  };

  public render() {
    const { tag: Tag, children, ...rest } = this.props;
    const { isIntersecting } = this.state;

    return (
      <Observer onChange={this.handleChange}>
        <Tag {...rest}>{children({ isIntersecting })}</Tag>
      </Observer>
    );
  }
}
