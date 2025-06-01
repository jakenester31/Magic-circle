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
    // visible
    get visible() { return(this.#visible) }

    set visible(val) {
        let ar = ['invisible','visible',0,1];
        if (ar.includes(val)){
            this.#visible = typeof val == 'string' ? ar.indexOf(val) : val;
            return(this.#visible);
        }
        throw Error('visible must be "invisible", "visible" or the indexes 0 & 1')
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
    #fillStyle = 0;
    #visible = 1;
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
        if (!this.visible){
            return(0);
        }
        DrawSetup(this);
        let a = 360 / this.sides;
        if (settings.debug == 1) {
            context.fillStyle = 'cyan';
            context.fillRect(this.x + this.parent.x - 5, this.y + this.parent.y - 5,10,10);
        }
        context.beginPath();
        this.fillStyle == -1 && context.save();
        for (var i = 0; i < this.sides + 1; i++) {
            let fx = (this.#offset + angle * -this.incAngle - this.offAngle + a * i) * PI;
            context.lineTo(
                this.parent.offset.x + this.parent.x + this.x + this.radius * -Math.sin(fx) * this.scale
                ,this.parent.offset.y + this.parent.y + this.y + this.radius * -Math.cos(fx) * this.scale
            );
        }
        // clear 
        if (this.fillStyle == -1) {
            context.clip();
            context.clearRect(this.parent.offset.x + this.x + this.parent.x - this.radius,this.parent.offset.y + this.y + this.parent.y - this.radius,this.radius * 2,this.radius * 2);
        }
        // fill
        if (this.fillStyle >= 0){
            context.stroke();
        }
        if (this.fillStyle == 1){
            context.fill();
        }
        context.closePath();
        this.fillStyle == -1 && context.restore();
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
        if (this.#scale == 'inherit')
            return(this.parent.scale);
        if (this.#scaleStyle == 'overRide')
            return(this.#scale);
        return(this.#scale * this.parent.scale);
    }

    set scale(val) {
        if (typeof val != 'number' && val != 'inherit') 
            throw Error('Scale must be a number or "inherit"');
        this.#scale = val;
        return(this.#scale);
    }

    get scaleStyle(){ return(this.#scaleStyle); }

    set scaleStyle(val){
        if (!['inherit','overRide'].includes(val))
            throw Error('Scale style must be "inherit" or "overRide"');
        this.#scaleStyle = val;
    }

    // fill style
    get fillStyle() { return(this.#fillStyle); }
    
    set fillStyle(val) {
        let ar = ['clear','line','fill',-1,0,1];
        if (ar.includes(val)){
            this.#fillStyle = typeof val == 'string' ? ar.indexOf(val) - 1: val;
            return this.#fillStyle;
        }
        throw Error('Fill style must be "clear", "line", "fill",or the indexes -1, 0 , or 1')
    }

    // visible
    get visible() { return(this.#visible) }

    set visible(val) {
        let ar = ['invisible','visible',0,1];
        if (ar.includes(val)){
            this.#visible = typeof val == 'string' ? ar.indexOf(val) : val;
            return(this.#visible);
        }
        throw Error('visible must be "invisible", "visible" or the indexes 0 & 1');
    }
}

class arc {
    #offset = 0;
    #incAngle;
    #scale = 'inherit';
    #scaleStyle = 'inherit';
    #fillStyle = 0; // clear, line, fill or -1, 0, 1
    constructor(x,y,radius,angle1,angle2,incAngle) {
        let parent = Object.fromEntries( Object.entries(obj.last).filter(e => Object.keys(drawSettings).includes(e[0])) );
        Object.assign(this,{x,y,radius,...parent});
        // Record parent child relationship
        obj.last.add = this;
        this.parent = obj.last;
        this.parent.last = this;
        // angles
        this.angle1 = angle1 || 0;
        this.angle2 = angle2 || 360;
        this.#incAngle = incAngle || 0;
    }
    draw(){
        if (settings.debug == 1) {
            context.fillStyle = 'black';
            context.fillRect(this.x + this.parent.x - 5, this.y + this.parent.y - 5,10,10);
        }
        DrawSetup(this);
        // clear save settings
        [-2,-1].includes(this.fillStyle) && context.save();
        context.beginPath();
            context.arc(this.x + this.parent.x + this.parent.offset.x,this.y + this.parent.y + this.parent.offset.y, this.radius * this.scale,
                (this.angle2 + this.#offset + angle * this.incAngle) * PI,
                (this.angle1 + this.#offset + angle * this.incAngle) * PI);
            [-2,2].includes(this.fillStyle) && context.lineTo(this.x + this.parent.x + this.parent.offset.x,this.y + this.parent.y + this.parent.offset.y);
            // clear 
            if ([-2,-1].includes(this.fillStyle)) {
                context.clip();
                context.clearRect(this.parent.offset.x + this.x + this.parent.x - this.radius,this.parent.offset.y + this.y + this.parent.y - this.radius,this.radius * 2,this.radius * 2);
            }
            // fill
            if (this.fillStyle >= 1){
                context.lineTo(
                    this.x + this.parent.x + this.parent.offset.x + this.radius * Math.cos((this.angle2 + this.#offset + angle * this.incAngle) * PI),
                    this.y + this.parent.y + this.parent.offset.y + this.radius * Math.sin((this.angle2 + this.#offset + angle * this.incAngle) * PI));
                context.lineTo(
                    this.x + this.parent.x + this.parent.offset.x + this.radius * Math.cos((this.angle2 + 1 + this.#offset + angle * this.incAngle) * PI),
                    this.y + this.parent.y + this.parent.offset.y + this.radius * Math.sin((this.angle2 + 1 + this.#offset + angle * this.incAngle) * PI));
            }
            if (this.fillStyle >= 0) {
                context.stroke();
            }
            [1,2].includes(this.fillStyle) && context.fill()
        context.closePath();
        // clear load settings
        [-2,-1].includes(this.fillStyle) && context.restore();
    }

    // increment angle
    get incAngle() { return(this.#incAngle); }

    set incAngle(val) {
        if (typeof val !== 'number')
            throw TypeError('Angle incrementor must be a number');
        this.#offset += angle * (val - this.#incAngle)
        this.#incAngle = val;
    }

    // Scale & scale style
    get scale() {
        if (this.#scale == 'inherit')
            return(this.parent.scale);
        if (this.#scaleStyle == 'overRide')
            return(this.#scale);
        return(this.#scale * this.parent.scale);
    }

    set scale(val) {
        if (typeof val != 'number' && val != 'inherit') {
            throw Error('Scale must be a number or "inherit"');
        }
        this.#scale = val;
        return(this.#scale);
    }

    get scaleStyle(){ return(this.#scaleStyle); }

    set scaleStyle(val){
        if (!['inherit','overRide'].includes(val)){
            throw Error('ScaleStyle must be "inherit" or "overRide"');
        }
        this.#scaleStyle = val;
    }

    // fill style
    get fillStyle() { return(this.#fillStyle); }
    
    set fillStyle(val) {
        let ar = ['clearCenter','clear','line','fill','fillCenter',-2,-1,0,1,2];
        if (ar.includes(val)){
            this.#fillStyle = typeof val == 'string' ? ar.indexOf(val) - 2 : val;
            return this.#fillStyle;
        }
        throw Error('Fill style must be "clearCenter", "clear", "line", "fill", "fillCenter" or the index values -2, -1, 0 , 1, or 2')
    }
}

class offset {
    #incAngle;
    #offset = 0;
    constructor(radius,angle,incAngle) {
        Object.assign(this,{radius,angle});
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