"use strict";
var memory = require("./memory");
var utils_1 = require("./utils");
var registers = {
    0x0a: 'gp1',
    0x0b: 'gp2',
    0x0c: 'gp3',
    0x0d: 'gp4',
    0x0e: 'gp5',
    0x0f: 'gp6',
    0x10: 'gp7',
    0x11: 'gp8',
    0x12: 'gp9',
    0x13: 'err',
    0x14: 'sp',
    0x15: 'eip'
};
function opcodes(mem, cpu) {
    return {
        0x00: function () {
            console.log("nop");
        },
        0x01: function (reg, ptr) {
            var source = registers[reg];
            memory.copy8(mem, ptr, cpu[source]);
            console.log("movrm8 $" + source + " -> *" + utils_1.format32(ptr));
        },
        0x02: function (reg, ptr) {
            var source = registers[reg];
            memory.copy16(mem, ptr, cpu[source]);
            console.log("movrm16 $" + source + " -> *" + utils_1.format32(ptr));
        },
        0x03: function (reg, ptr) {
            var source = registers[reg];
            memory.copy32(mem, ptr, cpu[source]);
            console.log("movrm32 $" + source + " -> *" + utils_1.format32(ptr));
        },
        0x04: function (val, reg) {
            var target = registers[reg];
            cpu[target] = val & 0xff;
            console.log("movr8 " + utils_1.format8(val) + " -> $" + target);
        },
        0x05: function (val, reg) {
            var target = registers[reg];
            cpu[target] = val & 0xffff;
            console.log("movr16 " + utils_1.format16(val) + " -> $" + target);
        },
        0x06: function (val, reg) {
            var target = registers[reg];
            cpu[target] = val;
            console.log("movr32 " + utils_1.format32(val) + " -> $" + target);
        },
        0x07: function (val, ptr) {
            memory.copy8(mem, ptr, val);
            console.log("movm8 " + utils_1.format8(val) + " -> *" + utils_1.format32(ptr));
        },
        0x08: function (val, ptr) {
            memory.copy16(mem, ptr, val);
            console.log("movm16 " + utils_1.format16(val) + " -> *" + utils_1.format32(ptr));
        },
        0x09: function (val, ptr) {
            memory.copy32(mem, ptr, val);
            console.log("movm32 " + utils_1.format32(val) + " -> *" + utils_1.format32(ptr));
        },
        0x0a: function () {
            console.log("hlt");
        },
        0x0b: function (ptr) {
            cpu.eip = ptr;
            console.log("jmp *" + utils_1.format32(ptr));
        },
        0x0c: function (ptr) {
            if (cpu.gp1 != 0x00) {
                cpu.eip = ptr;
            }
            console.log("jnz *" + utils_1.format32(ptr));
        },
        0x10: function (reg1, reg2) {
            var target1 = registers[reg1];
            var target2 = registers[reg2];
            cpu[target1] = cpu[target1] + cpu[target2];
            console.log("add $" + target1 + ", $" + target2);
        }
    };
}
exports.opcodes = opcodes;
;
//# sourceMappingURL=opcodes.js.map