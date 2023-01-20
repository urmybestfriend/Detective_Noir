import { EnumScene } from "../enums/EnumScene";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import { Input, Scene } from "phaser";
import GameUI from "./GameUI";
import { StateMachine } from "../FSM/StateMachine";
import { MainMenuState } from "../FSM/States/MainMenuState";
import Progress from "../utils/Progress";
import Transition from "../utils/Transition";
import InputHandler from "../Input/InputHandler";

type scaleMode = "FIT" | "SMOOTH";
const DEFAULT_WIDTH: number = 200;
const DEFAULT_HEIGHT: number = 600;
const MAX_WIDTH: number = 1920;
const MAX_HEIGHT: number = 1080;
let SCALE_MODE: scaleMode = "SMOOTH"; // FIT OR SMOOTH

export default class Game extends Phaser.Scene {
	public rexUI: RexUIPlugin;
	public mainStateMachine: StateMachine;
	public progress: Progress;
	public transition: Transition;
	public inputHandler: InputHandler;

	private _ui: Scene;

	public get ui(): Scene {
		return this._ui;
	}

	constructor() {
		super(EnumScene.GAME);
	}
	create() {
		this.resize(); //set the dimensions before anything else

		this._ui = this.scene.add("GameUI", GameUI, true, { x: 0, y: 0 });

		this.progress = new Progress(this);
		this.mainStateMachine = new StateMachine();
		this.mainStateMachine.Initialize(new MainMenuState(this));
		this.transition = new Transition(this);
		this.inputHandler = new InputHandler(this);

		window.addEventListener("resize", (event) => {
			this.resize();
		});

		this.sound.mute = "isMuted" in localStorage;
	}

	resize() {
	}

	update() {
	}
	
}
