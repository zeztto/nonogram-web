import type { MouseEvent } from 'react'
import type { CellState } from '../game'

type GridCellProps = {
  rowIndex: number
  columnIndex: number
  cell: CellState
  onClick: () => void
  onContextMenu: (event: MouseEvent<HTMLButtonElement>) => void
}

export function GridCell({ rowIndex, columnIndex, cell, onClick, onContextMenu }: GridCellProps) {
  const stateLabel = { empty: '빈칸', filled: '채움', crossed: 'X 표시' }[cell]
  return (
    <button
      className={`cell cell-${cell}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      aria-label={`${rowIndex + 1}행 ${columnIndex + 1}열, ${stateLabel}`}
      aria-pressed={cell === 'filled'}
      data-state={cell}
    >
      {cell === 'crossed' ? '×' : ''}
    </button>
  )
}
