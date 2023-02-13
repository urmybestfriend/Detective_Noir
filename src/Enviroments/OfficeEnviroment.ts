import Game from "../scenes/Game";
import Enviroment from "./Enviroment";
import { EnumEnviroments } from "../enums/EnumEnviroments";
import ImageUtils from "../utils/ImageUtils";
import TextDialog from "../UI/TextDialog";
import { NinesliceButton } from "../UI/NineSliceButton";
import { InventoryBox } from "../UI/InventoryBox";
import RecruitmentPopup from "../UI/RecruitmentPopups";

export default class OfficeEnviroment extends Enviroment {
    
    private bg: Phaser.GameObjects.Image;
    private desk: Phaser.GameObjects.Image;
    private lamp: Phaser.GameObjects.Image;
    private chair: Phaser.GameObjects.Rectangle;
    private terminal: Phaser.GameObjects.Image;
    private telephone: Phaser.GameObjects.Image;
    private badge: Phaser.GameObjects.Image;
    private gent: Phaser.GameObjects.Image;
    private gentDialog: TextDialog = null;
    private recruitmentDlg: RecruitmentPopup;

    private gentDialogBtns: NinesliceButton[] = [];

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

        this.desk = this.scene.add.image(x + w/2 + 30, y + h - 120, "office_desk")
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerdown", () => { 
                if(this.gentDialog == null)
                    this.emitter.emit("changeEnviroment", EnumEnviroments.OFFICE_DESK) 
                else
                    this.destroyDialog();
            })
        ImageUtils.zoomImage(this.desk, 300, 150);
        // this.chair = this.scene.add.rectangle(x + w/2 + 20, y + h - 100, 50, 90, 0xb4b4b4)

        // this.terminal = this.scene.add.image(x + w/2 - 120, y + h - 265, "terminal")
        // this.gent = this.scene.add.image(x + w/2 - 30, y + h - 275, "gent")
        //     .setInteractive()
        //     // .on("pointerdown", () => { this.showGentDialog("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquet, felis vel rhoncus pellentesque, neque orcirementum metus, vitae tempor ligula ipsum vel") });
        //     .on("pointerdown", () => { this.showGentDialogBtns() })
        this.lamp = this.scene.add.image(x + w/2 - 50, y + h - 225, "lamp");
        ImageUtils.zoomImage(this.lamp, 30, 60);
        this.telephone = this.scene.add.image(x + w/2 + 130, y + h - 215, "telephone");
        ImageUtils.zoomImage(this.telephone, 50, 40);
        // this.badge = this.scene.add.image(x + w/2 - 30, y + h/2 - 100, "badge");
        this.recruitmentDlg = new RecruitmentPopup(this.scene);
        super.load();
    }

    showGentDialog(txt) {
        if(this.gentDialog == null) {
            for(let i = 0; i < this.gentDialogBtns.length; i ++) 
                this.gentDialogBtns[i].destroy();
            this.gentDialogBtns = [];
            this.gentDialog = new TextDialog(this.scene, txt);
        } else {
            this.destroyDialog();
        }
    }

    addCredentialToInventory() {
        this.destroyDialog();
        if(!InventoryBox.getInstance().isAddedInventory('credential'))
            this.emitter.emit("addInventory", "credential")
    }

    destroyDialog() {
        if(this.gentDialogBtns != null) {
            for(let i = 0; i < this.gentDialogBtns.length; i ++) 
                this.gentDialogBtns[i].destroy();
            this.gentDialogBtns = [];
        }
        if(this.gentDialog != null) { 
            this.gentDialog.destroy();
            this.gentDialog = null;
        }
        if(this.inventoryDialog != null) {
            this.inventoryDialog.destroy();
            this.inventoryDialog = null;
        }
    }
    
    override goBack() {
    }

    showGentDialogBtns() {
        if(this.gentDialog == null) {
            const { width, height } = this.scene.sys.game.scale.gameSize;
            const scaleX = this.scene.sys.game.canvas.width / 1920;
            const scaleY = this.scene.sys.game.canvas.height / 1080;	
            let x = (width - (width*scaleX)) / 2;
            let y = (height - (height * scaleY)) / 2;
            let w = width*scaleX;
            let h = height*scaleY;
            if(this.gentDialogBtns.length == 0) {
                const testament_btn = new NinesliceButton(
                    this.scene, 
                    new Phaser.Math.Vector2(x + w/2, y + h + 50), 
                    "dialog_bg.png", 
                    "Testament", 
                    [13, 13, 13, 13], 
                    () => { this.showGentDialog("Asked about testament") },
                    "#ffffff",
                    new Phaser.Math.Vector2(200, 40)
                );
                this.scene.tweens.add({
                    targets : testament_btn,
                    x: x + w/2,
                    y: y + h - 100,
                    ease: "Linear",
                    duration: 300,
                    yoyo: false,
                });
                
                if(!InventoryBox.getInstance().isAddedInventory('credential')) {
                    const credential_btn = new NinesliceButton(
                        this.scene, 
                        new Phaser.Math.Vector2(x + w/2, y + h + 50), 
                        "dialog_bg.png", 
                        "Credential", 
                        [13, 13, 13, 13], 
                        () => { this.addCredentialToInventory() },
                        "#ffffff",
                        new Phaser.Math.Vector2(200, 40)
                    );
                    this.scene.tweens.add({
                        targets : credential_btn,
                        x: x + w/2,
                        y: y + h - 50,
                        ease: "Linear",
                        duration: 200,
                        yoyo: false,
                    })
                    this.gentDialogBtns.push(credential_btn);
                }
                this.gentDialogBtns.push(testament_btn);
            }
        } else {
            this.destroyDialog();
        }
    }

    public override destroy() {
        this.bg.destroy();
        this.desk.destroy();
        // this.gent.destroy();

        // this.terminal.destroy();
        this.telephone.destroy();
        // this.badge.destroy();
    }
}