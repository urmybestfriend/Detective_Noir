import * as Phaser from 'phaser';
import 'phaser/plugins/spine/dist/SpinePluginDebug';
import Preloader from './scenes/Preloader';
import Game from './scenes/Game';
import packageJson from '../package.json';

const config = {
	parent: 'phaser-container',
	dom: {
		createContainer: true
	},
	type: Phaser.AUTO,
	scale: {
		mode: Phaser.Scale.NONE,
		parent: 'phaser-game',
	},
	scene: [Preloader, Game],
	// plugins: {
	// 	scene: [
	// 	],
	// 	global: [
	// 	],
	// },
	mobileWidth: 375,
	version: packageJson.version
}

export default new Phaser.Game(config);
