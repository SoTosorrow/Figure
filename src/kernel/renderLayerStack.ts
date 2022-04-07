import { Renderer } from "./renderer";
import { Module } from './define'

type layer = (context:CanvasRenderingContext2D)=>void;

export class RenderLayerStack extends Renderer{
    public layerStack : layer[] = [];
    public video:any;

    public constructor(canvas:HTMLCanvasElement){
        super(canvas);

        let myVideo = document.getElementById('myVideo');
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(function (mediaStream) {
            (myVideo as HTMLVideoElement).srcObject = mediaStream;
            (myVideo as HTMLVideoElement).onloadedmetadata = function () {
            (myVideo as HTMLVideoElement).play();
            }
        });
        this.video = document.getElementById('myVideo');
        
        this.layerStack.push(this.drawCamera.bind(this));
        this.layerStack.push(this.drawGauss.bind(this));
    }

    public drawRed():void{
        // let image = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);
        // for(let i=0;i<image.data.length;i++){
        //     image.data[0+4*i] = 255
        //     image.data[1+4*i] = 0
        //     image.data[2+4*i] = 0
        //     image.data[3+4*i] = 255
        // }
        // this.context.putImageData(image,0,0);
        this.drawNoise();
    }

    public drawCamera():void{
        this.context.drawImage(this.video, 0, 0, 500, 400);
    }
    public drawGauss():void{
        let image = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);
        this.gaussBlur(image, 3);
        this.context.putImageData(image,0,0);
    }
    
    public test():void{
        for(let f of this.layerStack){
            f(this.context);
        }
    }

    // copy from https://zhuanlan.zhihu.com/p/98356516
    public gaussBlur(imgData:any, radius:number):void{

        radius *= 3;    //不知为什么,我的模糊半径是 css中 filter:bulr 值的三倍时效果才一致。
    
        //Copy图片内容
        let pixes = new Uint8ClampedArray(imgData.data);
        const width = imgData.width;
        const height = imgData.height;
        let gaussMatrix = [],
            gaussSum:any,
            x, y,
            r, g, b, a,
            i, j, k,
            w;
    
        radius = Math.floor(radius);
        const sigma = radius / 3;
    
        a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
        b = -1 / (2 * sigma * sigma);
    
        //生成高斯矩阵
        for (i = -radius; i <= radius; i++) {
            gaussMatrix.push(a * Math.exp(b * i * i));
        }
    
        //x 方向一维高斯运算
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                r = g = b = a = gaussSum = 0;
                for (j = -radius; j <= radius; j++) {
                    k = x + j;
                    if (k >= 0 && k < width) {
                        i = (y * width + k) * 4;
                        w = gaussMatrix[j + radius];
    
                        r += pixes[i] * w;
                        g += pixes[i + 1] * w;
                        b += pixes[i + 2] * w;
                        a += pixes[i + 3] * w;
    
                        gaussSum += w;
                    }
                }
    
                i = (y * width + x) * 4;
                //计算加权均值
                imgData.data.set([r, g, b, a].map(v=>v / gaussSum), i);
            }
        }
    
        pixes.set(imgData.data);
    
        //y 方向一维高斯运算
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                r = g = b = a = gaussSum = 0;
                for (j = -radius; j <= radius; j++) {
                    k = y + j;
    
                    if (k >= 0 && k < height) {
                        i = (k * width + x) * 4;
                        w = gaussMatrix[j + radius];
    
                        r += pixes[i] * w;
                        g += pixes[i + 1] * w;
                        b += pixes[i + 2] * w;
                        a += pixes[i + 3] * w;
    
                        gaussSum += w;
                    }
                }
                i = (y * width + x) * 4;
                imgData.data.set([r, g, b, a].map(v=>v / gaussSum), i);
            }
        }
    
        return imgData;
    };
}

export class RenderLayerStackModule implements Module{
    public enable : boolean = true;
    public stack : RenderLayerStack;
    public module !: any;

    public constructor(canvas : HTMLCanvasElement){
        this.stack = new RenderLayerStack(canvas);
    }

    public update(totalTime:number, interTime:number):void{
        console.log(1);
        
        for(let f of this.stack.layerStack){
            f(this.stack.context);
        }
    }

}