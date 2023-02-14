export default class ImageUtils {
    public static fitImage(img, scene) {
        const calcScaleX = (scene.sys.canvas.width / img.width);
        const calcScaleY = (scene.sys.canvas.height / img.height);  
        img.setScale(calcScaleX, calcScaleY);
    }

    public static zoomImage(img, width, height) {
        const calcScaleX = (width / img.width);
        const calcScaleY = (height / img.height);
        img.setScale(calcScaleX, calcScaleY);
    }

    public static createWithFilter(scene:Phaser.Scene, x:number, y:number, texture:string):Phaser.GameObjects.Image{
        const img = scene.add.image(x, y, texture)
        img.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

        return img;
    }
}