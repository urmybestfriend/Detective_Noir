import { EventDispatcher } from "../../utils/EventDispatcher";
import Game from "../../scenes/Game";
import { State } from "../State";
import ImageUtils from "../../utils/ImageUtils";
import { PlayState } from "./PlayState";

export class CaseSummaryState extends State {
	private overlay: Phaser.GameObjects.Graphics;
	private scene: Game;
	private emitter: EventDispatcher;
    private mainRect: Phaser.GameObjects.Rectangle;
    private sceneTitle: Phaser.GameObjects.Text;
    private caseTitleTxt;
    private caseImg: Phaser.GameObjects.Image;
    private caseTitle: Phaser.GameObjects.Text;

    private selectBtn: Phaser.GameObjects.Text;
    private summaryRect: Phaser.GameObjects.Rectangle;

	constructor(scene, caseTitleTxt) {
		super();

		this.scene = scene;
		this.emitter = EventDispatcher.getInstance();
		this.emitter.on("gamedResized", this.resize, this);
        this.caseTitleTxt = caseTitleTxt;
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

        this.mainRect = this.scene.add.rectangle(width / 2, height / 2, width, height, 0xb4b4b4);

        this.sceneTitle = this.scene.add.text(width / 2, 20, "CASE SUMMARY").setOrigin(0.5).setStyle({fontSize: 15, fontColor: "#ffffff"});

        let x = 50;
        let y = 50;
        this.caseImg = this.scene.add.image(x, y, "folder_enable").setOrigin(0.5);
        ImageUtils.zoomImage(this.caseImg, 20, 20);

        this.caseTitle = this.scene.add.text(x, y + 20, this.caseTitleTxt)
            .setOrigin(0.5)
            .setStyle({
                fontSize: 8,
                fontColor: "#ffffff"
            })
        
        this.summaryRect = this.scene.add.rectangle(100, 40, width - 120, height - 50, 0xffffff).setOrigin(0, 0).setStrokeStyle(1, 0x000000);
        
        this.selectBtn = this.scene.add.text(x, height - 20, "SELECT")
            .setOrigin(0.5)
            .setPadding(3)
            .setStyle({ 
                backgroundColor: "#ffffff",
                color: "#b4b4b4",
                fixedWidth: 60,
                fixedHeight: 20,
                fontSize: 12
            })
            .setAlign("center")
            .setInteractive()
            .on("pointerdown", () => { this.playGame() })
	}

	Update() {}

	Exit() {
		this.emitter.off("gamedResized", this.resize, this);

		this.overlay.destroy();
        this.mainRect.destroy();

		this.scene = undefined;
		this.emitter = undefined;
	}

    playGame() {
		this.scene.mainStateMachine.changeState(new PlayState(this.scene));
    }

}
