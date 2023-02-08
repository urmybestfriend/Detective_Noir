import { EventDispatcher } from "../../utils/EventDispatcher";
import Game from "../../scenes/Game";
import { State } from "../State";
import InputSelector from "../../UI/InputSelector";
import ImageUtils from "../../utils/ImageUtils";

export class EndState extends State {
	private scene: Game;
	private emitter: EventDispatcher;
	private overlay: Phaser.GameObjects.Graphics;
    private mainRect: Phaser.GameObjects.Rectangle;
    private sceneTitle: Phaser.GameObjects.Text;
    private badge: Phaser.GameObjects.Image;
    private submitInput: InputSelector;
    private submitBtn: Phaser.GameObjects.Text;

	constructor(scene) {
		super();

		this.scene = scene;
		this.emitter = EventDispatcher.getInstance();
	}

	resize(imgScale) {
		const { width, height } = this.scene.sys.game.scale.gameSize;
		//bg NOTE doesnt need to reposition or scale
		//overlay
		this.overlay.x = -(1920 - width) / 2; //NOTE why does this work??
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
        this.sceneTitle = this.scene.add.text(width / 2, (height - (height * scaleY)) / 2 + 40, "WELL DONE").setOrigin(0.5).setStyle({fontSize: 40, fontColor: "#000000"});

        this.badge = this.scene.add.image(width/2, height/2 - 100, "badge");

        this.submitInput = new InputSelector(
            this.scene,
            {
              x: width / 2,
              y: height / 2,
              width: 300,
              height: 48,
            },
            "",
            () => {}
        )
        this.submitBtn = this.scene.add.text(width/2 + 100, height/2 + 100, "SUBMIT")
                        .setOrigin(0.5)
                        .setPadding(5)
                        .setStyle({ 
                            backgroundColor: "#333333",
                            fixedWidth: 100,
                            fixedHeight: 30,
                            fontSize: 20
                        })
                        .setAlign("center")
                        .setInteractive({ useHandCursor: true })
    }

	Update() {}

	Exit() {
		this.emitter.off("gamedResized", this.resize, this);

		this.scene = undefined;
		this.emitter = undefined;
	}
}
