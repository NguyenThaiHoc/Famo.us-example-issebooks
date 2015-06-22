var DOMElement = require('famous/dom-renderables/DOMElement');
var PhysicsEngine = require('famous/physics/PhysicsEngine');
var FamousEngine = require('famous/core/FamousEngine');
var GestureHandler = require('famous/components/GestureHandler');

var physics = require('famous/physics');
var math = require('famous/math');

var InputSurface = require("famous/surfaces/InputSurface");

var DOMElement = require('famous/dom-renderables/DOMElement');
var Surface = require('famous/core/Surface');
var Transitionable = require('famous/transitions/Transitionable');

var GestureHandler = require('famous/components/GestureHandler');

var Box = physics.Box;
var Spring = physics.Spring;
var RotationalSpring = physics.RotationalSpring;
var RotationalDrag = physics.RotationalDrag;
var Quaternion = math.Quaternion;
var Vec3 = math.Vec3;

var famous = require('famous');
var DOMElement = famous.domRenderables.DOMElement;
var FamousEngine = famous.core.FamousEngine;
var Position = famous.components.Position;


var heightPage = heightScreen*0.99;
var widthPage = widthScreen*0.65;


// -------------------- data--------------------------

var unitListImage = ['images/welcome.png','images/unit1.png','images/unit2.png','images/unit3.png',
                    'images/unit4.png','images/unit10.PNG','images/review1.png','images/unit7.PNG',
                    'images/unit8.PNG','images/unit9.png','images/unit10.PNG','images/review2.png',]


//---------------DATA PAGE 4---------------------
var words = ['Phong', 'Quan', 'Fine', 'And you', 'Fine'];
var haha = ['fdsf', 'fdsfs', 'rewrwe', 'yrtytr', 'rwqrew']
var boxAlignX = 0.05;
var boxAlignY = 0.15;
var widthBoxText = widthPage*0.9;
var heightBoxText = 70;
var heightWord = 40;
var widthWord = 120;

// ----------------DATA PAGE 5----------------------



var timeAnimation = 3000;
function Pager (node, options) {
    this.node = node;
    this.currentIndex = 0;
    this.threshold = 4000;
    this.pageWidth = 0;

    var resizeComponent = {
        onSizeChange: function(size) {
            this.defineWidth(size)
        }.bind(this)
    };
    this.node.addComponent(resizeComponent);

    // Add a physics simulation and update this instance
    // using regular time updates from the clock.
    this.simulation = new PhysicsEngine();

    // .requestUpdate will call the .onUpdate method next frame, passing in the time stamp for that frame
    FamousEngine.requestUpdate(this);

    this.threshold = 4000;
    this.force = new Vec3();

    this.pages = _createPages.call(this, node, options.pageData);
}

Pager.prototype.defineWidth = function(size){
  this.pageWidth = size[0];
};

Pager.prototype.onUpdate = function(time) {
    this.simulation.update(time)

    var page;
    var physicsTransform;
    var p;
    var r;
    for (var i = 0, len = this.pages.length; i < len; i++) {
        page = this.pages[i];

        // Get the transform from the `Box` body
        physicsTransform = this.simulation.getTransform(page.box);
        p = physicsTransform.position;
        r = physicsTransform.rotation;

        // Set the `imageNode`'s x-position to the `Box` body's x-position
        page.node.setPosition(p[0] * this.pageWidth, 0, 0);

        // Set the `imageNode`'s rotation to match the `Box` body's rotation
        page.node.setRotation(r[0], r[1], r[2], r[3]);
    }

    FamousEngine.requestUpdateOnNextTick(this);
};

Pager.prototype.pageChange = function(oldIndex, newIndex) {
    if (oldIndex < newIndex) {
        this.pages[oldIndex].anchor.set(-1, 0, 0);
        this.pages[oldIndex].quaternion.fromEuler(0, Math.PI/2, 0);
        this.pages[newIndex].anchor.set(0, 0, 0);
        this.pages[newIndex].quaternion.set(1, 0, 0, 0);
    } else {
        this.pages[oldIndex].anchor.set(1, 0, 0);
        this.pages[oldIndex].quaternion.fromEuler(0, -Math.PI/2, 0);
        this.pages[newIndex].anchor.set(0, 0, 0);
        this.pages[newIndex].quaternion.set(1, 0, 0, 0);
    }
    this.currentIndex = newIndex;
};

