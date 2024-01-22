export function control(p,instruction,numberOprations,numberOfRegistors,x,y,w,h){
  p.stroke("black")
  p.rect(x,y,w,h)
  p.text("Control Unit",x+w/2-20,y+h/2)
  let operationEndPoint=[]
  for(let i=0;i<numberOprations;i++){
    const div = h/numberOprations
    let newY = y+div*i +15
    p.text(i,x+w-20,newY)
    operationEndPoint[i] = {x:x+w-20,y:newY}
  }

  for(let i=0;i<numberOfRegistors;i++){
    const div = h/numberOfRegistors
    let newY = y+div*i +30
    p.text(i,x+20,newY)
  }
  return operationEndPoint
}

// function decode(instruction){
//
// }
