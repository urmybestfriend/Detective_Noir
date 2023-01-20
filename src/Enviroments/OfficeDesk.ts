import { EnumEnviroments } from "../enums/EnumEnviroments";
import Game from "../scenes/Game";
import Enviroment from "./enviroment";
import ImageUtils from "../utils/ImageUtils";

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
		this.bg = this.scene.add.image(width/2, height/2, "desk_bg").setOrigin(0.5);
		ImageUtils.fitImage(this.bg, this.scene)

        const scaleX = this.scene.sys.game.canvas.width / 1920;
        const scaleY = this.scene.sys.game.canvas.height / 1080;	
        let x = (width - (width*scaleX)) / 2;
        let y = (height - (height * scaleY)) / 2;
        let w = width*scaleX;
        let h = height*scaleY;

        this.telephone = this.scene.add.image(x, y + h/2 - 30, "desk_telephone")
            .setOrigin(0, 0.5)
            .setInteractive()
            .on("pointerdown", () => { this.emitter.emit("changeEnviroment", EnumEnviroments.OFFICE_TELEPHONE)});
        ImageUtils.fitImage(this.telephone, this.scene)
        this.rolodex = this.scene.add.image(x + 200, y + h/2 - 30, "desk_rolodex")
            .setInteractive()
            .on("pointerdown", () => { this.emitter.emit("changeEnviroment", EnumEnviroments.OFFICE_ROLODEX)});
        ImageUtils.fitImage(this.rolodex, this.scene) 
        this.terminal = this.scene.add.image(x + w, y, "desk_terminal")
            .setOrigin(1, 0)
            .setInteractive()
            .on("pointerdown", () => { this.emitter.emit("changeEnviroment", EnumEnviroments.OFFICE_TERMINAL)});
        ImageUtils.fitImage(this.terminal, this.scene)

        this.glasses = this.scene.add.image(x + 280, y + h/2 + 50, "glasses")
            .setInteractive()
            .on("pointerdown", () => { this.addGlassesToInventory(); });
        ImageUtils.fitImage(this.glasses, this.scene)
        super.load();    
    }

    addGlassesToInventory() {
        this.glasses.destroy();
        this.emitter.emit("addInventory", "glasses");
    }

    public override destroy() {
        this.bg.destroy();
        this.telephone.destroy();
        this.rolodex.destroy();
        this.terminal.destroy();
    }
}