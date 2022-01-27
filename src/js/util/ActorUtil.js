
import gsap from "gsap";
import ShipRenderer from "@/view/renderers/ShipRenderer";

/**
 * change the value of given property of given actor
 * to targetValue over a time of delayTime seconds
 *
 * @param {Ship} actor
 * @param {string|Array<string>} property single String or Array of Strings
 * @param {number|Array<number>} targetValue single number or Array of numbers
 * @param {number} delayTime in seconds
 * @param {Function=} optCallback optional callback to execute when ready
 * @param {Function=} optEase optional easing function to use
 * @param {Function=} optUpdate optional method to execute while Tween
 *                    updates on each interation of its execution
 */
export function setDelayed( actor, property, targetValue, delayTime, optCallback, optEase, optUpdate ) {

    const vars = {
        onComplete: optCallback
    };

    if ( optUpdate ) {
        vars.onUpdate = optUpdate;
    }
    if ( Array.isArray( property )) {
        for ( let i = 0, l = property.length; i < l; ++i ) {
            vars[ property[ i ]] = targetValue[ i ];
        }
    }
    else {
        vars[ property ] = targetValue;
    }
    if ( optEase ) {
        vars[ "ease" ] = optEase;
    }

    gsap.to(
        actor, delayTime, vars
    );
}


export function calculateSquadronWidth( gameModel, totalEnemies ) {
    const width = Math.min( gameModel.world.width, ( ShipRenderer.TILE_SIZE.width * 2 ) * totalEnemies );
    return {
        xOffset: Math.min(
            gameModel.player.x,
            gameModel.world.width / 2 - width / 2,
        ),
        width,
    };
}
