import {EventDispatcher, CanvasKeyBoardEvent, CanvasMouseEvent} from './dispatcher'
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

export class Rect implements Unit{
    public x:number=0;
    public y:number=0;
    public constructor(x:number,y:number){
        this.x = x;
        this.y = y;
    }
    public draw(renderer:Renderer):void{
        renderer.drawRect(this.x,this.y,100,100);
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