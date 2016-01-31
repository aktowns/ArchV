import * as memory      from "./memory";
import * as processor   from "./processor";
import {format8, format16, format32} from "./utils";

var registers: { [opcode: number]: string; } = {
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

export function opcodes (mem: memory.Memory, cpu: processor.CPU): { [opcode: number]: any; } { 
    return {
        0x00: function () {
            console.log("nop");    
        },
        0x01: function (reg: processor.Register, ptr: number) { // movrm8 reg, memory
            var source = registers[reg];
            memory.copy8(mem, ptr, cpu[source]);
            
            console.log(`movrm8 $${source} -> *${format32(ptr)}`);
        },
        0x02: function (reg: processor.Register, ptr: number) { // movrm16 reg, memory
            var source = registers[reg];
            memory.copy16(mem, ptr, cpu[source]);
            
            console.log(`movrm16 $${source} -> *${format32(ptr)}`);
        },
        0x03: function (reg: processor.Register, ptr: number) { // movrm32 reg, memory
            var source = registers[reg];
            memory.copy32(mem, ptr, cpu[source]);
            
            console.log(`movrm32 $${source} -> *${format32(ptr)}`);
        },
        0x04: function (val: number, reg: processor.Register) { // movr8 val, reg
            var target = registers[reg];
            cpu[target] = val & 0xff;
            
            console.log(`movr8 ${format8(val)} -> $${target}`);
        },
        0x05: function (val: number, reg: processor.Register) { // movr16 val, reg
            var target = registers[reg];
            cpu[target] = val & 0xffff;
            
            console.log(`movr16 ${format16(val)} -> $${target}`);
        },
        0x06: function (val: number, reg: processor.Register) { // movr32 val, reg
            var target = registers[reg];
            cpu[target] = val;
            
            console.log(`movr32 ${format32(val)} -> $${target}`);
        },
        0x07: function (val: number, ptr: number) { // movm8 val, memory
            memory.copy8(mem, ptr, val);
            
            console.log(`movm8 ${format8(val)} -> *${format32(ptr)}`);
        },
        0x08: function (val: number, ptr: number) { // movm16 val, memory
            memory.copy16(mem, ptr, val);
            
            console.log(`movm16 ${format16(val)} -> *${format32(ptr)}`);
        },
        0x09: function (val: number, ptr: number) { // movm32 val, memory
            memory.copy32(mem, ptr, val);
            
            console.log(`movm32 ${format32(val)} -> *${format32(ptr)}`);
        },
        0x0a: function () { // hlt
            console.log("hlt");
        },
        0x0b: function (ptr: number) { // jmp memory
            cpu.eip = ptr;
            
            console.log(`jmp *${format32(ptr)}`);
        }, 
        0x0c: function (ptr: number) { // jnz memory
            if (cpu.gp1 != 0x00) {
                cpu.eip = ptr;
            }
            
            console.log(`jnz *${format32(ptr)}`);
        },
        0x10: function (reg1: processor.Register, reg2: processor.Register) { // add reg, reg
            var target1 = registers[reg1];
            var target2 = registers[reg2];
            cpu[target1] = cpu[target1] + cpu[target2]
            
            console.log(`add $${target1}, $${target2}`);
        }
    };
};