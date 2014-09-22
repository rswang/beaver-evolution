function BeaverEvolution(game) {
    this.game = game;
    boardGroup = this.game.add.group();
    evolutionCardGroup = this.game.add.group();
    taskbarGroup = this.game.add.group();
    this.board = new Board(this, boardGroup);
    this.evolutionCard = new EvolutionCard(this, evolutionCardGroup);
    this.taskbar = new Taskbar(this, taskbarGroup);
    this.beavers = 8;
    console.log("Welcome to Beaver Evolution!");
}

BeaverEvolution.prototype = {
    getBeavers: function() {
        return this.beavers;
    },
    getBoard: function() {
        return this.board;
    },
    getTaskbar: function() {
        return this.taskbar;
    },
    getEvolutionCard: function() {
        return this.evolutionCard;
    },
    preload: function() {
        this.game.load.image("test_image", "../assets/images/phaser.png");
        this.game.load.image("green", "../assets/images/green.png");
        this.game.load.image("green_brown", "../assets/images/green_brown.png");
        this.game.load.image("land", "/assets/images/land.png", 42, 48);
        this.game.load.image("water", "/assets/images/water.png", 42, 48);
        this.game.load.image("dam", "/assets/images/dam.png", 42, 48);
        this.game.load.image('checkbox_no', '../assets/images/checkbox_no.png', 40, 40);
        this.game.load.image('checkbox_yes', '../assets/images/checkbox_yes.png', 40, 40);
    },
    create: function() {
        this.game.stage.backgroundColor = "#000000";
        this.board.show();
    },
    update: function() {

    },
    render: function() {

    }
}