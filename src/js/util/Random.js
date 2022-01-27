

/**
 * convenience helper for all things associated
 * with chance and randomizing values :)
 */
const Random = {

    /**
     * random value at least equal to given min, and
     * with a multiplier for the game's current level to make the
     * value higher as the game progresses, for increased difficulty
     *
     * @param {number} min value to return
     * @param {number} level current game level
     * @param {number=} multiplier for the game level, defaults to 1
     */
    byLevel( min, level, multiplier = 1 ) {
        return Random.range( min, min + ( level * multiplier ));
    },

    /**
     * random value from given range
     * @param {number} min
     * @param {number} max
     * @return {number}
     */
    range( min, max ) {
        return Math.floor( Math.random() * ( max - min + 1 )) + min;
    },

    /**
     * random value from given Array
     * @param {Array<*>} array
     * @return {*}
     */
    from( array ) {
        return array[ Random.range( 0, array.length  -1 )];
    },

    /**
     * random boolean true/false
     * @return {boolean}
     */
    bool() {
        return Math.random() > .5;
    }
};
export default Random;
