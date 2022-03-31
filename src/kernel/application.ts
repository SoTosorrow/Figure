// todo 中间件思想
// 如何设计为非侵入式
// 组合式、中间件

import { TimerManager } from "./timer";
import {EventDispatcher } from './dispatcher'

/*
    整合模块，负责时间循环的处理
    暂时将render模块内置到application中

    采用组合式
    EventDispatcher模块 用于事件分发， 用户提供的继承于EventDispatcher的分发器可以定义各类事件
    TimerManager模块 用于定时器管理
    Render模块， 用于具体绘制（暂时内置

TODO：采用中间件——其他模块可以通过use嵌入application 
    use的模块将在step中调用
    其中useAtStart将在start中调用
    useAtStop将在stop中调用
    useAtEnd将在application结束时（析构）中调用
*/

export class Application{

    protected _start : boolean = false;
    protected _renderId : number = -1;

    // 起始帧时间
    protected _startTime !: number;
    // 上一帧时间
    protected _lastTime !: number;

    public dispatcher !: EventDispatcher;
    public timerManager : TimerManager;
    public canvas : HTMLCanvasElement;
    // public renderer ?: Renderer;

//TODO 自定义的中间件
// public module : Map<string,func> = new Map();
// or
// public module : Module[] = [];


    constructor(canvas : HTMLCanvasElement, 
                dispatcher:EventDispatcher=new EventDispatcher(canvas)
                // renderer:Renderer=new Renderer(canvas)
                ){
        this.canvas = canvas ;
        
        this.dispatcher = dispatcher;
        // this.renderer = renderer;
        this.timerManager = new TimerManager();
    }

    public start() : void{
        // render 尚未启动
        if(!this._start){
            // 启动render
            this._start = true;
            this._startTime = -1;
            this._lastTime = -1;

            // 根据时间重绘
            this._renderId = window.requestAnimationFrame(
                (time: number): void=>{
                    this.step(time);
                }
            )
            console.log("app start");

//TODO for map[].apply 调用useAtStart中间件
        }
    }

    public stop(): void{
        if(this._start){
            window.cancelAnimationFrame(this._renderId);
            this._renderId = -1;

            this._startTime = -1;
            this._lastTime = -1;
            this._start = false;

//TODO for map[].apply 调用useAtStop中间件
// 比如canvas.context2D clearRect
        }
    }

//TODO update作为中间件的use？再设定一个默认的application的update
    public update ( totalTime : number , interTime : number ) : void {}
//TODO this.renderer.render() render模块的调用，将会渲染继承renderer的自定义绘制
    public render  ( ) : void {}
   
    // 每帧调用
    protected step(time : number): void{
        if(this._startTime === -1 ) this._startTime = time;
        if(this._lastTime === -1 ) this._lastTime = time;

        // 当前时间与第一帧时间差ms
        let totalTime = time - this._startTime;
        // 当前时间与上一帧时间差s
        let interTime = ( time - this._lastTime );

        interTime /= 1000.0 ;
        this._lastTime = time ;
        
        // 处理定时器
        this.timerManager.handleTimers(interTime);

        this.update(totalTime, interTime) ;
        this.render();

/*TODO for map[].apply 调用use中间件

*/
        
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


