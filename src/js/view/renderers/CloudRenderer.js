
import { sprite } from "zcanvas";
import Config     from "@/config/Config";
import Assets     from "@/definitions/Assets";

export default class CloudRenderer extends sprite
{
    /**
     * a renderer that draws some pretty nice lookin' sky details
     * there is no Actor for this renderer, it's merely decorative !
     *
     * @constructor
     * @param {number} x
     * @param {number} y
     * @param {number=} speed
     * @param {number=} scale
     */
    constructor( x, y, speed, scale ) {

        scale = ( typeof scale === "number" ) ? scale : 1;

        super({ x, y, width: 300 * scale, height: 508 * scale, bitmap: Assets.GRAPHICS.SKY.img });

        /* instance properties */

        /**
         * @public
         * @type {number}
         */
        this.speed = ( typeof speed === "number" ) ? speed : 1;
    }

    /* public methods */

    // draw( aCanvasContext ) {
    //     // there is no associated Actor for a tile, run the update logic
    //     // inside the draw method

    //     this._bounds.top += this.speed;
    //     // when moving out of the screen reset position to the top
    //     if ( this._bounds.top > this.canvas.getHeight() ) {
    //         this._bounds.top = -this._bounds.height;
    //         this._bounds.left = Math.round( Math.random() * this.canvas.getWidth() );
    //     }
    //     super.draw( aCanvasContext );
    // }
}
