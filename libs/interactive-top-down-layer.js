var InteractiveTopDownLayer = TopDownLayer.extend({
    interactives: [],
    interactivesByTag: {},
    ctor: function() {
        this._super();

        this.scheduleUpdate();
    },
    update: function(dt) {
        this.handleInteractions();
    },
    handleInteractions: function() {
        this.interactives.forEach(function(interactive) {
            interactive.fenceEvents.forEach(function(event) {
                var interactives = (event.interactive)
                    ?   [event.interactive]
                    :   this.interactivesByTag[event.tag] || [];

                interactives.forEach(function(otherInteractive) {
                    if(interactive != otherInteractive)
                        this.checkEvent(event, interactive, otherInteractive, fence.type);
                }, this);
            }, this);
        }, this);
    },
    checkEvent: function(event, subject, object, type) {
        var objectIndex = subject.eventsInteractivesInRange[event.id].indexOf(object);
        var distance = MathHelper.dist(subject, object);

        var consideredInRange = objectIndex != -1; //object is "inRange" because it's in the array
        var inRange = distance <= event.range;

        if(!(consideredInRange ^ inRange)) //if inRange state is valid, then no need to do anything.
            return;

        if(inRange)
            subject.eventsInteractivesInRange[event.id].push(object);
        else
            subject.eventsInteractivesInRange[event.id].splice(objectIndex);

        if(inRange && type == 'onEnter' || !inRange && type == 'onExit')
            event.cb(object, distance);
    },

    removeChild: function(child, cleanup) {
        this._super(child, cleanup);
    },

    createInteractive: function(Character, location) {
        var interactive = new Character();

        this.interactives.push(interactive);
        interactive.tags.forEach(function(tag) {
            //TODO: add an array helper to do this in on function. (create array if necessary)
            if(!this.interactivesByTag[tag])
                this.interactivesByTag[tag] = [];

            this.interactivesByTag[tag].push(interactive);
        }, this);

        if(location)
            interactive.attr(this.gameMap.getScreenTileCoords(location));

        return interactive;
    }, 
});

function objInArray(arr, obj) {
    return arr.some(function(item) {
        for(var k in item)
            if(!obj[k] || item[k] != obj[k])
                return false;

        return true;
    });
}
