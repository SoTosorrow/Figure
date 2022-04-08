<template>
<video id="myVideo" width="500" height="400" src=""></video>
  <canvas id="cav" width="500" height="300" class="canvas"></canvas>
  <br>
  <button id="start" @click="clickStart">start</button>
  <button id="stop" @click="clickStop">stop</button>
</template>

<script setup lang="ts">
import {onMounted, ref, reactive} from 'vue'
import { Circle, DispatcherTest,Rect} from './kernel/to_use'
import { Application } from './kernel/application'
import { Unit } from './kernel/unit';
import { Utils } from './utils'
import { TimerManagerModule } from './kernel/timer';
import { RenderLayerStack, RenderLayerStackModule} from './kernel/renderLayerStack'
import { WebGLRenderer } from './kernel/webGLRenderer';

let app !: Application;

let clickStart = ()=>{
  app.start();
}
let clickStop = ()=>{
  app.stop();
  
}

onMounted(()=>{
  let canvas = document.getElementById("cav") as HTMLCanvasElement;
  console.log(canvas.getContext('webgl2'));
  
  app = new Application(canvas);
  
  app.modules.set("dispatcher",new DispatcherTest(app.canvas,app));
  let l:Unit[] = [];
  l.push(new Rect(100,10));
  l.push(new Rect(100,100));
  l.push(new Circle());
  (l[1] as Rect).x = 200;

  let timer = (app.modules.get("timerManager") as TimerManagerModule).module.addTimer(
    (a:number,b:number):void=>{
      (l[1] as Rect).x = Math.random()*200;
      (l[1] as Rect).y = Math.random()*200;
    },0.03,true
  )

  Utils.addElementList(app, l);


  //  app.modules.set("renderStack",new RenderLayerStackModule(app.canvas));
   app.modules.set("webgl",new WebGLRenderer(app.canvas));


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
