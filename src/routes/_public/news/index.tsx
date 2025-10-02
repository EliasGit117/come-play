import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  ArrowDownWideNarrowIcon,
  ArrowUpWideNarrowIcon, XIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger
} from '@/components/ui/select';
import { BasicPagination } from '@/components/ui/pagination';
import {
  getNewsPaginatedQueryOptions,
  getNewsPaginatedSchema
} from '@/features/news/server-functions/public/get-news-paginated';
import { ComponentProps, FC, useState } from 'react';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '@/components/ui/button';
import NewsPreviewLink from '@/components/news-preview-link';


export const Route = createFileRoute('/_public/news/')({
  component: RouteComponent,
  validateSearch: zodValidator(getNewsPaginatedSchema),
  loaderDeps: ({ search }) => (search),
  loader: async ({ context: { queryClient }, deps }) => {
    const res = await queryClient.prefetchQuery(getNewsPaginatedQueryOptions(deps));
    return { news: res };
  }
});

function RouteComponent() {
  const searchParams = Route.useLoaderDeps();
  const { data } = useQuery({
    ...getNewsPaginatedQueryOptions(searchParams),
    placeholderData: keepPreviousData,
    gcTime: 0,
    staleTime: 0
  });

  return (
    <main className="container mx-auto flex flex-col flex-1 gap-8 p-4">
      <header className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">News</h1>
          <p className="text-muted-foreground">Stay updated with the most recent articles</p>
        </div>
        <SearchPanel/>
      </header>

      <section
        aria-label="News list"
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
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
  }

  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <span className="hidden md:block ml-auto"/>

      <div className="relative">
        <Input
          value={_title}
          placeholder="Search by title"
          className='md:max-w-xs'
          onChange={(e) => {
            setTitle(e.target.value);
            debouncedInputChange(e.target.value);
          }}
        />

        {_title && (
          <div className="absolute right-1 top-0 bottom-0 flex">
            <Button
              tabIndex={-1}
              type="button"
              variant="ghost"
              size="icon"
              className="size-6 my-auto text-muted-foreground"
              onClick={clearText}
            >
              <XIcon className="size-3.5"/>
              <span className="sr-only">Clear</span>
            </Button>
          </div>
        )}
      </div>

      <Select value={dir} onValueChange={onDirSelectValueChange}>
        <SelectTrigger className="justify-start" asChild>
          <button type="button">
            <span className="capitalize">{dir ?? 'desc'}</span>
            {dir === 'asc' ? <ArrowUpWideNarrowIcon/> : <ArrowDownWideNarrowIcon/>}
          </button>
        </SelectTrigger>

        <SelectContent align="end">
          <SelectGroup>
            <SelectLabel>Order direction</SelectLabel>
            <SelectItem value="asc">
              <ArrowUpWideNarrowIcon/>
              <span>Asc</span>
            </SelectItem>
            <SelectItem value="desc">
              <ArrowDownWideNarrowIcon/>
              <span>Desc</span>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};