import { Application } from "./kernel/application";
import { Unit, UnitManagerModule } from "./kernel/unit";

export class Utils{

    public static addElement(app:Application, element:Unit):void{
        (app.modules.get("unitManager") as UnitManagerModule).module.addUnit(element);
    }
    public static removeElement(app:Application, element:Unit):void{
        (app.modules.get("unitManager") as UnitManagerModule).module.removeUnit(element);
    }
    public static addElementList(app:Application ,elementList:Unit[]):void{
        for(let i of elementList){
            (app.modules.get("unitManager") as UnitManagerModule).module.addUnit(i);
        }
    }
}