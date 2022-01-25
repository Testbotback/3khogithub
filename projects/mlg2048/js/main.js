'use strict';

import 'babel-polyfill';

import 'normalize.css';
import '../style/style.scss';
import '../style/game.scss';
import '../style/animations.scss';

import { default as Hammer } from 'hammerjs';
import { Game } from './game.js';
import * as Misc from './misc.js';
import { View } from './view.js';


let game = new Game();
let view = new View(game);

game.on('lose', event => {
	_paq.push(['trackEvent', 'GameOver', `score: ${event.score}, highest: ${event.highestCell}`]);
});

let transitioning = false;
document.onkeydown = async (event=window.event) => {
	switch (event.keyCode) {
		case 87:
		case 38:
			if (!transitioning) game.move('up');
			event.preventDefault();
			break;
		case 83:
		case 40:
			if (!transitioning) game.move('down');
			event.preventDefault();
			break;
		case 65:
		case 37:
			if (!transitioning) game.move('left');
			event.preventDefault();
			break;
		case 68:
		case 39:
			if (!transitioning) game.move('right');
			event.preventDefault();
			break;
	}
	transitioning = true;
	await Misc.sleep(100);
	transitioning = false;
};

let hammertime = new Hammer(document.querySelector('.game-board'));
hammertime.get('swipe').set({direction: Hammer.DIRECTION_ALL});
hammertime.on('swipe', event => {
	const d = Math.round((event.angle + 360) % 360 / 90) % 4;
	game.move(['right', 'down', 'left', 'up'][d]);
});

document.querySelector('.epilepsy-warning').addEventListener('click', event => {
	event.target.classList.add('hide');
});
