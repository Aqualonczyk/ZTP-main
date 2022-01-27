
import { sprite } from "zcanvas";

export default class ActorRenderer extends sprite
{
    /**
     * a renderer that represents the Actor actor on screen
     *
     * @constructor
     * @param {Actor} actor
     * @param {RenderController} renderController
     */
    constructor( actor, renderController ) {
        super({
            x      : actor.x,
            y      : actor.y,
            width  : actor.width,
            height : actor.height
        });

        /* instance properties */

        /**
         * @protected
         * @type {Actor}
         */
        this.actor = actor;

        /**
         * @protected
         * @type {RenderController}
         */
        this.renderController = renderController;

        /**
         * whether this renderer can show rumble
         * @type {boolean}
         */
        this.canRumble = false;

        /**
         * @type {{ lastLayer: number }}
         */
        this.cache = {
            lastLayer: NaN
        };

        /* initialization */

        actor.renderer = this;
    }

    /* public methods */

    update() {

        const actor  = this.actor;
        const bounds = this._bounds;

        // cache render parameters

        bounds.left = ( actor.x + actor.offsetX );
        bounds.top  = ( actor.y + actor.offsetY );

        if ( actor.layer !== this.cache.lastLayer ) {
            bounds.width  = actor.width;
            bounds.height = actor.height;

            this.cache.lastLayer = actor.layer;
        }

        // update spritesheet animation

        if ( this._animation ) {
            this.updateAnimation();
        }
    }

    /**
     * @override
     * @param {CanvasRenderingContext2D} aCanvasContext
     */
    draw( aCanvasContext ) {

        // apply rumble when applicable

        if ( this.canRumble ) {
            const rumbleObject = this.renderController.rumbling;
            if ( rumbleObject.active === true ) {
                this._bounds.left -= rumbleObject.x;
                this._bounds.top  -= rumbleObject.y;
            }
        }
        super.draw( aCanvasContext );
        /*
        if ( process.env.NODE_ENV === "development" ) {
            this.debug( aCanvasContext );
        }
        */
    }

    /* protected methods */

    /**
     * can be called from the draw()-method to show the
     * collidable bounding box around this Actor
     *
     * @protected
     * @param {CanvasRenderingContext2D} aCanvasContext
     */
    debug( aCanvasContext ) {
        aCanvasContext.strokeStyle = "#FF0000";
        aCanvasContext.lineWidth = 2;

        const hitBox = this.actor.hitBox;

        aCanvasContext.strokeRect(
            hitBox.left, hitBox.top,
            hitBox.right  - hitBox.left,
            hitBox.bottom - hitBox.top
        );
    }
}
