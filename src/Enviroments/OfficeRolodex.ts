import { EnumEnviroments } from "~/enums/EnumEnviroments";
import Game from "../scenes/Game";
import Enviroment from "./enviroment";
import ImageUtils from "../utils/ImageUtils";

export default class OfficeRolodex extends Enviroment {
    private bg: Phaser.GameObjects.Image;
    private rolodex: Phaser.GameObjects.Image;
    private btn1: Phaser.GameObjects.Text;
    private btn2: Phaser.GameObjects.Text;

    constructor (scene: Game, enviroment: EnumEnviroments) {
        super(scene, enviroment);

        this.load();
    }

    override load() {
        const { width, height } = this.scene.sys.game.scale.gameSize;
		this.bg = this.scene.add.image(width/2, height/2, "white_bg").setOrigin(0.5);
		ImageUtils.fitImage(this.bg, this.scene)

        const scaleX = this.scene.sys.game.canvas.width / 1920;
        const scaleY = this.scene.sys.game.canvas.height / 1080;	
        let x = (width - (width*scaleX)) / 2;
        let y = (height - (height * scaleY)) / 2;
        let w = width*scaleX;
        let h = height*scaleY;

        this.rolodex = this.scene.add.image(x + w/2, y + h, "rolodex_zoom").setOrigin(0.5, 1);
        ImageUtils.fitImage(this.rolodex, this.scene);

        
        this.btn1 = this.scene.add.text(x + w/2 - 200, y + h/2 - 100, "Q")
            .setOrigin(0.5)
            .setPadding(5)
            .setStyle({ 
                backgroundColor: "#666666",
                fixedWidth: 50,
                fixedHeight: 50,
                fontSize: 40
            })
            .setAlign("center")
            .setInteractive()
            .on("pointerdown", () => {})
            
        this.btn2 = this.scene.add.text(x + w/2 + 200, y + h/2 - 100, "E")
            .setOrigin(0.5)
            .setPadding(5)
            .setStyle({ 
                backgroundColor: "#666666",
                fixedWidth: 50,
                fixedHeight: 50,
                fontSize: 40
            })
            .setAlign("center")
            .setInteractive()
            .on("pointerdown", () => {})
    }

    public override destroy() {
        this.bg.destroy();
        this.rolodex.destroy();
        this.btn1.destroy();
        this.btn2.destroy();
    }
}