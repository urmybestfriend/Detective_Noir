import Game from "../scenes/Game";
import { EnumEnviroments } from "../enums/EnumEnviroments";
import { EventDispatcher } from "../utils/EventDispatcher";
import TextDialog from "../UI/TextDialog";

export default class Enviroment {
    scene: Game;
    enviroment: EnumEnviroments;
    emitter: EventDispatcher;
    inventoryDialog: TextDialog = null;

    constructor (scene: Game, name: EnumEnviroments) {
        this.scene = scene;
        this.enviroment = name;
        this.emitter = EventDispatcher.getInstance();
    }
    load(): void {

    }

    goBack() {
        
    }

    public showInventoryDialog(txt: String) {
        if(this.inventoryDialog == null)
            this.inventoryDialog = new TextDialog(this.scene, txt);
    }

    public destroy() {

    }
}