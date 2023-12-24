import '../css/style.css'
import {sketch} from 'p5js-wrapper';
import * as R from 'ramda'

const wordSize = 8
const wordPerBlock = 2
const numBlock = 16
const cachelength = 4
const cacheList = []
const tagCount  = Math.floor(Math.log2(numBlock/cachelength)) 
const lineCount = Math.floor(Math.log2(cachelength)) 
const wordCount = Math.floor(Math.log2(wordPerBlock)) 


const colors = ["red","blue","green","yellow","purple","cyan"]

const memory = []
const metaMemory = []
const  instructions=[]

let cache // global cache access

sketch.setup = function(){
  createCanvas (windowWidth/1.01, windowHeight/1.01);
  makeMemory(numBlock,wordPerBlock,wordSize)

  // makeInstruction
  let instructionSize = tagCount+lineCount+wordCount
  instructions.push(makeInstruction(instructionSize))
  instructions.push(makeInstruction(instructionSize))
  instructions.push(makeInstruction(instructionSize))

  cache=new Cache(cachelength,tagCount,wordPerBlock,wordSize) // create a cache
  for(let i=0;i<instructions.length;i++){
    cache.copyDirect(memory,i)
  }
  instructions.forEach((i,index)=>cache.copyDirect(memory,index))
}


sketch.draw= function(){
  colorMode(RGB)
  background(100);
  noFill()
  const buff = width/8
  showMemory(width/2+buff,10,width/3,height-30,memory) // display the memory
  cache.show(10,10,width/2+50,height/2) // display the cache
  instructions.forEach((i,index)=>showWord(10,height/2+20+(index+1)*30,width/2,30, i)) // display instruction
}





function makeMemory(numBlock,wordPerBlock,wordSize){
  for(let i=0;i<numBlock;i++){
    let block =[]
    for(let j=0;j<wordPerBlock;j++){
      block.push(randomWord(wordSize))
    }
    memory.push(block)
    metaMemory.push({})
   }
}
function makeInstruction (size){
  return randomWord(size)
}
function showWord(x,y,w,h,word,recColor="white"){
  let div = w/word.length
  for(let i =x, j=0; i<x+w,j<word.length;  i+=div,j++){
    stroke(recColor)
    rect(i,y,div,h);
    let num = word[j]
    textSize(20)
    if(num==0)
      stroke(0)
    if(num==1)
      stroke(255)
    text(num,i+div/2,y+h/2+5)
  }
}
function showBlock(x,y,w,h,block,color="white"){
  let div = h/block.length
  for(let i=0;i<block.length;i++){
    showWord(x,y+(i*div),w,div,block[i],color)
  }
}
function showMemory(x,y,w,h,memory){
  let div = h/memory.length
  for(let i=0;i<memory.length;i++){
    metaMemory[i] = {x,y:y+(i*div),w,div}
    if(mouseX>x && mouseX<x+w && mouseY>y+(i*div) && mouseY<y+(i*div)+div){
      showBlock(x,y+(i*div),w,div,memory[i],"red")
      stroke("white")
      text("b-"+i,x+w+5,y+(i*div)+div/2+5)
    }
    else {
      showBlock(x,y+(i*div),w,div,memory[i],"white")
    }
  }
}

class Cache{
  constructor(length,tagLength,wordPerBlock,wordSize){
    this.length = length
    this.lines = []
    this.tagCount = tagLength
    this.wordPerBlock = wordPerBlock
    this.wordSize = wordSize
    
    for(let i =0;i<length;i++){// intalize with empty
     let blockLine = '-'.repeat(this.tagCount+this.wordPerBlock*this.wordSize)
     this.lines[i]={block:blockLine,i}
    }
  }
  show(x,y,w,h){
    let div = h/this.length
    let color ="red"
    for(let i=0;i<this.length;i++){
      this.showCacheWord(x,y+(i*div),w,div,this.lines[i].block,color,this.tagCount)
      const isIn = mouseX>x && mouseX<x+w && mouseY>y+(i*div) && mouseY<y+(i*div)+div
      if(isIn){
        stroke("white")
        let nowBlock = metaMemory[this.lines[i].i]
        console.log(this.lines[i].block)
        if(this.lines[i].block!='-'.repeat(this.tagCount+2*wordSize)){
          line(x+w,y+(i*div),nowBlock.x,nowBlock.y+nowBlock.div/2)
        }
        text("l-"+i,x+w+5,y+(i*div)+div/2+5)
      }
    }
  }
  copyDirect(memory,instructionIndex){
      let tag = gettag(instructionIndex)
      let line = getline(instructionIndex)
      let blocknum = tag*cachelength+line
      let block =memory[blocknum]
      
      let tagnum = toBinary(tag,tagCount)
      let blockLine= [].concat(...tagnum,...block)
      this.addBlock(blockLine,line,blocknum)
  }
  addBlock(block,lineIndex,blockIndex){
    this.lines[lineIndex] ={block,i:blockIndex}
  }
  showCacheWord(x,y,w,h,word,recColor="white",tagLength =0){
     let div = w/word.length
     for(let i =x, j=0; i<x+w,j<word.length;  i+=div,j++){
       if(tagLength>0 && j<tagLength){
         stroke(recColor)
         fill(255,0,0,50)
       }
       else if(tagLength>0 && j>=tagLength){
         noFill()
         stroke("white")
       }
       rect(i,y,div,h);
       let num = word[j]
       textSize(20)
       if(num==0)
         stroke(0)
       if(num==1)
         stroke(255)
       text(num,i+div/2,y+h/2+5)
   }
  }
}

// small tools
function gettag(i){
  let latestInstruction =instructions[i]
  let splited =R.splitAt(2,latestInstruction)
  let tagBin =splited[0]
  return parseInt(tagBin.join(""), 2);
}
function getline(i){
  let latestInstruction =instructions[i]
  let splited =R.splitAt(2,latestInstruction)
  let lineBin =R.splitAt(2,splited[1])[0]
  return parseInt(lineBin.join(""), 2);
}
function randomWord(size){
  let word = []
  let i =0
  while(i<size){
    word.push(randomBinary())
    i++
  }
  return word
}
function randomBinary(){
  return Math.round(Math.random());
}
function toBinary(n,len){
  let bin = (n >>> 0).toString(2)
  if (bin.length < len)
    bin = '0'.repeat(len - bin.length) + bin
  return bin
}

// for responsiveness
sketch.windowResized = function(){
  resizeCanvas(windowWidth/1.01, windowHeight/1.01 )
}
