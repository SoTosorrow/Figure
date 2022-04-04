import {Module} from './define'

/*
    TODO 字典形式传参
    TODO 字典的默认
*/
export class Renderer{

    public canvas : HTMLCanvasElement;
    public context !: CanvasRenderingContext2D;

    public constructor(canvas : HTMLCanvasElement ) {
        this.canvas = canvas;
        
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
            // 绘制线条
            this.context.stroke();
        }
        this.context.restore();
    }

    public drawCircle(x:number, y:number, r:number):void{
        this.context.save();
        {
            this.context.fillStyle = "red";
            this.context.beginPath();
            this.context.arc(x,y,r,0,Math.PI*2);
            this.context.stroke();
        }
        this.context.restore();
    }

    public drawLine(x0:number, y0:number, x1:number, y1:number):void{
        this.context.save();
        this.context.beginPath();
        this.context.moveTo(x0, y0);
        this.context.lineTo(x1, y1);
        this.context.stroke();
        this.context.restore();
    }

    public drawGrid(color:string='grey', interval:number=10):void{
        this.context.save();
        this.context.strokeStyle = color;
        this.context.lineWidth = 0.5;
        for (let i:number = interval+0.5; i<this.canvas.width; i+=interval){
            this.drawLine(i,0, i,this.canvas.height);
        }
        for (let i:number = interval+0.5; i<this.canvas.height; i+=interval){
            this.drawLine(0, i,this.canvas.width, i);
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

    public render():void{}
}

// 对Renderer做了一层Module接口的规范化封装
export class RendererModule implements Module{
    
    public enable : boolean = true;
    public module !: Renderer;

    public constructor(canvas : HTMLCanvasElement){
        this.module = new Renderer(canvas)
    }

    public update(totalTime:number, interTime:number):void{
        this.module.render();
    }
}
