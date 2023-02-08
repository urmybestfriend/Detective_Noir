import ImageUtils from "../utils/ImageUtils";
import Game from "../scenes/Game"
import TextPlayer from "phaser3-rex-plugins/plugins/textplayer";

export default class TextDialog extends Phaser.GameObjects.Container{
    private textPlayer: TextPlayer;
    private dialogBox: Phaser.GameObjects.Rectangle;
    private avatar: Phaser.GameObjects.Image;

    constructor(game: Game, text: String) {
        super(game, 0, 0);

        this.scene.add.existing(this);
        this.createDialog(text)

    }

    createDialog(text) {
		const { width, height } = this.scene.sys.game.scale.gameSize;

        const _game = this.scene;
        this.dialogBox = this.scene.add.rectangle(width/2, height/2 - 100, 300, 100, 0xffffff)
            .setStrokeStyle(1, 0xb4b4b4)

        this.avatar = this.scene.add.image(width/2 - 150, height/2 - 50, "avatar");
        this.textPlayer = new TextPlayer(this.scene, {
			x: width / 2,
			y: height /2 - 100,
			width: 300,
			height: 100,
			padding: 10,
			wrap: {
				wrapWidth: 300,
				maxLines: 4,
				lineHeight: 15,
			},
			style: {
				fontFamily: '"Varela Round"',
				fontSize: "16px",
				color: 0x00_00_00,
			},
			typing: {
				speed: 35, // 0: no-typing
				animation: {
					duration: 300,
					yoyo: true,
					onStart(char) {
						char.setVisible();
						const _x = char.x;
						const _y = char.y;
						_game.tweens.add({
							targets: char,
							ease: "Cubic.out",
							alpha: {
								from: 0,
								to: 1,
							},
							y: {
								from: _y - 5,
								to: _y,
							},
							x: {
								from: _x + 5,
								to: _x,
							},
							scaleX: {
								from: 2,
								to: 1,
							},
							scaleY: {
								from: 2,
								to: 1,
							},
							duration: 200,
						});
					},
					onProgress(char, t) {},
					onComplete() {
                    },
				},
			},
		})
            .play(text)
        this.add(this.dialogBox);
        this.add(this.textPlayer);

    }

    destroy() {
        this.textPlayer.destroy();
        this.dialogBox.destroy();
        this.avatar.destroy();
    }
}