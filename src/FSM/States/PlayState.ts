import { EventDispatcher } from "../../utils/EventDispatcher";
import Game from "../../scenes/Game";
import { State } from "../State";
import ImageUtils from "../../utils/ImageUtils";
import Enviroment from "../../Enviroments/enviroment";
import { EnumEnviroments } from "../../enums/EnumEnviroments";
import OfficeEnviroment from "../../Enviroments/OfficeEnviroment";
import OfficeDesk from "../../Enviroments/OfficeDesk";
import OfficeRolodex from "../../Enviroments/OfficeRolodex";
import OfficeTelephone from "../../Enviroments/OfficeTelephone";
import OfficeTerminal from "../../Enviroments/OfficeTerminal";
import { InventoryBox } from "../../UI/InventoryBox";

export class PlayState extends State {
	private bg: Phaser.GameObjects.Image;
	private scene: Game;
	private emitter: EventDispatcher;
    private currentEnviroment: Enviroment;

    private inventoryBox: InventoryBox;
    private menuBtn: Phaser.GameObjects.Text;

	constructor(scene) {
		super();

		this.scene = scene;
		this.emitter = EventDispatcher.getInstance();
		this.emitter.on("gamedResized", this.resize, this);
        this.emitter.on("changeEnviroment", this.changeEnviroment.bind(this));
        this.emitter.on("addInventory", this.addInventory.bind(this));

		const { width, height } = this.scene.sys.game.scale.gameSize;
	}

	resize(imgScale) {
		//bg NOTE doesnt need to reposition or scale
	}

	Enter() {
		const { width, height } = this.scene.sys.game.scale.gameSize;
		//BG
        this.currentEnviroment = new OfficeEnviroment(this.scene, EnumEnviroments.OFFICE);

        this.inventoryBox = new InventoryBox(this.scene, new Phaser.Geom.Rectangle(width/2 - 260, height/2-230, 250, 50));
        this.inventoryBox.setDepth(1000);
        this.menuBtn = this.scene.add.text(width/2 + 220, height/2-240, "MENU")
            .setOrigin(0.5)
            .setPadding(5)
            .setStyle({ 
                backgroundColor: "#666666",
                fixedWidth: 80,
                fixedHeight: 30,
                fontSize: 20
            })
            .setAlign("center")
            .setDepth(1000)
            .setInteractive()
            .on("pointerdown", () => {})
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
}
