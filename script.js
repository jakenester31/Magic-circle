//* General
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
    scrollSens:10,
    debug:0,
},
drawSettings = {
    color:'purple',
    lineWidth:3,
    lineJoin:'miter',   // miter, bevel, round
},
obj = [],
PI = Math.PI / 180;
var angle = 0,
mouse = {x:0,y:0};

new ResizeObserver(function(){
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);
    draw();
}).observe(canvas);


// Objects (testing)
const t = new magic_circle(100,100,1);
// outer
const a = new shape(0,0,3,120,0,-5);
new shape(0,0,3,120,60,-5);
// inner
new shape(0,0,3,50,0,5);
new shape(0,0,3,50,60,5);

const b = new arc(0,0,55,0,140,5);

const c = new offset(100,90,4);
new shape(0,0,5,20,60,-5);

new magic_circle(100,400);
new shape(0,0,3,100,0,5);



//# draw
setInterval(draw,30);
function draw() {
    // Setup
    context.resetTransform();
    context.translate(workspace.x,workspace.y);
    context.scale(workspace.scale,workspace.scale);
    context.clearRect(-workspace.x / workspace.scale,-workspace.y / workspace.scale,doc.clientWidth / workspace.scale,doc.clientHeight / workspace.scale);
    // update
    draw.pause != 1 && (angle = ++angle % 360);
    for (var i = 0; i < obj.length; i++){
        obj[i].draw();
    }
}

//* Translations
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

        // mouse bounding
        for (var i = 0; i < 2; i++){
            const dim = canvas['client' + ['Width','Height'][i]];
            mp[1][i] < 0 && (mp[1][i] = 0);
            mp[1][i] > dim && (mp[1][i] = dim);
        }

        workspace.x += mp[1][0] - mp[0][0];
        workspace.y += mp[1][1] - mp[0][1];

        mouse = {x:mp[1][0],y:mp[1][1]}
    }
    function stop() {
        mouse.x = undefined;
        mouse.y = undefined;
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
    workspace.scale += dir * workspace.scale / (100 / settings.scrollSens);
    // Bind scale
    workspace.scale > 20 && (workspace.scale = 20);
    workspace.scale < 1/10 && (workspace.scale = 1/10);
    // Which pos?
    let x = mouse.x || e.clientX;
    let y = mouse.y || e.clientY;
    // reposition workspace
    workspace.x -= (x - workspace.x) / old * (workspace.scale - old);
    workspace.y -= (y - workspace.y) / old * (workspace.scale - old);
}, {passive:false})