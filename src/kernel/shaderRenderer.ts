/*
    webgl & webgl2 & bitmaprenderer??
 */


export class ShaderRenderer{
    public canvas : HTMLCanvasElement;
    public context !: WebGL2RenderingContext;

    public constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;

        let temp = canvas.getContext('webgl2');
        if(temp !== null)
            this.context = temp;
    }
}