import { EventDispatcher } from "../../utils/EventDispatcher";
import Game from "../../scenes/Game";
import { State } from "../State";
import ImageUtils from "../../utils/ImageUtils";
import { CharacterSelectState } from "./CharacterSelectState";

export class MainMenuState extends State {
	private bg: Phaser.GameObjects.Image;
	private overlay: Phaser.GameObjects.Graphics;
	private buttons: Phaser.GameObjects.Text[] = [];
	private scene: Game;
	private emitter: EventDispatcher;
	private doorObj: Phaser.GameObjects.Image;

	constructor(scene) {
		super();

		this.scene = scene;
		this.emitter = EventDispatcher.getInstance();
		this.emitter.on("gamedResized", this.resize, this);

		const { width, height } = this.scene.sys.game.scale.gameSize;
	}

	resize(imgScale) {
		const { width, height } = this.scene.sys.game.scale.gameSize;
		//bg NOTE doesnt need to reposition or scale
		//overlay
		this.overlay.x = -(1920 - width) / 2; //NOTE why does this work??
		//logo
	}

	Enter() {
		const { width, height } = this.scene.sys.game.scale.gameSize;
		//Overlay
		this.overlay = this.scene.add.graphics();
		this.overlay.fillStyle(0xffffff);
		this.overlay.fillRect(0, 0, width, height);
		//BG

		this.doorObj = this.scene.add.image(width / 4, height / 4 * 3, "door").setOrigin(0, 1);
		ImageUtils.fitImage(this.doorObj, this.scene)
		//Buttons
		this.createButtons(
			width / 3 * 2 - 100,
			height / 3,
			200,
			50,
			10,
			["START", "HOW", "OPTIONS"],
			[
				this.startNewGame.bind(this),
				this.showTutorial.bind(this),
				this.showOption.bind(this),
			]
		);
		
	}

	Update() {}

	Exit() {
		this.emitter.off("gamedResized", this.resize, this);

		for (let i = 0; i < this.buttons.length; i++) {
			this.buttons[i].destroy();
		}


		this.overlay.destroy();
		this.buttons = [];

		this.scene = undefined;
		this.emitter = undefined;
	}

	createButtons(
		x: number,
		y: number,
		width: number,
		height: number,
		padding: number,
		labels: string[],
		cbs: Function[]
	) {
		for (let index = 0; index < labels.length; index++) {
			const btn = this.scene.add.text(x, y + 70 * index, labels[index])
						.setOrigin(0.5)
						.setPadding(padding)
						.setStyle({ 
							backgroundColor: "#b4b4b4",
							fixedWidth: width,
							fixedHeight: height,
							fontSize: 30
						})
						.setAlign("center")
						.setInteractive({useHandCursor: true})
						.once("pointerdown", cbs[index])

			this.buttons.push(btn)
			this.scene.add.existing(btn);
		}
	}

	showTutorial() {
		// this.scene.tutorial.show();
	}

	showOption() {
	}

	startNewGame() {
		this.scene.mainStateMachine.changeState(new CharacterSelectState(this.scene));
	}

}
