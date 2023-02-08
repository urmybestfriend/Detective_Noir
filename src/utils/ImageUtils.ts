export default class ImageUtils {
    static fitImage(img, scene) {
        const calcScaleX = (scene.sys.canvas.width / img.width);
        const calcScaleY = (scene.sys.canvas.height / img.height);  
        img.setScale(calcScaleX, calcScaleY);
    }

    static zoomImage(img, width, height) {
        const calcScaleX = (width / img.width);
        const calcScaleY = (height / img.height);
        img.setScale(calcScaleX, calcScaleY);
    }
}