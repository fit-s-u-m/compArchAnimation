import '../css/style.css';
import {p5} from 'p5js-wrapper';
import {Registor} from "./partB tools/registor.js"
import {Alu} from "./partB tools/alu.js"
import {control} from "./partB tools/controlUnit.js"
import {line} from "./partB tools/line.js"
import {getControlMemory,createInstruction, getControlWords} from './partB tools/decoder.js'


let sketch1 = new p5( p => {
    const Rwidth = 150
    const Rheight = 200
    const numRegistor = 4
    const  Rx = 10
    let Ry 
    let  AluX 
    let middle
    const showContolMemory = (x,y,w,h,contolWord)=>{
      controlWord.forEach((word,i)=>{
        word.forEach((bit,j)=>{
          p.noFill()
          p.rect(x+i*w,y+j*h,w,h) 
        })
      })
    }
    const start=()=>{
     // Taking instruction inputs form the user
     let userInstruction = p.select("#instruction").value().toUpperCase();
     let source1 = p.select("#source1").value();
     let source2 = p.select("#source2").value();
     let destination = p.select("#destination").value();

     // Creating instruction and getting the corresponding controlWords
     let instruction = createInstruction(userInstruction,source1,source2,destination);
     let controlWords = getControlWords(instruction);
     let controlMemory = getControlMemory();

     console.log(controlMemory);
     console.log(instruction,controlWords);

    }
    p.setup = () => {
      const one= document.getElementById('one');
      p.createCanvas(one.clientWidth, one.clientHeight);
      p.createButton("submit").position(p.width/2,50).mousePressed(start)
      Ry = p.height*0.2
      AluX = p.width-200  
      middle = p.width/2
    };
  
    p.draw = () => {
      p.background(100);
      Registor(p,Rx,Ry,Rwidth,Rheight,numRegistor,["R0","R2"])
      Alu(p,AluX,Ry,Rwidth,Rheight)
      const endPoints = control(p,0,4,numRegistor,middle,Ry,Rwidth,Rheight)
      line(p,endPoints)
    };
    p.windowResized= ()=>{
      p.resizeCanvas(one.clientWidth, one.clientHeight)
      Ry = p.height*0.2
      AluX = p.width-200  
      middle= p.width/2
    }
  }, 'one');


// let sketch2 = new p5( p => {
//     p.setup = () => {
//       const two= document.getElementById('two')
//       p.createCanvas(two.clientWidth, two.clientHeight)
//     }
//     p.draw = () => {
//       p.background(100);
//     }
// }, 'two')
