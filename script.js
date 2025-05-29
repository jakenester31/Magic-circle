// General
const 
doc = document.documentElement,
canvas = document.querySelector('#workspace'),
context = canvas.getContext('2d'),
workspace = {
    x:0,
    y:0,
    scale:1
},
settings = {
    lazy:0,
},
obj = [],
pi = Math.PI / 180;

new ResizeObserver(function(){
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);
    draw();
}).observe(canvas);


workspace.scale = 2.3;
workspace.x = 50;
workspace.y = 100;


var angle = 0;

class shape {
    constructor(x,y,rad,sides,ang,incAng) {
        Object.assign(this,{x:x,y:y,sides:sides,radius:rad,angle:{c:ang,i:incAng}})
        this.lineWidth = drawSettings.lineWidth;
        this.color = drawSettings.color;
        this.lineJoin = drawSettings.lineJoin;
        obj.push(this);
    }
    draw() {
        let a = 360 / this.sides;
        setObjDraw(this);
        context.beginPath();
        for(var i = 0; i < this.sides; i++){
            if (settings.lazy != 1){
                context.lineTo(offsetObj.x + this.x + this.radius * -Math.sin(-(this.angle.c + (a * i)) * pi),offsetObj.y + this.y + this.radius * -Math.cos(-(this.angle.c + (a * i)) * pi));
            } else {
                context.lineTo(this.x + this.radius * -Math.sin(-(angle * this.angle.i + this.angle.c + (a * i)) * pi),this.y + this.radius * -Math.cos(-(angle * this.angle.i + this.angle.c + (a * i)) * pi));
            }
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
        setObjDraw(this);
        context.beginPath();
            context.arc(this.x,this.y,this.radius,0,2 * Math.PI);
        context.stroke();
        context.closePath();
    }
}

class line {
    constructor(x,y,point1,point2,incAng) {
        Object.assign(this,{x:x,y:y,point1:point1,point2:point2,incAng:incAng});
        obj.push(this);
    }
    draw() {
        // console.log(this.point1);
        setObjDraw(this);
        context.beginPath();
        if (settings.lazy != 1){
            context.moveTo(this.x + this.point1[0] * -Math.sin(-this.point1[1] * pi),this.y + this.point1[0] * -Math.cos(-this.point1[1] * pi));
            context.lineTo(this.x + this.point2[0] * -Math.sin(-this.point2[1] * pi),this.y + this.point2[0] * -Math.cos(-this.point2[1] * pi));
        } else {
            context.fillRect(this.x - 5,this.y - 5,10,10);
            for (var i = 0; i < 2; i++){
                let point = [this.point1,this.point2][i]
                let rad = Math.sqrt(point[0] * point[0] + point[1] * point[1] )
                let dir = Math.atan2(point[0],point[1]);
                // console.log(dir / pi);
                context.lineTo(this.x + rad * Math.sin(dir),this.y + rad * Math.cos(dir));
            }
        }
        
        context.stroke();
        context.closePath();
    }
}

class offset {
    constructor(x,y,rad,ang,incAng) {
        Object.assign(this,{x:x,y:y,radius:rad,angle:{c:ang,i:incAng}})
        obj.push(this);
    }
    draw() {
        offsetObj.x += this.x + this.radius * -Math.sin(-this.angle.c * pi);
        offsetObj.y += this.y + this.radius * -Math.cos(-this.angle.c * pi);
        if (this.x == 'reset'){
            offsetObj.x = 0;
        } 
        if (this.y == 'reset'){
            offsetObj.y = 0;
        }
    }
}



const drawSettings = {
    color:'purple',
    lineWidth:1,
    lineJoin:'round',   // miter, bevel, round
}

// Objects

// inner triangle
drawSettings.lineJoin = 'bevel';
new shape(100,100,30,3,0,-4);
new shape(100,100,30,3,60,-4);
new shape(100,100,30,6,60,-4);
// outer
new shape(100,100,60,3,0,4);
new shape(100,100,60,3,60,4);
new shape(100,100,60,6,60,4);
new circle(100,100,60);

// small details 1
drawSettings.lineJoin = 'miter';
for (var i = 0; i < 6; i++){
    new line(100,100,[50,-3 + 60 * i],[40,-13 + 60 * i],4);
    new line(100,100,[50,3 + 60 * i],[40,13 + 60 * i],4);
    new line(100,100,[35,-11 + 60 * i],[35,11 + 60 * i],4);

    new offset(0,0,41,60 * i,4);
    new shape(100,100,7,3,0,-16);
    new shape(100,100,7,3,60,-16);
    new offset('reset','reset');
}




// draw
update.pause = 1;
setInterval(draw,30);
function draw() {
    // Setup
    context.resetTransform();
    context.translate(workspace.x,workspace.y);
    context.scale(workspace.scale,workspace.scale);
    context.clearRect(-workspace.x / workspace.scale,-workspace.y / workspace.scale,doc.clientWidth / workspace.scale,doc.clientHeight / workspace.scale);
    update();
    // context.arc();
}

var offsetObj = {x:0,y:0};

function update() {
    offsetObj = {x:0,y:0};
    settings.lazy == 1 && update.pause != 1 && (angle = ++angle % 360);
    for(var i = 0; i < obj.length; i++){
        if (settings.lazy != 1 && update.pause != 1){
            ['shape','offset'].indexOf(obj[i].constructor.name) > -1 && (obj[i].angle.c += obj[i].angle.i);
            if (obj[i].constructor.name === 'line'){
                obj[i].point1[1]+= obj[i].incAng;
                obj[i].point2[1]+= obj[i].incAng;
            }
        }
        obj[i].draw();
    }
    // console.log(offsetObj);
}

function setObjDraw(obj){
    context.strokeStyle = obj.color;
    context.fillStyle = obj.color;
    context.lineJoin = obj.lineJoin;
    context.lineWidth = obj.lineWidth;
}





// Translations

canvas.addEventListener('mousedown', e => {
    if (e.button !== 0){
        return(0);
    }
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
    if (e.ctrlKey){
        e.preventDefault();
    }
     const dir = -e.deltaY / Math.abs(e.deltaY) || 0
    // old/new scales
    const old = workspace.scale; 
    workspace.scale += dir * workspace.scale / 10;
    // reposition workspace
    workspace.x -= (e.clientX - workspace.x) / old * (workspace.scale - old);
    workspace.y -= (e.clientY - workspace.y) / old * (workspace.scale - old);
}, {passive:false})