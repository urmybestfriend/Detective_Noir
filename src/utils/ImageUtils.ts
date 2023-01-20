export default class ImageUtils {
    static fitImage(img, scene) {
        const calcScaleX = scene.sys.game.canvas.width / 1920;
        const calcScaleY = scene.sys.game.canvas.height / 1080;
        img.setScale(calcScaleX, calcScaleY);
    }
}