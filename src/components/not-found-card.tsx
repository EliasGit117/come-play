import { IconArrowLeft, IconHome } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { Button, buttonVariants } from '@/components/ui/button';

import type { VariantProps } from 'class-variance-authority';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages';

const buttonSize: VariantProps<typeof buttonVariants>['size'] = 'sm';

interface INotFoundedCardProps extends ComponentProps<typeof Card> {}

export const NotFoundCard: FC<INotFoundedCardProps> = ({ children, className, ...props }) => {
  return (
      <Card className={cn("w-full max-w-sm mt-20", className)} {...props}>
        <CardHeader>
          <CardTitle>
            {m['common.notFound.title']()}
          </CardTitle>
          <CardDescription>
            {children || <p>{m['common.notFound.description']()}</p>}
          </CardDescription>
        </CardHeader>

        <CardFooter className="gap-1">
          <Button
            size={buttonSize}
            variant="outline"
            onClick={() => window.history.back()}
            className="flex-1"
          >
            <IconArrowLeft/>
            <span>{m['common.notFound.goBack']()}</span>
          </Button>

          <Button size={buttonSize} variant='outline' className="flex-1" asChild>
            <Link to="/">
              <IconHome/>
              <span>{m['common.notFound.startOver']()}</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
  );
}
