import ImageUtils from "../utils/ImageUtils";
import { EventDispatcher } from "../utils/EventDispatcher";

export interface Inventory {
    imageName,
    img: Phaser.GameObjects.Image,
    circle: Phaser.GameObjects.Graphics,
    back_circle: Phaser.GameObjects.Arc
}

let instance = null;
export class InventoryBox extends Phaser.GameObjects.Container {

    private inventories:Inventory[] = [];
    private rect: Phaser.Geom.Rectangle;
    private selectedInventoryIndex = 100;

    private isReadTestament: Boolean = false;
    private isVerifiedPensioner: Boolean = false;
    private isHaveContactCard: Boolean = false;
    private isHaveCredential: Boolean = false;

    private isObjectClicked: Boolean = false;
    private draggingImg: Phaser.GameObjects.Image;

	private emitter: EventDispatcher;

    constructor(scene: Phaser.Scene, rect: Phaser.Geom.Rectangle) {
        super(scene, rect.x, rect.y);

        this.emitter = EventDispatcher.getInstance();
        this.scene.add.existing(this);

        this.scene.input.on("gameobjectmove", this.mouseMove.bind(this))
        this.scene.input.on("gameobjectup", this.mouseUp.bind(this))
        this.rect = rect;
        const rectangle = this.scene.add.rectangle(0, 0, rect.width, rect.height, 0xffffff)
            .setOrigin(0, 0.5)
            .setStrokeStyle(1, 0x000000);

        this.add(rectangle);
        instance = this;
    }
    static getInstance() {
        if(instance == null) {
            instance = this;
        }
        return instance;
    }

    public get selectedInventoryName() {
        if(this.selectedInventoryIndex == 100) 
            return null;
        return this.inventories[this.selectedInventoryIndex].imageName;
    }

    public get IsReadTestament() {
        return this.isReadTestament;
    }
    public get IsVerifiedPensioner() {
        return this.isVerifiedPensioner;
    }
    public get IsHaveContactCard() {
        return this.isHaveContactCard;
    }
    public get IsHaveCredential() {
        return this.isHaveCredential;
    }
    public get IsObjectClicked() {
        return this.isObjectClicked;
    }

    public setIsReadTestament(b) {
        this.isReadTestament = b;
    }
    public setIsVerifiedPensioner(b) {
        this.changeCredentialImg();
        this.isVerifiedPensioner = b;

    }
    public setIsHaveContactCard(b) {
        this.isHaveContactCard = b;
    }
    public setIsHaveCredential(b) {
        this.isHaveCredential = b;
    }

    public get Inventories(): Inventory[] {
        return this.inventories;
    }


    public isAddedInventory(imgName) {
        for(let i = 0; i < this.inventories.length; i ++) {
            if(this.inventories[i].imageName == imgName)
                return true;
        }
        return false;
    }

    addInventory(imgName) {
        let len = this.inventories.length;

        const image = new Phaser.GameObjects.Image(this.scene, 10 + 1.5*len*12, 0, imgName);
        ImageUtils.zoomImage(image, 10, 10);

        const circle = this.scene.add.graphics().setPosition(this.rect.x + 10 + 1.5*len*12, this.rect.y).fillCircle(0, 0, 8);
        const back_circle = this.scene.add.circle(10 + len*1.5*12, 0, 8, 0xffffff)
            .setStrokeStyle(1, 0xb4b4b4)
            .setInteractive()
            .on("pointerdown", () => { this.selectInventory(len) });
        this.add(back_circle);
        this.add(image);
        image.setMask(circle.createGeometryMask());
        
        let inv: Inventory = {
            imageName: imgName,
            img: image,
            circle: circle,
            back_circle: back_circle,
        };
        this.inventories.push(inv);
    }

    removeInventory(imgName) {
        var tmp_inventories = this.inventories;
        for(let i = 0; i < this.inventories.length; i ++) {
            this.inventories[i].img.destroy();
            this.inventories[i].back_circle.destroy();
        }
        this.inventories = [];

        for(let i = 0; i < tmp_inventories.length; i ++) {
            if(tmp_inventories[i].imageName != imgName) {
                this.addInventory(tmp_inventories[i].imageName)
            }
        }
        
    }

    changeCredentialImg() {
        for(let i = 0; i < this.inventories.length ; i ++) {
            if(this.inventories[i].imageName == "credential") {
                this.inventories[i].img.setTexture("credential_verified");
                break;
            }
        }
    }

    selectInventory(index) {
        this.isObjectClicked = true;
        if(this.selectedInventoryIndex != 100) this.inventories[this.selectedInventoryIndex].back_circle.setStrokeStyle(1, 0xb4b4b4);

        if(this.inventories[this.selectedInventoryIndex]?.imageName == "glasses" && this.inventories[index].imageName == "testament") {
            // this.removeInventory("glasses");
            this.emitter.emit("showInventoryDialog", "Ask about the pensioner");
            this.isReadTestament = true;
        }
        if(this.selectedInventoryIndex != index) {
            this.inventories[index].back_circle.setStrokeStyle(1.5, 0xb4b4b4);
            this.selectedInventoryIndex = index;
        } else {
            this.selectedInventoryIndex = 100;
        }
    }

    mouseMove(pos) {
        if(this.isObjectClicked == true) {
            this.draggingImg?.destroy()
            this.draggingImg = new Phaser.GameObjects.Image(this.scene, pos.x-this.rect.x, pos.y-this.rect.y, this.Inventories[this.selectedInventoryIndex]?.imageName=="credential" && this.isVerifiedPensioner == true ? "credential_verified": this.Inventories[this.selectedInventoryIndex]?.imageName);
            ImageUtils.zoomImage(this.draggingImg, 10, 10)
            this.add(this.draggingImg)
        }
    }

    mouseUp(pos, obj) {
        if(this.isObjectClicked == true) {
            if(!obj.texture){
                let index = (obj.x -10) / 18;
                if(this.inventories[this.selectedInventoryIndex]?.imageName == "glasses" && this.inventories[index]?.imageName == "testament") {
                    this.emitter.emit("showInventoryDialog", "Ask about the pensioner");
                    this.isReadTestament = true;
                }
            } else {
                console.log(obj.texture.key)
            }
            this.isObjectClicked = false;
            this.draggingImg?.destroy();
        }
    }
}