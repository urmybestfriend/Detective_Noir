import Game from "../scenes/Game";

let instance = null;
export default class Progress {
	private scene: Game;
	private progressTime: string;
	private progressMonth: string;


	constructor(scene: Game) {
		this.scene = scene;
		instance = this;
	}

	public get Time(): string {
		return this.progressTime;
	}

	public get Month(): string {
		return this.progressMonth;
	}

	public changeBoolConfig(boolDict: Record<string, boolean>) {
		this.createProgressJson();
	}

	static getInstance() {
		if (instance == null) {
			instance = this;
		}
		return instance;
	}

	hasAnswered(index: number) {
		return false;
	}

	checkPrerequisites(prerequisites: string[], andOrBool: boolean) {
		// If there are no prerequisites to check
		if (prerequisites.length == 0) {
			return true;
		}
		// If case of AND
		if (andOrBool) {
			return prerequisites.every((req) => Progress.getInstance().prerequisiteMet(req));
		} else {
			return prerequisites.some((req) => Progress.getInstance().prerequisiteMet(req));
		}
	}

	addTimeProgress() {
		this.createProgressJson();
	}

	onSceneChange() {
			this.createProgressJson();
	}

	createProgressJson() {
		const json = {};

		this.saveToLocalStorage(json);
	}

	parseProgressJson() {}

	saveToLocalStorage(json) {
		localStorage.setItem("progress", JSON.stringify(json));
	}

	hasSaveFile() {
		if (localStorage.getItem("progress")) return true;
		else return false;
	}

	loadProgress(data) {
	}

	getLoadedLevelName() {
	}

	removeProgress(callback) {
		if (this.hasSaveFile()) {
			localStorage.removeItem("progress");
		} else {
			//no save file
			callback();
		}
	}

}
