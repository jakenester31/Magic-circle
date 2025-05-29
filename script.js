// General
const doc = document.documentElement;
const canvas = document.querySelector('#workspace');
const context = canvas.getContext('2d');
const workspace = {
    x:0,
    y:0,
    scale:1
}
const obj = [];
const pi = Math.PI / 180

new ResizeObserver(function(){
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);
    draw();
}).observe(canvas);

class shape {
    constructor(x,y,sides,rad,ang,incAng) {
        Object.assign(this,{x:x,y:y,sides:sides,radius:rad,angle:{c:ang,i:incAng}})
        obj.push(this);
    }
    draw() {
        let a = 360 / this.sides;
        context.beginPath();
        for(var i = 0; i < this.sides; i++){
            context.lineTo(this.x + this.radius * -Math.sin(-(this.angle.c + (a * i)) * pi),this.y + this.radius * -Math.cos(-(this.angle.c + (a * i)) * pi));
        }
        context.closePath();
        context.stroke();
    }
}

class circle {
    constructor(x,y,rad) {
        Object.assign(this,{x:x,y:y,radius:rad});
        obj.push(this);
    }
    draw() {
        context.arc();
    }
}



// Objects

// inner triangle
new shape(100,100,3,30,0,-4);
new shape(100,100,3,30,60,-4);
// outer
new shape(100,100,3,60,0,4);
new shape(100,100,3,60,60,4);

// draw
setInterval(draw,30);
function draw() {
    // Setup
    context.resetTransform();
    context.translate(workspace.x,workspace.y);
    context.scale(workspace.scale,workspace.scale);
    context.clearRect(-workspace.x / workspace.scale,-workspace.y / workspace.scale,doc.clientWidth / workspace.scale,doc.clientHeight / workspace.scale);
    update();
}

function update() {
    for(var i = 0; i < obj.length; i++){
        obj[i].angle.c += obj[i].angle.i
        obj[i].draw();
    }
}







// Translations

canvas.addEventListener('mousedown', e => {
    addEventListener('mousemove', move);
    addEventListener('mouseup', stop);
    let mp = [];
    while (mp.length < 2) {mp.push([e.clientX,e.clientY]);}
    function move(e) {
        mp.shift();
        mp.push([e.clientX,e.clientY]);
        workspace.x += mp[1][0] - mp[0][0];
        workspace.y += mp[1][1] - mp[0][1];
    }
    function stop() {
        removeEventListener('mousemove',move);
        removeEventListener('mouseup',stop);
    }
})

canvas.addEventListener('wheel', e => {
     const dir = -e.deltaY / Math.abs(e.deltaY) || 0
    // old/new scales
    const old = workspace.scale; 
    workspace.scale += dir * workspace.scale / 10;
    // reposition workspace
    workspace.x -= (e.clientX - workspace.x) / old * (workspace.scale - old);
    workspace.y -= (e.clientY - workspace.y) / old * (workspace.scale - old);
})