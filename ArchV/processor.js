"use strict";
var utils_1 = require("./utils");
var memory = require("./memory");
var opcodes_1 = require("./opcodes");
var CPU = (function () {
    function CPU() {
        this._gp1 = 0;
        this._gp2 = 0;
        this._gp3 = 0;
        this._gp4 = 0;
        this._gp5 = 0;
        this._gp6 = 0;
        this._gp7 = 0;
        this._gp8 = 0;
        this._gp9 = 0;
        this._err = 0;
        this._sp = 0;
        this._eip = 0;
    }
    Object.defineProperty(CPU.prototype, "gp1", {
        get: function () { return this._gp1; },
        set: function (v) {
            utils_1.assert(utils_1.isUInt32(v), "register set larger than width");
            this._gp1 = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "gp2", {
        get: function () { return this._gp2; },
        set: function (v) {
            utils_1.assert(utils_1.isUInt32(v), "register set larger than width");
            this._gp2 = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "gp3", {
        get: function () { return this._gp3; },
        set: function (v) {
            utils_1.assert(utils_1.isUInt32(v), "register set larger than width");
            this._gp3 = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "gp4", {
        get: function () { return this._gp4; },
        set: function (v) {
            utils_1.assert(utils_1.isUInt32(v), "register set larger than width");
            this._gp4 = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "gp5", {
        get: function () { return this._gp5; },
        set: function (v) {
            utils_1.assert(utils_1.isUInt32(v), "register set larger than width");
            this._gp5 = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "gp6", {
        get: function () { return this._gp6; },
        set: function (v) {
            utils_1.assert(utils_1.isUInt32(v), "register set larger than width");
            this._gp6 = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "gp7", {
        get: function () { return this._gp7; },
        set: function (v) {
            utils_1.assert(utils_1.isUInt32(v), "register set larger than width");
            this._gp7 = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "gp8", {
        get: function () { return this._gp8; },
        set: function (v) {
            utils_1.assert(utils_1.isUInt32(v), "register set larger than width");
            this._gp8 = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "gp9", {
        get: function () { return this._gp9; },
        set: function (v) {
            utils_1.assert(utils_1.isUInt32(v), "register set larger than width");
            this._gp9 = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "err", {
        get: function () { return this._err; },
        set: function (v) {
            utils_1.assert(utils_1.isUInt32(v), "register set larger than width");
            this._err = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "sp", {
        get: function () { return this._sp; },
        set: function (v) {
            utils_1.assert(utils_1.isUInt32(v), "register set larger than width");
            this._sp = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CPU.prototype, "eip", {
        get: function () { return this._eip; },
        set: function (v) {
            utils_1.assert(utils_1.isUInt32(v), "register set larger than width");
            this._eip = v;
        },
        enumerable: true,
        configurable: true
    });
    CPU.prototype.clear = function () {
        this._gp1 = 0;
        this._gp2 = 0;
        this._gp3 = 0;
        this._gp4 = 0;
        this._gp5 = 0;
        this._gp6 = 0;
        this._gp7 = 0;
        this._gp8 = 0;
        this._gp9 = 0;
        this._err = 0;
        this._eip = 0;
        this._sp = 0;
    };
    CPU.prototype.print_registers = function () {
        console.log(("\n            gp1: " + utils_1.format32(this._gp1) + " gp2: " + utils_1.format32(this._gp2) + " gp3: " + utils_1.format32(this._gp3) + "\n            gp4: " + utils_1.format32(this._gp4) + " gp5: " + utils_1.format32(this._gp5) + " gp6: " + utils_1.format32(this._gp6) + "\n            gp7: " + utils_1.format32(this._gp7) + " gp8: " + utils_1.format32(this._gp8) + " gp9: " + utils_1.format32(this._gp9) + "\n            err: " + utils_1.format32(this._err) + "  sp: " + utils_1.format32(this._sp) + " eip: " + utils_1.format32(this._eip) + "\n        ").replace(/^\s+/mg, '').replace(/\n/g, ' '));
    };
    return CPU;
}());
exports.CPU = CPU;
var System = (function () {
    function System(cpu, memory) {
        this.cpu = cpu;
        this.memory = memory;
    }
    System.prototype.load = function (code, offset) {
        if (offset === void 0) { offset = 0x00; }
        memory.copy(this.memory, offset, code);
    };
    System.prototype.start = function (offset) {
        if (offset === void 0) { offset = 0x00; }
        this.cpu.eip = offset;
        this.process();
    };
    System.prototype.reboot = function () {
        this.cpu.clear();
        memory.clear(this.memory);
    };
    System.prototype.read8 = function () {
        return this.memory[this.cpu.eip++];
    };
    System.prototype.read16 = function () {
        return this.memory[this.cpu.eip++] << 8 | this.memory[this.cpu.eip++] & 0xffff;
    };
    System.prototype.read32 = function () {
        return (this.memory[this.cpu.eip++] << 24 |
            this.memory[this.cpu.eip++] << 16 |
            this.memory[this.cpu.eip++] << 8 |
            this.memory[this.cpu.eip++]) >>> 0;
    };
    System.prototype.process = function () {
        while (this.cpu.eip < this.memory.length) {
            var op = this.read8();
            var f = opcodes_1.opcodes(this.memory, this.cpu)[op];
            switch (op) {
                case 0x00:
                    f();
                    break;
                case 0x01:
                case 0x02:
                case 0x03:
                    f(this.read8(), this.read32());
                    break;
                case 0x04:
                    f(this.read8(), this.read8());
                    break;
                case 0x05:
                    f(this.read16(), this.read8());
                    break;
                case 0x06:
                    f(this.read32(), this.read8());
                    break;
                case 0x07:
                    f(this.read8(), this.read32());
                    break;
                case 0x08:
                    f(this.read16(), this.read32());
                    break;
                case 0x09:
                    f(this.read32(), this.read32());
                    break;
                case 0x0a:
                    f();
                    return;
                case 0x0b:
                case 0x0c:
                    f(this.read32());
                    break;
                case 0x10:
                    f(this.read8(), this.read8());
                    break;
                default:
                    throw new Error("unknown opcode " + utils_1.format8(op));
            }
        }
    };
    return System;
}());
exports.System = System;
//# sourceMappingURL=processor.js.map