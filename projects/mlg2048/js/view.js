import { Howl } from 'howler';
import * as Misc from './misc.js';
import * as Random from './random.js';
import { ShaderView } from './shaderview.js';

import BackgroundShader from '../shader/background.frag.glsl';

import AudioSrcAirhorn from '../audio/airhorn.mp3';
import AudioSrcDamnson from '../audio/damnson.mp3';
import AudioSrcHitmarker from '../audio/hitmarker.mp3';
import AudioSrcMomgetthecamera from '../audio/momgetthecamera.mp3';
import AudioSrcOhbabyatriple from '../audio/ohbabyatriple.mp3';
import AudioSrcSad from '../audio/sad.mp3';
import AudioSrcSanic from '../audio/sanic.mp3';
import AudioSrcSmokeweedeveryday from '../audio/smokeweedeveryday.mp3';
import AudioSrcWow from '../audio/wow.mp3';


const Audio = [
	[ 'airhorn', AudioSrcAirhorn ],
	[ 'damnson', AudioSrcDamnson ],
	[ 'hitmarker', AudioSrcHitmarker ],
	[ 'momgetthecamera', AudioSrcMomgetthecamera ],
	[ 'ohbabyatriple', AudioSrcOhbabyatriple ],
	[ 'sad', AudioSrcSad ],
	[ 'sanic', AudioSrcSanic ],
	[ 'smokeweeeveryday', AudioSrcSmokeweedeveryday ],
	[ 'wow', AudioSrcWow ],
].reduce((audio, [ name, src ]) => {
	audio[name] = new Howl({ src: [ src ] });
	return audio;
}, {});

const Anim = {
	async show(elem, duration) {
		let container = document.querySelector('.animations');
		container.appendChild(elem);
		await Misc.sleep(duration);
		container.removeChild(elem);
	},

	// Waits for any DOM elements previously added to be styled.
	async prepareTransition() {
		await Misc.animationFrame();
		await Misc.animationFrame();
	},

	async shake(el, intensity) {
		while (intensity > 0) {
			const transX = Random.uniform() * intensity * 2;
			const transY = Random.uniform() * intensity * 2;
			const rot = Random.uniform() * intensity * 4;
			el.style.transform = `translate(${transX}vw, ${transY}vw) rotate(${rot}deg)`;

			const start = performance.now();
			await Misc.animationFrame();
			intensity = intensity - (performance.now() - start) / 1000;
		}
		el.style.transform = '';
	},

	showGameText(text, duration) {
		let el = Misc.elementFromHtml(`
			<span class="anim anim-text text-game">${text}</span>
		`);
		el.style.left = (Math.random() * 80 + 10)+'%';
		el.style.top  = (Math.random() * 80 + 10)+'%';
		el.style.transform = `rotate(${Random.uniform()*45}deg)`;
		Anim.show(el, duration);
	}
};


export class View {
	constructor(game) {
		this.game = game;
		this.scoreLerp = 1;
		this.timeLevel = 0;

		this.update(game.board);
		this.game.on('move', event => {
			document.querySelector('.game').classList.remove('game-state-begin');
			this.update(event.newBoard);

			const biggestNew = event.diff.add
				.reduce((biggest, cell) => Math.max(biggest, cell.val), 0);
			if (biggestNew == 32) {
				Barage.airhorns();
			} else if (biggestNew == 128) {
				Barage.sanic();
			} else if (biggestNew == 512) {
				Audio.smokeweedeveryday.play();
			} else if (biggestNew > 4) {
				Barage.default();
			}

			event.diff.add
				.filter(cell => cell.merged)
				.forEach((cell, i) => {
					const cellEl = document.getElementById('cell-'+cell.id);
					setTimeout(() => {
						let mark = Misc.elementFromHtml(`
							<div class="anim anim-hitmarker anim-image"></div>
						`);
						const rect = cellEl.getBoundingClientRect();
						const hx = (rect.right - rect.left) / 2;
						const hy = (rect.bottom - rect.top) / 2;
						mark.style.left = (rect.left + hx + hx * 0.5 * Random.uniform())+'px';
						mark.style.top  = (rect.top  + hy + hy * 0.5 * Random.uniform())+'px';
						Anim.show(mark, 500);

						Audio.hitmarker.play();
					}, 100 + 50 * i);
				});

			setTimeout(() => {
				Anim.shake(document.querySelector('.game-board'), event.diff.add.length / 6);
			}, 100);
		});
		this.game.on('lose', event => {
			Audio.sad.play();
			document.querySelector('.game').classList.add('game-state-lose');

			const score = this.game.score();
			var tier =
				score < 400  ? 0 :
				score < 800  ? 1 :
				score < 1600 ? 2 :
				3;
			const texts = document.querySelectorAll(`.lose-tier-${tier}`)
			Random.pick(texts).classList.remove('lose-text');
		});
		this.game.on('win', event => {
			Anim.shake(document.querySelector('.game-board'), 3);
		});

		try {
			const el = document.querySelector('.gl-background');
			let glView = new ShaderView(el, BackgroundShader);
			glView.on('pre-render', event => {
				this.scoreLerp += Math.sqrt(Math.max(this.game.score() - this.scoreLerp, 0) / 80);
				this.timeLevel += Math.min(this.scoreLerp / 1000, 0.5);
				glView.gl.uniform1f(glView.uniform('level'), this.scoreLerp / 512);
				glView.gl.uniform1f(glView.uniform('time_level'), this.timeLevel);
			});
		} catch (err) {
			console.error(err.message);
		}
	}

