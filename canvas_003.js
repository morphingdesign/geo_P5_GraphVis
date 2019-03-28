//**********************************************************************************
// Declare variables

// GUI
let gui;

// GUI library requires the use of 'var' to define variables, and not 'let'
var bgColor = [0, 25, 50];         // Dark blue color
var ptSize = 1;
var ptColor = [255, 255, 255];
var zoom = 0;
var rotationSpeed = 0.1;

// Setup of pseudonyms for ctrl panel labels
let geoSizeMultiple;


// Color declaration
let blackSolid, whiteSolid, redSolid, greenSolid, blueSolid;
let whiteGrad10, whiteGrad50;

let scalar = 350;

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

    // set geoSizeMultiple range
    sliderRange(-150, 10, 1);
    gui.addGlobals('zoom');

    // set speed range
    sliderRange(0.0, 0.5, 0.01);
    gui.addGlobals('rotationSpeed');

    // set bgColor
    sliderRange(0, 255, 1);
    gui.addGlobals('bgColor');

}

//**********************************************************************************
// Draw function
function draw() {

    background(bgColor);

    push();
    translate(0, 0, zoom);

    noFill();
    stroke(ptColor);
    strokeWeight(ptSize);

    for(let r = 0; r < cityLoc.length; r++){
        point(cityLoc[r].x * scalar, cityLoc[r].y * scalar, cityLoc[r].z * scalar);
        //print(r + ": " + cityLoc[r].x);
    }
    pop();
}

// Dynamically adjust the canvas to the window
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

