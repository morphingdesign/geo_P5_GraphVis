//##################################################################################
//##################################################################################
// Declare variables
let x, y, z, a, b, n, m, u, v;
let scalar = 50;
let scalarZ = 20;
let counter = 0;
let gridSize = 15;

// GUI element from p5 GUI library
let guiStyle;           // GUI for managing geo styles (color, point size, etc.)
let guiGeo;             // GUI for managing geo parameters (density, variation, etc.)
let guiViewport;        // GUI for managing viewport controls (zoom, rotate, etc.)

// In-file classes for geometry
let backGrid;           // Background grid, from Grid class
let chladniGeo;         // Math geometry, from MathGeo class

// GUI library requires the use of 'var' to define variables, and not 'let'
var bgColor = [0, 25, 50];         // Dark blue color
var ptSize = 1;
var ptColor = [255, 255, 255];
var density = .5;       // Linked to iteration variable
var zoom = -500;
var tilt = 45;          // Linked to angle variable
var rotation = 0;       // Linked to rotAngle variable
var variation = 0;
var animation = true;   // Boolean to toggle anim in gui
var grid = true;        // Boolean to toggle background grid in gui

// Setup of pseudonyms for ctrl panel labels
let pointSize;
let iteration;          // Linked to density variable in gui
let angle;              // Linked to tilt variable in gui
let rotAngle;           // Linked to rotation variable in gui

// Color declaration
let blackSolid, whiteSolid, redSolid, greenSolid, blueSolid, yellowSolid;
let whiteGrad10, whiteGrad50;

// Mouse controls
let geoX, geoY, geoXSize, geoYSize;
let overGeo = false;        // Bool for mouse over geo
let overLocked = false;     // Bool to retain mouse pos over geo
let dragSpeed = 5.0;        // Multiplier for mouse drag motion

// Display variables
// This has to be included in the Setup Canvas & windowResized() function
let buffer = 20;            // Compensates for bottom and right edges of window

//##################################################################################
//##################################################################################
// Preload function
function preload(){
}

//##################################################################################
//##################################################################################
// Setup function
function setup(){
    // Setup canvas
    createCanvas(windowWidth - buffer, windowHeight - buffer, WEBGL);

    //******************************************************************************
    // Color initialization
    whiteSolid = color(255, 255, 255);
    whiteGrad10 = color(255, 255, 255, 10);
    whiteGrad50 = color(255, 255, 255, 50);
    blackSolid = color(0, 0, 0);
    redSolid = color(255, 0, 0);
    greenSolid = color(0, 255, 0);
    blueSolid = color(0, 0, 255);
    yellowSolid = color(255, 255, 0);

    //******************************************************************************
    // Initiate geo function
    chladniGeo = new MathGeo();

    //******************************************************************************
    // Initialize GUI for style controls
    // Parameters include: (label (which can be wrapped text), x-pos from left, y-pos from top)
    guiStyle = createGui('Style Control Panel (Double-click menu to expand/collapse', 20, 20);

    // Set ptSize range
    // Include ptColor to adjust point color
    sliderRange(1, 10, 1);
    guiStyle.addGlobals('ptSize', 'ptColor');

    // Set bgColor
    sliderRange(0, 255, 1);
    guiStyle.addGlobals('bgColor');

    //******************************************************************************
    // Initialize GUI for geometry parameter controls
    guiGeo = createGui('Geometry Control Panel (Double-click menu to expand/collapse', 230, 20);

    // Set point density
    sliderRange(0.15, 0.5, 0.01);
    guiGeo.addGlobals('density');

    // Set speed range
    sliderRange(0.0, 100.0, 0.1);
    guiGeo.addGlobals('variation');

    // Toggle animation on/off
    guiGeo.addGlobals('animation', 'grid');

    //******************************************************************************
    // Initialize GUI for viewport controls
    guiViewport = createGui('Viewport Control Panel (Double-click menu to expand/collapse', 440, 20);

    // Set zoom, or z-depth
    sliderRange(-1000, 500, 1);
    guiViewport.addGlobals('zoom');

    // Set tilt, or rotate-x angle, in degrees
    sliderRange(0, 90, 1);
    guiViewport.addGlobals('tilt');

    // Set view rotation, or rotate-z angle, in degrees
    sliderRange(0, 360, 1);
    guiViewport.addGlobals('rotation');


}

