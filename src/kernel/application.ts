import { Module } from './define'
import { TimerManagerModule } from "./timer";
import { RendererModule } from "./renderer";
import { EventDispatcherModule } from './dispatcher'
import { UnitManagerModule } from "./unit";

/*
    整合模块，负责时间循环的处理

    采用组合式
    EventDispatcher模块 用于事件分发， 用户提供的继承于EventDispatcher的分发器可以定义各类事件
    TimerManager模块 用于定时器管理
    Render模块， 用于具体绘制（

TODO：采用中间件——其他模块可以通过use嵌入application 
    use的模块将在step中调用
    其中useAtStart将在start中调用
    useAtStop将在stop中调用
    useAtEnd将在application结束时（析构）中调用
*/



export class Application{

    protected _start : boolean = false;
    public canvas : HTMLCanvasElement;

    // 起始帧时间
    protected _startTime !: number;
    // 上一帧时间
    protected _lastTime !: number;

    // 基本模块，必备定时器、渲染、事件分配器、(,触发器,图元系统)
    public modules : Map<string,Module> = new Map();


    constructor(canvas : HTMLCanvasElement){
        this.canvas = canvas;

        // 基本模块 事件分配器，目前与App实际无关系，不受App控制
        this.modules.set("dispatcher", new EventDispatcherModule(canvas));
        // 基本模块，定时器，目前仅包含真实时间定时，TODO帧定时
        this.modules.set("timerManager", new TimerManagerModule());
        // 数据单位管理器
        this.modules.set("unitManager", new UnitManagerModule(canvas));

    }

    public setModule(name:string,module : any):void{
        this.modules.set(name, module);
    }
    public getModule(name:string):any{
        return this.modules.get(name);
    }

    public start() : void{
        if(!this._start){
            this._start = true;
            this._startTime = -1;
            this._lastTime = -1;

            console.log("app start");
            window.requestAnimationFrame(
                (time: number): void=>{
                    this.step(time);
                }
            )
        }
    }

    public stop(): void{
        if(this._start){
            // window.cancelAnimationFrame(this._renderId);

            this._startTime = -1;
            this._lastTime = -1;
            this._start = false;

        }
        console.log(this.modules);
        
        
    }

    // 每帧调用
    protected step(time : number): void{
        if(this._startTime === -1 ) this._startTime = time;
        if(this._lastTime === -1 ) this._lastTime = time;

        // 当前时间与第一帧时间差ms
        let totalTime = time - this._startTime;
        // 当前时间与上一帧时间差s
        let interTime = ( time - this._lastTime );

        interTime /= 1000.0 ;
        // fps
        // console.log(1/interTime);
        
        this._lastTime = time ;
        
        // 处理定时器
        // this.modules.get("timerManager").handleTimers(interTime);
        // 处理渲染模块
        // this.modules.get("renderer").render();

        // 顺序问题
        for(let i of this.modules.values()){
            if(i.enable){
                i.update(totalTime, interTime);
            }
        }

       if(this._start){
            // cancelAnimationFrame not work
            requestAnimationFrame ( this.step.bind(this) ) ;
            // requestAnimationFrame(
            //     (time:number):void=>{
            //         this.step(time);
            //     }
            // )
        }
    }

}