function animationUnit(position){
    if(position.getY()=== 0){
        position.set(0,-150,0, {duration: timeAnimation, curve: 'outQuad'}, animationUnit(position));
    }else{
        position.set(0,0,0, {duration: timeAnimation, curve: 'outQuad'}, animationUnit(position));
    }
}

function PageListenRepeat(imageNode){
    var sentence1 = imageNode.addChild(); 
    var sentence1DIV= new DOMElement(sentence1, {
        content: '<p>_______________<p>'
    });
    sentence1.setSizeMode('absolute', 'absolute')
              .setAbsoluteSize(widthPage*0.3, heightPage*0.3)
              .setAlign(0.35,0.39);

    var sentence2 = imageNode.addChild(); 
    var sentence2DIV= new DOMElement(sentence2, {
        content: '<p>_______________</p>'
    });
    sentence2.setSizeMode('absolute', 'absolute')
              .setAbsoluteSize(widthPage*0.3, heightPage*0.3)
              .setAlign(0.75,0.42);

    var show = imageNode.addChild();
    var showDIV = new DOMElement(show,{
        content: '<button class = "showbutton">Show</button>'
    });
    show.setSizeMode('absolute', 'absolute')
              .setAbsoluteSize(widthPage*0.3, heightPage*0.3)
              .setAlign(0.6,0.8)
              .setPosition(0, 0);

    var showgestures = new GestureHandler(show);
    showgestures.on('tap', function(){
        sentence1DIV.setContent('<p>Hello. I am Mai</p>');
        setTimeout(function(){ sentence2DIV.setContent('<p>Hi, Mai. I am Nam</p>'); }, 600);
    });
}