//##################################################################################
//##################################################################################
// Draw function
function draw() {
    background(bgColor);

    //******************************************************************************
    // Evaluate mouse controls
    geoX = windowWidth / 2;
    geoY = windowHeight / 2;
    geoXSize = gridSize * scalar / 2;
    geoYSize = gridSize * scalar / 2;

    if(
        mouseX > geoX - geoXSize &&
        mouseX < geoX + geoXSize &&
        mouseY > geoY - geoYSize &&
        mouseY < geoY + geoYSize
    )
    {
        overGeo = true;
    }
    else{
        overGeo = false;
    }

    //******************************************************************************
    // Re-associate control variable names with gui variables
    angle = tilt;
    rotAngle = rotation;
    iteration = density;

    //******************************************************************************
    push();
    translate(0, 0, zoom);  // Centralize location of geo in canvas

    // View controls
    rotateX(radians(angle));        // Tilt
    rotateZ(radians(rotAngle));     // Z-axis Rotation

    // Scene geometry
    backGrid = new Grid(whiteGrad10, 50);   // Background grid construction and draw
    if(grid) {                  // Condition to display/hide background grid
        backGrid.draw();
    }
    chladniGeo.draw();          // Geo creation
    if(animation) {             // Animate chladni variation iteratively through draw()
        variation += 0.001;
    }
    pop();

}

//##################################################################################
//##################################################################################
// Functions

//**********************************************************************************
// Dynamically adjust the canvas to the window
function windowResized() {
    resizeCanvas(windowWidth - buffer, windowHeight - buffer);
}

//**********************************************************************************
// Initiates actions for when the mouse button is pressed
function mousePressed(){
    if(overGeo){
        overLocked = true;
        //print("overGeo & mouse pressed & overLocked");              // Used for debug
    }
    else{
        overLocked = false;
        //print("not overGeo & mouse pressed & not overLocked");      // Used for debug
    }
}

//**********************************************************************************
// Drives geo rotation and tilt based on mouse drag direction
function mouseDragged(){
    if(overLocked && mouseX > pmouseX){
        rotation-=dragSpeed;
        //print("mouse dragged to right");  // Used for debug
    }
    if(overLocked && mouseX < pmouseX){
        rotation+=dragSpeed;
        //print("mouse dragged to left");   // Used for debug
    }
    if(overLocked && mouseY > pmouseY){
        tilt-=dragSpeed;
        //print("mouse dragged up");        // Used for debug
    }
    if(overLocked && mouseY < pmouseY){
        tilt+=dragSpeed;
        //print("mouse dragged down");      // Used for debug
    }
}

//**********************************************************************************
// Coordinates with mousePressed function
function mouseReleased(){
    overLocked = false;
    //print("mouse released");              // Used for debug
}

//**********************************************************************************
// Manages mouse wheel for zooming in/out geo
function mouseWheel(event){
    zoom -= event.delta;
    return false;           // Included to block page scrolling
}

//##################################################################################
//##################################################################################
// Classes

