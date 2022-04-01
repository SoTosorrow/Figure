export class Renderer{

    // protected _renderId : number = -1;
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
        // this.clearContext();
        // this.drawNoise();
    }
}

export class Test extends Renderer{

    public constructor(canvas : HTMLCanvasElement ) {
        super(canvas);
    }
    public render():void{
        this.clearContext();
        this.drawRect(0,0,Math.random()*100,100);
    }
}