
const assetRoot  = "./assets/";
const spriteRoot = `${assetRoot}images/sprites/`;

/**
 * All assets used in the game, e.g. graphics and sound effects.
 * The image elements are appended by the AssetService during application start, these
 * image elements can be reused by all renderers (zCanvas.sprites) without the need
 * for them to each allocate a unique image per sprite type.
 */
export default {
    GRAPHICS: {
        POWERUP      : { src: `${spriteRoot}spritesheet_powerups.png`, img: null },
        SHIP         : { src: `${spriteRoot}spritesheet_ship.png`,     img: null },
        BOSS         : { src: `${spriteRoot}spritesheet_boss.png`,     img: null },
        FX           : { src: `${spriteRoot}spritesheet_fx.png`,       img: null },
        WATER        : { src: `${spriteRoot}spritesheet_water.png`,    img: null },
        SKY          : { src: `${spriteRoot}clouds.png`,               img: null },
        BULLET       : { src: `${spriteRoot}bullet.png`,               img: null },
        TILE         : { src: `${spriteRoot}tile.png`,                 img: null },
        ISLAND       : { src: `${spriteRoot}tilesheet_island.png`,     img: null }
    },

    AUDIO: {
        AU_EXPLOSION : `${assetRoot}sounds/explosion.mp3`,
        AU_LASER     : `${assetRoot}sounds/laser.mp3`
    }
};