function PageDragWord(imageNode, words){
    var box = imageNode.addChild();

    box.setSizeMode('absolute', 'absolute')
              .setAbsoluteSize(widthBoxText,heightBoxText* Math.ceil(words.length/3))
              .setAlign(boxAlignX, boxAlignY)
              .setPosition(0,0);

    var boxDIV = new DOMElement(box, {
        properties: {
            'background-color': '#FAAC58'
        }
    });

    var wordsEle = [];
    var wordsEleDIV = [];
    var wordgestures =[];
    for(var j = 0; j< words.length; j++){
        wordsEle[j] = box.addChild();
        wordsEle[j].setSizeMode('absolute', 'absolute')
              .setAbsoluteSize(widthWord, heightWord)
              .setAlign(0, 0)
              .setPosition(widthBoxText/3*(j%3), heightBoxText*(j/3));
        wordsEleDIV = new DOMElement(wordsEle[j],{
            properties:{
                'background-color': '#ffffff',
            },
            content: '<p class ="textInBox">'+words[j]+'</p>'
        });
        wordgestures[j] = new GestureHandler(wordsEle[j]);
    }

    //fix code events
    wordgestures[0].on('drag', function(e){
            console.log(e.pointers[0].position.x+" "+ e.pointers[0].position.y + "  "+j)
            wordsEle[0].setPosition(e.pointers[0].position.x-boxAlignX*widthPage-(widthScreen- widthPage)/2 - widthWord/2, 
                                    e.pointers[0].position.y-boxAlignY*heightPage -(heightScreen - heightPage)/2 - heightWord/2);
        });
    wordgestures[1].on('drag', function(e){
            console.log(e.pointers[0].position.x+" "+ e.pointers[0].position.y + "  "+j)
            wordsEle[1].setPosition(e.pointers[0].position.x-boxAlignX*widthPage-(widthScreen- widthPage)/2 - widthWord/2, 
                                    e.pointers[0].position.y-boxAlignY*heightPage -(heightScreen - heightPage)/2 - heightWord/2);
        });
    wordgestures[2].on('drag', function(e){
            console.log(e.pointers[0].position.x+" "+ e.pointers[0].position.y + "  "+j)
            wordsEle[2].setPosition(e.pointers[0].position.x-boxAlignX*widthPage-(widthScreen- widthPage)/2 - widthWord/2, 
                                    e.pointers[0].position.y-boxAlignY*heightPage -(heightScreen - heightPage)/2 - heightWord/2);
        });
    wordgestures[3].on('drag', function(e){
            console.log(e.pointers[0].position.x+" "+ e.pointers[0].position.y + "  "+j)
            wordsEle[3].setPosition(e.pointers[0].position.x-boxAlignX*widthPage-(widthScreen- widthPage)/2 - widthWord/2, 
                                    e.pointers[0].position.y-boxAlignY*heightPage -(heightScreen - heightPage)/2 - heightWord/2);
        });
    wordgestures[4].on('drag', function(e){
            console.log(e.pointers[0].position.x+" "+ e.pointers[0].position.y + "  "+j)
            wordsEle[4].setPosition(e.pointers[0].position.x-boxAlignX*widthPage-(widthScreen- widthPage)/2 - widthWord/2, 
                                    e.pointers[0].position.y-boxAlignY*heightPage -(heightScreen - heightPage)/2 - heightWord/2);
        });
}
function _createPages(root, pageData) {
    var pages = [];

    for (var i = 0; i < pageData.length; i++) {
        var imageNode = root.addChild();

        imageNode.setSizeMode(1,1,1)
        imageNode.setAbsoluteSize(widthPage, heightPage, 0);
        imageNode.setAlign(0.5, 0.5);
        imageNode.setMountPoint(0.5, 0.5);
        imageNode.setOrigin(0.5, 0.5);
        // modify page

        // ------------------Page 3

        if(i === 2){
            var unitList = [];
            var position = [];
            for(var j = 0; j< unitListImage.length; j++){
                unitList[j] = new DOMElement(imageNode);
                unitList[j] = imageNode.addChild();
                var alignX = (j/unitListImage.length>1/2)?0.6:0.3;
                var alignY = (j/unitListImage.length>1/2)?((unitListImage.length-j)*2/unitListImage.length):(j*1.7/unitListImage.length);
                unitList[j].setSizeMode('absolute', 'absolute')
                      .setAbsoluteSize(widthPage*0.15, heightPage*0.2)
                      .setAlign(alignY,alignX)
                      .setPosition(j/unitListImage.length,0);
                var tagDIV = new DOMElement(unitList[j], { 
                    properties:{
                        'background-image': 'url('+unitListImage[j]+')',
                        'background-repeat': 'no-repeat'
                    } 
                });
                position[j] = new Position(unitList[j]);
            }

            // fix animation

            setInterval(function(){ 
                if(position[0].getY() === 0){
                    position[0].set(0,-10,0, {duration: timeAnimation, curve: 'inOutSine'});  
                }
                else{
                    position[0].set(0,0,0, {duration: timeAnimation, curve: 'inOutSine'});
                }
            }, timeAnimation);

            setInterval(function(){ 
                if(position[1].getY() === 0){
                    position[1].set(0,-90,0, {duration: timeAnimation, curve: 'inOutSine'});  
                }
                else{
                    position[1].set(0,0,0, {duration: timeAnimation, curve: 'inOutSine'});
                }
            }, timeAnimation);

            setInterval(function(){ 
                if(position[2].getY() === 0){
                    position[2].set(0,-60,0, {duration: timeAnimation, curve: 'inOutSine'});  
                }
                else{
                    position[2].set(0,0,0, {duration: timeAnimation, curve: 'inOutSine'});
                }
            }, timeAnimation);


            setInterval(function(){ 
                if(position[3].getY() === 0){
                    position[3].set(0,-40,0, {duration: timeAnimation, curve: 'inOutSine'});  
                }
                else{
                    position[3].set(0,0,0, {duration: timeAnimation, curve: 'inOutSine'});
                }
            }, timeAnimation);


            setInterval(function(){ 
                if(position[4].getY() === 0){
                    position[4].set(0,-80,0, {duration: timeAnimation, curve: 'inOutSine'});  
                }
                else{
                    position[4].set(0,0,0, {duration: timeAnimation, curve: 'inOutSine'});
                }
            }, timeAnimation);

            setInterval(function(){ 
                if(position[5].getY() === 0){
                    position[5].set(0,-150,0, {duration: timeAnimation, curve: 'inOutSine'});  
                }
                else{
                    position[5].set(0,0,0, {duration: timeAnimation, curve: 'inOutSine'});
                }
            }, timeAnimation);

            setInterval(function(){ 
                if(position[6].getY() === 0){
                    position[6].set(0,-10,0, {duration: timeAnimation, curve: 'inOutSine'});  
                }
                else{
                    position[6].set(0,0,0, {duration: timeAnimation, curve: 'inCirc'});
                }
            }, timeAnimation);

            setInterval(function(){ 
                if(position[7].getY() === 0){
                    position[7].set(0,-50,0, {duration: timeAnimation, curve: 'inOutSine'});  
                }
                else{
                    position[7].set(0,0,0, {duration: timeAnimation, curve: 'inOutSine'});
                }
            }, timeAnimation);

            setInterval(function(){ 
                if(position[8].getY() === 0){
                    position[8].set(0,-30,0, {duration: timeAnimation, curve: 'inOutSine'});  
                }
                else{
                    position[8].set(0,0,0, {duration: timeAnimation, curve: 'inOutSine'});
                }
            }, timeAnimation);

            setInterval(function(){ 
                if(position[10].getY() === 0){
                    position[10].set(0,-50,0, {duration: timeAnimation, curve: 'inOutSine'});  
                }
                else{
                    position[10].set(0,0,0, {duration: timeAnimation, curve: 'inOutSine'});
                }
            }, timeAnimation);

            setInterval(function(){ 
                if(position[11].getY() === 0){
                    position[11].set(0,-90,0, {duration: timeAnimation, curve: 'inOutSine'});  
                }
                else{
                    position[11].set(0,0,0, {duration: timeAnimation, curve: 'inOutSine'});
                }
            }, timeAnimation);

            setInterval(function(){ 
                if(position[9].getY() === 0){
                    position[9].set(0,-10,0, {duration: timeAnimation, curve: 'inOutSine'});  
                }
                else{
                    position[9].set(0,0,0, {duration: timeAnimation, curve: 'inOutBounce'});
                }
            }, timeAnimation);
        }
        // ------------------Page 4
        if(i === 3){
            PageDragWord(imageNode, words);
        }

        //---------------------------page5
        if(i === 4){
            PageListenRepeat(imageNode);
        }

        // var gestureHandler = new GestureHandler(imageNode);
        //     gestureHandler.on('drag', function(index, e) {
        //             this.force.set(e.centerDelta.x, 0, 0); // Add a force equal to change in X direction
        //             this.force.scale(20); // Scale the force up
        //             this.pages[index].box.applyForce(this.force); // Apply the force to the `Box` body

        //             if (e.centerVelocity.x > this.threshold) {
        //                 if (this.draggedIndex === index && this.currentIndex === index) {
        //                     // Move index to left
        //                     this.node.emit('pageChange', {direction: -1, amount: 1});
        //                 }
        //             }
        //             else if (e.centerVelocity.x < -this.threshold){
        //                 if (this.draggedIndex === index && this.currentIndex === index) {
        //                     this.node.emit('pageChange', {direction: 1,  amount:1});
        //                 }
        //             }

        //             if (e.status === 'start') {
        //                 this.draggedIndex = index;
        //             }
        //         }.bind(this, i));

        var el = new DOMElement(imageNode);
        el.setProperty('background-color', '#ffffff')
        el.setProperty('backgroundImage', 'url(' + pageData[i] + ')');
        el.setProperty('background-repeat', 'no-repeat');
        el.setProperty('background-size', 'cover');

        // A `Box` body to relay simulation data back to the visual element
        var box = new Box({
            mass: 100,
            size: [100,100,100]
        });

        // Place all anchors off the screen, except for the
        // anchor belonging to the first image node
        var anchor = i === 0 ? new Vec3(0, 0, 0) : new Vec3(1, 0, 0);

        // Attach the box to the anchor with a `Spring` force
        var spring = new Spring(null, box, {
            period: 0.5,
            dampingRatio: 1,
            anchor: anchor
        });

        // Rotate the image 90deg about the y-axis,
        // except for first image node
        var quaternion = i === 0 ? new Quaternion() : new Quaternion().fromEuler(0,-Math.PI/2,0);

        // Attach an anchor orientation to the `Box` body with a `RotationalSpring` torque
        var rotationalSpring = new RotationalSpring(null, box, {
            period: 1,
            dampingRatio: 0.9,
            anchor: quaternion
        });

        // Notify the physics engine to track the box and the springs
        this.simulation.add(box, spring, rotationalSpring);

        pages.push({
          node: imageNode,
          el: el,
          box: box,
          spring: spring,
          quaternion: quaternion,
          rotationalSpring: rotationalSpring,
          anchor: anchor
        });
    }

    return pages;
}

module.exports = Pager;
