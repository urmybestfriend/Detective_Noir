import { EnumEnviroments } from "../enums/EnumEnviroments";
import Game from "../scenes/Game";
import Enviroment from "./Enviroment";
import ImageUtils from "../utils/ImageUtils";
import TextDialog from "../UI/TextDialog";
import { NinesliceButton } from "../UI/NineSliceButton";
import { InventoryBox } from "../UI/InventoryBox";

export default class OfficeTerminal extends Enviroment {
    private bg: Phaser.GameObjects.Image;
    private terminal: Phaser.GameObjects.Image;
    private terminalDialog: TextDialog = null;
    private testamentBtn: NinesliceButton = null;
    private gameCompleteBtn: NinesliceButton = null;
    private isBtnClicked: Boolean = false;
    private pongGame: Phaser.GameObjects.DOMElement = null;
    private pongBtn: Phaser.GameObjects.Text;

    constructor(scene: Game, enviroment: EnumEnviroments) {
        super(scene, enviroment);

        this.load();
    }

    override load() {
        const { width, height } = this.scene.sys.game.scale.gameSize;
        this.bg = this.scene.add.image(width / 2, height / 2, "white_bg")
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerdown", () => { this.destroyDialog() });
        ImageUtils.fitImage(this.bg, this.scene);

        this.terminal = this.scene.add.image(width / 2, height, "terminal_zoom")
            .setOrigin(0.5, 1)
            .setInteractive()
            .on("pointerup", () => { this.clickTerminal() });
        ImageUtils.zoomImage(this.terminal, width/3*2, height/3*2);

        this.pongBtn = this.scene.add.text(30, 60, "Play Pong")
            .setOrigin(0.5)
            .setPadding(3)
            .setStyle({ 
                backgroundColor: "#666666",
                fixedWidth: 50,
                fixedHeight: 15,
                fontSize: 8
            })
            .setAlign("center")
            .setDepth(1000)
            .setInteractive()
            .on("pointerdown", () => { this.openPongGame()})
    }

    openPongGame() {
        const { width, height } = this.scene.sys.game.scale.gameSize;
        if(this.pongGame == null) {
            document.getElementsByTagName('canvas')[0].style.zIndex = '-1';
        
            this.pongGame = this.scene.add.dom(width / 2, height-5)
                                .setOrigin(0.5, 1);
            this.pongGame.createFromHTML('<iframe width="200" height="110" src="https://ponggame.io/" frameborder="0" allow="accelerometer; autoplay; clip-board-write; encrypted-media; gyroscope; picture-in-picture" style="border-radius: 10px" allowfullscreen></iframe>');
            this.scene.add.container(0, 0).add(this.pongGame);
            this.pongBtn.setText('Close');
        } else {
            document.getElementsByTagName('canvas')[0].style.zIndex = '1';
            this.pongGame.destroy();
            this.pongGame = null;
            this.pongBtn.setText('Play Pong');
        }
    }

    override goBack() {
        this.emitter.emit("changeEnviroment", EnumEnviroments.OFFICE_DESK);
    }
    showTerminalDialog(txt) {
        if (this.terminalDialog == null) {
            this.terminalDialog = new TextDialog(this.scene, txt);
        }
    }
    clickTerminal() {
        if (this.terminalDialog == null && this.inventoryDialog == null && this.isBtnClicked == false) {
            if (InventoryBox.getInstance().selectedInventoryName == "credential") {
                if (InventoryBox.getInstance().IsHaveCredential == true) {
                    this.showTerminalDialog("Called the pensioner");
                    this.createGameCompleteBtn();
                } else {
                    this.showTerminalDialog("Error Message");
                }
            } else {
                this.showTerminalDialog("Asked about testament");
                if (!InventoryBox.getInstance().isAddedInventory('testament'))
                    this.createBtn();
            }
        } else {
            this.destroyDialog();
            if (this.isBtnClicked == true)
                this.isBtnClicked = false;
        }
    }

    destroyDialog() {
        if (this.terminalDialog != null) {
            this.terminalDialog.destroy();
            this.terminalDialog = null;
        }
        if (this.testamentBtn != null) {
            this.testamentBtn.destroy();
            this.testamentBtn = null;
        }
        if (this.gameCompleteBtn != null) {
            this.gameCompleteBtn.destroy();
            this.gameCompleteBtn = null;
        }
        if (this.inventoryDialog != null) {
            this.inventoryDialog.destroy();
            this.inventoryDialog = null;
        }
    }

    createBtn() {
        const {width, height} = this.scene.sys.canvas;
        if (this.testamentBtn == null) {
            this.testamentBtn = new NinesliceButton(
                this.scene,
                new Phaser.Math.Vector2(width / 2, height + 20),
                "dialog_bg.png",
                "Testament",
                [13, 13, 13, 13],
                () => { this.addTestamentToInventory() },
                "#ffffff",
                new Phaser.Math.Vector2(150, 20)
            );

            this.scene.tweens.add({
                targets: this.testamentBtn,
                x: width / 2,
                y: height - 30,
                ease: "Linear",
                duration: 300,
                yoyo: false,
            });
        }
    }

    createGameCompleteBtn() {
        const {width, height} = this.scene.sys.canvas;
        if (this.gameCompleteBtn == null) {
            this.gameCompleteBtn = new NinesliceButton(
                this.scene,
                new Phaser.Math.Vector2(width / 2, height + 20),
                "dialog_bg.png",
                "Game Complete",
                [13, 13, 13, 13],
                () => {
                    this.emitter.emit("endGame");
                    this.destroyDialog();
                },
                "#ffffff",
                new Phaser.Math.Vector2(150, 20)
            );

            this.scene.tweens.add({
                targets: this.gameCompleteBtn,
                x: width / 2,
                y: height - 30,
                ease: "Linear",
                duration: 300,
                yoyo: false,
            });
        }
    }
    addTestamentToInventory() {
        this.isBtnClicked = true;
        this.destroyDialog();
        if (!InventoryBox.getInstance().isAddedInventory('testament'))
            this.emitter.emit("addInventory", "testament")
    }
    public override destroy() {
        this.bg.destroy();
        this.terminal.destroy();
        
        if(this.pongBtn != null) {
            this.pongBtn.destroy();
            this.pongBtn = null;
        }
        if(this.pongGame != null) {
            document.getElementsByTagName('canvas')[0].style.zIndex = '1';
            this.pongGame.destroy();
            this.pongGame = null;
        }
    }
}