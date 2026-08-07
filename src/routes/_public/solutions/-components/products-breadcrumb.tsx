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

interface ICrumb {
  /** category slug for the category landing link; omit for the current page */
  categorySlug?: string;
  label: string;
}

interface IProps {
  crumbs: ICrumb[];
}

const ProductsBreadcrumb: FC<IProps> = ({ crumbs }) => {
  const productsLabel = tm('pages.public.products.common.productsLabel');

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
          <BreadcrumbPage className="text-muted-foreground">{productsLabel}</BreadcrumbPage>
        </BreadcrumbItem>

        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;

          return (
            <span key={crumb.label} className="contents">
              <BreadcrumbSeparator/>
              <BreadcrumbItem>
                {isLast || !crumb.categorySlug ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to="/solutions/$category" params={{ category: crumb.categorySlug }}>
                      {crumb.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default ProductsBreadcrumb;
