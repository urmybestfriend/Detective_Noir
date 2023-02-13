import Game from "../scenes/Game";
import InputSelector from "./InputSelector";

export default class RecruitmentPopup extends Phaser.GameObjects.Container {

    private dialogBg: Phaser.GameObjects.Rectangle;
    private title: Phaser.GameObjects.Text;
    private content: Phaser.GameObjects.Text;
    private emailInput: InputSelector;
    private submitBtn: Phaser.GameObjects.Text;
    private cancelBtn: Phaser.GameObjects.Text;
    private errTxt: Phaser.GameObjects.Text;

    constructor(game: Game) {
        super(game, 0, 0);

		const { width, height } = this.scene.sys.game.scale.gameSize;
        this.dialogBg = this.scene.add.rectangle(width/2, height/2, width/3, height/3, 0x333333);
        this.title = this.scene.add.text(width/2, height/3 + 20, "Subscribe Email").setColor("#ffffff").setFontSize(25).setOrigin(0.5, 0);
        this.content = this.scene.add.text(width/2, height/3 + 60, "Please type your email for subscribe \n It'll send to our recruitment team").setColor("#ffffff").setFontSize(12).setOrigin(0.5, 0);
        // this.content = this.scene.add.text(width/2, height/3 + 80, "It'll send to our recruitment team").setColor("#ffffff").setFontSize(12).setOrigin(0.5, 0);
        this.errTxt = this.scene.add.text(width/2, height/2 + 50, "Pleaes enter a email!").setColor("#ff0000").setFontSize(10).setOrigin(0.5, 0).setVisible(false);

        this.emailInput = new InputSelector(
            this.scene,
            {
              x: width / 2,
              y: height / 2 - 20,
              width: width/3 - 100,
              height: 20,
            },
            "",
            () => {}
        );

        this.submitBtn = this.scene.add.text(width/2 - 70, height/3*2 - 50, "Submit")
            .setOrigin(0.5, 0)
            .setPadding(5)
            .setStyle({ 
                backgroundColor: "#ffffff",
                fixedWidth: 100,
                fixedHeight: 30,
                fontSize: 20,
                color: "#000000"
            })
            .setAlign("center")
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => { this.submitDialog() })

        this.cancelBtn = this.scene.add.text(width/2 + 70, height/3*2 - 50, "Cancel")
            .setOrigin(0.5, 0)
            .setPadding(5)
            .setStyle({ 
                backgroundColor: "#858585",
                fixedWidth: 100,
                fixedHeight: 30,
                fontSize: 20
            })
            .setAlign("center")
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => { this.cancelDialog() })
    }

    submitDialog() {
        if(this.emailInput.getEmail() == "" || this.emailInput.getEmail() == "|") {
            this.errTxt.setVisible(true);
            return;
        } else {
            this.destroy();
        }
    }

    cancelDialog() {
        this.destroy();
    }

    destroy() {
        this.dialogBg.destroy();
        this.title.destroy();
        this.content.destroy();
        this.emailInput?.destroy?.();
        this.errTxt.destroy();
        this.submitBtn.destroy();
        this.cancelBtn.destroy();
    }
}