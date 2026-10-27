import test from 'node:test';import assert from 'node:assert/strict';
import {PUZZLES,buildEmptyBoard,getClues,transpose,countSolvedCells,isSolved,getProgressPercent,type CellState} from '../src/game';
test('three authored 10x10 puzzles have consistent row/column clues and completed boards',()=>{
 assert.equal(PUZZLES.length,3);
 for(const p of PUZZLES){assert.equal(p.size,10);assert.equal(p.solution.length,10);assert.ok(p.solution.every(r=>r.length===10));
 const board=p.solution.map(r=>r.map(v=>v?'filled':'empty')) as CellState[][];
 assert.equal(isSolved(p.solution,board),true);assert.equal(getProgressPercent(p.solution,board),100);
 assert.equal(getClues(p.solution).flat().reduce((a,b)=>a+b,0),countSolvedCells(p.solution,board).target);
 assert.equal(getClues(transpose(p.solution)).flat().reduce((a,b)=>a+b,0),countSolvedCells(p.solution,board).target);
 }
 assert.deepEqual(getClues([[false,false],[true,true],[true,false,true]]),[[0],[2],[1,1]]);
});
test('empty board rows are independent and wrong filled cells cannot show 100 percent',()=>{
 const p=PUZZLES[0];const empty=buildEmptyBoard(10);empty[0][0]='crossed';assert.equal(empty[1][0],'empty');
 const board=p.solution.map(r=>r.map(v=>v?'filled':'crossed')) as CellState[][];
 const row=p.solution.findIndex(r=>r.includes(false));const column=p.solution[row].indexOf(false);board[row][column]='filled';
 assert.equal(isSolved(p.solution,board),false);assert.ok(getProgressPercent(p.solution,board)<100);
});
