const canvas=document.getElementById('screen')
const ctx=canvas.getContext('2d')

canvas.width=innerWidth
canvas.height=innerHeight
ctx.strokeStyle='white'
ctx.translate(innerWidth/2,innerHeight/2)

x=[0,50]
y=[0,0]

function rotateAbout(x,y,x1,y1,angle,retX){
	let x2=x-x1
	let y2=y-y1
	let c=Math.round(Math.cos(angle) * 100) / 100;
	let s=Math.round(Math.sin(angle) * 100) / 100;
	let x3=x2*c-y2*s
	let y3=x2*s+y2*c
	return retX?Math.round(x1+x3,2):Math.round(y1+y3,2)
}


let iters=0;maxIters=16

function lerp(start,end,amt){
	return start+(end-start)*amt
}

let prog=0
let rate=0.05
let sc=1
let newscale=0.8
let rotBy=Math.PI/2
ctx.lineWidth='10'

function draw(){
	// Store the current transformation matrix
	ctx.save();

	// Use the identity matrix while clearing the canvas
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Restore the transform
	ctx.restore();
	ctx.beginPath()
	ctx.moveTo(x[0],y[0])
	for (var i = 1; i < x.length; i++) {
		ctx.lineTo(x[i],y[i])
		ctx.stroke()
		ctx.beginPath()
		ctx.moveTo(x[i],y[i])
	}
	for (var i = x.length - 2; i >= 0; i--) {
		let nx=rotateAbout(x[i],y[i],x[x.length-1],y[y.length-1],lerp(0,rotBy,prog),true)
		let ny=rotateAbout(x[i],y[i],x[x.length-1],y[y.length-1],lerp(0,rotBy,prog),false)
		ctx.lineTo(nx,ny)
		ctx.stroke()
		ctx.beginPath()
		ctx.moveTo(nx,ny)
	}
	if(prog<1){
		prog+=rate
	}else{
		let x2=x[x.length-1]
		let y2=y[x.length-1]
		for (var i = x.length - 2; i >= 0; i--) {
			let nx=rotateAbout(x[i],y[i],x2,y2,rotBy,true)
			let ny=rotateAbout(x[i],y[i],x2,y2,rotBy,false)
			x.push(nx)
			y.push(ny)
		}
		prog=0
		++iters
		console.log(iters)
		// ctx.translate((x[0]+x[x.length-1])/2,(y[0]+y[y.length-1])/2)
		ctx.scale(newscale,newscale)
	}
	if(iters<maxIters)requestAnimationFrame(draw)
}

draw()