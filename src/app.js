var HelloWorldLayer = InteractiveTopDownLayer.extend({
    ctor:function () {
        this._super();

        var gameMap = this.gameMap = new GameMap(new cc.TMXTiledMap(res.smallMap), "obstructions");

        var thief = this.createInteractive(res.jane, ['thief'], {
            x: cc.winSize.width / 2,
            y: cc.winSize.height / 2,
        });

        var monster = this.createInteractive(res.mouse, ['monster'], {
            x: 150,
            y: 600,
        });

//            BubbleText.quickPrint('Hello!', character, {panOffset: {x: 0, y: 64}});
        thief.onTagEnter('monster', 64*10, function(monster, distance) {
            BubbleText.quickPrint('Engard!!', enemy, {panOffset: {x: 0, y: 64}});
            thief.engaged = monster;
        });

        thief.onTagEnter('monster', 64*10, function(monster, distance) {
            BubbleText.quickPrint('Hiya!!', enemy, {panOffset: {x: 0, y: 64}});
            thief.inrange = true;
        });

        thief.onTagExit('monster', 128, function(monster, distance) {
            BubbleText.quickPrint('alright then.', enemy, {panOffset: {x: 0, y: 64}});
            thief.inrange = false;
        });

        enemy.onSelect(function() {
            do {
                randomLocation = {x: Math.random() * cc.winSize.width, y: Math.random() * cc.winSize.height};
            } while(!gameMap.move(enemy, randomLocation, 0.05)) //speed is seconds per tile
        }, true);

        this.onClick(function(touches, event) {
            gameMap.move(character, touches[0].getLocation(), 0.1); //speed is seconds per tile
        });

        this.addChild(this.gameMap.tiledMap);
        this.addChild(character);
        this.addChild(enemy);

        this.addOnHoverEffect();

        return true;
    },
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});
