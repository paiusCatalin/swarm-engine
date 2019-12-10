const se = require("../index");
require("./../../../psknode/bundles/pskruntime");
const assert = require('../../double-check').assert;
const path = require("path");

se.initialise();

const constitution = [
    path.join(__dirname, '../../../psknode/bundles/sandboxBase.js'),
    path.join(__dirname, '../../../psknode/bundles/pskruntime.js'),
    path.join(__dirname, '../../../psknode/bundles/domain.js')
];

const powerCord = new se.OuterIsolatePowerCord(constitution);

$$.swarmEngine.plug("Agent007", powerCord);


assert.callback('interactionAttachToPriority', (callback) => {
    let attachToCalled = false;
    let onCalled = false;
    let onReturnCalled  = false;

    $$.interactions.attachTo("global.echo", {
        interactResponse: function(input){
            attachToCalled = true;
        }
    });

    const swarm = $$.interaction.startSwarmAs("Agent007", "global.echo", "interactSay", "it works");
    swarm.on({
        interactResponse: function(input){
            assert.equal(input, 'it works');
            onCalled = true;
            this.swarm("Agent007", "finally", input);
        }
    }).onReturn(function(){
        console.log('ia uite');
        onReturnCalled = true;
    });

    setTimeout(() => {
        assert.true(onCalled, '.on({interactResponse}) was not called');
        assert.true(onReturnCalled, '.onReturn was not called');
        assert.false(attachToCalled, '.attachTo({interactResponse}) was called, but for this swarm it should have been overwritten by .on({interactResponse})');
        callback();
    }, 1000);
}, 1500);


