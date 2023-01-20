import { EventDispatcher } from "../../utils/EventDispatcher";
import Game from "../../scenes/Game";
import { State } from "../State";
import NinePatch from "phaser3-rex-plugins/plugins/ninepatch2";
import ImageUtils from "../../utils/ImageUtils";
import Progress from "../../utils/Progress";
import { CaseSelectState } from "./CaseSelectState";

export class CharacterSelectState extends State {
	private bg: Phaser.GameObjects.Image;
	private overlay: Phaser.GameObjects.Graphics;
	private buttons: Phaser.GameObjects.Text[] = [];
	private scene: Game;
	private emitter: EventDispatcher;

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

        this.bg = this.scene.add.image(width / 2, height / 2, "character_select_bg").setOrigin(0.5);
		ImageUtils.fitImage(this.bg, this.scene);

        const scaleX = this.scene.sys.game.canvas.width / 1920;
		//Buttons
		this.createButtons(
			width*scaleX / 4 + (width - width*scaleX)/2,
			height - 50,
			150,
			50,
			10,
			["SELECT", "SELECT"],
			[
				this.girlSelect.bind(this),
				this.boySelect.bind(this),
			]
		);
		
	}

	Update() {}

	Exit() {
		this.emitter.off("gamedResized", this.resize, this);

		for (let i = 0; i < this.buttons.length; i++) {
			this.buttons[i].destroy();
		}

		this.bg.destroy();
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
        const scaleX = this.scene.sys.game.canvas.width / 1920;
		for (let index = 0; index < labels.length; index++) {
			const btn = this.scene.add.text(x + (this.scene.sys.canvas.width*scaleX / 2) * index, y, labels[index])
							.setOrigin(0.5)
							.setPadding(padding)
							.setStyle({ 
								backgroundColor: "#b4b4b4",
								fixedWidth: width,
                                fixedHeight: height,
								fontSize: 30
							})
							.setAlign("center")
							.setInteractive({ useHandCursor: true })
							.on("pointerup", cbs[index])
            
			this.buttons.push(btn)
			this.scene.add.existing(btn);
		}
	}

	showTutorial() {
		// this.scene.tutorial.show();
	}

    girlSelect() {
		this.scene.mainStateMachine.changeState(new CaseSelectState(this.scene));
    }

    boySelect() {
		this.scene.mainStateMachine.changeState(new CaseSelectState(this.scene));
    }

	continueGame() {
	}
}
