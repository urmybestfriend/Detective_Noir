import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import HiddenInputText from "phaser3-rex-plugins/plugins/hiddeninputtext";
import RoundRectangle from "phaser3-rex-plugins/plugins/roundrectangle";
import Label from "phaser3-rex-plugins/templates/ui/label/Label";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";

export default class InputSelector extends Sizer {
  private inputField: Label;
  private username: string;
  private cb: Function;

  constructor(
    scene: Phaser.Scene,
    config: Sizer.IConfig,
    username: string,
    cb?: Function
  ) {
    super(scene, config);

    this.username = username;
    this.cb = cb;

    this.createInput(config.width); //NOTE have to pass this because Sizer doesnt havea  width yet

    this.scene.add.existing(this);

    this.layout();
    this.setOrigin(0.5);
    this.setPosition(this.x, this.y);
  }

  private createInput(width: number) {
    const roundRect = new RoundRectangle(
      this.scene,
      0,
      0,
      5,
      5,
      5
    ).setFillStyle(0xffffff, 0.4).setInteractive().on('pointerup', () => { this.inputField.emit('blur')});
    this.scene.add.existing(roundRect);
    const bbcodetext = new BBCodeText(this.scene, 0, 0, this.username, {
      fontFamily: "Varela Round",
      fontSize: "23px",
      color:  0x344A7D,
      fixedWidth: width,
      fixedHeight: 22,
      valign: "center",
      align: "center"
    });
    this.scene.add.existing(bbcodetext);

    this.inputField = new Label(this.scene, {
      orientation: "x",
      background: roundRect,
      text: bbcodetext,
      space: { top: 13, bottom: 13, left: 16, right: 16 },
    }).layout();
    this.scene.add.existing(this.inputField);

    // @ts-ignore
    this.inputField._edit = new HiddenInputText(this.inputField, {'onOpen': this.onOpen.bind(this)});
    // @ts-ignore
    this.inputField._edit.on('blur', this.onClose.bind(this), this);

    this.add(this.inputField);
  }

  getEmail() {
    return this.inputField.text;
  }
  
  onOpen(textObject, hiddenInputText) {
    console.log(textObject)
    console.log(hiddenInputText)
    console.log(textObject._edit)
    textObject.text = hiddenInputText.text = "";
  }

  onClose() {
    console.log("asdf")
    this.cb?.(this.inputField.text);
  }

  destroy() {
    this.inputField.setVisible(false);
  }
}
