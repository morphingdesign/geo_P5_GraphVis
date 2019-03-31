//**********************************************************************************
// Declare variables


let x, y, z, a, b, n, m, u, v;
let scalar = 50;
let scalarZ = 20;
let counter = 0;
let gridSize = 15;

// GUI
let gui;

// GUI library requires the use of 'var' to define variables, and not 'let'
var bgColor = [0, 25, 50];         // Dark blue color
var ptSize = 1;
var ptColor = [255, 255, 255];
var density = .3;         // Create GUI element for density that varies between 0.1 & 0.5
var zoom = 0;
var tilt = 45;
var rotation = 0;
var variation = 0;

// Setup of pseudonyms for ctrl panel labels
let geoSizeMultiple;
let angle;
let rotAngle;
let iteration;

// Color declaration
let blackSolid, whiteSolid, redSolid, greenSolid, blueSolid;
let whiteGrad10, whiteGrad50;

//
function preload(){

}

//**********************************************************************************
// Setup function
function setup(){
    // Setup canvas
    createCanvas(windowWidth, windowHeight, WEBGL);
    // Color initialization
    whiteSolid = color(255, 255, 255);
    whiteGrad10 = color(255, 255, 255, 10);
    whiteGrad50 = color(255, 255, 255, 50);
    blackSolid = color(0, 0, 0);
    redSolid = color(255, 0, 0);
    greenSolid = color(0, 255, 0);
    blueSolid = color(0, 0, 255);



    // Initialize GUI
    // Parameters include: (label (which can be wrapped text), x-pos from left,
    // y-pos from top)
    gui = createGui('Control Panel (Double-click menu to expand/collapse', 20, 20);

    // set ptSize range
    // include ptColor
    sliderRange(1, 10, 1);
    gui.addGlobals('ptSize', 'ptColor');

    // set point density
    sliderRange(0.15, 0.5, 0.01);
    gui.addGlobals('density');

    // set speed range
    sliderRange(0.0, 100.0, 0.1);
    gui.addGlobals('variation');

    // set zoom, or z-depth
    sliderRange(-1000, 500, 1);
    gui.addGlobals('zoom');

    // set tilt, or rotate-x angle, in degrees
    sliderRange(0, 90, 1);
    gui.addGlobals('tilt');

    // set view rotation, or rotate-z angle, in degrees
    sliderRange(0, 360, 1);
    gui.addGlobals('rotation');

    // set bgColor
    sliderRange(0, 255, 1);
    gui.addGlobals('bgColor');

}

//**********************************************************************************
// Draw function
function draw() {
    background(bgColor);

    push();

    // Central geo in canvas
    translate(0, 0, zoom);

    // Re-associate control variable names with gui variables
    angle = tilt;
    rotAngle = rotation;
    iteration = density;

    // View controls
    rotateX(radians(angle));        // Tilt
    rotateZ(radians(rotAngle));     // Z-axis Rotation

    // Background grid construction and draw
    backGrid = new Grid(zoom, whiteGrad10, 50);
    backGrid.draw();

    // Geo creation
    chladniPat();

    // Animate chladni variation iteratively through draw()
    variation+=0.001;

    pop();
}

//**********************************************************************************
// Dynamically adjust the canvas to the window
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

//**********************************************************************************
// Geo creation
function chladniPat(){
    push();
    //translate(0, 0, 0);
    //translate(-width/2, -height/2, 0);
    noFill();
    stroke(ptColor);
    strokeWeight(ptSize);
    for(u=-gridSize; u <= gridSize ; u+=iteration){
        for(v=-gridSize; v <= gridSize; v+=iteration){
            // Static Values
            /**
             a = 4.14;
             b = 7.96;
             m = a;
             n = b;
             **/

            // Dynamic values
            a = map(variation, 0, 100, 4, 8);
            b = map(variation, 0, 100, 4, 8);
            m = map(variation, 0, 100, 4, 8);
            n = map(variation, 0, 100, 4, 8);

            x = u * scalar;
            y = v * scalar;
            z = a * sin(PI * n * x) * sin(PI * m * y) + b * sin(PI * m * x) * sin(PI * n * y) * scalarZ;
            point(x, y, z);
        }
    }
    pop();

    if(counter == 100){
        counter = 0;
    }
    else{
        counter+=iteration;
    }
}

//**********************************************************************************
// Background Grid Class
class Grid{
    constructor(z, gridColor, spacing){
        //this.z = z;
        this.z = 0;
        this.gridColor = gridColor;
        this.spacing = spacing;
    }

    draw(){
        push();
        strokeWeight(1);
        stroke(this.gridColor);
        translate(-gridSize, -gridSize, this.z);           // X-value used to vary start position
        for(let i=0; i <= gridSize * 2; i+=10){
            line(0, i, gridSize * 2, i);       // Horizontal Lines
        }                              // Line spacing varies by passed through parameter
        for(let i=0; i <= gridSize * 2; i+=10){
            line(i, 0, i, gridSize * 2);       // Vertical Lines
        }
        pop();
    }

}