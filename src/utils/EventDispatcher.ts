let instance = null;
export class EventDispatcher extends Phaser.Events.EventEmitter {
    constructor() {
        super();     
    }

    static getInstance() {
        if (instance == null) {
            instance = new EventDispatcher();
        }
        return instance;
    }
} 