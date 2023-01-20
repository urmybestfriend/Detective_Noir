import Game from "../scenes/Game";
import { EventDispatcher } from "./EventDispatcher";

export interface TransitionOptions {
    callback?: Function,
}

export default class Transition {
    private emitter: EventDispatcher;
    private scene: Game;
    private transitionBG: Phaser.GameObjects.Image;

    protected fadeSpeed: number = 1000;

    public get go(): Phaser.GameObjects.Image {
        return this.transitionBG;
    }

    constructor(scene: Game) {
        this.scene = scene;

        this.emitter = EventDispatcher.getInstance();
        this.emitter.on("onTransition", this.start.bind(this));
        this.emitter.on("gameResized", this.resize.bind(this));

        this.transitionBG = this.scene.ui.add.image(0, 0, 'ui', 'transition_bg.png')
            .setDisplaySize(this.scene.sys.canvas.width, this.scene.sys.canvas.height)
            .setAlpha(0)
            .setOrigin(0)
            .setActive(false)
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(999);
    }

	resize() {
		this.transitionBG.setDisplaySize(this.scene.sys.canvas.width + 1, this.scene.sys.canvas.height)
	}

    start(options: TransitionOptions) {
        const timeline: Phaser.Tweens.Timeline = this.scene.tweens.createTimeline();
        timeline.add(this.startTransition())
        timeline.add((options?.callback) ? this.stopTransition(options?.callback) : this.stopTransition())
        timeline.play();
    }

    startTransition() {
        return {
            targets: this.transitionBG,
            duration: this.fadeSpeed,
            ease: Phaser.Math.Easing.Cubic.Out,
            alpha: {
                from: 0,
                to: 1
            }
        }
    }

    stopTransition(cb?: Function) {
        return {
            targets: this.transitionBG,
            duration: this.fadeSpeed,
            ease: Phaser.Math.Easing.Cubic.Out,
            alpha: {
                from: 1,
                to: 0
            },
            onStart: () => { cb?.() },
            onComplete: () => {
                this.emitter.emit("onTransitionFinished");
            }
        }
    }
}