import NinePatch from "phaser3-rex-plugins/plugins/ninepatch2";

export class NinesliceButton extends Phaser.GameObjects.Container {
    protected img: NinePatch;
    protected txt: Phaser.GameObjects.Text;
    public onClick: ([]) => void;
    private onClickArgs: [];

    constructor(scene, pos, buttonImg, txt, slice, onClick, color = "#000", size = Phaser.Math.Vector2.ZERO, onClickArgs = undefined) {
        super(scene, pos.x, pos.y);

        this.img = new NinePatch(this.scene, {
            x: 0,
            y: 0,
            width: size.x,
            height: size.y,
            key: 'ui',
            baseFrame: buttonImg,
            rows: [slice[0], undefined, slice[2]],
            columns: [slice[3], undefined, slice[1]]
        })
            .setOrigin(.5, .5)
            .setInteractive().on('pointerdown', (pointer) => this.OnBtnClick());

        this.txt = scene.add.text(-size.x/2 + 20, 0, txt, { fill: '#000' });
        this.txt.setOrigin(0, .5);

        this.onClick = onClick;
        this.onClickArgs = onClickArgs;
        if (size === Phaser.Math.Vector2.ZERO) {
            this.ResizeButton();
        }

        this.add(this.img);
        this.add(this.txt);

        scene.add.existing(this);

        this.txt.setStyle({ fontFamily: 'Verdana', color, wordWrap: { width: size.x-50 } }); //NOTE magic padding number
    }


    setTextPadding(x) {
        this.txt.x += x;
    }

    changeTextColor(color) {
        this.txt.setColor(color);
    }

    changeCB(cb) {
        this.onClick = cb;
    }

    ResizeButton() {
        const bounds = this.txt.getBounds();
        this.img.resize(
            bounds.width + 10 * 2,
            Phaser.Math.Clamp(bounds.height + 10 * 2, 50, 999)
        );

        this.txt.x += 10;
    }

    getPosition() {
        return new Phaser.Math.Vector2(this.x, this.y);
    }

    setXPosition(pos) {
        this.x = pos;
    }

    setYPosition(pos) {
        this.y = pos;
    }


    CenterText() {
        this.txt.x += this.GetWidth() / 2;
        this.txt.x -= this.txt.displayWidth / 2;

    }

    SetPaddingLeft(paddingLeft: number) {
        this.txt.x += paddingLeft;
    }

    OnBtnClick() {
        this.onClick(this.onClickArgs);
    }

    GetWidth() {
        return this.img.displayWidth;
    }

    getHeight() {
        return this.img.displayHeight;
    }

    Destroy() {
        this.destroy();
    }
}