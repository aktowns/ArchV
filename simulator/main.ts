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

