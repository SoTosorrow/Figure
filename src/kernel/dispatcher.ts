/*
    事件分配器

    TODO 增加map<string,func>的自定义事件
*/

import { EInputEventType }from './define';
import { vec2 } from './math2d';

export class CanvasInputEvent {
    public altKey : boolean ;
    public ctrlKey : boolean ;
    public shiftKey : boolean ;
    public type : EInputEventType ;
    public constructor ( type : EInputEventType , altKey : boolean = false , ctrlKey : boolean = false , shiftKey : boolean = false  ) {
        this . altKey = altKey ;
        this . ctrlKey = ctrlKey ;
        this . shiftKey = shiftKey ;
        this . type = type ;
    }
}
export class CanvasMouseEvent extends CanvasInputEvent {
    public button  : number  ;
    public canvasPosition  : vec2  ;
    
    public localPosition  : vec2  ; 
    public hasLocalPosition : boolean ;

    public constructor ( type : EInputEventType , canvasPos : vec2 , button : number , altKey  : boolean = false , ctrlKey : boolean = false , shiftKey : boolean = false ) {
        super ( type , altKey , ctrlKey , shiftKey ) ;
        this . canvasPosition = canvasPos ;
        this . button = button ;
        this . hasLocalPosition = false ;
        this . localPosition = vec2 . create ( ) ;
    }
}

export class CanvasKeyBoardEvent extends CanvasInputEvent {
    public key : string ;
    public keyCode : number ;
    public repeat : boolean ;

    public constructor ( type : EInputEventType , key : string , keyCode : number , repeat : boolean , altKey : boolean = false , ctrlKey : boolean = false , shiftKey : boolean = false ) {
        super ( type , altKey , ctrlKey , shiftKey  ) ;
        this . key = key ;
        this . keyCode = keyCode ;
        this . repeat = repeat ;
    }
}

// 实现EventListenerObject的handleEvent方法，浏览器自动调用
export class EventDispatcher implements EventListenerObject{

    public isSupportMouseMove ?: boolean ;
    protected _isMouseDown ?: boolean ;
    public canvas : HTMLCanvasElement;

    constructor(canvas : HTMLCanvasElement){
        this.canvas = canvas;
        this.canvas . addEventListener ( "mousedown" , this , false ) ;
        this.canvas . addEventListener ( "mouseup" , this , false ) ;
        this.canvas . addEventListener ( "mousemove" , this , false ) ;
        // HTMLCanvasElement 不能够监听键盘，所以用window监听
        window.addEventListener ( "keydown" , this , false ) ;
        window.addEventListener ( "keyup" , this , false ) ;
        window.addEventListener ( "keypress" , this , false ) ;
        this._isMouseDown = false ;
        this.isSupportMouseMove = false ;
    }
 
    public handleEvent ( evt  : Event )  : void {
        switch ( evt . type ) {
            case "mousedown" :
                this . _isMouseDown = true ;
                this . dispatchMouseDown ( this . _toCanvasMouseEvent ( evt , EInputEventType . MOUSE_DOWN ) ) ;
                break ;
            case "mouseup" :
                this . _isMouseDown = false ;
                this . dispatchMouseUp ( this . _toCanvasMouseEvent ( evt , EInputEventType . MOUSE_UP ) ) ;
                break ;
            case "mousemove" :
                if ( this . isSupportMouseMove ) {
                    this . dispatchMouseMove ( this . _toCanvasMouseEvent ( evt , EInputEventType . MOUSE_MOVE ) ) ;
                }
                if ( this . _isMouseDown ) {
                    this . dispatchMouseDrag ( this . _toCanvasMouseEvent ( evt , EInputEventType . MOUSE_DRAG ) ) ;
                }
                break ;
            case "keypress" :
                this . dispatchKeyPress ( this . _toCanvasKeyBoardEvent ( evt , EInputEventType . KEY_PRESS ) ) ;
                break ;
            case "keydown" :
                this . dispatchKeyDown ( this . _toCanvasKeyBoardEvent ( evt , EInputEventType . KEY_DOWN ) ) ;
                break ;
            case "keyup" :
                this . dispatchKeyUp ( this . _toCanvasKeyBoardEvent ( evt , EInputEventType . KEY_UP ) ) ;
                break ;
        }
    }

    
    protected dispatchMouseDown ( evt : CanvasMouseEvent ) : void {     return ;}
    protected dispatchMouseUp ( evt : CanvasMouseEvent ) : void {     return ;}
    protected dispatchMouseMove ( evt : CanvasMouseEvent ) : void {     return ;}
    protected dispatchMouseDrag ( evt : CanvasMouseEvent ) : void {    return ;}
    protected dispatchKeyDown ( evt : CanvasKeyBoardEvent ) : void {    return ;}
    protected dispatchKeyUp ( evt : CanvasKeyBoardEvent ) : void {    return ;}
    protected dispatchKeyPress ( evt : CanvasKeyBoardEvent ) : void {    return ;}

