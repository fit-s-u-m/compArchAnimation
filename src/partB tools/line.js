export function line( p,numBus=3 ,whichToActivate,numberRegistor =4){
  const buses = bus(p,numBus)
  registorToBus(p,numberRegistor,buses)
}
let busArray

function bus(p,numBus){
  let spaceing = 200
  switch (numBus){
  case 3:
    const y1 =50
    const y2 =p.height -50
    const y3 =p.height -100
    p.line(10,y1,p.width-10,y1)
    p.line(10,y2,p.width-10,y2)
    p.line(10,y3,p.width-10,y3)
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
    let endPoints=Array(numberRegistor)
    // make lines
    for(let i=div,counter=0;i<=2*Rheight,counter<numberRegistor;i+=2*div,counter++){
      const length = i/2
      p.stroke('red')
      const p1 = Rx+Rwidth
      const p2 = Ry+i/2
      const p3 = Rx+Rwidth +length
      const p4 = Ry+i/2
      endPoints[counter] = {x:p3,y:p4}
      p.line(p1,p2,p3,p4)
    }
    // connect to bus
    for(let i=0;i<buses.length;i++){
      endPoints.forEach(registors=>{
        p.stroke(255,255,0,50)
        p.line(registors.x,registors.y,registors.x,buses[i])
      })
    }
    
}
function AluToBus(){

}
function controlToAlu(){
}

function controlToRegistor(){

}

