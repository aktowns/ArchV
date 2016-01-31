"use strict";
function assert(ev, msg) {
    if (!ev) {
        throw new Error("Assertion Failed: " + msg);
    }
}
exports.assert = assert;
function isUInt8(val) {
    return (val >= 0 && val <= 255);
}
exports.isUInt8 = isUInt8;
function isUInt16(val) {
    return (val >= 0 && val <= 65535);
}
exports.isUInt16 = isUInt16;
function isUInt24(val) {
    return (val >= 0 && val <= 16777215);
}
exports.isUInt24 = isUInt24;
function isUInt32(val) {
    return (val >= 0 && val <= 4294967295);
}
exports.isUInt32 = isUInt32;
function format(inp, padding) {
    if (padding === void 0) { padding = ""; }
    var str = inp.toString(16);
    return "0x" + (padding + str).substring(str.length);
}
exports.format = format;
function format8(inp) {
    return format(inp, "00");
}
exports.format8 = format8;
function format16(inp) {
    return format(inp, "0000");
}
exports.format16 = format16;
function format32(inp) {
    return format(inp, "00000000");
}
exports.format32 = format32;
function toByteArray(val) {
    if (isUInt8(val)) {
        return [val];
    }
    else if (isUInt16(val)) {
        return [val >> 8 & 0xff,
            val & 0xff];
    }
    else if (isUInt24(val)) {
        return [val >> 16 & 0xff,
            val >> 8 & 0xff,
            val & 0xff];
    }
    else if (isUInt32(val)) {
        return [val >> 24 & 0xff,
            val >> 16 & 0xff,
            val >> 8 & 0xff,
            val & 0xff];
    }
    else {
        throw new Error("given val is > 32 bit");
    }
}
exports.toByteArray = toByteArray;
//# sourceMappingURL=utils.js.map