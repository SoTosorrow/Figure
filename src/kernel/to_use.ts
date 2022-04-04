import {EventDispatcher, CanvasKeyBoardEvent, CanvasMouseEvent} from './dispatcher'
import { Application } from "./application";
import { Renderer } from './renderer';
import { Module } from './define';
import { Unit } from './unit';


export class DispatcherTest extends EventDispatcher implements Module{

    public app:any;
    public enable : boolean = true;
    public mouseX : number = 0;
    public mouseY : number = 0;

    public constructor(canvas:HTMLCanvasElement,app:any){
        super(canvas);
        this.app = app;
        this.isSupportMouseMove = true;
    }
    public update(totalTime:number, interTime:number){
    }

    protected dispatchMouseMove(evt:CanvasMouseEvent):void{
        this.mouseX = evt.canvasPosition.x;
        this.mouseY = evt.canvasPosition.y;
        // console.log(this.mouseX,this.mouseY);
        
    }
    protected dispatchKeyDown(evt:CanvasKeyBoardEvent):void{
        console.log(evt.key);
    }
    protected dispatchMouseDown(evt:CanvasMouseEvent):void{
        console.log(evt.canvasPosition.toString());
        // this.app.getModule("timerManager").addTimer(
        //     (a:number,b:number):void=>{
        //         this.app.getModule("renderer").drawCircle(evt.canvasPosition.x,evt.canvasPosition.y,20);
        //     },0.03
        // )
        // this.app.getModule("renderer").drawCircle(evt.canvasPosition.x,evt.canvasPosition.y,20);
        
    }
}

export class Test extends Renderer implements Module{

    public _lineDashOffset : number = 0;
    public app : any;
    public enable:boolean = true;

    private _updateLineDashOffset():void{
        this._lineDashOffset++;
        if(this._lineDashOffset>10000)
            this._lineDashOffset=0;
    }

    public drawRect( x:number, y:number, w:number, h:number):void{
        this.context.save();
        {
            this.context.fillStyle = "grey";
            this.context.lineWidth = 5;
            // this.context.setLineDash([10,5]);
            // this.context.lineDashOffset = this._lineDashOffset;
            // this.context.strokeStyle = "blue";
            this.context.beginPath();
            this.context.moveTo(x, y);
            this.context.lineTo(x + w, y);
            this.context.lineTo(x + w, y + h);
            this.context.lineTo(x, y + h);
            // 封闭几何
            this.context.closePath();
            // 绘制线条
            this.context.fill();
        }
        this.context.restore();
    }

    public drawCircle(x:number, y:number, r:number):void{
        this.context.save();
        {
            this.context.fillStyle = "red";
            this.context.lineWidth = 3;
            this.context.setLineDash([10,5]);
            this.context.lineDashOffset = this._lineDashOffset;
            this.context.beginPath();
            this.context.arc(x,y,r,0,Math.PI*2);
            this.context.fill();
            // this.context.stroke();
        }
        this.context.restore();
    }


    public callback(id:number, data:any):void{
        this._updateLineDashOffset();
        // this.drawRect(100,100,100,100);
    }

    public constructor(canvas : HTMLCanvasElement, app : any ) {
        super(canvas);
        this.app = app;
        this.app.modules.get("timerManager").module.addTimer(this.callback.bind(this),0.033);
        
    }
    public render():void{
        
        this.drawNoise();
    }
    public update(totalTime:number, interTime:number){
        this.clearContext();
        this.drawGrid();
        // this.context.translate(200,100);
        this.render();
    }
}

export class Rect implements Unit{
    public draw(renderer:Renderer):void{
        renderer.drawRect(100,100,100,100);
    }
}
export class Circle implements Unit{
    public draw(renderer:Renderer):void{
        renderer.drawCircle(100,100,30);
    }
}




/*
目标代码：按键控制玩家移动，收到碰撞颜色改变
class control : extends EventDispatcher{
    protected dispatchKeyDown(evt:CanvasKeyBoardEvent):void{
        console.log(evt.key);
    }
    protected dispatchMouseDown(evt:CanvasMouseEvent):void{
        console.log(evt.canvasPosition.toString());
    }
}
class render : extends Canvas2DApplication{

}
class Player{

    public hp : number = 10;
    public pos : vec2 = ();

    void render(){

    }

    void update(){

    }

    void onCollsionEnter(collsion other)
    {
        if(other.tag == "enemy"){
            this.hp--;
        }
    }
}
app.conpenment.add(new Player());


*/