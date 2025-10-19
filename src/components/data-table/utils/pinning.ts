import { Column } from '@tanstack/react-table';
import { CSSProperties } from 'react';

interface IPinningProps<TData> {
  column: Column<TData>;
  withBorder?: boolean;
}

export function getCommonPinningStyles<TData>({ column, withBorder = false }: IPinningProps<TData>): CSSProperties {
  const isPinned = column.getIsPinned();
  const isLeftPinned = isPinned === 'left';
  const isRightPinned = isPinned === 'right';

  const isLastLeftPinnedColumn = isLeftPinned && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn = isRightPinned && column.getIsFirstColumn('right');

  const borderShadow =
    withBorder && (isLastLeftPinnedColumn || isFirstRightPinnedColumn)
      ? isLastLeftPinnedColumn
        ? '-4px 0 4px -4px var(--border) inset'
        : '4px 0 4px -4px var(--border) inset'
      : undefined;

  const pinnedPosition =
    isLeftPinned ? { left: `${column.getStart('left')}px` } :
      isRightPinned ? { right: `${column.getAfter('right')}px` } : {};

  return {
    position: isPinned ? 'sticky' : 'relative',
    zIndex: isPinned ? 1 : 0,
    // opacity: isPinned ? 0.97 : 1,
    background: 'var(--background)',
    width: column.getSize(),
    boxShadow: borderShadow,
    ...pinnedPosition
  };
}
