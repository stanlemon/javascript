import * as React from "react";

export interface ContainerProps {
  loading?: string;
}

// eslint-disable-next-line max-lines-per-function
export function withContainer<OriginalProps extends {}>(
  WrappedComponent: React.ComponentType<OriginalProps>
): React.ComponentType<OriginalProps & ContainerProps> {
  type CombinedProps = OriginalProps & ContainerProps;

  class Container extends React.Component<CombinedProps> {
    // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    static defaultProps: CombinedProps = {
      loading: "Loading!!!"
    } as CombinedProps;

    state = {
      initialized: false
    };

    componentDidMount(): void {
      // Simulate remote data load, 2 minutes after we mounted set initialized to true
      setTimeout(() => {
        this.setState({
          initialized: true
        });
      }, 500);
    }

    render(): React.ReactNode {
      if (!this.state.initialized) {
        return <div>{this.props.loading}</div>;
      }

      const props = {
        ...this.props
      };

      return <WrappedComponent {...props} />;
    }
  }
  return Container;
}

export interface HeaderProps {
  size?: number;
  children: React.ReactChildren | React.ReactText;
}

export class Header extends React.Component<HeaderProps> {
  static defaultProps: Partial<HeaderProps> = {
    size: 1
  };

  render(): React.ReactNode {
    const H = (
      props: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >
    ): JSX.Element => React.createElement("h" + this.props.size, props);

    return (
      <div>
        <H>{this.props.children}</H>
      </div>
    );
  }
}

export const WrappedHeader = withContainer(Header);

export const WrappedHeaderExample = <WrappedHeader>Hello World</WrappedHeader>;
