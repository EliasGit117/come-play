import * as React from 'react';
import { Button } from './button';
import { LoaderCircle } from 'lucide-react';


interface IProps extends React.ComponentProps<typeof Button> {
  loading?: boolean;
  hideText?: boolean;
}

function LoadingButton(props: IProps) {
  const { loading, hideText, children, disabled, ...restOfProps } = props;

  if (loading)
    return (
      <Button {...restOfProps} asChild={false} disabled={disabled ?? true}>
        <LoaderCircle className="animate-spin"/>
        {!hideText && <span>Loading</span>}
      </Button>
    );

  return (
    <Button{...restOfProps} disabled={disabled}>
      {children}
    </Button>
  );
}

export { LoadingButton };
