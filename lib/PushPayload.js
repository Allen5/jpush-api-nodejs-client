/**
 * PushPayload
 */

var JError = require('./JPushError');
var JUtil = require('./util');



/**
 * PushPayload constructor
 * @param client
 * @constructor
 */
function PushPayload(client) {
    this.client = client;
    this.payload = {};
}



/**
 * platform setter
 * @returns {setPlatform}
 */
function setPlatform() {
    if (arguments.length < 1) {
        throw new JError.InvalidArgumentError("platform's args cannot all be null");
    }
    var platform;
    if (arguments.length == 1 && arguments[0] === ALL) {
        platform = ALL;
    } else {
        platform = [];
        for(var i=0; i<arguments.length; i++) {
            if (VALID_DEVICE_TYPES.indexOf(arguments[i]) != -1) {
                if (platform.indexOf(arguments[i]) == -1) {
                    platform.push(arguments[i]);
                }
            } else {
                throw new JError.InvalidArgumentError("Invalid device type '" + arguments[i] + "', platform can only be set to 'android', 'ios' or 'winphone'");
            }
        }
    }
    this.payload = JUtil.extend(this.payload, {'platform' : platform});
    return this;
}



/**
 * general audience builder
 * @param args
 * @param title
 * @returns {Array}
 */
function buildAudience(args, title) {
    if (args.length < 1) {
        throw new JError.InvalidArgumentError("Should be set at least ont " + title);
    }
    var payload = new Array();
    if (args.length == 1 && typeof args[0] === 'string') {
        var tags_t = args[0].split(',');
        for (var i=0; i<tags_t.length; i++) {
            if (tags_t[i].trim().length > 0) {
                payload.push(tags_t[i].trim());
            }
        }
        if (payload.length < 1) {
            throw new JError.InvalidArgumentError("Should be set at least ont " + title);
        }
    } else if (args.length == 1 && Array.isArray(args[0])) {
        for (var i=0; i< args[0].length; i++) {
            if (typeof args[0][i] != 'string') {
                throw new JError.InvalidArgumentError("Invalid " + title + ' at index ' + i + ', ' +  title + ' can only be set to the String');
            }
            payload.push(args[0][i]);
        }
    } else {
        for (var i=0; i<args.length; i++) {
            if (typeof args[i] != 'string') {
                throw new JError.InvalidArgumentError("Invalid " + title + ' at argument ' + i + ', ' +  title + ' can only be set to the String');
            }
            payload.push(args[i]);
        }
    }
    return payload;
}

/**
 * alias builder
 * @returns {{alias: Array}}
 */
function alias() {
    return {'alias' : buildAudience(arguments, 'alias')};
}

/**
 * tag builder
 * @returns {{tag: Array}}
 */
function tag() {
    return {'tag' : buildAudience(arguments, 'tag')};
}

/**
 * tag_and builder
 * @returns {{tag_and: Array}}
 */
function tag_and() {
    return {'tag_and' : buildAudience(arguments, 'tag_and')};
}

/**
 * registration_id builder
 * @returns {{registration_id: Array}}
 */
function registration_id () {
    return {'registration_id' : buildAudience(arguments, 'registration_id')};
}

/**
 * audience setter
 * @returns {setAudience}
 */
function setAudience() {
    if (arguments.length < 1) {
        throw new JError.InvalidArgumentError("audience must be set");
    }
    var audience;
    if (arguments.length  == 1 && arguments[0] === ALL) {
        audience = ALL;
    } else {
        audience = {};
        for (var i=0; i<arguments.length; i++) {
            audience = JUtil.extend(audience, arguments[i]);
        }
    }
    this.payload = JUtil.extend(this.payload, {'audience' : audience});
    return this;
}

/**
 * android notification builder
 * @param alert
 * @param title
 * @param builder_id
 * @param extras
 * @returns {{android: {alert: *}}}
 */
