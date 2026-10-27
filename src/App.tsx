import { useEffect, useState, type CSSProperties, type MouseEvent } from 'react'
import './App.css'
import { GridCell } from './components/GridCell'

import { PUZZLES, buildEmptyBoard, getClues, transpose, getNextCellState, countSolvedCells, isSolved, getProgressPercent, type CellState, type Tool, type Puzzle } from './game'

function App() {
  const [puzzleId, setPuzzleId] = useState(PUZZLES[0].id)
  const [tool, setTool] = useState<Tool>('fill')
  const [board, setBoard] = useState<CellState[][]>(
    buildEmptyBoard(PUZZLES[0].size),
  )
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const puzzle = PUZZLES.find((entry) => entry.id === puzzleId) ?? PUZZLES[0]
  const rowClues = getClues(puzzle.solution)
  const columnClues = getClues(transpose(puzzle.solution))
  const progress = countSolvedCells(puzzle.solution, board)
  const progressPercent = getProgressPercent(puzzle.solution, board)
  const solved = isSolved(puzzle.solution, board)

  useEffect(() => {
    if (solved) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((currentSeconds) => currentSeconds + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [solved])

  function resetBoard(nextPuzzle: Puzzle = puzzle) {
    setBoard(buildEmptyBoard(nextPuzzle.size))
    setElapsedSeconds(0)
  }

  function updateCell(rowIndex: number, columnIndex: number, nextState: CellState) {
    setBoard((currentBoard) =>
      currentBoard.map((row, currentRowIndex) =>
        row.map((cell, currentColumnIndex) => {
          if (currentRowIndex === rowIndex && currentColumnIndex === columnIndex) {
            return cell === nextState ? 'empty' : nextState
          }

          return cell
        }),
      ),
    )
  }

  function handleCellClick(rowIndex: number, columnIndex: number) {
    updateCell(rowIndex, columnIndex, getNextCellState(tool))
  }

  function handleCellContextMenu(
    event: MouseEvent<HTMLButtonElement>,
    rowIndex: number,
    columnIndex: number,
  ) {
    event.preventDefault()
    updateCell(rowIndex, columnIndex, 'crossed')
  }

  function handlePuzzleChange(nextPuzzleId: string) {
    const nextPuzzle = PUZZLES.find((entry) => entry.id === nextPuzzleId)

    if (!nextPuzzle) {
      return
    }

    setPuzzleId(nextPuzzleId)
    setTool('fill')
    resetBoard(nextPuzzle)
  }

  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60

  return (
    <main className="app-shell" style={{ '--accent': puzzle.accent } as CSSProperties}>
      <section className="hero-panel">
        <div className="hero-copy">
          
          <h1>노노그램</h1>
          <p className="hero-description">
            행과 열 힌트를 보고 칸을 채우세요. 마우스 오른쪽 클릭은 빠른 X 표시,
            모바일에서는 아래 툴 전환 버튼으로 같은 동작을 사용할 수 있습니다.
          </p>
        </div>

        <div className="hero-controls">
          <label className="picker">
            <span>퍼즐</span>
            <select
              value={puzzleId}
              onChange={(event) => handlePuzzleChange(event.target.value)}
            >
              {PUZZLES.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </select>
          </label>

          <div className="stats-card">
            <div>
              <span className="stats-label">진행도</span>
              <strong>{progress.correct} / {progress.target}</strong>
            </div>
            <div>
              <span className="stats-label">완성도</span>
              <strong>{progressPercent}%</strong>
            </div>
            <div>
              <span className="stats-label">시간</span>
              <strong>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </strong>
            </div>
          </div>

          <p className="puzzle-description">{puzzle.description}</p>

          <div className="tool-row" role="toolbar" aria-label="보드 도구">
            <button
              className={tool === 'fill' ? 'tool-button active' : 'tool-button'}
              onClick={() => setTool('fill')}
            >
              채우기
            </button>
            <button
              className={tool === 'cross' ? 'tool-button active' : 'tool-button'}
              onClick={() => setTool('cross')}
            >
              X 표시
            </button>
            <button
              className={tool === 'erase' ? 'tool-button active' : 'tool-button'}
              onClick={() => setTool('erase')}
            >
              지우기
            </button>
            <button className="tool-button secondary" onClick={() => resetBoard()}>
              다시 시작
            </button>
          </div>

          <div role="status" className={solved ? 'status-banner solved' : 'status-banner'}>
            {solved ? '퍼즐 해결 완료' : '힌트를 맞춰 완성 이미지를 찾아보세요'}
          </div>
        </div>
      </section>

      <section className="board-panel">
        <div className="column-clues" style={{ gridTemplateColumns: `repeat(${puzzle.size}, 1fr)` }}>
          {columnClues.map((clueGroup, index) => (
            <div className="clue-stack column" key={`column-${index}`}>
              {clueGroup.map((value, clueIndex) => (
                <span key={`column-${index}-${clueIndex}`}>{value}</span>
              ))}
            </div>
          ))}
        </div>

        <div className="board-wrap">
          <div className="row-clues">
            {rowClues.map((clueGroup, index) => (
              <div className="clue-stack row" key={`row-${index}`}>
                {clueGroup.map((value, clueIndex) => (
                  <span key={`row-${index}-${clueIndex}`}>{value}</span>
                ))}
              </div>
            ))}
          </div>

          <div
            className="board-grid"
            style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))` }}
          >
            {board.map((row, rowIndex) =>
              row.map((cell, columnIndex) => (
                <GridCell
                  key={`${rowIndex}-${columnIndex}`}
                  rowIndex={rowIndex}
                  columnIndex={columnIndex}
                  cell={cell}
                  onClick={() => handleCellClick(rowIndex, columnIndex)}
                  onContextMenu={(event) =>
                    handleCellContextMenu(event, rowIndex, columnIndex)
                  }
                />
              )),
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
