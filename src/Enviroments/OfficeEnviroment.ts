import Game from "../scenes/Game";
import Enviroment from "./enviroment";
import { EnumEnviroments } from "../enums/EnumEnviroments";
import ImageUtils from "../utils/ImageUtils";
import TextDialog from "../UI/TextDialog";

export default class OfficeEnviroment extends Enviroment {
    
    private bg: Phaser.GameObjects.Image;
    private desk: Phaser.GameObjects.Rectangle;
    private chair: Phaser.GameObjects.Rectangle;
    private files: Phaser.GameObjects.Rectangle;
    private terminal: Phaser.GameObjects.Image;
    private telephone: Phaser.GameObjects.Image;
    private badge: Phaser.GameObjects.Image;
    private gent: Phaser.GameObjects.Image;
    private gentDialog: TextDialog = null;

    constructor(scene: Game, enviroment: EnumEnviroments) {
        super(scene, enviroment);

        this.load();
    }

    override load(): void {
		const { width, height } = this.scene.sys.game.scale.gameSize;
		this.bg = this.scene.add.image(width/2, height/2, "office_bg")
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerdown", () => { this.destroyDialog() });
		ImageUtils.fitImage(this.bg, this.scene)

        const scaleX = this.scene.sys.game.canvas.width / 1920;
        const scaleY = this.scene.sys.game.canvas.height / 1080;	
        let x = (width - (width*scaleX)) / 2;
        let y = (height - (height * scaleY)) / 2;
        let w = width*scaleX;
        let h = height*scaleY;

        this.desk = this.scene.add.rectangle(x + w/2 - 30, y + h - 150, 250, 150, 0x666666)
            .setInteractive()
            .on("pointerdown", () => { this.emitter.emit("changeEnviroment", EnumEnviroments.OFFICE_DESK) })
        this.chair = this.scene.add.rectangle(x + w/2 + 20, y + h - 100, 50, 90, 0xb4b4b4)
        this.files = this.scene.add.rectangle(x + w - 120, y + h/2 + 70, 80, 270, 0xb4b4b4)

        this.terminal = this.scene.add.image(x + w/2 - 120, y + h - 265, "terminal")
        ImageUtils.fitImage(this.terminal, this.scene)
        this.gent = this.scene.add.image(x + w/2 - 30, y + h - 275, "gent")
            .setInteractive()
            .on("pointerdown", () => { this.showGentDialog("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquet, felis vel rhoncus pellentesque, neque orcirementum metus, vitae tempor ligula ipsum vel") });
        ImageUtils.fitImage(this.gent, this.scene) 
        this.telephone = this.scene.add.image(x + w/2 + 50, y + h - 240, "telephone");
        ImageUtils.fitImage(this.telephone, this.scene)
        this.badge = this.scene.add.image(x + w/2 - 30, y + h/2 - 100, "badge");
        ImageUtils.fitImage(this.badge, this.scene)
        super.load();
    }

    showGentDialog(txt) {
        if(this.gentDialog == null)
            this.gentDialog = new TextDialog(this.scene, txt);
    }

    destroyDialog() {
        if(this.gentDialog != null) {
            this.gentDialog.destroy();
            this.gentDialog = null;
        }
    }
    public override destroy() {
        this.bg.destroy();
        this.desk.destroy();
        this.chair.destroy();
        this.files.destroy();
        this.gent.destroy();

        this.terminal.destroy();
        this.telephone.destroy();
        this.badge.destroy();
    }
}