//@ Classes
class magic_circle {
    #visible = 1;
    #scale = 1;
    constructor(x,y,scale) {
        Object.assign(this,{x,y,...drawSettings});
        this.children = [];
        obj.push(this);
        obj.last = this;
        this.#scale = scale || 1;
    }
    draw() {
        if (this.#visible == 0){
            return(0);
        }
        if (settings.debug == 1) {
            context.fillStyle = 'red';
            context.fillRect(this.x - 5, this.y - 5,10,10);
        }
        this.offset = {x:0,y:0};
        for (var i = 0; i < this.children.length; i++){
            this.children[i].draw();
        }
    }

    set add(val) { // OMG where has this been my whole life? Its like a function but it looks like setting a variable??
        this.children.push(val);
        return val;
    }

    set visible(val){
        if ([0,1].includes(val)){
            this.#visible = val;
            return(val);
        }
        if (typeof val !== 'number'){
            throw new TypeError('Input must be a number');
        }
        throw new RangeError('Input must be 0 or 1');
    }
    // scale
    get scale() { return(this.#scale); }

    set scale(val) {
        if (typeof val != 'number') {
            throw TypeError('Scale must be a number');
        }
        this.#scale = val;
        return(this.#scale);
    }
}

class shape {
    #incAngle;
    #offset = 0;
    #scale = 'inherit';
    #scaleStyle = 'inherit';
    constructor(x,y,sides,radius,offAngle,incAngle) {
        let parent = Object.fromEntries( Object.entries(obj.last).filter(e => Object.keys(drawSettings).includes(e[0])) );
        Object.assign(this,{x,y,sides,radius,offAngle,...parent});
        // Record parent child relationship
        obj.last.add = this;
        this.parent = obj.last;
        this.parent.last = this;
        // Default angle values
        this.offAngle = offAngle || 0;
        this.#incAngle = incAngle || 0;
    }
    draw() {
        DrawSetup(this);
        let a = 360 / this.sides;
        if (settings.debug == 1) {
            context.fillStyle = 'cyan';
            context.fillRect(this.x + this.parent.x - 5, this.y + this.parent.y - 5,10,10);
        }
        context.beginPath();
        for (var i = 0; i < this.sides; i++) {
            let fx = (this.#offset + angle * -this.incAngle - this.offAngle + a * i) * PI;
            context.lineTo(
                this.parent.offset.x + this.parent.x + this.x + this.radius * -Math.sin(fx) * this.scale
                ,this.parent.offset.y + this.parent.y + this.y + this.radius * -Math.cos(fx) * this.scale
            );
        }
        context.closePath();
        context.stroke();
    }
    // increment angle
    get incAngle() { return(this.#incAngle); }

    set incAngle(val) {
        if (typeof val !== 'number')
            throw TypeError('Angle increment must be a number');
        this.#offset += angle * (val - this.#incAngle)
        this.#incAngle = val;
    }
    // Scale & scale style
    get scale() {
        if (this.#scale == 'inherit'){
            return(this.parent.scale);
        }
        if (this.#scaleStyle == 'overRide')
            return(this.#scale);
        return(this.#scale * this.parent.scale);
    }

    set scale(val) {
        if (typeof val != 'number' && val != 'inherit') {
            throw TypeError('Scale must be a number or "inherit"');
        }
        this.#scale = val;
        return(this.#scale);
    }

    get scaleStyle(){ return(this.#scaleStyle); }

    set scaleStyle(val){
        if (!['inherit','overRide'].includes(val)){
            throw TypeError('ScaleStyle must be "inherit" or "overRide"');
        }
        this.#scaleStyle = val;
    }
}

class arc {
    #offset = 0;
    #incAngle;
    #scale = 'inherit';
    #scaleStyle = 'inherit';
    constructor(x,y,radius,angle1,angle2,incAngle) {
        let parent = Object.fromEntries( Object.entries(obj.last).filter(e => Object.keys(drawSettings).includes(e[0])) );
        Object.assign(this,{x,y,radius,...parent});
        // Record parent child relationship
        obj.last.add = this;
        this.parent = obj.last;
        this.parent.last = this;
        // angles
        this.angle1 = angle1 || 0;
        this.angle2 = angle2 || 2
        this.#incAngle = incAngle || 0;
    }
    draw(){
        if (settings.debug == 1) {
            context.fillStyle = 'black';
            context.fillRect(this.x + this.parent.x - 5, this.y + this.parent.y - 5,10,10);
        }
        DrawSetup(this);
        context.beginPath();
        context.arc(this.x + this.parent.x + this.parent.offset.x,this.y + this.parent.y + this.parent.offset.y, this.radius * this.scale,
            (this.angle2 + this.#offset + angle * this.incAngle) * PI,
            (this.angle1 + this.#offset + angle * this.incAngle) * PI);
        context.stroke();
        context.closePath();
    }

    // increment angle
    get incAngle() { return(this.#incAngle); }

    set incAngle(val) {
        if (typeof val !== 'number')
            throw TypeError('Angle increment must be a number');
        this.#offset += angle * (val - this.#incAngle)
        this.#incAngle = val;
    }

    // Scale & scale style
    get scale() {
        if (this.#scale == 'inherit'){
            return(this.parent.scale);
        }
        if (this.#scaleStyle == 'overRide')
            return(this.#scale);
        return(this.#scale * this.parent.scale);
    }

    set scale(val) {
        if (typeof val != 'number' && val != 'inherit') {
            throw TypeError('Scale must be a number or "inherit"');
        }
        this.#scale = val;
        return(this.#scale);
    }

    get scaleStyle(){ return(this.#scaleStyle); }

    set scaleStyle(val){
        if (!['inherit','overRide'].includes(val)){
            throw TypeError('ScaleStyle must be "inherit" or "overRide"');
        }
        this.#scaleStyle = val;
    }
}

class offset {
    #incAngle;
    #offset = 0;
    constructor(radius,angle,incAngle) {
        let parent = Object.fromEntries( Object.entries(obj.last).filter(e => Object.keys(drawSettings).includes(e[0])) );
        Object.assign(this,{radius,angle,...parent});
        // Record parent child relationship
        obj.last.add = this;
        this.parent = obj.last;
        this.parent.last = this;
        this.#incAngle = incAngle || 0;
    }
    draw() {
        let fx = -(this.angle + this.#offset - angle * this.incAngle) * PI
        this.parent.offset.x += this.radius * -Math.sin(fx);
        this.parent.offset.y += this.radius * -Math.cos(fx);
        if (settings.debug == 1) {
            context.fillStyle = 'lime';
            context.fillRect(this.parent.offset.x + this.parent.x - 5, this.parent.offset.y + this.parent.y - 5,10,10);
        }
    }

    // increment angle
    get incAngle() { return(this.#incAngle); }

    set incAngle(val) {
        if (typeof val !== 'number')
            throw TypeError('Angle increment must be a number');
        this.#offset += angle * (val - this.#incAngle)
        this.#incAngle = val;
    }
}

//* Functions
function DrawSetup(obj) {
    context.strokeStyle = obj.color;
    context.fillStyle = obj.color;
    context.lineJoin = obj.lineJoin;
    context.lineWidth = obj.lineWidth;
}