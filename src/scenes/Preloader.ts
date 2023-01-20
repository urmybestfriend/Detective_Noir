import { EnumScene } from "../enums/EnumScene";
import { ProgressBar } from "phaser3-progressbar";
export default class Preloader extends Phaser.Scene {
	private progressBar: ProgressBar;
	constructor() {
		super(EnumScene.PRELOADER);
	}

	async preload() {
		new Promise((res, rej) => {
			this.load.image("background", "background/main_bg.png").on("complete", () => {
				this.add.image(0, 0, "background").setOrigin(0);
				res(true);
			});
		}).then(() => {
			// loader
			this.load.image("background", "background/main_bg.png");
			this.load.image("door", "ui/door.png");
			this.load.image("character_select_bg", "background/character_select_bg.png");
			this.load.image("case_select_bg", "background/case_select_bg.png");
			this.load.image("avatar", "ui/avatar.png")

			this.load.image("folder_enable", "ui/folder_enable.png");
			this.load.image("folder_disable", "ui/folder_disable.png");
			
			this.load.image("office_bg", "background/office_bg.png");
			this.load.image("badge", "ui/badge.png");
			this.load.image("telephone", "ui/telephone.png");
			this.load.image("terminal", "ui/terminal.png");
			this.load.image("gent", "ui/gent.png");
			this.load.image("glasses", "ui/glasses.png");

			this.load.image("desk_bg", "background/desk_bg.png");
			this.load.image("desk_rolodex", "ui/desk_rolodex.png");
			this.load.image("desk_telephone", "ui/desk_telephone.png");
			this.load.image("desk_terminal", "ui/desk_terminal.png");
			this.load.image("terminal_zoom", "ui/terminal_zoom.png");
			this.load.image("rolodex_zoom", "ui/rolodex_zoom.png");
			this.load.image("telephone_zoom", "ui/telephone_zoom.png");

			this.load.image("white_bg", "background/white_bg.png");
			this.load.image("telephone_zoom_bg", "background/telephone_zoom_bg.png");

			this.load.multiatlas("ui", "ui/ui.json", "ui");

			// Create a progressbar.
			this.progressBar = new ProgressBar(this, {
				centerX: this.sys.canvas.width / 2,
				centerY: this.sys.canvas.height / 2,
				boxFill: 0x616c8c,
				boxStrokeColor: 0x616c8c,
				boxFillAlpha: 0.5,
				paddingH: 10,
				paddingV: 5,
				// ... other configuration ...
			});
			this.add
				.text(this.sys.canvas.width / 2, this.sys.canvas.height / 2 + 30, "LOADING")
				.setOrigin(0.5, 0)
				.setFontSize(25);
			this.load.start();
			// Hook up the progress event.
			this.load.on("progress", (value) => {
				this.progressBar.update(value);
			});

			// Destroy on complete.
			this.load.on("complete", () => {
				this.progressBar.destroy();
				this.scene.start(EnumScene.GAME);
			});
		});
	}

	create() {
		this.scene.stop("PreloadScene");
		this.scene.launch("MainScene");
	}
}
