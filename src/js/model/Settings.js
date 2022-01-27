
const STORAGE_KEY = "gme.settings";
let configuration;

/**
 * model that manages the list of
 * high scores within LocalStorage
 */
const Settings = {

    /**
     * Storable properties
     */
    PROPS: {
        HAS_PLAYED  : "hp",
        MUSIC_ON    : "me"
    },

    /**
     * initialize the model, this also
     * fetches previously stored settings from LocalStorage
     */
    init() {
        retrieve();
    },

    /**
     * retrieve a setting from the configuration
     *
     * @param {string} property name of property to retrieve
     * @return {*}
     */
    get( property ) {
        return configuration[ property ];
    },

    /**
     * saves given property and its value into the
     * configuration
     *
     * @param {string} property
     * @param {*} value
     */
    set( property, value ) {
        configuration[ property ] = value;
        save();
    }
};
export default Settings;

function retrieve() {
    try {
        const data = localStorage.getItem( STORAGE_KEY );
        if ( data ) {
            configuration = JSON.parse( data );
            return;
        }
    }
    catch ( e ) {}
    configuration = createDefaultConfiguration();
}

function save() {
    try {
        localStorage.setItem( STORAGE_KEY, JSON.stringify( configuration ));
        return true;
    }
    catch ( e ) {}
    return false;
}

function createDefaultConfiguration() {
    const out = {};

    out[ Settings.PROPS.HAS_PLAYED ] = false;
    // note we mute audio when in local dev mode
    out[ Settings.PROPS.MUSIC_ON ]   = process.env.NODE_ENV !== "development";

    return out;
}
