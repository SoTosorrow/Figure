<template>
  <canvas id="cav" width="500" height="300" class="canvas"></canvas>
  <br>
  <button id="start" @click="clickStart">start</button>
  <button id="stop" @click="clickStop">stop</button>
</template>

<script setup lang="ts">
import {onMounted, ref, reactive} from 'vue'
import { Canvas2DApplication as ApplicationTest} from './kernel/to_use'

let app !: ApplicationTest;
let timer0 : number;
let timer1 : number;

let clickStart = ()=>{
  app.start();
}
let clickStop = ()=>{
  app.timerManager.removeTimer(timer1);
  app.stop();
  
}

onMounted(()=>{
  let canvas = document.getElementById("cav") as HTMLCanvasElement;
  app = new ApplicationTest(canvas);

  timer0 = app.timerManager.addTimer(
      (id:number,data:string)=>{
        console.log(data);
      }
  ,3,true,"test string");
  timer1 = app.timerManager.addTimer(
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
