import { EnumEnviroments } from "../enums/EnumEnviroments";
import Game from "../scenes/Game";
import Enviroment from "./Enviroment";
import ImageUtils from "../utils/ImageUtils";
import { InventoryBox } from "../UI/InventoryBox";

export default class OfficeDesk extends Enviroment {
    private bg: Phaser.GameObjects.Image;
    private rolodex: Phaser.GameObjects.Image;
    private telephone: Phaser.GameObjects.Image;
    private terminal: Phaser.GameObjects.Image;
    private glasses: Phaser.GameObjects.Image;

    constructor (scene: Game, enviroment: EnumEnviroments) {
        super(scene, enviroment);

        this.load();
    }

    override load() {
        const { width, height } = this.scene.sys.game.scale.gameSize;
		this.bg = this.scene.add.image(width/2, height/2, "desk_bg")
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {this.destroyDialog()});

        let w = 1920;
        let h = 1080;

        this.telephone = this.scene.add.image(0, height/2 - 30, "desk_telephone")
            .setOrigin(0, 0.5)
            .setInteractive()
            .on("pointerdown", () => { this.emitter.emit("changeEnviroment", EnumEnviroments.OFFICE_TELEPHONE)});
        this.rolodex = this.scene.add.image(400, height/2 - 30, "desk_rolodex")
            .setInteractive()
            .on("pointerdown", () => { this.emitter.emit("changeEnviroment", EnumEnviroments.OFFICE_ROLODEX)});
        this.terminal = this.scene.add.image(width, 0, "desk_terminal")
            .setOrigin(1, 0)
            .setInteractive()
            .on("pointerdown", () => { this.emitter.emit("changeEnviroment", EnumEnviroments.OFFICE_TERMINAL)});

        if(InventoryBox.getInstance().isAddedInventory("glasses") == false) {
            this.glasses = this.scene.add.image(550, height/2 + 150, "glasses")
                .setInteractive()
                .on("pointerdown", () => { this.addGlassesToInventory(); });
        }
        super.load();    
    }

    destroyDialog() {
        if(this.inventoryDialog != null) {
            this.inventoryDialog.destroy();
            this.inventoryDialog = null;
        }
    }
    addGlassesToInventory() {
        this.glasses.destroy();
        this.emitter.emit("addInventory", "glasses");
    }

    override goBack() {
        this.emitter.emit("changeEnviroment", EnumEnviroments.OFFICE);
    }

    public override destroy() {
        this.bg.destroy();
        this.telephone.destroy();
        this.rolodex.destroy();
        this.terminal.destroy();
    }
}