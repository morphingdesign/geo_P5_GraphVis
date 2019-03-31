//**********************************************************************************
// Declare variables
let x, y, z, a, b, n, m, u, v;
let scalar = 50;
let scalarZ = 20;
let counter = 0;
let gridSize = 15;

// GUI
let gui;

let backGrid;
let chladniGeo;

// GUI library requires the use of 'var' to define variables, and not 'let'
var bgColor = [0, 25, 50];         // Dark blue color
var ptSize = 1;
var ptColor = [255, 255, 255];
var density = .3;       // Linked to iteration variable
var zoom = -500;
var tilt = 45;          // Linked to angle variable
var rotation = 0;       // Linked to rotAngle variable
var variation = 0;
var animation = true;   // Boolean to toggle anim in gui
var grid = true;   // Boolean to toggle background grid in gui

// Setup of pseudonyms for ctrl panel labels
let iteration;          // Linked to density variable in gui
let angle;              // Linked to tilt variable in gui
let rotAngle;           // Linked to rotation variable in gui

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

    chladniGeo = new MathGeo();

    // Initialize GUI
    // Parameters include: (label (which can be wrapped text), x-pos from left,
    // y-pos from top)
    gui = createGui('Control Panel (Double-click menu to expand/collapse', 20, 20);

    // Set ptSize range
    // Include ptColor to adjust point color
    sliderRange(1, 10, 1);
    gui.addGlobals('ptSize', 'ptColor');

    // Set point density
    sliderRange(0.15, 0.5, 0.01);
    gui.addGlobals('density');

    // Set speed range
    sliderRange(0.0, 100.0, 0.1);
    gui.addGlobals('variation');

    // Set zoom, or z-depth
    sliderRange(-1000, 500, 1);
    gui.addGlobals('zoom');

    // Set tilt, or rotate-x angle, in degrees
    sliderRange(0, 90, 1);
    gui.addGlobals('tilt');

    // Set view rotation, or rotate-z angle, in degrees
    sliderRange(0, 360, 1);
    gui.addGlobals('rotation');

    // Set bgColor
    sliderRange(0, 255, 1);
    gui.addGlobals('bgColor');

    // Toggle animation on/off
    gui.addGlobals('animation', 'grid');

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
    backGrid = new Grid(whiteGrad10, 50);

    // Condition to display/hide background grid
    if(grid) {
        backGrid.draw();
    }

    // Geo creation
    chladniGeo.draw();

    // Animate chladni variation iteratively through draw()
    if(animation) {
        variation += 0.001;
    }

    pop();
}

//**********************************************************************************
// Dynamically adjust the canvas to the window
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

//**********************************************************************************
// Geo creation
class MathGeo {
    constructor() {
    }

    draw() {
        push();
        noFill();
        stroke(ptColor);
        strokeWeight(ptSize);
        for (u = -gridSize; u <= gridSize; u += iteration) {
            for (v = -gridSize; v <= gridSize; v += iteration) {
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

        if (counter == 100) {
            counter = 0;
        } else {
            counter += iteration;
        }
    }
}

//**********************************************************************************
// Background Grid Class
class Grid{
    constructor(gridColor, spacing){
        this.gridColor = gridColor;
        this.spacing = spacing;
    }

    draw(){
        push();
        strokeWeight(2);
        stroke(this.gridColor);
        translate(-gridSize * scalar, -gridSize * scalar, 0);           // X-value used to vary start position
        for(let i=0; i <= gridSize * scalar * 2; i+=this.spacing){
            line(0, i, gridSize * scalar * 2, i);       // Horizontal Lines
        }                              // Line spacing varies by passed through parameter
        for(let i=0; i <= gridSize * scalar * 2; i+=this.spacing){
            line(i, 0, i, gridSize * scalar * 2);       // Vertical Lines
        }
        pop();
    }
}