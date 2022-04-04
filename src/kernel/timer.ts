import {Module} from './define'
/*
    定时器
*/

// 定时器回调函数的functional
//TODO 需要设置id参数吗？不一定吧
export type TimerCallBackFunc = (id:number,data:any)=>void;

// 定时器
export class Timer{
    // 标识定时器的id
    public id : number = -1;
    // 定时器是否启用
    public enable : boolean = false;
    // 定时器调用的倒计时（常量
    public timeout : number = 0;
    // 定时器调用的倒计时（变量
    public countdown : number = 0;
    // 定时器是否只调用一次
    public onlyOnce : boolean  = false;

    // 定时器回调函数
    public callBackFunc : TimerCallBackFunc;
    // 定时器回调函数参数
    public callBackData : any = undefined;


    constructor(callBackFunc : TimerCallBackFunc){
        this.callBackFunc = callBackFunc;
    }

}

export class TimerManager{

    public timers : Timer[] = [];
    protected _timersId : number = 0;

    public handleTimers ( interTime : number ) :  void {
        for ( let i=0 ; i<this.timers.length; i++) {
            let timer : Timer = this.timers[i];
            // 未启用的定时器不计时间
            if( timer.enable === false ) {
                continue;
            }
            timer.countdown -= interTime;
            if ( timer.countdown < 0.0 ) {
                timer.callBackFunc(timer.id ,timer.callBackData ) ;
                if ( timer.onlyOnce === false ) {
                    timer.countdown = timer.timeout; 
                } else {  
                    // 只调用一次的定时器调用完就remove
                    this.removeTimer (timer.id ) ;
                }
            }
        }
    }
    
    public addTimer(callback : TimerCallBackFunc , 
                    timeout : number = 1.0 , 
                    onlyOnce : boolean = false ,
                    data : any = undefined ) : number {
                        
        let timer : Timer
        let found : boolean = false ;
        for ( let i = 0 ; i < this . timers . length ; i ++ ) {
            let timer : Timer = this . timers [ i ] ;
            if ( timer . enable === false ) {
                timer . callBackFunc = callback ;
                timer . callBackData = data ;
                timer . timeout = timeout ;
                timer . countdown = timeout ;
                timer . enable = true ;
                timer . onlyOnce = onlyOnce ;
                return timer . id ;
            }
        }

        timer = new Timer ( callback ) ;
        timer . callBackData = data ;
        timer . timeout = timeout ;
        timer . countdown = timeout ;
        timer . enable = true ;
        timer . id = ++ this . _timersId ; 
        timer . onlyOnce = onlyOnce ; 

        this . timers . push ( timer ) ;
        return timer . id ;
    }

    public removeTimer ( id : number ) : boolean {
        let found : boolean = false ;
        for ( let i = 0 ; i < this . timers . length ; i ++ ) {
            if ( this . timers [ i ] . id === id ) {
                let timer : Timer = this . timers [ i ] ;
                // 并未真正删除定时器，而是设置成未启用，利于效率
                timer . enable = false ; 
                found = true ;
                break ;
            }
        }
        return found ;
    }

    public removeTimerPermanent(id: number) : boolean{
        return true;
    }
}

export class TimerManagerModule implements Module{

    public enable : boolean = true;
    public module !: TimerManager;

    public constructor(){
        this.module = new TimerManager();
    }

    public update(totalTime:number, interTime:number):void{
        this.module.handleTimers(interTime);
    }

}
