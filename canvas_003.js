//**********************************************************************************
// Declare variables


let x, y, z, a, b, n, m, u, v;
let scalar = 50;
let scalarZ = 20;
let iteration = .3;
let counter = 0;
let gridSize = 15;

// GUI
let gui;

// GUI library requires the use of 'var' to define variables, and not 'let'
var bgColor = [0, 25, 50];         // Dark blue color
var ptSize = 1;
var ptColor = [255, 255, 255];
var zoom = 0;
var variation = 0;

// Setup of pseudonyms for ctrl panel labels
let geoSizeMultiple;


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

    // set speed range
    sliderRange(0.0, 100.0, 0.1);
    gui.addGlobals('variation');

    // set geoSizeMultiple range
    sliderRange(-150, 10, 1);
    gui.addGlobals('zoom');

    // set bgColor
    sliderRange(0, 255, 1);
    gui.addGlobals('bgColor');

}

//**********************************************************************************
// Draw function
function draw() {
    background(bgColor);
    push();
    //translate(0, 0, zoom);

    translate(-windowWidth / 4, -windowHeight/4, zoom);
    rotateX(radians(45));
    chladniPat();
    pop();
}

// Dynamically adjust the canvas to the window
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function chladniPat(){
    push();
    translate(0, 0, 0);
    noFill();
    stroke(ptColor);
    strokeWeight(ptSize);
    for(u=0; u < gridSize ; u+=iteration){
        for(v=0; v < gridSize; v+=iteration){
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