//**********************************************************************************
// Geo creation
class MathGeo {
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // Class Constructor
    constructor() {

    }

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // Class Methods
    // *******************************************************
    // Renders math geo
    draw() {

        let geoPts = [];
        let counter = 0;

        let gradientZColor = new Gradient(greenSolid, redSolid);
        push();
        noFill();
        stroke(ptColor);
        strokeWeight(ptSize);
        for (u = -gridSize; u <= gridSize; u += iteration) {
            for (v = -gridSize; v <= gridSize; v += iteration) {

                // *******************************************************
                // The following are variables & formulas for chladni patterns
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

                geoPts[counter] = createVector(x, y, z);
                //print(geoPts[counter]);


                // *******************************************************
                //
                let gradZColor = gradientZColor.returnGrad(z, -1, 1);
                stroke(gradZColor);
                //point(x, y, z);
                point(geoPts[counter].x, geoPts[counter].y, geoPts[counter].z);



                counter++;
                //print(counter);

            }
        }
        pop();

        print("Length of geoPts[]: " + geoPts.length);

        // Code not being used
        //if (counter == 100) {
        //    counter = 0;
        //} else {
        //    counter += iteration;
        //}


        let maxZVal;
        let maxPtsIndices = [];
        let indexCounter = 0;
        let arrayLength = geoPts.length;

        for(let i = 1; i < arrayLength; i++){
            //print("geoPts[" + i + "]= " + geoPts[i].z);
            if(geoPts[i].z > geoPts[i - 1].z) {
                //maxPtsIndices[indexCounter] = geoPts[i];
                maxZVal = geoPts[i].z;
                //print("maxPtsIndices[" + indexCounter + "]= " + maxPtsIndices[indexCounter]);
                //indexCounter++;
                //print("maxZVal: " + maxZVal);
            }
            //print("Processed maxZVal: " + maxZVal);
        }
        print("Processed maxZVal: " + maxZVal);

        let lineExtend = 40;
        let bufferRange = 0.0000001;

        for(let i = 0; i < geoPts.length; i++){
            if(geoPts[i].z >= maxZVal - bufferRange){
                print("[" + i + "]= " + geoPts[i].z);
                stroke(yellowSolid);
                strokeWeight(2);
                line(geoPts[i].x, geoPts[i].y, geoPts[i].z, geoPts[i].x, geoPts[i].y, geoPts[i].z + lineExtend);
                strokeWeight(5);
                point(geoPts[i].x, geoPts[i].y, geoPts[i].z + lineExtend);
                //point(geoPts[i].x, geoPts[i].y, geoPts[i].z);
            }
        }



        //geoPts.sort(function(a, b){
        //    return a.value - b.value;
        //});
        //console.log(geoPts);

    }
}

//**********************************************************************************
// Background Grid Class
class Grid{
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // Class Constructor
    constructor(gridColor, spacing){
        this.gridColor = gridColor;
        this.spacing = spacing;
    }

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // Class Methods
    // *******************************************************
    // Renders grid geo
    draw(){
        push();
        strokeWeight(2);
        stroke(this.gridColor);
        translate(-gridSize * scalar, -gridSize * scalar, 0);           // X-value used to vary start position
        for(let i=0; i <= gridSize * scalar * 2; i+=this.spacing){
            line(0, i, gridSize * scalar * 2, i);       // Horizontal Lines
        }                                                       // Line spacing varies by passed through parameter
        for(let i=0; i <= gridSize * scalar * 2; i+=this.spacing){
            line(i, 0, i, gridSize * scalar * 2);       // Vertical Lines
        }
        pop();
    }
}

//**********************************************************************************
// Gradient Class
class Gradient {
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // Class Constructor
    // Returns a gradient based on color parameter
    // Alpha start is opaque end and alpha end is most transparent end of gradient
    constructor(startColorToGrad, endColorToGrad){
        this.startColorToGrad = startColorToGrad;
        this.endColorToGrad = endColorToGrad;
    }

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // Class Methods
    // *******************************************************
    // Needs to be used within a loop to output the color in integer format
    returnGrad(iterVal, minValue, maxValue){
        this.iterVal = iterVal;
        this.minValue = minValue;
        this.maxValue = maxValue;
        let gradient;

        let gradRange = map(this.iterVal, this.minValue, this.maxValue, 0.0, 1.0);  // Map arc angle between 0 and 1 gradient range
        return gradient = lerpColor(this.startColorToGrad, this.endColorToGrad, gradRange);  // Vary the color
        //return gradient;
    }
}