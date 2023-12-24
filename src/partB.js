import '../css/style.css';
import {p5} from 'p5js-wrapper';

let sketch1 = new p5( p => {

    p.setup = () => {
      // canvas size is specified in the CSS file (size of div #one)
      const one= document.getElementById('one');
      p.createCanvas(one.clientWidth, one.clientHeight);
      // same as: p.createCanvas($("#one").width(), $("#one").height());
    };
  
    p.draw = () => {
      p.background(100);
      p.fill(255);
      p.noStroke();
      p.rectMode(p.CENTER);
      p.rect(p.mouseX, p.mouseY, 50, 50);
  
    };
  }, 'one');
  
  
let sketch2 = new p5( p => {
    const numBits = 8
    const cacheList = []

    function divide(x,y,w,h,div,num=""){
      let size = w/div;
      p.colorMode(p.HSB)
      for(let i =x; i<x+w; i+=size){
        // p.stroke(255%(i-x),255,200)
        p.stroke(150,100,100)
        p.rect(i,y,size,h);

        // if(num=="random"){
          // num = randomBinary()
          if(num=="0")
            p.stroke(0)
          if(num=="1")
            p.stroke(255)
          p.text(num,i+size/2,y+h/2+5)
        }
      // }
     }
    class Cache{
      constructor(x,y,w,h,div,n=0){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.div = div
        this.num=n
      }
      show(){
        divide(this.x,this.y,this.w,this.h, this.div, this.num)
      }
    }

  
    p.setup = () => {
      const two= document.getElementById('two')
      p.createCanvas(two.clientWidth, two.clientHeight)
      let ydiv = (p.height-20)/30
      let xdiv = 8

      for(let i=10;i<=p.height-20;i+=ydiv){
        cacheList.push(new Cache(p.width/2,i,p.width/2-10,ydiv, xdiv,randomBinary()))
       }

    }
  
    p.draw = () => {
      p.colorMode(p.RGB)
      p.background(100);
      p.noFill()
      p.stroke(255)
      p.rect(p.width/2, 10, p.width/2-10, p.height-20); //cache box
      p.rect(10,10,p.width/2-30,30) //instruction set
      divide(10,10,p.width/2-30,30, numBits)

      for(let i=0;i<cacheList.length;i++){
        cacheList[i].show()
      }
    }


}, 'two')


function randomBinary(){
  return Math.round(Math.random());
}



