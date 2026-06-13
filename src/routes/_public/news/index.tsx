import { IconSortAscending, IconSortDescending, IconX } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { BasicPagination } from '@/components/ui/pagination';
import { getNewsPaginatedSchema } from '@/features/news/schemas/search-news';
import { orpc } from '@/lib/orpc';
import { ComponentProps, FC, useState } from 'react';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from 'use-debounce';
import NewsPreviewLink from '@/components/news-preview-link';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Button } from "@/components/ui/button";


export const Route = createFileRoute('/_public/news/')({
  component: RouteComponent,
  validateSearch: getNewsPaginatedSchema,
  loaderDeps: ({ search }) => (search),
  loader: async ({ context: { queryClient }, deps }) => {
    const res = await queryClient.prefetchQuery(orpc.news.search.queryOptions({ input: deps }));
    return { news: res };
  }
});

function RouteComponent() {
  const searchParams = Route.useLoaderDeps();
  const { data } = useQuery({
    ...orpc.news.search.queryOptions({ input: searchParams }),
    placeholderData: keepPreviousData,
  });

  return (
    <main className="container mx-auto flex flex-col flex-1 gap-8 p-4">
      <header className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News</h1>
          <p className="text-muted-foreground mt-2">Stay updated with the most recent articles</p>
        </div>
        <SearchPanel className='mt-auto'/>
      </header>

      <section aria-label="News list" className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.items.map((item) => (
          <article key={item.id}>
            <NewsPreviewLink news={item}/>
          </article>
        ))}
      </section>

      <BasicPagination page={data?.page} totalPages={data?.pageCount} resetScroll={true} className="mt-auto"/>
    </main>
  );
}


const SearchPanel: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const navigate = Route.useNavigate();
  const searchParams = Route.useLoaderDeps();
  const { dir, title } = searchParams;
  const [_title, setTitle] = useState(title);

  const onDirSelectValueChange = (value: string) => {
    void navigate({
      to: '.',
      replace: true,
      search: (pv) => ({ ...pv, dir: value as 'asc' | 'desc' })
    });
  };

  const debouncedInputChange = useDebouncedCallback((value: string) => {
    void navigate({
      to: '.',
      replace: true,
      search: (pv) => ({ ...pv, title: value || undefined })
    });
  }, 300);

  const clearText = () => {
    setTitle('');
    void navigate({
      to: '.',
      replace: true,
      search: (pv) => ({ ...pv, title: undefined })
    });
  };

  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <span className="hidden md:block ml-auto"/>

      <InputGroup className="md:max-w-xs">
        <InputGroupInput
          value={_title}
          placeholder="Search by title"
          onChange={(e) => {
            setTitle(e.target.value);
            debouncedInputChange(e.target.value);
          }}
        />
        {_title && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={clearText} size="icon-xs">
              <IconX/>
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline">
            {dir === 'asc' ? <IconSortAscending/> : <IconSortDescending/>}
            <span className="capitalize">{dir ?? 'desc'}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Order direction</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={dir ?? 'desc'} onValueChange={onDirSelectValueChange}>
            <DropdownMenuRadioItem value="asc">
              <IconSortAscending/>
              <span>Asc</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="desc">
              <IconSortDescending/>
              <span>Desc</span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};