function android(alert, title, builder_id, extras) {
    if (!alert || typeof alert != 'string') {
        throw new JError.InvalidArgumentError("android.alert is require and can only be set to the String");
    }
    var android = {'alert' : alert};

    if (title != null) {
        if (typeof title != 'string') {
           throw new JError.InvalidArgumentError("Invalid android.title, it can only be set to the String");
        }
        android['title'] = title;
    }

    if (builder_id != null) {
        if (typeof builder_id != 'number') {
            throw new JError.InvalidArgumentError("Invalid android.builder_id, it can only be set to the Number");
        }
        android['builder_id'] = builder_id;
    }

    if (extras != null) {
        if (typeof extras != 'object') {
            throw new JError.InvalidArgumentError("Invalid android.extras");
        }
        android['extras'] = extras;
    }
    return {'android' : android};
}

/**
 * ios notification builder
 * @param alert
 * @param sound
 * @param badge
 * @param contentAvailable
 * @param extras
 * @returns {{ios: {alert: *}}}
 */
function ios(alert, sound, badge, contentAvailable, extras) {
    if (!alert || typeof alert != 'string') {
        throw new JError.InvalidArgumentError("ios.alert is require and can only be set to the String");
    }
    var ios = {'alert' : alert};

    if (sound != null) {
        if (typeof sound != 'string') {
            throw new JError.InvalidArgumentError("Invalid ios.sound, it can only be set to the String");
        }
        if (sound != DISABLE_SOUND) {
            ios['sound'] = sound;
        }
    } else {
        ios['sound'] = "";
    }

    if (badge != null) {
        if (typeof badge != 'number') {
            throw new JError.InvalidArgumentError("Invalid ios.badge, it can only be set to the Number");
        }
        ios['badge'] = badge;
    } else {
        ios['badge'] = 1;
    }

    if (contentAvailable != null) {
        if (typeof contentAvailable != 'boolean') {
            throw new JError.InvalidArgumentError("Invalid ios.contentAvailable, it can only be set to the Boolean");
        }
        if (contentAvailable) {
            ios['content-available'] = 1;
        }
    }

    if (extras != null) {
        if (typeof extras != 'object') {
            throw new JError.InvalidArgumentError("Invalid ios.extras");
        }
        ios['extras'] = extras;
    }
    return {"ios" : ios};
}

/**
 * winphone notification builder
 * @param alert
 * @param title
 * @param openPage
 * @param extras
 * @returns {{winphone: {alert: *}}}
 */
function winphone(alert, title, openPage, extras) {
    if (!alert || typeof alert != 'string') {
        throw new JError.InvalidArgumentError("winphone.alert is require and can only be set to the String");
    }

    var winphone = {'alert' : alert};

    if (title != null) {
        if (typeof title != 'string') {
            throw new JError.InvalidArgumentError("Invalid winphone.title, it can only be set to the String");
        }
        winphone['title'] = title;
    }

    if (openPage != null) {
        if (typeof openPage != 'string') {
            throw new JError.InvalidArgumentError("Invalid winphone.openPage, it can only be set to the String");
        }
        winphone['_open_page'] = openPage;
    }

    if (extras != null) {
        if (typeof extras != 'object') {
            throw new JError.InvalidArgumentError("Invalid winphone.extras");
        }
        winphone['extras'] = extras;
    }

    return {'winphone' : winphone};
}

/**
 * notification setter
 * @returns {setNotification}
 */
function setNotification() {
    if (arguments.length < 1) {
        throw new JError.InvalidArgumentError("Invalid notification");
    }
    var notification = {};
    var offset = 0;
    if (typeof arguments[0] === 'string') {
        notification['alert'] = arguments[0];
        offset = 1;
    }
    for (; offset < arguments.length; offset++) {
        if (typeof arguments[offset] != 'object') {
            throw new JError.InvalidArgumentError("Invalid notification argument at index " + offset);
        }
        notification = JUtil.extend(notification, arguments[offset]);
    }

    this.payload = JUtil.extend(this.payload, {'notification' : notification});
    return this;
}

/**
 * message setter
 * @param msg_content
 * @param title
 * @param content_type
 * @param extras
 * @returns {setMessage}
 */
