import {
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { IconAlertTriangle, IconArrowLeft, IconHome, IconRefresh } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { m } from '@/paraglide/messages'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  console.error(error)

  return (
    <Empty className="min-w-0 flex-1">
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className="bg-destructive/10 text-destructive"
        >
          <IconAlertTriangle />
        </EmptyMedia>
        <EmptyTitle>{m['common.errorBoundary.title']()}</EmptyTitle>
        <EmptyDescription>
          {error.message || m['common.errorBoundary.description']()}
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button onClick={() => router.invalidate()}>
            <IconRefresh data-icon="inline-start" />
            {m['common.errorBoundary.tryAgain']()}
          </Button>

          {isRoot ? (
            <Button asChild variant="outline">
              <Link to="/">
                <IconHome data-icon="inline-start" />
                {m['common.errorBoundary.home']()}
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault()
                  window.history.back()
                }}
              >
                <IconArrowLeft data-icon="inline-start" />
                {m['common.errorBoundary.goBack']()}
              </Link>
            </Button>
          )}
        </div>
      </EmptyContent>
    </Empty>
  )
}
