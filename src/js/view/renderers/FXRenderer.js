
import { sprite } from "zcanvas";
import Config     from "@/config/Config";
import Assets     from "@/definitions/Assets";

/**
 * a renderer that renders different animations
 * like transition effects, explosions, etc.
 * this renderer does not belong to an Actor
 *
 * @constructor
 * @param {RenderController} renderController
 */
export default class FXRenderer extends sprite
{
    constructor( renderController ) {
        super({
            x: 0, y: 0,
            width:  FXRenderer.TILE_SIZE.width,
            height: FXRenderer.TILE_SIZE.height
        });

        const animationCompleteHandler = renderController.onFXComplete.bind( renderController, this );

        this.setBitmap( Assets.GRAPHICS.FX.img );
        this.setSheet([

                // Animation when Actor is switching layer
                { row: 0, col: 0, fpt: 2, amount: 8, onComplete: animationCompleteHandler },

                // Explosion
                { row: 1, col: 0, fpt: 3, amount: 16, onComplete: animationCompleteHandler }
            ],
            FXRenderer.TILE_SIZE.width,
            FXRenderer.TILE_SIZE.height
        );
    }

    /* public methods */

    /**
     * @param {Actor} actor
     * @param {number} animationIndex
     */
    showAnimation( actor, animationIndex, optXoffset = 0, optYoffset = 0 ) {

        // animation gets equal coordinates of given actor

        // optional : align to width/height ?
        //this.setWidth ( actor.width );
        //this.setHeight( actor.height );

        this.setX( actor.x + actor.offsetX + optXoffset );
        this.setY( actor.y + actor.offsetY + optYoffset );

        this.switchAnimation( animationIndex );
    };

    /**
     * @override
     * @param {CanvasRenderingContext2D} aCanvasContext
     */
    draw( aCanvasContext ) {
        // need to manually trigger update (zCanvas has been
        // initialized to use an external update handler, which is
        // the gameloop in Game. The FXRenderer is not part
        // of the game loop as it has no associated Actor (TODO: is this logical?)

        this.update();

        super.draw( aCanvasContext );
    }
}

/**
 * dimensions of each tile in the spritesheet
 *
 * @public
 * @type {{width: number, height: number}}
 */
FXRenderer.TILE_SIZE = { width: 64, height: 64 };

/**
 * all animations that are available to this renderer
 * these translate to animation indices in the sprite sheet
 *
 * @public
 * @type {Object}
 */
FXRenderer.ANIMATION = {
    CLOUD    : 0,
    EXPLOSION: 1
};
