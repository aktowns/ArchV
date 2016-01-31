"use strict";
var utils_1 = require("./utils");
function copy8(mem, pos, val) {
    utils_1.assert(utils_1.isUInt8(pos), "width of val larger than int8");
    mem[pos] = val & 0xff;
}
exports.copy8 = copy8;
function copy16(mem, pos, val) {
    utils_1.assert(utils_1.isUInt16(pos), "width of val larger than int16");
    mem[pos] = (val >> 8 & 0xff);
    mem[pos + 1] = (val & 0xff);
}
exports.copy16 = copy16;
function copy32(mem, pos, val) {
    utils_1.assert(utils_1.isUInt32(pos), "width of val larger than int32");
    mem[pos] = (val >> 24 & 0xff);
    mem[pos + 1] = (val >> 16 & 0xff);
    mem[pos + 2] = (val >> 8 & 0xff);
    mem[pos + 3] = (val & 0xff);
}
exports.copy32 = copy32;
function copy(mem, pos, val) {
    mem.set(val, pos);
}
exports.copy = copy;
function clear(mem) {
    mem.fill(0x00);
}
exports.clear = clear;
function read8(mem, pos) {
    return mem[pos];
}
exports.read8 = read8;
function read16(mem, pos) {
    return (mem[pos] << 8 | mem[pos + 1]) >>> 0;
}
exports.read16 = read16;
function read32(mem, pos) {
    return (mem[pos] << 24 |
        mem[pos + 1] << 16 |
        mem[pos + 2] << 8 |
        mem[pos + 3]) >>> 0;
}
exports.read32 = read32;
function create(size) {
    return new Uint8Array(size);
}
exports.create = create;
//# sourceMappingURL=memory.js.map