	update(targetBoard) {
		targetBoard.flat()
			.filter(cell => cell.val > 0)
			.forEach((cell, i) => {
				let cellEl = document.getElementById('cell-'+cell.id);
				if (!cellEl) {
					cellEl = Misc.elementFromHtml(`
						<div class="game-cell game-cell-${cell.val}"><span></span></div>
					`);
					cellEl.id = 'cell-'+cell.id;
					document.querySelector('.game-board-cells').appendChild(cellEl);

					(cell.merged || []).forEach(id => {
						let oldCellEl = document.getElementById('cell-'+id);
						oldCellEl.style.left = (cell.x * 25)+'%';
						oldCellEl.style.top  = (cell.y * 25)+'%';
						oldCellEl.classList.add('fade-out');
						setTimeout(() => oldCellEl.parentNode.removeChild(oldCellEl), 200);
					});
				}
				cellEl.style.left = (cell.x / 4 * 100)+'%';
				cellEl.style.top  = (cell.y / 4 * 100)+'%';
			});
		Array.prototype.forEach.call(document.querySelectorAll('.game-score'), $el => {
			$el.innerHTML = this.game.score();
		}, this);
	}
}

const Barage = {
	default() {
		Random.bool(0.1) && Audio[Random.pick([
			'damnson',
			'momgetthecamera',
			'ohbabyatriple',
			'wow',
		])].play();
		Anim.showGameText(Random.pick([
			'DAYUM',
			'I\'ll rekt u m8',
			'LMAO',
			'XD',
			'sweg',
			'ur whalecum',
			'h8tr',
		]), 500);
	},

	airhorns() {
		for (let i = 0; i < 4; i++) {
			setTimeout(async () => {
				Audio.airhorn.play();

				let airhorn = Misc.elementFromHtml(`
					<div class="anim anim-airhorn">
						<div class="anim-image"></div>
					</div>
				`);
				airhorn.style.top  = (Math.random() * 80 + 10)+'%';
				airhorn.style.left = (Math.random() * 80 + 10)+'%';
				const rotStart = Random.uniform() * 60;
				let rotEl = airhorn.querySelector('.anim-image');
				rotEl.style.transform = `rotate(${rotStart}deg)`;
				Anim.show(airhorn, 1500);
				await Anim.prepareTransition();
				const rotEnd = rotStart + Random.inv() * (30 + 240 * Math.random());
				rotEl.style.transform = `rotate(${rotEnd}deg)`;
			}, 200 * i);
		}
	},

	async sanic() {
		Audio.sanic.play();

		['such speed', '2fast4me', 'sanic hegehog', 'gtg fast', 'catch me m8']
			.forEach((text, i) => {
				setTimeout(() => Anim.showGameText(text, 500), 100 + i * 300);
			});

		for (let i = 0; i < 6; i++) {
			setTimeout(async () => {
				let sanic = Misc.elementFromHtml(`
					<div class="anim anim-sanic">
						<div class="anim-image"></div>
					</div>
				`);
				const a = Math.random() * 0.8 + 0.1;
				const b = Math.random() * 0.8 + 0.1;
				const cont = document.querySelector('.animations');
				const angrad = Math.atan2(cont.clientWidth, cont.clientHeight * (a - b)) - Math.PI/2;
				sanic.querySelector('.anim-image').style.transform = `rotate(${angrad}rad)`;
				sanic.style.left = '-300px';
				sanic.style.top  = `${a * 100}%`;
				Anim.show(sanic, 2000);
				await Anim.prepareTransition();
				sanic.style.top  = `${b * 100}%`;
				sanic.style.left = 'calc(100% + 300px)';
			}, 300 * i);
		}
	},
};