function setMessage(msg_content, title, content_type, extras) {
    if (msg_content == null || typeof msg_content != 'string') {
        throw new JError.InvalidArgumentError("message.msg_content is require and can only be set to the String");
    }
    var message = {'msg_content' : msg_content};

    if (title != null) {
        if (typeof title !== 'string') {
            throw new JError.InvalidArgumentError("Invalid message.title, it can only be set to the String");
        }
        message['title'] = title;
    }

    if (content_type != null) {
        if (typeof content_type !== 'string') {
            throw new JError.InvalidArgumentError("Invalid message.content_type, it can only be set to the String");
        }
        message['content_type'] = content_type;
    }

    if (extras != null) {
        if (typeof extras != 'object') {
            throw new JError.InvalidArgumentError("Invalid message.extras");
        }
        message['extras'] = extras;
    }

    this.payload = JUtil.extend(this.payload, {'message' : message});
    return this;
}

/**
 * create random sendno
 * @returns {number}
 */
function generateSendno() {
    return(MIN_SENDNO + Math.round(Math.random() * (MAX_SENDNO - MIN_SENDNO)));
}

/**
 * options setter
 * @param sendno
 * @param time_to_live
 * @param override_msg_id
 * @param apns_production
 * @returns {setOptions}
 */
function setOptions(sendno, time_to_live, override_msg_id, apns_production) {
    if (sendno == null && time_to_live == null && override_msg_id == null && apns_production == null) {
        throw new JError.InvalidArgumentError("option's args cannot all be null.");
    }
    var options = {};

    if (sendno != null) {
        if (typeof sendno !== 'number') {
            throw new JError.InvalidArgumentError("Invalid options.sendno, it can only be set to the Number");
        }
        options['sendno'] = sendno;
    } else {
        options['sendno'] = generateSendno();
    }

    if (time_to_live != null) {
        if (typeof time_to_live !== 'number') {
            throw new JError.InvalidArgumentError("Invalid options.time_to_live, it can only be set to the Number");
        }
        options['time_to_live'] = time_to_live;
    }

    if (override_msg_id != null) {
        if (typeof override_msg_id !== 'number') {
            throw new JError.InvalidArgumentError("Invalid options.override_msg_id, it can only be set to the Number");
        }
        options['override_msg_id'] = override_msg_id;
    }

    if (apns_production != null) {
        if (typeof apns_production !== 'boolean') {
            throw new JError.InvalidArgumentError("Invalid options.apns_production, it can only be set to the Boolean");
        }
        options['apns_production'] = apns_production;
    }

    this.payload = JUtil.extend(this.payload, {'options' : options});
    return this;

}

function toJSON() {
    return JSON.stringify(this.platform);
}

function send() {


}

function stringToBytes(str) {
    var ch, st, re = [];
    for (var i = 0; i < str.length; i++ ) {
        ch = str.charCodeAt(i);
        st = [];
        do {
            st.push( ch & 0xFF );
            ch = ch >> 8;
        }
        while ( ch );
        re = re.concat( st.reverse() );
    }
    // return an array of bytes
    return re;
}


// ------ PushPayload prototype
PushPayload.prototype.setPlatform = setPlatform;
PushPayload.prototype.setAudience = setAudience;
PushPayload.prototype.setNotification = setNotification;
PushPayload.prototype.setMessage = setMessage;
PushPayload.prototype.setOptions = setOptions;
PushPayload.prototype.toJSON = toJSON;
PushPayload.prototype.send = send;

// ------ private constant define ------
var VALID_DEVICE_TYPES = ["ios", "android", "winphone"];
var DISABLE_SOUND = 'DISABLE_SOUND'
var MIN_SENDNO = 100000;
var MAX_SENDNO = 4294967294;

// ------ public constant define -------
exports.ALL = 'all';


// ------ public methods
exports.tag = tag;
exports.tag_and = tag_and;
exports.alias = alias;
exports.registration_id = registration_id;

// ----- public class ------
exports.PushPayload = PushPayload;





// ------ test ------
var payload = new PushPayload(null);
payload.setAudience(tag('tag1', 'tag2'), alias('alias1,alias2'), registration_id('id1, id2,'))
    .setPlatform('ios', 'winphone')
    .setNotification("alert all",android('android alert'), ios('ios alert'))
    .setMessage('msg_content', 'msg_title', null, {'key': 'value'})
    .setOptions(123456, 60, 654321, false);
console.log(JSON.stringify(payload.payload));

console.log(generateSendno());

/*
var json = winphone('android alert', 'title', null, {'key': 'value'});
console.log(JSON.stringify(json));
*/




