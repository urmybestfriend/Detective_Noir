import { EventDispatcher } from "../../utils/EventDispatcher";
import Game from "../../scenes/Game";
import { State } from "../State";
import ImageUtils from "../../utils/ImageUtils";
import { CaseSummaryState } from "./CaseSummaryState";

export class CaseSelectState extends State {
	private overlay: Phaser.GameObjects.Graphics;
	private scene: Game;
	private emitter: EventDispatcher;
    private mainRect: Phaser.GameObjects.Rectangle;
    private sceneTitle: Phaser.GameObjects.Text;
    private caseTitles = [
        {
            title: "CASE #1", 
            status: true
        },
        {
            title: "CASE #2", 
            status: true
        },  
        {
            title: "CASE #3", 
            status: true
        },
        {
            title: "CASE #4", 
            status: false
        },
        {
            title: "CASE #5", 
            status: false
        },
        {
            title: "CASE #6", 
            status: false
        },
        {
            title: "CASE #7", 
            status: false
        },
        {
            title: "CASE #8", 
            status: false
        },
        {
            title: "CASE #9", 
            status: false
        },
        {
            title: "CASE #10", 
            status: false
        },
        {
            title: "CASE #11", 
            status: false
        },
        {
            title: "CASE #12", 
            status: false
        },
    ];
    private caseBtnImg: Phaser.GameObjects.Image[] = [];
    private caseBtnTitle: Phaser.GameObjects.Text[] = [];

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

        
        const scaleX = this.scene.sys.game.canvas.width / 1920;
        const scaleY = this.scene.sys.game.canvas.height / 1080;	

        this.mainRect = this.scene.add.rectangle(width / 2, height / 2, width*scaleX, height*scaleY, 0xb4b4b4);

        this.sceneTitle = this.scene.add.text(width / 2, (height - (height * scaleY)) / 2 + 40, "SELECT_CASE").setOrigin(0.5).setStyle({fontSize: 40, fontColor: "#ffffff"});

        for (let index = 0; index < this.caseTitles.length; index ++) {
            let x = (width - (width*scaleX)) / 2 + 80 + (index % 4) * ((width * scaleX - 160) / 3);
            let y = (height - (height * scaleY)) / 2 + 150 + Math.floor((index / 4)) * ((width * scaleX-100) / 3);
            const btnImg = this.scene.add.image(x, y, this.caseTitles[index].status?"folder_enable":"folder_disable")
                .setOrigin(0.5)
                .setInteractive()
                .on("pointerdown", () => { this.caseSummary(this.caseTitles[index].title)});
            ImageUtils.zoomImage(btnImg, 50, 50)
            
            const btnTitleTxt = this.scene.add.text(x, y + 40, this.caseTitles[index].title).setOrigin(0.5);
            btnTitleTxt.setStyle({
                fontSize: 15,
                fontColor: "#ffffff"
            })
            this.caseBtnImg.push(btnImg);
            this.caseBtnTitle.push(btnTitleTxt);
        }
	}

	Update() {}

	Exit() {
		this.emitter.off("gamedResized", this.resize, this);

		this.overlay.destroy();
        this.mainRect.destroy();
        this.sceneTitle.destroy();

        for(let index = 0; index < this.caseTitles.length; index ++) {
            this.caseBtnImg[index].destroy();
            this.caseBtnTitle[index].destroy();
        }

		this.scene = undefined;
		this.emitter = undefined;
	}

    caseSummary(title) {
		this.scene.mainStateMachine.changeState(new CaseSummaryState(this.scene, title));
    }


}
