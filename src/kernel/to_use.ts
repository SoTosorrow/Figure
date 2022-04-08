import {EventDispatcher, CanvasKeyBoardEvent, CanvasMouseEvent} from './dispatcher'
import { Renderer } from './renderer';
import { Module } from './define';
import { Unit } from './unit';


export class DispatcherTest extends EventDispatcher implements Module{

    public app:any;
    public enable : boolean = true;
    public mouseX : number = 0;
    public mouseY : number = 0;
    public isDown : boolean = false;

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
        if(this.isDown)
            this.app.getModule("unitManager").module.addUnit(new Rect(evt.canvasPosition.x, evt.canvasPosition.y))
        
    }
    protected dispatchKeyDown(evt:CanvasKeyBoardEvent):void{
        console.log(evt.key);
    }
    protected dispatchMouseDown(evt:CanvasMouseEvent):void{
        console.log(evt.canvasPosition.toString());
        this.isDown = true;
    }
    protected dispatchMouseUp(evt:CanvasMouseEvent):void{
        this.isDown = false;
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
        renderer.drawRect(this.x,this.y,10,10);
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