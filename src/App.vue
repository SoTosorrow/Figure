<template>
  <canvas id="cav" width="500" height="300" class="canvas"></canvas>
  <br>
  <button id="start" @click="clickStart">start</button>
  <button id="stop" @click="clickStop">stop</button>
</template>

<script setup lang="ts">
import {onMounted, ref, reactive} from 'vue'
import { Circle, DispatcherTest,Rect,Test} from './kernel/to_use'
import {Application} from './kernel/application'
import { UnitManagerModule } from './kernel/unit';

let app !: Application;

let clickStart = ()=>{
  app.start();
}
let clickStop = ()=>{
  app.stop();
  
}

onMounted(()=>{
  let canvas = document.getElementById("cav") as HTMLCanvasElement;
  app = new Application(canvas);
  
  
  // app.modules.set("renderer", new Test(app.canvas, app));
  app.modules.set("dispatcher",new DispatcherTest(app.canvas,app));
  let element = new Rect();
  let element2 = new Circle();
  (app.modules.get("unitManager") as UnitManagerModule).module.addUnit(element);
  (app.modules.get("unitManager") as UnitManagerModule).module.addUnit(element2);
  (app.modules.get("unitManager") as UnitManagerModule).module.removeUnit(element);



})
</script>


<style>
body{
  background: #eeeeee;
}
canvas{
  background: #ffffff;
  margin: 0px;
  box-shadow: 4px 4px 8px rgba(0,0,0,0.5);
}
</style>
