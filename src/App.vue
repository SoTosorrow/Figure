<template>
  <canvas id="cav" width="500" height="300" class="canvas"></canvas>
  <br>
  <button id="start" @click="clickStart">start</button>
  <button id="stop" @click="clickStop">stop</button>
</template>

<script setup lang="ts">
import {onMounted, ref, reactive} from 'vue'
import { DispatcherTest} from './kernel/to_use'
import { Test} from './kernel/renderer'
import {Application} from './kernel/application'

let app !: Application;
let timer0 : number;
let timer1 : number;

let clickStart = ()=>{
  app.start();
}
let clickStop = ()=>{
  app.getModule("timerManager").removeTimer(timer1);
  app.stop();
  
}

onMounted(()=>{
  let canvas = document.getElementById("cav") as HTMLCanvasElement;
  app = new Application(canvas);
  app.modules.set("renderer", new Test(app.canvas));
  app.modules.set("dispatcher",new DispatcherTest(app.canvas))

  timer0 = app.getModule("timerManager").addTimer(
      (id:number,data:string)=>{
        console.log(data);
      }
  ,3,true,"test string");
  timer1 = app.getModule("timerManager").addTimer(
    (id:number,data:string)=>{
      console.log(data);
    }
  ,1,false,"11111")
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
