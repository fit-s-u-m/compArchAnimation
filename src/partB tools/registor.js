export function Registor(p,x,y,w,h,numberOfRegistor=4,arrayOfHighlight){
  p.stroke("black")
  p.noFill()
  p.rect(x,y,w,h) 
  const div = h/numberOfRegistor 

  const registorsToHighlight = decodeRegistorToNum(arrayOfHighlight)

  for(let i=y, j=0; i<y+h, j<numberOfRegistor ;i+=div, j++){

    p.noFill()
    p.text(`R-${j}`,x+w/2,i+div/2)
    if(registorsToHighlight.includes(j))
      p.fill(255,0,0,50)
    p.rect(x,i,w,div)
  }
}
function decodeRegistorToNum(arrayOfHighlight){
  return arrayOfHighlight.map((i)=>{
    const num = i.split("")[1]
    return parseInt(num)
  })
}

