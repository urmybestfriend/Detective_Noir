export interface Inventory {
    imageName,
    img: Phaser.GameObjects.Image,
    circle: Phaser.GameObjects.Arc
}

export class InventoryBox extends Phaser.GameObjects.Container {

    private inventories:Inventory[] = [];
    private rect: Phaser.Geom.Rectangle;
    private selectedInventoryIndex;

    constructor(scene: Phaser.Scene, rect: Phaser.Geom.Rectangle) {
        super(scene, rect.x, rect.y);

        this.scene.add.existing(this);

        this.rect = rect;
        const rectangle = this.scene.add.rectangle(0, 0, rect.width, rect.height, 0xffffff)
            .setOrigin(0, 0.5)
            .setStrokeStyle(1, 0x000000);

        this.add(rectangle);
    }

    addInventory(imgName) {
        let len = this.inventories.length;

        const image = new Phaser.GameObjects.Image(this.scene, 30 + len*30, 0, imgName);
        let scaleX = 30 / image.width;
        let scaleY = 20 / image.height;
        image.setScale(scaleX, scaleY);

        const circle = this.scene.add.graphics().setPosition(this.rect.x + 30 + len*30, this.rect.y).fillCircle(0, 0, 20);
        const back_circle = this.scene.add.circle(30 + len*30, 0, 20, 0xffffff)
            .setStrokeStyle(1, 0xb4b4b4)
            .setInteractive()
            .on("pointerdown", () => { this.selectInventory(len) });
        this.add(back_circle);
        this.add(image);
        image.setMask(circle.createGeometryMask());

        let inv: Inventory = {
            imageName: imgName,
            img: image,
            circle: back_circle
        };
        this.inventories.push(inv);
    }

    selectInventory(index) {
        this.inventories[index].circle.setStrokeStyle(3, 0xb4b4b4);
        if(this.selectedInventoryIndex) this.inventories[this.selectedInventoryIndex].circle.setStrokeStyle(1, 0xb4b4b4);
        this.selectedInventoryIndex = index;
    }
}