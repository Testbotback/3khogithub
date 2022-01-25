import { Observable } from './misc.js';
import * as Random from './random.js';


let _idEnum = 0;

class Board {
	constructor(grid) {
		if (!grid) {
			this.grid = Array.from({ length: 4 }, () => {
				return Array.from({ length: 4 }, () => ({val: 0}));
			});
		} else {
			this.grid = grid;
		}
	}

	flat() {
		return this.grid.reduce((result, row, y) => {
			return row.reduce((result, cell, x) => {
				return result.concat([{
					x,
					y,
					val:    cell.val,
					id:     cell.id,
					merged: cell.merged,
				}]);
			}, result);
		}, []);
	}

	count(value) {
		return this.flat()
			.filter(cell => cell.val == value);
	}

	equals(other) {
		return this.grid.every((row, y) => {
			return row.every((cell, x) => {
				return other.grid[y][x].val == cell.val;
			});
		});
	}

	clone() {
		return new Board(this.grid.map(row => row.map(cell => cell)));
	}

	rotate(deg) {
		switch ((deg + 360) % 360) {
			case 0:
				return this.clone();
			case 90:
				return new Board([
					[this.grid[0][3], this.grid[1][3], this.grid[2][3], this.grid[3][3]],
					[this.grid[0][2], this.grid[1][2], this.grid[2][2], this.grid[3][2]],
					[this.grid[0][1], this.grid[1][1], this.grid[2][1], this.grid[3][1]],
					[this.grid[0][0], this.grid[1][0], this.grid[2][0], this.grid[3][0]],
				]);
			case 180:
				return new Board(this.grid.map((row) => row.reverse()).reverse());
			case 270:
				return this.rotate(90).rotate(180);
			default:
				throw new Error(`Can not rotate board by ${deg}deg`);
		}
	}

	// Shifts the cells in the field to the left.
	shift() {
		return new Board(this.grid.map(row => {
			const [ newRow, ] = row
				.filter(cell => cell.val !== 0)
				.reduce(([newRow, prevMerged], cell, x) => {
					if (!newRow.length) {
						return [[cell], false];
					}
					if (newRow[newRow.length-1].val == cell.val && !prevMerged) {
						return [newRow.slice(0, newRow.length-1).concat([{
							val:    cell.val * 2,
							id:     ++_idEnum,
							merged: [newRow[newRow.length-1].id, cell.id],
						}]), true];
					}
					return [newRow.concat([cell]), false];
				}, [[], false]);
			return newRow.concat(Array.from({ length: 4 - newRow.length }, () => ({val: 0})));
		}));
	}
}


export class Game extends Observable {
	constructor() {
		super();
		this.board = new Board();

		// Seed
		for (let i = 0; i < 2; i++) {
			const cell = Random.pick(this.board.count(0));
			this.board.grid[cell.y][cell.x] = {val: 2, id: ++_idEnum};
		}
	}

	move(dir) {
		const deg =
			dir == 'left'  ? 0 :
			dir == 'up'    ? 90 :
			dir == 'right' ? 180 :
			dir == 'down'  ? 270 :
			-1;
		if (deg == -1) {
			throw new Error(`Unknown direction ${dir}`);
		}
		const oldBoard = this.board.clone();
		this.board = this.board.rotate(deg)
			.shift()
			.rotate(-deg);

		if (oldBoard.equals(this.board)) {
			return;
		}

		const cell = Random.pick(this.board.count(0));
		this.board.grid[cell.y][cell.x] = { val: Random.pick([2, 4]), id: ++_idEnum };

		this.trigger('move', {
			oldBoard,
			newBoard: this.board,
			diff: {
				add: this.board.flat().filter(cell => {
					return !oldBoard.flat()
						.some(oldCell => cell.id == oldCell.id);
				}),
				rem: oldBoard.flat().filter(cell => {
					return !this.board.flat()
						.some(newCell => cell.id == newCell.id);
				}),
			},
		});

		if (!this.board.count(0).length) {
			const movePossible = [0, 90, 180, 270]
				.some(deg => this.board.rotate(deg)
					.shift()
					.count(0)
					.length > 0);
			if (!movePossible) {
				this.trigger('lose', {
					score:       this.score(),
					highestCell: this.board.flat()
						.reduce((biggest, cell) => Math.max(cell.val, biggest), 0),
				});
			}
		}

		if (this.board.count(2048).length) {
			this.trigger('win');
		}
	}

	score() {
		return this.board.flat()
			.filter(cell => cell.val > 2)
			.reduce((sum, cell) => sum + cell.val * Math.log2(cell.val >> 1), 0);
	}
}
