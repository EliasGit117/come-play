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

  const borderShadow = withBorder && (isLastLeftPinnedColumn || isFirstRightPinnedColumn) ?
    (isLastLeftPinnedColumn ? '-1px 0 0 0 var(--border) inset' : '1px 0 0 0 var(--border) inset') :
    undefined;

  const pinnedPosition =
    isLeftPinned ? { left: `${column.getStart('left')}px` } :
      isRightPinned ? { right: `${column.getAfter('right')}px` } : {};

  return {
    position: isPinned ? 'sticky' : 'relative',
    zIndex: isPinned ? 1 : 0,
    background: 'var(--background)',
    width: column.getSize(),
    boxShadow: borderShadow,
    ...pinnedPosition
  };
}
