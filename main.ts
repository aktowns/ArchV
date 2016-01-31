/*
    ArchV a toy cpu architecture in typescript 
*/

import * as memory          from "./ArchV/memory";
import * as processor       from "./ArchV/processor";
import {assert, format32}   from "./ArchV/utils";

function checkMem32(mem: memory.Memory, ptr: number, val: number) {
    var rawmem = memory.read32(mem, 0);
    console.log("\x1b[36m", format32(rawmem), "\x1b[0m");

    assert(rawmem == val, `checkMem32: ${format32(rawmem)} != ${format32(val)}`);
}

var cpu = new processor.CPU();
var mem = memory.create(1024*10); // 10kb

memory.copy32(mem, 0, 0xbadc0ffe);

checkMem32(mem, 0x00000000, 0xbadc0ffe); // *0x00000000 => 0xbadc0ffe

var sys = new processor.System(cpu, mem);

/* 
    The basics
*/

// mov* and friends
var program: [number] = [
    0x01, 0x0a, 0x00, 0x00, 0x00, 0x00, // movrm8 gp1, *0x00000000
    0x04, 0xde, 0x0a,                   // movr8 0xde, gp1
    0x01, 0x0a, 0x00, 0x00, 0x00, 0x00, // movrm8 gp1, *0x00000000
    0x0a                                // hlt
]
sys.load(program, 0x1000);
sys.start(0x1000);

checkMem32(mem, 0x00000000, 0xdedc0ffe); // *0x00000000 => 0xdedc0ffe

// -

program = [
    0x04, 0xad, 0x0a,                   // movr8 0xad, gp1
    0x01, 0x0a, 0x00, 0x00, 0x00, 0x01, // movrm8 gp1, *0x00000001
    0x0a                                // hlt
]

sys.load(program, 0x1000);
sys.start(0x1000);

checkMem32(mem, 0x00000000, 0xdead0ffe); // *0x00000000 => 0xdead0ffe

// -

program = [
    0x05, 0xbe, 0xef, 0x0a,             // movr16 0xbeef, gp1
    0x02, 0x0a, 0x00, 0x00, 0x00, 0x02, // movrm16 gp1, *0x00000002
    0x0a                                // hlt
]

sys.load(program, 0x1000);
sys.start(0x1000);

checkMem32(mem, 0x00000000, 0xdeadbeef); // *0x00000000 => 0xdeadbeef

sys.reboot();

// -

program = [
    0x04, 0xb0, 0x0a,                   // movr8 0xb0, gp1
    0x04, 0x0b, 0x0b,                   // movr8 0x0b, gp2
    0x01, 0x0a, 0x00, 0x00, 0x00, 0x00, // movrm8 gp1, *0x00000000
    0x01, 0x0b, 0x00, 0x00, 0x00, 0x01, // movrm8 gp2, *0x00000001
    0x01, 0x0a, 0x00, 0x00, 0x00, 0x02, // movrm8 gp1, *0x00000002
    0x01, 0x0b, 0x00, 0x00, 0x00, 0x03, // movrm8 gp2, *0x00000003
    0x0a                                // hlt
];

sys.load(program, 0x1000);
sys.start(0x1000);

checkMem32(mem, 0x00000000, 0xb00bb00b); // *0x00000000 => 0xb00bb00b

sys.reboot();

// -

program = [
    0x06, 0xca, 0xfe, 0xba, 0xbe, 0x0a, // movr32 0xcafebabe, gp1 
    0x03, 0x0a, 0x00, 0x00, 0x00, 0x00, // movrm32 gp1, *0x00000000
    0x0a                                // hlt
]

sys.load(program, 0x1000);
sys.start(0x1000);

checkMem32(mem, 0x00000000, 0xcafebabe); // *0x00000000 => 0xcafebabe

sys.reboot();

// -

program = [
    0x09, 0x1a, 0xbe, 0x11, 0xed, 0x00, 0x00, 0x00, 0x00, // movm32 0x1abe11ed, *0x00000000
    0x0a                                                  // hlt
]

sys.load(program, 0x1000);
sys.start(0x1000);

