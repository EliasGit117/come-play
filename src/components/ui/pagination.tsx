import * as React from "react"
import { Link } from "@tanstack/react-router"
import { type VariantProps } from "class-variance-authority"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDots,
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
} & Pick<VariantProps<typeof buttonVariants>, "size" | "variant"> &
  Omit<React.ComponentProps<typeof Link>, "search"> & {
    // Loosened so the component stays route-agnostic and reusable; the typed
    // reducer is restored via the cast on the rendered Link below.
    search?: (prev: Record<string, unknown>) => Record<string, unknown>
  }

function PaginationLink({
  className,
  isActive,
  disabled,
  size = "icon",
  variant,
  ...props
}: PaginationLinkProps) {
  return (
    <Link
      data-slot="pagination-link"
      data-active={isActive}
      aria-current={isActive ? "page" : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      className={cn(
        buttonVariants({ variant: variant ?? (isActive ? "outline" : "ghost"), size }),
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...(props as React.ComponentProps<typeof Link>)}
    />
  )
}

type PaginationNavProps = Omit<PaginationLinkProps, "isActive"> & {
  textHidden?: boolean
}

function PaginationFirst({
  className,
  textHidden,
  size = "default",
  ...props
}: PaginationNavProps) {
  return (
    <PaginationLink
      aria-label="Go to first page"
      size={size}
      className={className}
      {...props}
    >
      <IconChevronsLeft data-icon="inline-start" />
      {!textHidden && <span>First</span>}
    </PaginationLink>
  )
}

function PaginationPrevious({
  className,
  textHidden,
  size = "default",
  ...props
}: PaginationNavProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size={size}
      className={className}
      {...props}
    >
      <IconChevronLeft data-icon="inline-start" />
      {!textHidden && <span>Previous</span>}
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  textHidden,
  size = "default",
  ...props
}: PaginationNavProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size={size}
      className={className}
      {...props}
    >
      {!textHidden && <span>Next</span>}
      <IconChevronRight data-icon="inline-end" />
    </PaginationLink>
  )
}

function PaginationLast({
  className,
  textHidden,
  size = "default",
  ...props
}: PaginationNavProps) {
  return (
    <PaginationLink
      aria-label="Go to last page"
      size={size}
      className={className}
      {...props}
    >
      {!textHidden && <span>Last</span>}
      <IconChevronsRight data-icon="inline-end" />
    </PaginationLink>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <IconDots />
      <span className="sr-only">More pages</span>
    </span>
  )
}

interface BasicPaginationProps {
  page?: number
  totalPages?: number
  className?: string
  resetScroll?: boolean
}

function BasicPagination({
  className,
  page = 1,
  totalPages = 1,
  resetScroll,
}: BasicPaginationProps) {
  const isMobile = useIsMobile()

  const pages = getPaginationList({
    page,
    totalPages,
    maxItemCount: isMobile ? 7 : 9,
  })

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            to="."
            textHidden
            disabled={page <= 1}
            resetScroll={resetScroll}
            search={(pv: Record<string, unknown>) => ({ ...pv, page: page - 1 })}
          />
        </PaginationItem>

        {pages.map((p, idx) => (
          <PaginationItem key={idx}>
            {p === -1 ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                to="."
                resetScroll={resetScroll}
                isActive={p === page}
                className={cn(isMobile && "text-xs")}
                search={(pv: Record<string, unknown>) => ({ ...pv, page: p })}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            to="."
            textHidden
            disabled={page >= totalPages}
            resetScroll={resetScroll}
            search={(pv: Record<string, unknown>) => ({ ...pv, page: page + 1 })}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

interface GetPaginationListParams {
  page: number
  totalPages: number
  maxItemCount: number
}

function getPaginationList(params: GetPaginationListParams): number[] {
  const { page, totalPages, maxItemCount } = params
  if (totalPages <= 0) return []
  if (totalPages <= maxItemCount) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const nearBeginningThreshold = Math.ceil(maxItemCount / 2)
  const nearEndThreshold = totalPages - Math.ceil(maxItemCount / 2) + 1

  const result: number[] = []

  if (page <= nearBeginningThreshold) {
    for (let i = 1; i <= maxItemCount - 2; i++) {
      result.push(i)
    }
    result.push(-1)
    result.push(totalPages)
    return result
  }

  if (page >= nearEndThreshold) {
    result.push(1)
    result.push(-1)
    for (let i = totalPages - (maxItemCount - 3); i <= totalPages; i++) {
      result.push(i)
    }
    return result
  }

  result.push(1)
  result.push(-1)

  const middleCount = maxItemCount - 4
  const halfMiddle = Math.floor(middleCount / 2)
  const middleStart = Math.max(2, page - halfMiddle)
  const middleEnd = Math.min(totalPages - 1, middleStart + middleCount - 1)

  for (let i = middleStart; i <= middleEnd; i++) {
    result.push(i)
  }

  result.push(-1)
  result.push(totalPages)
  return result
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationFirst,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
  PaginationEllipsis,
  BasicPagination,
  getPaginationList,
}
