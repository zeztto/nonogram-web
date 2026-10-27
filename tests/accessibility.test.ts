import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { GridCell } from '../src/components/GridCell'
import type { CellState } from '../src/game'

test('actual grid buttons announce empty, filled and crossed independently of hidden puzzle answers', () => {
  const labels = new Set<string>()
  for (const [cell, stateLabel] of [['empty', '빈칸'], ['filled', '채움'], ['crossed', 'X 표시']] as [CellState, string][]) {
    const markup = renderToStaticMarkup(createElement(GridCell, { rowIndex: 2, columnIndex: 4, cell, onClick() {}, onContextMenu() {} }))
    const label = /aria-label="([^"]+)"/.exec(markup)?.[1]
    assert.equal(label, `3행 5열, ${stateLabel}`)
    labels.add(label!)
    assert.match(markup, new RegExp(`data-state="${cell}"`))
    assert.match(markup, new RegExp(`aria-pressed="${cell === 'filled'}"`))
    assert.equal(markup.includes('정답'), false)
  }
  assert.equal(labels.size, 3)
})
