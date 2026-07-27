import { FC } from 'react';
import { Link } from '@tanstack/react-router';
import { IconHome } from '@tabler/icons-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { tm } from '../-lib/get-message';

interface IProps {
  /** label for the current page; omit when rendering the /solutions index itself */
  current?: string;
}

const SolutionsBreadcrumb: FC<IProps> = ({ current }) => {
  const solutionsLabel = tm('pages.public.solutions.common.solutionsLabel');

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" aria-label="Home">
              <IconHome className="size-4"/>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator/>

        <BreadcrumbItem>
          {current ? (
            <BreadcrumbLink asChild>
              <Link to="/solutions">{solutionsLabel}</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage className="text-muted-foreground">{solutionsLabel}</BreadcrumbPage>
          )}
        </BreadcrumbItem>

        {current && (
          <>
            <BreadcrumbSeparator/>
            <BreadcrumbItem>
              <BreadcrumbPage>{current}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default SolutionsBreadcrumb;
