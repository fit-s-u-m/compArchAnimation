import '../css/style.css'
import {sketch} from 'p5js-wrapper';
import * as R from 'ramda'

let wordSize = 8
let wordPerBlock = 2
let  numBlock = 16
let cachelength = 4
let missHit = []
let tagCount  = Math.floor(Math.log2(numBlock/cachelength)) 
let lineCount = Math.floor(Math.log2(cachelength)) 
let wordCount = Math.floor(Math.log2(wordPerBlock)) 

let instructionSize = tagCount+lineCount+wordCount
let n=0;
let globalBlockHighlight = null
let metaInstruction =[]
let mappingInput
let numBlockInput
let wordSizeInput
let cachelengthInput
let wordPerBlockInput
let prevButton
let nextButton 
let mapping = "direct"



const colors = ["blue","green","yellow","purple","cyan"]

const memory = []
const metaMemory = []
const  instructions=[]

let cache // global cache access

sketch.setup = function(){
  createCanvas (windowWidth/1.01, windowHeight/1.01)
    .parent("canvas")

  prevButton =createButton("prev")
    .mousePressed(prev)
    .parent("clock_control")
  nextButton = createButton("next")
    .mousePressed(next)
    .parent("clock_control")

  
  const numBlockLable = createElement("lable","num of block")
    .parent("lable")
  numBlockInput = createInput(16,"number")
    .parent("inputs")
    .id("numBlock")

  const wordSizeLable = createElement("lable","word size")
    .parent("lable")
  wordSizeInput = createInput(8,"number")
    .parent("inputs")
    .id("wordSize")

  const cachelengthLable = createElement("lable","cache length")
    .parent("lable")
  cachelengthInput = createInput(4,"number")
    .parent("inputs")
    .id("cachelength")

  const wordPerBlockLable = createElement("lable","word per block")
   .parent("lable")
  wordPerBlockInput = createInput(2,"number")
    .parent("inputs")
    .id("wordPerBlock")

  // mappingInput = createSelect("options", [ "direct" ,"associtive", "set associtive"])
  const mappingLable = createElement("lable","mapping")
   .parent("lable")
  mappingInput = createSelect()
    .parent("inputs")
    .id("mapping")

    mappingInput.option("direct")
    mappingInput.option("associtive")
    mappingInput.option("set associtive")
    mappingInput.size(500,30)
  
  makeMemory (numBlock,wordPerBlock,wordSize)
  cache=new Cache (cachelength,tagCount,wordPerBlock,wordSize) // create a cache

  // set up inital value
  numBlock = numBlockInput.value()
  wordSize = wordSizeInput.value()
  cachelength = cachelengthInput.value()
  wordPerBlock = wordPerBlockInput.value()
  mapping = mappingInput.value()

}
function reDraw(){
  memory.length=0
  metaMemory.length=0
  makeMemory (numBlock,wordPerBlock,wordSize)
  cache=new Cache (cachelength,tagCount,wordPerBlock,wordSize) // create a cache
  
  numBlock = numBlockInput.value()
  wordSize = wordSizeInput.value()
  cachelength = cachelengthInput.value()
  wordPerBlock = wordPerBlockInput.value()
  mapping = mappingInput.value()

}
function prev(){
  if(n>0)
   n--
}
function next(){
   n++
}
function setMapping(){
  if(mapping=="direct"){
    tagCount  = Math.ceil(Math.log2(numBlock/cachelength)) 
    lineCount = Math.ceil(Math.log2(cachelength)) 
    wordCount = Math.ceil(Math.log2(wordPerBlock)) 
  }
  else if(mapping="associtive"){
    tagCount  = Math.ceil(Math.log2(numBlock)) 
    lineCount = 0
    wordCount = Math.ceil(Math.log2(wordPerBlock)) 
  }
  instructionSize = tagCount+lineCount+wordCount 
}


