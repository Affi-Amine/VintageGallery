const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

let engine;
let items = [];
let lastMouseX = -1;
let lastMouseY = -1;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    engine = Engine.create();
    engine.world.gravity.y = 0.1;

    addBoundaries();

    for (let i = 0; i < 12; i++) {
        let x = Math.random() * window.innerWidth;
        let y = Math.random() * window.innerHeight;
        items.push(new Item(x, y, `./assets/i${i + 1}.jpg`));
    }
}

function addBoundaries() {
    const thickness = 50;
    World.add(engine.world, [
        Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true }),
        Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true }),
        Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true }),
        Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true })
    ]);
}

function draw() {
    background("black");
    Engine.update(engine);
    items.forEach((item) => item.update());
}

class Item {
    constructor(x, y, imagePath) {
        let options = {
            frictionAir: 0.075,
            restitution: 0.25,
            density: 0.002,
            angle: Math.random() * Math.PI * 2,
        };

        this.body = Bodies.rectangle(x, y, 100, 200, options);
        World.add(engine.world, this.body);

        this.div = document.createElement("div");
        this.div.className = "item";

        const img = document.createElement("img");
        img.src = imagePath;
        this.div.appendChild(img);
        document.body.appendChild(this.div);
    }

    update() {
        this.div.style.left = `${this.body.position.x - 50}px`;
        this.div.style.top = `${this.body.position.y - 100}px`;
        this.div.style.transform = `rotate(${this.body.angle}rad)`;
    }
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function mouseMoved() {
    if (dist(mouseX, mouseY, lastMouseX, lastMouseY) > 10) {
        lastMouseX = mouseX;
        lastMouseY = mouseY;

        items.forEach((item) => {
            if (dist(mouseX, mouseY, item.body.position.x, item.body.position.y) < 150) {
                let forceMagnitude = 3;
                Body.applyForce(item.body, {
                    x: item.body.position.x,
                    y: item.body.position.y,
                }, {
                    x: random(-forceMagnitude, forceMagnitude),
                    y: random(-forceMagnitude, forceMagnitude),
                });
            }
        });
    }
}

setup();