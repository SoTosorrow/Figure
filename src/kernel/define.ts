/*
    一些常量和接口的定义
*/

import { mat2d, vec2 } from "./math2d";

export enum EInputEventType {
    MOUSE_EVENT,    
    MOUSE_DOWN,     
    MOUSE_UP,      
    MOUSE_MOVE,     
    MOUSE_DRAG,    
    KEYBOARD_EVENT, 
    KEY_UP,         
    KEY_DOWN,       
    KEY_PRESS, 

//TODO 移动端事件   
};

export interface Module{
    // 模块是否启用
    enable : boolean;

    // 层级
    // layer : number;

    // 自定义的模块具体内容
    // module : any;

    // 模块每帧的调用
    update(totalTime:number, interTime:number):void;

}
