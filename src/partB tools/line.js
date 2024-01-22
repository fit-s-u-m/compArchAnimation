let busArray
let endPoints
let busRegistorPoint
let toHighlight =[0,2,1]
let toHighlightBus = 0
let busUsed =[]


export function line( p,operationEndPoint,whichToActivate,numBus=3 ,numberRegistor =4){
  const buses = bus(p,numBus)
  busRegistorPoint=Array(numBus).fill(Array(numberRegistor))
  registorToBus(p,numberRegistor,buses)
  controlToRegistor(p)
  controlToAlu(p,operationEndPoint)
}

function bus(p,numBus){
  let spaceing = 200
  switch (numBus){
  case 3:
    const y1 =50
    const y2 =p.height -50
    const y3 =p.height -100
    const y =[y1,y2,y3]
    for(let i=0;i<numBus;i++){
      if(toHighlightBus==i){
        p.stroke("blue")
        // console.log(busRegistorPoint[i-1],y[i])
        // p.line(busRegistorPoint[i][toHighlight[1]].x ,y[i],p.width-10,y[i])
        p.line(10,y[i],p.width-10,y[i])
      }else{
        p.stroke('black')
        p.line(10,y[i],p.width-10,y[i])
      }
    }
    return [y1,y2,y3]
    break;
  case 2:
    break;
  case 1:
    break;
  default:
      console.log( "error")
  }
}

function registorToBus(p,numberRegistor,buses){
    const Ry = p.height*0.2
    const Rx = 10
    const Rwidth = 150
    const Rheight = 200
    const div = Rheight/numberRegistor
    endPoints=Array(numberRegistor)
    // make lines
    for(let i=div,counter=0;i<=2*Rheight,counter<numberRegistor;i+=2*div,counter++){
      const length = i/2
      p.stroke('red')
      const p1 = Rx+Rwidth
      const p2 = Ry+i/2
      const p3 = Rx+Rwidth +length
      const p4 = Ry+i/2
      endPoints[counter] = {x:p3,y:p4}
      if(counter==toHighlight){
        p.stroke("blue")
      }
      p.line(p1,p2,p3,p4)
    }
    // connect to bus
    for(let i=0;i<buses.length;i++){
      endPoints.forEach( (registors,j)=>{
        if(toHighlight.includes(j) && i==toHighlightBus){
          if(busUsed.includes(toHighlightBus)){
            toHighlightBus+=1
            if(toHighlightBus>=buses.length)
              (console.log("num bus excedded"))
          }
          p.stroke("blue")
          // busUsed[i]=(toHighlightBus)
        }
        else
          p.stroke(255,255,0,50)
        p.line(registors.x -i*5,registors.y,registors.x -i*5,buses[i])
        busRegistorPoint[i][j] = {x:registors.x -i*5,y:buses[i]}
      })
    }
    
}
function AluToBus(){

}
function controlToAlu(p,operationEndPoint){

  const middle = p.width/2
  const Ry = p.height*0.2
  const Rheight = 200
  const AluX = p.width-200  
  for(let i=0;i<operationEndPoint.length;i++){
    const px = operationEndPoint[i].x
    const py = operationEndPoint[i].y
    if(i==2){
      p.stroke(255,255,0)
    }
    else{
      p.stroke(255,255,0,50)
    }
    p.line(px,py,AluX,py)
  }
}

 function controlToRegistor(p){
   const middle = p.width/2
   const Ry = p.height*0.2
   const Rheight = 200
   for(let i=0;i<endPoints.length;i++){
     p.stroke(255,255,0,50)
     p.line(endPoints[i].x,endPoints[i].y,middle,endPoints[i].y)
   }
 }

