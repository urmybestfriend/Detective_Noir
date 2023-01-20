export default class InputHandler {
    private scene: Phaser.Scene;
    private gameObjectClicked: Boolean = false;

    constructor(scene) {
        this.scene = scene;

		this.scene.input.on("gameobjectdown", this.OnGameObjectClicked.bind(this));
		this.scene.input.on("pointerdown", this.OnPointerDown.bind(this));
		this.scene.input.on("pointerup", this.OnPointerUp.bind(this));
		this.scene.input.on("gameobjectup", () => (this.gameObjectClicked = false));
    }

    OnGameObjectClicked(pointer, gameObject, event) {
        this.gameObjectClicked = true;
	}

	OnPointerDown(pointer) {
        if(this.gameObjectClicked == true) return;
	}

	OnPointerUp(pointer, gameObject) {
        if(this.gameObjectClicked == true) return;
	}
}