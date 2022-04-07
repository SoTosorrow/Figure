import { Module } from "./define";
import { vec2, mat2d } from "./math2d";
import { Renderer } from "./renderer";

export interface DrawElement{
    // setState(context:CanvasRenderingContext2D):void;
    draw(renderer:Renderer):void;
}

export interface TransfromElement{
    x : number;
    y : number;

    rotate : number;

    sx : number;
    sy : number;

    getWorldMatrix ( ) : mat2d ;
    getLocalMatrix ( ) : mat2d ;
}

export interface Unit extends DrawElement{
    draw(renderer:Renderer):void;
}

export class UnitManager{
    public canvas : HTMLCanvasElement;
    public context !: CanvasRenderingContext2D; 
    public units :Unit[] = [];
    public renderer : Renderer;

    public constructor(canvas : HTMLCanvasElement ){
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        
        // context2DTemp 类型为 CanvasRenderingContext2D | null
        let contextTemp = this.canvas.getContext("2d");
        // 保证context2D不为null
        if( contextTemp === null){
            return;
        }
        this.context = contextTemp;
    }

    public render():void{
        
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.renderer.drawGrid();
        for(let i of this.units){
            // if i.visiable === false
            i.draw(this.renderer);
        }
    }

    public addUnit(unit:Unit):void{
        this.units.push(unit);
    }
    public removeUnitAt(index:number):void{
        this.units.splice(index,1);
        
    }
    public removeUnit(unit:Unit):boolean{
        let index = this . getUnitIndex ( unit ) ;
        if ( index !== -1 ) {
            this . removeUnitAt ( index ) ;            
            return true ;
        }
        return false ;
    }
    public removeAll():void{
        this.units = [];
    }
    public getUnit ( index : number ) : Unit {
        if ( index < 0 || index > this . units . length - 1 ) {
            throw new Error ( "index out" ) ;
        }
        return this . units [ index ] ;
    }
    public getUnitIndex ( unit: Unit ): number {
        for ( let i = 0 ; i < this . units . length ; i++ ) {
            if ( this . units [ i ] === unit ) {
                return i ;
            }
        }
        return -1 ;
    }

}

export class UnitManagerModule implements Module{
    public enable : boolean = true;
    public module !: any;

    public constructor(canvas : HTMLCanvasElement){
        this.module = new UnitManager(canvas);
    }

    public update(totalTime:number, interTime:number):void{
        this.module.render();
    }
}