import { Link } from '@tanstack/react-router';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowLeftIcon, HomeIcon } from 'lucide-react';
import type { VariantProps } from 'class-variance-authority';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';

const buttonSize: VariantProps<typeof buttonVariants>['size'] = 'sm';

interface INotFoundedCardProps extends ComponentProps<typeof Card> {}

export const NotFoundCard: FC<INotFoundedCardProps> = ({ children, className, ...props }) => {
  return (
      <Card className={cn("w-full max-w-sm mt-20", className)} {...props}>
        <CardHeader>
          <CardTitle>
            404 - Not Found
          </CardTitle>
          <CardDescription>
            {children || <p>The page you are looking for does not exist.</p>}
          </CardDescription>
        </CardHeader>

        <CardFooter className="gap-1">
          <Button
            size={buttonSize}
            variant="outline"
            onClick={() => window.history.back()}
            className="flex-1"
          >
            <ArrowLeftIcon/>
            <span>Go back</span>
          </Button>

          <Button size={buttonSize} variant='outline' className="flex-1" asChild>
            <Link to="/">
              <HomeIcon/>
              <span>Start Over</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
  );
}