sketch.draw = function(){
  colorMode(RGB)
  background(100)
  strokeWeight(1)
  noFill()

  numBlockInput.changed(reDraw)
  wordSizeInput.changed(reDraw)
  cachelengthInput.changed(reDraw)
  wordPerBlockInput.changed(reDraw)
  mappingInput.changed(()=>{reDraw();instructions.length=0;})

  const buff = width/16
  showMemory(width/2+buff - 15,10,width/3+buff+buff/2,height-30,memory) // display the memory
  cache.show(10,10,width/2+50,height/4) // display the cache
  setMapping()
  clock(n)
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
function showWord(x,y,w,h,word,recColor="white",text_size=20){
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
    textSize(text_size)
    text(num,i+div/2,y+h/2+5)
  }
}
function showBlock(x,y,w,h,block,color="white"){
  let div = h/block.length
  for(let i=0;i<block.length;i++){
    showWord(x,y+(i*div),w,div,block[i],color,div/1.1)
  }
}
function showMemory(x,y,w,h,memory){
  const div = h/memory.length
  for(let i=0;i<memory.length;i++){
    metaMemory[i] = {x,y:y+(i*div),w,div}
    const isIn = mouseX>x && mouseX<x+w && mouseY>y+(i*div) && mouseY<y+(i*div)+div
    if(isIn){
      showBlock(x,y+(i*div),w,div,memory[i],"red")
      stroke("white")
      text("b-"+i,x+w+5,y+(i*div)+div/2+5)
    }
    else {
      showBlock(x,y+(i*div),w,div,memory[i],"white")
    }
  }
  const newDivSize = numBlock/cachelength
  const newDiv = h/newDivSize 
  let newY = y
  for(let i=0;i<newDivSize;i++){
    let colorIndex = i%(colors.length-1)
    strokeWeight(3)
    // highlightBlock(x,newY,w,newDiv,colors[colorIndex])
    highlightBlock(x,newY,w,newDiv,"black")
    newY +=newDiv
  }
    strokeWeight(1)

}
function highlightBlock(x,y,w,h,c){
  stroke(c)
  strokeWeight(2)
  rect(x,y,w,h)
}


