import { EventDispatcher } from "../../utils/EventDispatcher";
import Game from "../../scenes/Game";
import { State } from "../State";
import ImageUtils from "../../utils/ImageUtils";
import Enviroment from "../../Enviroments/Enviroment";
import { EnumEnviroments } from "../../enums/EnumEnviroments";
import OfficeEnviroment from "../../Enviroments/OfficeEnviroment";
import OfficeDesk from "../../Enviroments/OfficeDesk";
import OfficeRolodex from "../../Enviroments/OfficeRolodex";
import OfficeTelephone from "../../Enviroments/OfficeTelephone";
import OfficeTerminal from "../../Enviroments/OfficeTerminal";
import { InventoryBox } from "../../UI/InventoryBox";
import { EndState } from "./EndState";

export class PlayState extends State {
	private scene: Game;
	private emitter: EventDispatcher;
    private currentEnviroment: Enviroment;

    private inventoryBox: InventoryBox;
    private menuBtn: Phaser.GameObjects.Text;
    private backBtn: Phaser.GameObjects.Text;


	constructor(scene) {
		super();

		this.scene = scene;
		this.emitter = EventDispatcher.getInstance();
		this.emitter.on("gamedResized", this.resize, this);
        this.emitter.on("changeEnviroment", this.changeEnviroment.bind(this));
        this.emitter.on("addInventory", this.addInventory.bind(this));

        this.emitter.on("showInventoryDialog", this.showInventoryDialog.bind(this));

        this.emitter.on("endGame", this.endGame.bind(this));
		const { width, height } = this.scene.sys.game.scale.gameSize;
	}

	resize(imgScale) {
		//bg NOTE doesnt need to reposition or scale
	}

	Enter() {
		const { width, height } = this.scene.sys.game.scale.gameSize;
		//BG
        this.currentEnviroment = new OfficeEnviroment(this.scene, EnumEnviroments.OFFICE);

        this.inventoryBox = new InventoryBox(this.scene, new Phaser.Geom.Rectangle(5, 15, 100, 20));
        this.inventoryBox.setDepth(1000);
        this.menuBtn = this.scene.add.text(width-50, 15, "MENU")
            .setOrigin(0.5)
            .setPadding(3)
            .setStyle({ 
                backgroundColor: "#666666",
                fixedWidth: 35,
                fixedHeight: 15,
                fontSize: 8
            })
            .setAlign("center")
            .setDepth(1000)
            .setInteractive()
            .on("pointerdown", () => {})
        this.backBtn = this.scene.add.text(width-20, 15, "↩")
            .setOrigin(0.5)
            .setPadding(3)
            .setStyle({
                backgroundColor: "#666666",
                fixedWidth: 15,
                fixedHeight: 15,
                fontSize: 8
            })
            .setAlign("center")
            .setDepth(1000)
            .setInteractive()
            .on("pointerdown", () => { this.currentEnviroment.goBack() })
    }

	Update() {}

	Exit() {
		this.emitter.off("gamedResized", this.resize, this);

		this.scene = undefined;
		this.emitter = undefined;
	}

    changeEnviroment(enviroment: EnumEnviroments) {
        var t = this;
        let transitionObject: any = {
            callback: () => {
                switch(enviroment) {
                    case EnumEnviroments.OFFICE:
                        t.currentEnviroment.destroy();
                        t.currentEnviroment = new OfficeEnviroment(this.scene, EnumEnviroments.OFFICE);
                        break;
                    case EnumEnviroments.OFFICE_DESK:
                        t.currentEnviroment.destroy();
                        t.currentEnviroment = new OfficeDesk(this.scene, EnumEnviroments.OFFICE_DESK);
                        break;
                    case EnumEnviroments.OFFICE_ROLODEX:
                        t.currentEnviroment.destroy();
                        t.currentEnviroment = new OfficeRolodex(this.scene, EnumEnviroments.OFFICE_ROLODEX);
                        break;
                    case EnumEnviroments.OFFICE_TELEPHONE:
                        t.currentEnviroment.destroy();
                        t.currentEnviroment = new OfficeTelephone(this.scene, EnumEnviroments.OFFICE_TELEPHONE);
                        break;
                    case EnumEnviroments.OFFICE_TERMINAL:
                        t.currentEnviroment.destroy();
                        t.currentEnviroment = new OfficeTerminal(this.scene, EnumEnviroments.OFFICE_TERMINAL);
                        break;
                }
            }
        }
        this.emitter.emit("onTransition", transitionObject);
    }

    addInventory(imgName) {
        this.inventoryBox.addInventory(imgName);
    }

    showInventoryDialog(txt: String) {
        this.currentEnviroment.showInventoryDialog(txt);
    }
    endGame() {
        this.inventoryBox.destroy();
        this.menuBtn.destroy();
        this.backBtn.destroy();
		this.scene.mainStateMachine.changeState(new EndState(this.scene));
    }
}