    private _viewportToCanvasCoordinate ( evt : MouseEvent ) : vec2 {
        if ( this . canvas ) {
            let rect : ClientRect = this . canvas . getBoundingClientRect ( ) ;
            if ( evt . type === "mousedown" ) {
                // console . log (" boundingClientRect : " + JSON . stringify ( rect ) ) ;
                // console . log ( " clientX : " + evt . clientX + " clientY : " + evt.clientY ) ;
            }
            if ( evt . target ) 
            { 
                let borderLeftWidth : number = 0 ;  
                let borderTopWidth : number = 0 ;   
                let paddingLeft : number = 0 ;      
                let paddingTop : number = 0 ;       
                let decl : CSSStyleDeclaration  = window . getComputedStyle ( evt . target as HTMLElement ) ;
                let strNumber : string | null =  decl . borderLeftWidth ;

                if ( strNumber !== null ) {
                    borderLeftWidth  = parseInt ( strNumber , 10 ) ;
                }

                if ( strNumber !== null ) {
                    borderTopWidth = parseInt ( strNumber , 10 ) ;
                }

                strNumber = decl . paddingLeft ;
                if ( strNumber !== null ) {
                    paddingLeft = parseInt(strNumber,10);
                }

                strNumber = decl . paddingTop ;
                if ( strNumber !== null ) {
                    paddingTop = parseInt ( strNumber , 10) ;
                }
            
                let x : number  = evt . clientX - rect . left - borderLeftWidth - paddingLeft ;
                let y : number  = evt . clientY - rect . top - borderTopWidth - paddingTop ;

                let pos : vec2 = vec2 . create ( x , y ) ;    
            
                if ( evt . type === "mousedown" ) {
                    // console . log ( " borderLeftWidth : " + borderLeftWidth + " borderTopWidth : " + borderTopWidth ) ;
                    // console . log ( " paddingLeft : " + paddingLeft + " paddingTop : " + paddingTop ) ;
                    // console . log ( " 变换后的canvasPosition : " + pos . toString( ) ) ;
                    // console.log(pos.toString());
                    
                }
                return pos ;
             }
             alert("canvas为null");
             throw new Error("canvas为null");
        }
        
        alert("evt . target为null");
        throw new Error("evt . target为null");
    }
    
    private _toCanvasMouseEvent ( evt : Event , type : EInputEventType ) : CanvasMouseEvent {
        let event : MouseEvent = evt as MouseEvent ;
        let mousePosition : vec2 = this . _viewportToCanvasCoordinate ( event ) ;
        let canvasMouseEvent : CanvasMouseEvent = new CanvasMouseEvent ( type , mousePosition , event . button , event . altKey , event . ctrlKey , event . shiftKey ) ;
        return canvasMouseEvent ;
    }

    private _toCanvasKeyBoardEvent ( evt : Event , type : EInputEventType  ) : CanvasKeyBoardEvent {
        let event : KeyboardEvent = evt as KeyboardEvent ;
        let canvasKeyboardEvent : CanvasKeyBoardEvent = new CanvasKeyBoardEvent ( type , event . key , event . keyCode , event . repeat , event . altKey , event . ctrlKey , event . shiftKey ) ;
        return canvasKeyboardEvent ;
    }
}

