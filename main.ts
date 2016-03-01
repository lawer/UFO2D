/// <reference path="phaser/phaser.d.ts"/>

class mainState extends Phaser.State {
    private ufo:Phaser.Sprite;
    private cursor:Phaser.CursorKeys;
    private walls:Phaser.Group;

    private UFO_SIZE = 75;
    private MAX_SPEED:number = 300; // pixels/second
    private ACCELERATION:number = 500; // pixels/second/second
    private DRAG:number = 100;

    preload():void {
        super.preload();

        this.load.image('ufo', 'assets/UFO_small.png');
        this.load.image('pickup', 'assets/Pickup.png');
        this.load.image('center', 'assets/center.png');
        this.load.image('up', 'assets/up.png');
        this.load.image('down', 'assets/down.png');
        this.load.image('left', 'assets/left.png');
        this.load.image('right', 'assets/right.png');

        this.physics.startSystem(Phaser.Physics.ARCADE);
    }

    create():void {
        super.create();
        this.createWalls();
        this.createPlayer();

        this.cursor = this.input.keyboard.createCursorKeys();
    }

    private createWalls() {
        this.walls = this.add.group();
        this.walls.enableBody = true;

        var wall_up = this.add.sprite(0, 0, 'up', null, this.walls);
        var wall_left = this.add.sprite(0, wall_up.height, 'left', null, this.walls);

        var center = this.add.sprite(wall_left.width, wall_up.height, 'center', null);

        var wall_right = this.add.sprite(wall_left.width + center.width, wall_up.height, 'right', null, this.walls);
        var wall_down = this.add.sprite(0, wall_up.height + center.height, 'down', null, this.walls);

        this.walls.setAll('body.immovable', true);
    };

    private createPlayer() {
        this.ufo = this.add.sprite(this.world.centerX, this.world.centerY, 'ufo');
        this.ufo.anchor.setTo(0.5, 0.5);

        this.physics.enable(this.ufo, Phaser.Physics.ARCADE);

        this.ufo.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y
        this.ufo.body.collideWorldBounds = true;
        this.ufo.body.bounce.set(0.7);
        this.ufo.body.drag.setTo(this.DRAG, this.DRAG); // x, y
        this.ufo.body.angularDrag = this.DRAG;
    };

    update():void {
        super.update();
        this.game.debug.bodyInfo(this.ufo, 0, 0);
        this.moveUfo();

        this.physics.arcade.collide(this.ufo, this.walls)
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
