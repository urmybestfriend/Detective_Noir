import { EnumEnviroments } from "~/enums/EnumEnviroments";
import Game from "../scenes/Game";
import Enviroment from "./enviroment";
import ImageUtils from "../utils/ImageUtils";

export default class OfficeTelephone extends Enviroment {
    private bg: Phaser.GameObjects.Image;
    private telephone: Phaser.GameObjects.Image;

    constructor (scene: Game, enviroment: EnumEnviroments) {
        super(scene, enviroment);

        this.load();
    }

    override load() {
        const { width, height } = this.scene.sys.game.scale.gameSize;
		this.bg = this.scene.add.image(width/2, height/2, "telephone_zoom_bg").setOrigin(0.5);
		ImageUtils.fitImage(this.bg, this.scene)

        const scaleX = this.scene.sys.game.canvas.width / 1920;
        const scaleY = this.scene.sys.game.canvas.height / 1080;	
        let x = (width - (width*scaleX)) / 2;
        let y = (height - (height * scaleY)) / 2;
        let w = width*scaleX;
        let h = height*scaleY;

        this.telephone = this.scene.add.image(x + w/2, y + h/2, "telephone_zoom").setOrigin(0.5);
        ImageUtils.fitImage(this.telephone, this.scene);
    }

    public override destroy() {
        this.bg.destroy();
        this.telephone.destroy();
    }
}