checkMem32(mem, 0x00000000, 0x1abe11ed); // *0x00000000 => 0x1abe11ed

sys.reboot();

// some program code padded with nops to align to 8 byte boundaries for display

/*
  Conditionals
*/
// jmp
program = [
    /* 0x00001000 */ 0x0b, 0x00, 0x00, 0x10, 0x10, 0x00, 0x00, 0x00, // jmp *0x00001010 
    /* 0x00001008 */ 0x04, 0x99, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, // movr8 99, gp1
    /* 0x00001010 */ 0x04, 0x33, 0x0b, 0x00, 0x00, 0x00, 0x00, 0x00, // movr8 33, gp2
    /* 0x00001018 */ 0x0b, 0x00, 0x00, 0x10, 0x28, 0x00, 0x00, 0x00, // jmp *0x00001028
    /* 0x00001020 */ 0x04, 0x99, 0x0d, 0x00, 0x00, 0x00, 0x00, 0x00, // movr8 99, gp4 
    /* 0x00001028 */ 0x04, 0x44, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x00, // movr8 44, gp3
    /* 0x00001030 */ 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // hlt 
]

sys.load(program, 0x1000);
sys.start(0x1000);

cpu.print_registers(); // gp1 == 0, gp2 == 33, gp3 == 44, gp4 == 0

assert(cpu.gp1 == 0x00, "gp1 != 0x00");
assert(cpu.gp2 == 0x33, "gp2 != 0x33");
assert(cpu.gp3 == 0x44, "gp3 != 0x44");
assert(cpu.gp4 == 0x00, "gp4 != 0x00");

sys.reboot();

// jnz 
program = [
    /* 0x00001000 */ 0x04, 0x01, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, // movr8 1, gp1 
    /* 0x00001008 */ 0x0c, 0x00, 0x00, 0x10, 0x18, 0x00, 0x00, 0x00, // jnz *0x00001017
    /* 0x00001010 */ 0x04, 0x99, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, // movr8 99, gp1
    /* 0x00001018 */ 0x04, 0x33, 0x0b, 0x00, 0x00, 0x00, 0x00, 0x00, // movr8 33, gp2
    /* 0x00001020 */ 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // hlt 
]

sys.load(program, 0x1000);
sys.start(0x1000);

cpu.print_registers(); // gp1 == 0x01, gp2 == 33

assert(cpu.gp1 == 0x01, "gp1 != 0x01");
assert(cpu.gp2 == 0x33, "gp2 != 0x33");

sys.reboot();

/* 
    Maths
*/
// addr
program = [
    /* 0x00001000 */ 0x04, 0x10, 0x0a, 0x00, // movr8 10, gp1
    /* 0x00001004 */ 0x04, 0x10, 0x0b, 0x00, // movr8 10, gp2 
    /* 0x00001008 */ 0x10, 0x0a, 0x0b, 0x00, // addr gp1, gp2
    /* 0x0000100b */ 0x0a, 0x00, 0x00, 0x00, // hlt
]

sys.load(program, 0x1000);
sys.start(0x1000);

cpu.print_registers(); // gp1 == 20, gp2 == 10

assert(cpu.gp1 == 0x20, "gp1 != 0x20");
assert(cpu.gp2 == 0x10, "gp2 != 0x10");

sys.reboot();

// addr 32bit values
program = [
    /* 0x00001000 */ 0x06, 0x00, 0x00, 0x05, 0x78, 0x0a, 0x00, 0x00, // movr32 1400, gp1
    /* 0x00001008 */ 0x06, 0x00, 0x00, 0x0d, 0x48, 0x0b, 0x00, 0x00, // movr32 3400, gp2 
    /* 0x00001010 */ 0x10, 0x0a, 0x0b, 0x00, 0x00, 0x00, 0x00, 0x00, // addr gp1, gp2
    /* 0x00001018 */ 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00  // hlt
]

sys.load(program, 0x1000);
sys.start(0x1000);

cpu.print_registers(); // gp1 == 20, gp2 == 10

assert(cpu.gp1 == 0x12c0, "gp1 != 0x12c0"); // 4800
assert(cpu.gp2 == 0x0d48, "gp2 != 0x0d48");
