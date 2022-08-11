//this game will have only 1 state
var GameState = {
    //load the game assets before the game start
    preload: function(){
        //('sprite name','sprite source')
        this.load.image('grass-background', 'image/background.png');
        this.load.image('arrow', 'image/arrow.png');
        //this.load.image('white_tiger', 'image/Takara-Tomy-Beyblade-Burst-B-132-Random-Booster-Vol-14-Japan-Figure-4904810618539-9_500x500.png')
        //this.load.image('fighter', 'image/fighter.png')

        //declare spriteImage
        this.load.spritesheet('chicken', 'image/chicken_spritesheet.png', 131, 200, 3);
        this.load.spritesheet('sheep', 'image/sheep_spritesheet.png', 244, 200, 3);
        this.load.spritesheet('pig', 'image/pig_spritesheet.png', 297, 200, 3);
        this.load.spritesheet('horse', 'image/horse_spritesheet.png', 212, 200, 3);

        //declare audio file
        this.load.audio('chickenSound', ['music/ogg/316920__rudmer-rotteveel__chicken-single-alarm-call.ogg','music/mp3/316920__rudmer-rotteveel__chicken-single-alarm-call.mp3']);
        this.load.audio('sheepSound', ['music/ogg/429884__julalvr__2-balar-despues-de-comer-wav.ogg','music/mp3/429884__julalvr__2-balar-despues-de-comer-wav.mp3']);
        this.load.audio('horseSound', ['music/ogg/53261__stomachache__horse.ogg','music/mp3/53261__stomachache__horse.mp3']);
        this.load.audio('pigSound', ['music/ogg/409014__jammaj__pig-snorting-fx.ogg','music/mp3/409014__jammaj__pig-snorting-fx.mp3']);
        
    },
    /*--------------------------------------------------create: function(): use for executed after everything is loaded-----------------------------------------------------------------*/
    create: function(){

        //screen auto responsive 
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        //background
        this.green_background = this.game.add.sprite(0, 0, 'grass-background');

        //group for animals
        var animalData = [
            //key=the name of the image
            {key: 'sheep', text: 'SHEEP', audio: 'sheepSound'},
            {key: 'pig', text: 'PIG', audio: 'pigSound'},
            {key: 'horse', text: 'HORSE', audio: 'horseSound'},
            {key: 'chicken', text: 'CHICKEN', audio: 'chickenSound'}
        ];

        this.animal = this.game.add.group();//declare the animal as add group

        //animalData function name declaration
        var self = this;
        var animal;

        animalData.forEach(function(element){//is the for loop use for creating the element in the group
            //create the element in the group
            animal = self.animal.create(-1000, this.game.world.centerY, element.key);
            //set parameter and position
            animal.customParams = {text: element.text, sound: self.game.add.audio(element.audio)};
            animal.anchor.setTo(0.5);

            //create animal animation
            animal.animations.add('animate', [0, 1, 2, 1, 0, 1], 3, false);

            //animal user input
            animal.inputEnabled = true;
            animal.input.pixelPerfectClick = true;
            animal.events.onInputDown.add(self.animateAnimal, self);
        });

        //use for changing the next group object
        this.currentAnimal = this.animal.next();
        this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY);

        //show the text
        this.showText(this.currentAnimal);

        //left arrow
        this.leftArrow = this.game.add.sprite('100', this.game.world.centerY, 'arrow');
        this.leftArrow.anchor.setTo(0.5);
        this.leftArrow.scale.x = -1;
        this.leftArrow.customParams = {direction:-1};
        this.leftArrow.inputEnabled = true;
        this.leftArrow.input.pixelPerfectClick = true;
        this.leftArrow.events.onInputDown.add(this.switchAnimal, this);

        //right arrow
        this.rightArrow = this.game.add.sprite('540', this.game.world.centerY, 'arrow');
        this.rightArrow.anchor.setTo(0.5);
        this.rightArrow.customParams = {direction: 1};
        this.rightArrow.inputEnabled = true;
        this.rightArrow.input.pixelPerfectClick = true;
        this.rightArrow.events.onInputDown.add(this.switchAnimal, this);

    },
    /*---------------------------------------------------update:function()=this is use for create a function to allow executed multiple times---------------------------------------------------*/
    update: function(){
    },

    //animal animation function
    animateAnimal: function(sprite, event){
        sprite.play('animate');
        sprite.customParams.sound.play();
    },
    
    //switching the animal
    switchAnimal: function(sprite, event){

        if(this.isMoving){
            return false;
        }
        this.isMoving = true;

        //hide the text
        this.animalText.visible = false;

        var nextAnimal, endX;

        //if the arrow direction more than one move to the right, else move to the left
        if(sprite.customParams.direction > 0){
            nextAnimal = this.animal.next();
            nextAnimal.x = -nextAnimal.width/2;
            endX = 640 + this.currentAnimal.width/2;
        }
        else{
            nextAnimal = this.animal.previous();
            nextAnimal.x = 640 + nextAnimal.width/2;
            endX = -this.currentAnimal.width/2;
        }

        //animal moving animation
        var nextAnimalMovement = this.game.add.tween(nextAnimal);
        nextAnimalMovement.to({x: this.game.world.centerX}, 300);
        //to allow the animal will be changed when the moving animation is done
        nextAnimalMovement.onComplete.add(function(){
            this.isMoving = false;
            this.showText(nextAnimal);
        }, this);
        nextAnimalMovement.start();

        //changing current animal position after animation
        var currentAnimalMovement = this.game.add.tween(this.currentAnimal);
        currentAnimalMovement.to({x: endX}, 300);
        currentAnimalMovement.start();

        this.currentAnimal.x = endX;
        nextAnimal.x = this.game.world.centerX;
        this.currentAnimal = nextAnimal;
    },

    //showing the text
    showText: function(animal){
        //text styling
        var textStyle = {
            font: 'bold 30pt Audiowide',
            fill: '#00008B',
            align: 'center'
        }
        if(!this.animalText){
            this.animalText = this.game.add.text(this.game.width/1.9, this.game.height * 0.85, '', textStyle);
            this.animalText.anchor.setTo(0.5);
        }

        this.animalText.setText(animal.customParams.text);
        this.animalText.visible = true;
    }
};

//initialize the Phaser framework
var game = new Phaser.Game(600, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');