class Cache{
  constructor(length,tagLength,wordPerBlock,wordSize){
    this.length = length
    this.lines = []
    this.tagCount = tagLength
    this.wordPerBlock = wordPerBlock
    this.wordSize = wordSize
    this.x=0
    this.y=0
    this.w=0
    this.h=0

    for(let i =0;i<length;i++){// intalize with empty
     let blockLine = '-'.repeat(this.tagCount+this.wordPerBlock*this.wordSize)
     this.lines[i]={block:blockLine,i}
    }
    
  }
  show(x,y,w,h){
    this.x=x
    this.y=y
    this.w=w
    this.h=h
    strokeWeight(1)


    let div = h/this.length
    let color ="red"
    strokeWeight(1)
    for(let i=0;i<this.length;i++){
      this.showCacheGrid(x,y+(i*div),w,div,this.lines[i].block,color,tagCount)
      const isIn = mouseX>x && mouseX<x+w && mouseY>y+(i*div) && mouseY<y+(i*div)+div
      if(isIn){
        stroke("white")
        let nowBlock = metaMemory[this.lines[i].i]
        const stn = '-'.repeat(this.tagCount+this.wordPerBlock*wordSize)
        if(this.lines[i].block!=stn){
          line(x+w,y+(i*div),nowBlock.x,nowBlock.y+nowBlock.div/2)
          highlightBlock(nowBlock.x,nowBlock.y,nowBlock.w,nowBlock.div,"red")
        }
        text("l-"+i,x+w+5,y+(i*div)+div/2+5)
      }
      this.showCacheWord(x, y+(i*div), w, div, this.lines[i].block)
    }
  }
  copyDirect(memory, instructionIndex, clock=0){
      let tag = gettag(instructionIndex)
      let line = getline(instructionIndex)
      let blocknum = (tag*cachelength) + line
      let block =memory[blocknum]
      
      let tagnum = toBinary(tag,tagCount)
      let blockLine= [].concat(...tagnum,...block)
      this.addBlock(blockLine,line,blocknum)
  }
  copyAssosiative(memory,instructionIndex){
    let tag = getAssociativeTag(instructionIndex)
    let block =memory[tag]
    let tagnum = toBinary(tag,tagCount)
    let blockLine= [].concat(...tagnum,...block)

    if(metaInstruction[instructionIndex]){
       this.addBlock(blockLine,metaInstruction[instructionIndex].i,tag)
    }
    else {
      let randomPlace
      cache.lines.forEach(line=>{
        if(! Array.isArray(line.block))
          randomPlace = line.i
      })
      metaInstruction[instructionIndex] = {i:randomPlace}
      this.addBlock(blockLine,randomPlace,tag)
      // console.log(isMiss(instructionIndex,"associtive"))
      if (!randomPlace && isMiss(instructionIndex,"associtive")){
      setTimeout(()=>{
           window.alert("no Place to put in")
      },50)

      }
    }
      
  }
  addBlock(block,lineIndex,blockIndex){
    this.lines[lineIndex] ={block,i:blockIndex}
  }
  highlightcache(i){
         let div = this.h/this.length
        highlightBlock(this.x,this.y+(i*div),this.w,div,"yellow")
  }
  showCacheGrid(x,y,w,h,word,recColor="white",tagLength =0){
     let div = w/word.length
       for(let i =x, j=0; i<x+w,j<word.length;  i+=div,j++){
         if(tagLength>0 && j<tagLength){
           stroke(recColor)
           fill(255,0,0,50)
         }
         else if(tagLength>0 && j>=tagLength && j<tagLength+(word.length/2)-1){
           fill("gray")
           stroke("white")
         }
         else{
           stroke("white")
           noFill()
         } 
         rect(i,y,div,h);
       }
  }
  showCacheWord(x,y,w,h,word){
    let div = w/word.length
    for(let i=0; i<this.length; i++){
       for(let i =x, j=0; i<x+w,j<word.length;  i+=div,j++){
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
}

// small tools
function gettag(i){
  let latestInstruction =instructions[i]
  let splited =R.splitAt(2,latestInstruction)
  let tagBin =splited[0]
  return parseInt(tagBin.join(""), 2);
}

function getAssociativeTag(i){
  let latestInstruction =instructions[i]
  let tagBin = R.take(latestInstruction.length-wordCount,latestInstruction)  
  return parseInt(tagBin.join(""), 2);
}

function getAssociativeWord(i){
  let latestInstruction =instructions[i]
  let wordBin = R.takeLast(wordCount,latestInstruction)
  return parseInt(wordBin.join(""), 2);
}
function getCacheTag(line){
  const block =cache.lines[line].block
  const blockLine = '-'.repeat(tagCount+ (wordPerBlock*wordSize) )
  const isCacheEmpty = ! Array.isArray(block)
  if(! isCacheEmpty){
    const tagArray = block.splice(0,tagCount)
    return parseInt(tagArray.join(""),2)
  }
  return null
}
function getline(i){
  let latestInstruction =instructions[i]
  let splited =R.splitAt(2,latestInstruction)
  let lineBin =R.splitAt(2,splited[1])[0]
  return parseInt(lineBin.join(""), 2);
}
function getword(i){
  let latestInstruction =instructions[i]
  let splited =R.splitAt(2,latestInstruction)
  let lineBin =R.splitAt(2,splited[1])[1]
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
function clock(n){

  for(let i =0;i<cache.length;i++){// intalize with empty
     let blockLine = '-'.repeat(cache.tagCount+cache.wordPerBlock*cache.wordSize)
     cache.lines[i]={block:blockLine,i}
  }

  for(let i=0;i<n;i++){

    if(instructions[i]==null){
        instructions[i]= makeInstruction(instructionSize)
        missHit[i] = isMiss(i,mapping)
    }
    if(missHit[i] && mapping=="direct"){
       cache.copyDirect(memory,i)
    }
    if(missHit[i] && mapping=="associtive"){
       cache.copyAssosiative(memory,i)
    }
    const y = height/2+20+(i+1)*30
    const isIn = mouseX>10 && mouseX<10+width/2 && mouseY>y && mouseY<y+30
    const currentTag = gettag(i)
    const currentLine = getline(i)
    if(isIn && mapping=="direct"){
      showWord(10,y,width/2,30, instructions[i],"yellow")
      cache.highlightcache(currentLine)
      const tag = gettag(i)
      const line = getline(i)
      const word = getword(i)
      let blocknum = (tag*cachelength) + line
      const newblock = metaMemory[blocknum]
      const index = word*newblock.div/wordPerBlock
      highlightBlock(newblock.x, newblock.y+index, newblock.w, newblock.div/(wordPerBlock),"yellow")
    }
    else if(isIn && mapping=="associtive"){
      showWord(10,y,width/2,30, instructions[i],"yellow")
      if(metaInstruction[i]){
      cache.highlightcache(metaInstruction[i].i)
      }

      const tag = getAssociativeTag(i)
      const word = getAssociativeWord(i)

      const newblock = metaMemory[tag]
      const index = word*newblock.div/wordPerBlock
      highlightBlock(newblock.x, newblock.y+index, newblock.w, newblock.div/(wordPerBlock),"yellow")
    }
    else 
      showWord(10,y,width/2,30, instructions[i])

    stroke("red")
    if(missHit[i])
      text("M",width/2+20,height/2+40+(i+1)*30)
    stroke("cyan")
    if(missHit[i]==false)
      text("H",width/2+20,height/2+40+(i+1)*30)
  }
    prevButton.position(10,height/2+25+(n+2)*30)
    nextButton.position(100,height/2+25+(n+2)*30)
}
function isMiss(i,mapping){
    const currentTag = gettag(i)
  if(mapping=="direct"){
    const currentLine = getline(i)
    const cacheTag = getCacheTag(currentLine)
    if(cacheTag === currentTag)
      return false
    return true
  }
  else if(mapping="associtive"){
    for(i=0;i<cache.lines.length;i++){
      if(cache.lines[i].block=="-".repeat(cache.tagCount+cache.wordPerBlock*cache.wordSize))
        continue
      let cacheTag = getCacheTag(i)
      if(cacheTag==currentTag)
        return false
    }
    return true
  }
}

// for responsiveness
sketch.windowResized = function(){
  resizeCanvas(windowWidth/1.01, windowHeight/1.01 )
}
