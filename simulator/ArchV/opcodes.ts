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
    0x15: 'eip',
    0x16: 'zf'
};

export function opcodes (mem: memory.Memory, cpu: processor.CPU): { [opcode: number]: any; } { 
    return {
        // nop
        0x00: () => {
            // console.log("nop");    
        },
        // movrm8 reg, memory
        0x01: (reg: processor.Register, ptr: number) => { 
            var source = registers[reg];
            memory.copy8(mem, ptr, cpu[source]);
            
            console.log(`movrm8 $${source} -> *${format32(ptr)}`);
        },
        // movrm16 reg, memory
        0x02: (reg: processor.Register, ptr: number) => { 
            var source = registers[reg];
            memory.copy16(mem, ptr, cpu[source]);
            
            console.log(`movrm16 $${source} -> *${format32(ptr)}`);
        },
        // movrm32 reg, memory
        0x03: (reg: processor.Register, ptr: number) => { 
            var source = registers[reg];
            memory.copy32(mem, ptr, cpu[source]);
            
            console.log(`movrm32 $${source} -> *${format32(ptr)}`);
        },
        // movr8 val, reg
        0x04: (val: number, reg: processor.Register) => { 
            var target = registers[reg];
            cpu[target] = val & 0xff;
            
            console.log(`movr8 ${format8(val)} -> $${target}`);
        },
        // movr16 val, reg
        0x05: (val: number, reg: processor.Register) => { 
            var target = registers[reg];
            cpu[target] = val & 0xffff;
            
            console.log(`movr16 ${format16(val)} -> $${target}`);
        },
        // movr32 val, reg
        0x06: (val: number, reg: processor.Register) => { 
            var target = registers[reg];
            cpu[target] = val;
            
            console.log(`movr32 ${format32(val)} -> $${target}`);
        },
        // movm8 val, memory
        0x07: (val: number, ptr: number) => { 
            memory.copy8(mem, ptr, val);
            
            console.log(`movm8 ${format8(val)} -> *${format32(ptr)}`);
        },
        // movm16 val, memory
        0x08: (val: number, ptr: number) => { 
            memory.copy16(mem, ptr, val);
            
            console.log(`movm16 ${format16(val)} -> *${format32(ptr)}`);
        },
        // movm32 val, memory
        0x09: (val: number, ptr: number) => { 
            memory.copy32(mem, ptr, val);
            
            console.log(`movm32 ${format32(val)} -> *${format32(ptr)}`);
        },
        // hlt
        0x0a: () => {
            console.log("hlt");
        },
        // jmp memory
        0x0b: (ptr: number) => { 
            cpu.eip = ptr;
            
            console.log(`jmp *${format32(ptr)}`);
        }, 
        // jnz memory
        0x0c: (ptr: number) => { 
            if (cpu.zf == 0x00) {
                cpu.eip = ptr;
            }
            
            console.log(`jnz *${format32(ptr)}`);
        },
        // jz memory
        0x0d: (ptr: number) => {
            if (cpu.zf == 0x01) {
                cpu.eip = ptr;
            }

            console.log(`jz *${format32(ptr)}`);
        },
        // cmpr reg, reg
        0x0e: (reg1: processor.Register, reg2: processor.Register) => {
            var target1 = registers[reg1];
            var target2 = registers[reg2];
            
            cpu.zf = (cpu[target1] == cpu[target2]) ? 1 : 0;

            console.log(`cmpr *$${target1}, $${target2} ; js=${cpu.zf}`);
        },
        // add reg, reg
        0x10: (reg1: processor.Register, reg2: processor.Register) => {  
            var target1 = registers[reg1];
            var target2 = registers[reg2];
            cpu[target1] = cpu[target1] + cpu[target2]
            
            console.log(`add $${target1}, $${target2}`);
        }
    };
};
