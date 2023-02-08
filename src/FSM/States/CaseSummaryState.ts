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

        
        const scaleX = this.scene.sys.game.canvas.width / 1920;
        const scaleY = this.scene.sys.game.canvas.height / 1080;	

        this.mainRect = this.scene.add.rectangle(width / 2, height / 2, width*scaleX, height*scaleY, 0xb4b4b4);

        this.sceneTitle = this.scene.add.text(width / 2, (height - (height * scaleY)) / 2 + 40, "CASE SUMMARY").setOrigin(0.5).setStyle({fontSize: 40, fontColor: "#ffffff"});

        let x = (width - (width*scaleX)) / 2 + 80;
        let y = (height - (height * scaleY)) / 2 + 150;
        this.caseImg = this.scene.add.image(x, y, "folder_enable").setOrigin(0.5);
        this.caseTitle = this.scene.add.text(x, y + 40, this.caseTitleTxt)
            .setOrigin(0.5)
            .setStyle({
                fontSize: 15,
                fontColor: "#ffffff"
            })
        
        this.summaryRect = this.scene.add.rectangle(width / 2 + 70, height / 2 + 30, width*scaleX - 200, height*scaleY - 150, 0xffffff).setStrokeStyle(1, 0x000000);
        
        this.selectBtn = this.scene.add.text(x, (height*scaleY) + (height - (height*scaleY))/2 - 80, "SELECT")
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ 
                backgroundColor: "#ffffff",
                color: "#b4b4b4",
                fixedWidth: 150,
                fixedHeight: 50,
                fontSize: 30
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
