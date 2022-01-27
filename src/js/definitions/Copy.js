
const Copy = {

    /**
     * copy can be either string, Array<string> or an Object
     * w/ separate "title" and "body" string (for
     * instance for displaying messages w/ title header)
     */
    BONUS      : "+{0} pts.",
    ENERGY     : "Energy restored",
    WEAPONS    : [ "Bullet", "Bullet spray", "Laser" ],
    NEXT_LEVEL : "Level {0}",

    TUTORIAL: {
        KEYBOARD: [
            { text: "Move your ship using the arrow keys (or WASD)", timeout: 0 },
            { text: "Press the spacebar to shoot",                   timeout: 5 },
            { text: "Use the Z key to change vertical plane",        timeout: 4 }
        ],
        TOUCH: [
            { text: "Steer your ship using the control stick on the bottom left", timeout: 0 },
            { text: "Press the right button to fire",                             timeout: 5 },
            { text: "Press the left button to change vertical plane",             timeout: 4 }
        ]
    },

    MUSIC: {
        title: "Now playing:",
        body : "{0} by {1}"
    },

    /**
     * @public
     * @param {string} copyKey of above enumeration
     * @param {string|Array<string>=} optDataReplacement with values to replace in above strings,
     *        either single string for single {0} replacement, or Array<string> for {0}, {1}, {2}, etc..
     * @return {string}
     */
    applyData( copyKey, optDataReplacement ) {

        const text = Copy[ copyKey ], isPrimitive = typeof text === "string";

        // create a deep copy of primitive values

        let titleData = ( isPrimitive ) ? text : text.title;
        let bodyData  = ( isPrimitive ) ? null : text.body;

        if ( Array.isArray( optDataReplacement )) {
            optDataReplacement.forEach(( replacement, index ) => {
                bodyData = bodyData.replace( `{${index}}`, replacement );
            });
        }
        else if ( typeof optDataReplacement === "string" || typeof optDataReplacement === "number" ) {
            titleData = titleData.replace( `{0}`, optDataReplacement );
        }
        return {
            title: titleData,
            body : bodyData
        };
    }
};
export default Copy;
