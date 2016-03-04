/// <reference path="phaser/phaser.d.ts"/>

import Point = Phaser.Point;
class mainState extends Phaser.State {
    private ufo:Phaser.Sprite;
    private cursor:Phaser.CursorKeys;
    private walls:Phaser.TilemapLayer;

    private UFO_SIZE = 75;
    private MAX_SPEED:number = 300; // pixels/second
    private ACCELERATION:number = 500; // pixels/second/second
    private DRAG:number = 100;
    private BOUNCE:number = 0.4;
    private ANGULAR_DRAG:number = this.DRAG * 1.3;
    private pickups:Phaser.Group;
    private map:Phaser.Tilemap;

    preload():void {
        super.preload();

        this.load.image('ufo', 'assets/UFO_small.png');
        this.load.image('pickup', 'assets/Pickup_small.png');

        this.game.load.tilemap('tilemap', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/Background_small.png');

        this.physics.startSystem(Phaser.Physics.ARCADE);
    }

    create():void {
        super.create();
        this.createWalls();
        this.createPlayer();
        this.createPickupObjects();

        //this.world.scale.setTo(1.25);
        this.camera.follow(this.ufo, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);

        this.cursor = this.input.keyboard.createCursorKeys();
    }

    private createWalls() {
        this.map = this.game.add.tilemap('tilemap');
        this.map.addTilesetImage('Background_small', 'tiles');

        var background = this.map.createLayer('background');
        this.walls = this.map.createLayer('walls');

        this.map.setCollisionBetween(1, 100, true, 'walls');
    };

    private createPlayer() {
        this.pickups = this.add.group();
        this.pickups.enableBody = true;

        this.ufo = this.add.sprite(this.world.centerX, this.world.centerY, 'ufo');
        this.ufo.anchor.setTo(0.5, 0.5);

        this.physics.enable(this.ufo, Phaser.Physics.ARCADE);

        this.ufo.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y
        this.ufo.body.collideWorldBounds = true;
        this.ufo.body.bounce.set(this.BOUNCE);
        this.ufo.body.drag.setTo(this.DRAG, this.DRAG); // x, y
        this.ufo.body.angularDrag = this.ANGULAR_DRAG;
    };

    private createPickupObjects():void {
        this.pickups = this.add.group();
        this.pickups.enableBody = true;

        this.map.createFromObjects('pickups', 101, 'pickup', 0, true, false, this.pickups);

        /*var positions:Point[] = [
            new Point(300, 95),
            new Point(190, 135), new Point(410, 135),
            new Point(120, 200), new Point(480, 200),
            new Point(95, 300), new Point(505, 300),
            new Point(120, 405), new Point(480, 405),
            new Point(190, 465), new Point(410, 465),
            new Point(300, 505),
        ];

        for (var i = 0; i < positions.length; i++) {
            var position = positions[i];
            var pickup = new Pickup (this.game, position.x, position.y, 'pickup');
            this.add.existing(pickup);

            pickup.scale.setTo(0, 0);
            this.add.tween(pickup.scale).to({x: 1, y: 1}, 300).start();

            this.pickups.add(pickup);
        }*/
    }

    update():void {
        super.update();
        this.moveUfo();

        this.physics.arcade.collide(this.ufo, this.walls);
        this.physics.arcade.overlap(this.ufo, this.pickups, this.getPickup, null, this);
    }

    getPickup(ufo:Phaser.Sprite, pickup:Phaser.Sprite){
        var tween = this.add.tween(pickup.scale).to({x: 0, y: 0}, 50);
        tween.onComplete.add(function () {
            pickup.kill();
        });
        tween.start();
        //pickup.kill();
    }

    private moveUfo() {
        if (this.cursor.left.isDown) {
            this.ufo.body.acceleration.x = -this.ACCELERATION;
        } else if (this.cursor.right.isDown) {
            this.ufo.body.acceleration.x = this.ACCELERATION;
        } else if (this.cursor.up.isDown) {
            this.ufo.body.acceleration.y = -this.ACCELERATION;
        } else if (this.cursor.down.isDown) {
            this.ufo.body.acceleration.y = this.ACCELERATION;
        } else {
            this.ufo.body.acceleration.x = 0;
            this.ufo.body.acceleration.y = 0;
        }

        this.ufo.body.angularAcceleration = this.ufo.body.acceleration.x;
    };
}

class Pickup extends Phaser.Sprite {

    constructor(game:Phaser.Game, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture) {
        super(game, x, y, key);

        this.anchor.setTo(0.5, 0.5);
    }

    update():void {
        super.update();
        this.angle += 1;
    }
}


class SimpleGame {
    game:Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(600, 600, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
}

window.onload = () => {
    var game = new SimpleGame();
};
