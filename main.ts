/// <reference path="phaser/phaser.d.ts"/>

class mainState extends Phaser.State {
    private ufo:Phaser.Sprite;
    private cursor:Phaser.CursorKeys;
    private UFO_SIZE = 75;
    private UFO_SPEED = 200;

    preload():void {
        super.preload();

        this.load.image('ufo', 'assets/UFO.png');
        this.load.image('pickup', 'assets/Pickup.png');
        this.load.image('background', 'assets/Background.png');

        this.physics.startSystem(Phaser.Physics.ARCADE);
    }

    create():void {
        super.create();
        var background;

        background = this.add.sprite(0, 0, 'background');
        var scale = this.world.height / background.height;
        background.scale.setTo(scale, scale);

        this.ufo = this.add.sprite(this.world.centerX, this.world.centerY, 'ufo');
        this.ufo.width = this.ufo.height = this.UFO_SIZE;
        this.ufo.anchor.setTo(0.5, 0.5);

        this.physics.enable(this.ufo);
        this.cursor = this.input.keyboard.createCursorKeys();
    }

    update():void {
        super.update();
        this.game.debug.bodyInfo(this.ufo, 0, 0);
        
        this.ufo.body.velocity.x = 0;
        this.ufo.body.velocity.y = 0;

        if (this.cursor.left.isDown) {
            this.ufo.body.velocity.x = -this.UFO_SPEED;
        } else if (this.cursor.right.isDown) {
            this.ufo.body.velocity.x = this.UFO_SPEED;
        }

        if (this.cursor.up.isDown) {
            this.ufo.body.velocity.y = -this.UFO_SPEED;
        } else if (this.cursor.down.isDown) {
            this.ufo.body.velocity.y = this.UFO_SPEED;
        }
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
