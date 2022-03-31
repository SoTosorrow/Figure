import {EventDispatcher, CanvasKeyBoardEvent, CanvasMouseEvent} from './dispatcher'
import { Application } from "./application";


export class DispatcherTest extends EventDispatcher{
    protected dispatchKeyDown(evt:CanvasKeyBoardEvent):void{
        console.log(evt.key);
    }
    protected dispatchMouseDown(evt:CanvasMouseEvent):void{
        console.log(evt.canvasPosition.toString());
    }
}

export class ApplicationTestDispatcher extends Application{

    constructor(canvas:HTMLCanvasElement){
        let dispatcher = new DispatcherTest(canvas);
//TODO 参数缺省了dispatcher依然会导入dispatcher参数？？？
        super(canvas, dispatcher);
    }

    public update(totalTime:number, interTime:number):void{
        // console.log(1/interTime);
        
    }
    public render():void{

    }
}

/*
    封装了绘制函数的Application
TODO 封装到renderer中再作为模块结合到application
TODO 字典形式传参
TODO 字典的默认
*/
export class Canvas2DApplication extends Application {
    public context !: CanvasRenderingContext2D;

    public constructor(canvas : HTMLCanvasElement ) {
        let dispatcher = new DispatcherTest(canvas);
        super(canvas, dispatcher);
        // context2DTemp 类型为 CanvasRenderingContext2D | null
        let contextTemp = this.canvas.getContext("2d");
        // 保证context2D不为null
        if( contextTemp === null){
            return;
        }
        this.context = contextTemp;
    }

    public clearContext() : void{
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    }

    public drawRect( x:number, y:number, w:number, h:number):void{
        this.context.save();
        {
            this.context.fillStyle = "grey";
            // this.context.strokeStyle = "blue";
            // this.context.lineWidth = 5;
            this.context.beginPath();
            this.context.moveTo(x, y);
            this.context.lineTo(x + w, y);
            this.context.lineTo(x + w, y + h);
            this.context.lineTo(x, y + h);
            // 封闭几何
            this.context.closePath();
            this.context.stroke();
        }
        this.context.restore();
    }

    public drawNoise():void{
        let image = this.context.createImageData(this.canvas.width,this.canvas.height);
        // let image = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);
        for(let i=0;i<image.data.length;i++){
            image.data[0+4*i] = Math.floor(Math.random()*255)
            image.data[1+4*i] = Math.floor(Math.random()*255)
            image.data[2+4*i] = Math.floor(Math.random()*255)
            image.data[3+4*i] = Math.floor(Math.random()*255)
        }
        this.context.putImageData(image,0,0);
    }

    public render():void{
        // this.context.fillRect(0,0,Math.random()*100,100);
        this.clearContext();
        // this.drawRect(100,0,Math.random()*100,100);
        this.drawNoise();
    }
    public update(totalTime:number, interTime:number):void{
        console.log(1/interTime);
    }
}

