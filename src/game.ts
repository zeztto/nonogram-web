export type CellState = 'empty' | 'filled' | 'crossed'
export type Tool = 'fill' | 'cross' | 'erase'

export type Puzzle = {
  id: string
  name: string
  size: number
  solution: boolean[][]
  accent: string
  description: string
}

export const PUZZLES: Puzzle[] = [
  {
    id: 'rocket',
    name: '로켓',
    size: 10,
    accent: '#d94f2b',
    description: '대칭 형태의 로켓을 완성하세요.',
    solution: [
      [false, false, false, false, true, true, false, false, false, false],
      [false, false, false, true, true, true, true, false, false, false],
      [false, false, true, true, true, true, true, true, false, false],
      [false, false, false, true, true, true, true, false, false, false],
      [false, false, true, true, true, true, true, true, false, false],
      [false, true, true, false, true, true, false, true, true, false],
      [true, true, true, true, true, true, true, true, true, true],
      [false, false, true, true, false, false, true, true, false, false],
      [false, true, true, false, false, false, false, true, true, false],
      [true, true, false, false, false, false, false, false, true, true],
    ],
  },
  {
    id: 'heart',
    name: '하트',
    size: 10,
    accent: '#bc274a',
    description: '하트 모양을 완성하세요.',
    solution: [
      [false, true, true, false, false, false, false, true, true, false],
      [true, true, true, true, false, false, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [false, true, true, true, true, true, true, true, true, false],
      [false, false, true, true, true, true, true, true, false, false],
      [false, false, false, true, true, true, true, false, false, false],
      [false, false, false, false, true, true, false, false, false, false],
      [false, false, false, false, true, true, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
    ],
  },
  {
    id: 'cat',
    name: '고양이',
    size: 10,
    accent: '#3d5a80',
    description: '귀와 수염이 보이는 고양이 얼굴 패턴입니다.',
    solution: [
      [true, false, false, false, false, false, false, false, false, true],
      [true, true, false, false, false, false, false, false, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [false, true, true, true, true, true, true, true, true, false],
      [false, true, false, true, true, true, true, false, true, false],
      [false, true, true, true, true, true, true, true, true, false],
      [true, true, true, false, true, true, false, true, true, true],
      [false, true, true, true, false, false, true, true, true, false],
      [false, false, true, true, true, true, true, true, false, false],
      [false, false, false, true, true, true, true, false, false, false],
    ],
  },
]

export function buildEmptyBoard(size: number): CellState[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 'empty'),
  )
}

export function getClues(lines: boolean[][]): number[][] {
  return lines.map((line) => {
    const groups: number[] = []
    let run = 0

    line.forEach((value) => {
      if (value) {
        run += 1
      } else if (run > 0) {
        groups.push(run)
        run = 0
      }
    })

    if (run > 0) {
      groups.push(run)
    }

    return groups.length > 0 ? groups : [0]
  })
}

export function transpose(grid: boolean[][]): boolean[][] {
  return grid[0].map((_, columnIndex) => grid.map((row) => row[columnIndex]))
}

export function getNextCellState(tool: Tool): CellState {
  if (tool === 'fill') return 'filled'
  if (tool === 'cross') return 'crossed'
  return 'empty'
}

export function countSolvedCells(solution: boolean[][], board: CellState[][]) {
  let correct = 0
  let target = 0
  let incorrect = 0

  solution.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (!cell && board[rowIndex][columnIndex] === 'filled') incorrect += 1
      if (cell) {
        target += 1
        if (board[rowIndex][columnIndex] === 'filled') {
          correct += 1
        }
      }
    })
  })

  return { correct, target, incorrect }
}

export function isSolved(solution: boolean[][], board: CellState[][]) {
  return solution.every((row, rowIndex) =>
    row.every((cell, columnIndex) => {
      if (cell) {
        return board[rowIndex][columnIndex] === 'filled'
      }

      return board[rowIndex][columnIndex] !== 'filled'
    }),
  )
}

export function getProgressPercent(solution: boolean[][], board: CellState[][]): number {
  const progress = countSolvedCells(solution, board)
  return progress.target ? Math.round((progress.correct / (progress.target + progress.incorrect)) * 100) : 0
}
