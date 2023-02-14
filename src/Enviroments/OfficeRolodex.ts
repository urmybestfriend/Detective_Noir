import { EnumEnviroments } from "../enums/EnumEnviroments";
import Game from "../scenes/Game";
import Enviroment from "./Enviroment";
import ImageUtils from "../utils/ImageUtils";
import { InventoryBox } from "../UI/InventoryBox";
import TickTask from "phaser3-rex-plugins/plugins/utils/componentbase/TickTask";

export default class OfficeRolodex extends Enviroment {
    private bg: Phaser.GameObjects.Image;
    private btn1: Phaser.GameObjects.Text;
    private btn2: Phaser.GameObjects.Text;
    private cardRects: Phaser.GameObjects.Rectangle[] = [];
    private rectColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
    private cardLabel: Phaser.GameObjects.Text = null;
    private labels = ["asdf", "asdf", "asdf", "Buddy", "asdf"];

    constructor (scene: Game, enviroment: EnumEnviroments) {
        super(scene, enviroment);

        this.load();
    }

    override load() {
        const { width, height } = this.scene.sys.game.scale.gameSize;
		this.bg = this.scene.add.image(width/2, height/2, "white_bg")
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerdown", ()=> {this.destroyDialog()});
        ImageUtils.fitImage(this.bg, this.scene)

        for(let i = 0 ; i < 5; i ++) {
            this.cardRects[i] = this.scene.add.rectangle(width/2, height/2 + i*10, 200 + 10*i, 100, this.rectColors[i])
                .setOrigin(0.5)
                .setDepth(i)
                .setInteractive()
                .on("pointerdown", () => { this.addCardToInventory() })
        }
        this.cardLabel = this.scene.add.text(width/2, height/2+30, this.labels[this.labels.length - 1]).setOrigin(0.5).setColor("#000000").setDepth(this.labels.length);
        this.btn1 = this.scene.add.text(width/2 - 150, height/2 - 20, "Q")
            .setOrigin(0.5)
            .setPadding(5)
            .setStyle({ 
                backgroundColor: "#666666",
                fixedWidth: 30,
                fixedHeight: 30,
                fontSize: 12
            })
            .setAlign("center")
            .setInteractive()
            .on("pointerdown", () => { this.changeRolodex(false) })
            
        this.btn2 = this.scene.add.text(width/2 + 150, height/2 - 20, "E")
            .setOrigin(0.5)
            .setPadding(5)
            .setStyle({ 
                backgroundColor: "#666666",
                fixedWidth: 30,
                fixedHeight: 30,
                fontSize: 12
            })
            .setAlign("center")
            .setInteractive()
            .on("pointerdown", () => { this.changeRolodex(true) })
    }

    changeRolodex(isNext) {
        const { width, height } = this.scene.sys.game.scale.gameSize;
        if(isNext == true) {
            for(let i = 0; i < this.cardRects.length; i ++) {
                this.scene.tweens.add({
                    targets : this.cardRects[i],
                    x: this.cardRects[i].x-5,
                    y: this.cardRects[i].y + 10,
                    width: this.cardRects[i].width + 10,
                    ease: "Linear",
                    duration: 300,
                    yoyo: false,
                });
                this.cardRects[i].setDepth(i+1)
            }
            this.scene.tweens.add({
                targets: this.cardRects[this.cardRects.length - 1],
                alpha: 0,
                ease: "Cubic.out",
                duration: 300,
                yoyo: false,
            });
            this.cardLabel.setText(this.labels[this.cardRects.length - 2]);
            let temp = this.scene.add.rectangle(width/2, this.cardRects[0].y, this.cardRects[0].width, this.cardRects[0].height, this.rectColors[this.cardRects.length - 1])
                .setAlpha(0)
                .setDepth(0)
                .setInteractive()
                .on("pointerdown", () => { this.addCardToInventory() });;
            this.scene.tweens.add({
                targets: temp,
                alpha: 1,
                ease: "Cubic.in",
                duration: 300,
                yoyo: false
            })
            this.cardRects.splice(0, 0, temp);
            this.cardRects.splice(this.cardRects.length-1, 1);
            this.rectColors.splice(0, 0, this.rectColors[this.rectColors.length-1]);
            this.rectColors.pop();
            this.labels.splice(0, 0, this.labels[this.labels.length - 1]);
            this.labels.pop();
        } else {
            for(let i = 0; i < this.cardRects.length; i ++) {
                this.scene.tweens.add({
                    targets : this.cardRects[i],
                    x: this.cardRects[i].x+5,
                    y: this.cardRects[i].y - 10,
                    width: this.cardRects[i].width - 10,
                    ease: "Linear",
                    duration: 300,
                    yoyo: false,
                });
                this.cardRects[i].setDepth(i-1)
            }
            this.scene.tweens.add({
                targets: this.cardRects[0],
                alpha: 0,
                ease: "Cubic.out",
                duration: 300,
                yoyo: false,
            });
            this.cardLabel.setText(this.labels[0]);
            let temp = this.scene.add.rectangle(width/2, this.cardRects[this.cardRects.length-1].y, this.cardRects[this.cardRects.length-1].width, this.cardRects[this.cardRects.length-1].height, this.rectColors[0])
                .setAlpha(0)
                .setDepth(this.cardRects.length-1)
                .setInteractive()
                .on("pointerdown", () => { this.addCardToInventory() });
            this.scene.tweens.add({
                targets: temp,
                alpha: 1,
                ease: "Cubic.in",
                duration: 300,
                yoyo: false
            })
            this.cardRects.push(temp);
            this.cardRects.splice(0, 1);
            this.rectColors.push(this.rectColors[0]);
            this.rectColors.splice(0, 1);
            this.labels.push(this.labels[0]);
            this.labels.splice(0, 1);
        }
    }

    destroyDialog() {
        if(this.inventoryDialog != null) {
            this.inventoryDialog.destroy();
            this.inventoryDialog = null;
        }
    }
    addCardToInventory() {
        if(this.inventoryDialog == null && this.cardLabel.text == "Buddy"){
            if(!InventoryBox.getInstance().isAddedInventory('card'))
                this.emitter.emit("addInventory", "card");
        }
        else
            this.destroyDialog();
    }

    override goBack() {
        this.destroyDialog();
        this.emitter.emit("changeEnviroment", EnumEnviroments.OFFICE_DESK);
    }

    public override destroy() {
        this.bg.destroy();
        this.btn1.destroy();
        this.btn2.destroy();
        for(let i = 0; i < this.cardRects.length; i ++) {
            this.cardRects[i].destroy();
        }
        this.cardLabel.destroy();
        this.cardRects = [];
    }
}