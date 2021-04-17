const {
    Schema,
    model
} = require('mongoose');

const SettingSchema = new Schema({
    guildID: {
        type: String,
        required: true
    },
    settings: {
        type: Object
    }
});

const Setting = model('setting', SettingSchema);

module.exports = Setting;