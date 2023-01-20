import Game from "../scenes/Game";
import { EnumEnviroments } from "../enums/EnumEnviroments";
import { EventDispatcher } from "../utils/EventDispatcher";

export default class Enviroment {
    scene: Game;
    enviroment: EnumEnviroments;
    emitter: EventDispatcher;

    constructor (scene: Game, name: EnumEnviroments) {
        this.scene = scene;
        this.enviroment = name;
        this.emitter = EventDispatcher.getInstance();
    }
    load(): void {

    }

    public destroy() {

    }
}