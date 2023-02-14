import { EnumEnviroments } from "../enums/EnumEnviroments";
import Game from "../scenes/Game";
import Enviroment from "./Enviroment";
import ImageUtils from "../utils/ImageUtils";
import { InventoryBox } from "../UI/InventoryBox";
import TextDialog from "../UI/TextDialog";
import { NinesliceButton } from "../UI/NineSliceButton";

export default class OfficeTelephone extends Enviroment {
    private bg: Phaser.GameObjects.Image;
    private telephone: Phaser.GameObjects.Image;
    private phoneDialog: TextDialog = null;
    private phoneDialogBtns: NinesliceButton[] = [];
    private isNextDialogBtnClicked: Boolean = false;

    constructor (scene: Game, enviroment: EnumEnviroments) {
        super(scene, enviroment);

        this.load();
    }

    override load() {
        const { width, height } = this.scene.sys.game.scale.gameSize;
		this.bg = this.scene.add.image(width/2, height/2, "telephone_zoom_bg")
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerdown", () => {this.destroyDialog()});
        ImageUtils.fitImage(this.bg, this.scene)

        this.telephone = this.scene.add.image(width/2, height/2, "telephone_zoom")
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerup", () => { this.callSb() })
        ImageUtils.zoomImage(this.telephone, width/2, height/2)
    }

    callSb() {
        if(this.phoneDialog == null && this.inventoryDialog == null) {
            if(InventoryBox.getInstance().selectedInventoryName != "card") {
                if(InventoryBox.getInstance().IsVerifiedPensioner == true) {
                    InventoryBox.getInstance().setIsHaveCredential(true);
                    this.phoneDialog = new TextDialog(this.scene, "Pensioner reactivated credentials");
                } else {
                    this.phoneDialog = new TextDialog(this.scene, "Asks player to stop prank call");
                }
            } else {
                this.phoneDialog = new TextDialog(this.scene, "talks about what Buddy had for dinner");
                this.showPhoneDialogBtns();
            }
        } else {
            if(this.isNextDialogBtnClicked == false)
                this.destroyDialog();
            else 
                this.isNextDialogBtnClicked = false;
        }
    }

    showPhoneDialogBtns() {
        const {width, height} = this.scene.sys.canvas;
        if(this.phoneDialogBtns.length == 0) {
            const btn1 = new NinesliceButton(
                this.scene, 
                new Phaser.Math.Vector2(width / 2, height + 20),
                "dialog_bg.png", 
                "Know about the pensioner", 
                [13, 13, 13, 13], 
                () => { this.nextPhoneDialog() },
                "#ffffff",
                new Phaser.Math.Vector2(150, 20)
            );
            this.scene.tweens.add({
                targets : btn1,
                x: width / 2,
                y: height - 30,
                ease: "Linear",
                duration: 300,
                yoyo: false,
            });
            
            this.phoneDialogBtns.push(btn1);
        }
    }
    nextPhoneDialog() {
        this.isNextDialogBtnClicked = true;
        if(this.phoneDialogBtns != null) {
            for(let i = 0; i < this.phoneDialogBtns.length; i ++) 
                this.phoneDialogBtns[i].destroy();
            this.phoneDialogBtns = [];
        }
        if(this.phoneDialog != null) { 
            this.phoneDialog.destroy();
            this.phoneDialog = null;
        }
        this.phoneDialog = new TextDialog(this.scene, "Receive credentials");
        InventoryBox.getInstance().setIsVerifiedPensioner(true);
    }

    destroyDialog() {
        if(this.phoneDialogBtns != null) {
            for(let i = 0; i < this.phoneDialogBtns.length; i ++) 
                this.phoneDialogBtns[i].destroy();
            this.phoneDialogBtns = [];
        }
        if(this.phoneDialog != null) { 
            this.phoneDialog.destroy();
            this.phoneDialog = null;
        }
        if(this.inventoryDialog != null) {
            this.inventoryDialog.destroy();
            this.inventoryDialog = null;
        }
    }
    override goBack() {
        this.emitter.emit("changeEnviroment", EnumEnviroments.OFFICE_DESK);
    }

    public override destroy() {
        this.bg.destroy();
        this.telephone.destroy();
    }
}