import {assert, isUInt8, isUInt16, isUInt32} from "./utils"

export type Memory = Uint8Array;

export function copy8(mem: Memory, pos: number, val: number): void {
    assert(isUInt8(pos), "width of val larger than int8");
        
    mem[pos] = val & 0xff;
}

export function copy16(mem: Memory, pos: number, val: number): void {
    assert(isUInt16(pos), "width of val larger than int16");
    
    mem[pos]   = (val >> 8 & 0xff);
    mem[pos+1] = (val & 0xff);
}

export function copy32(mem: Memory, pos: number, val: number): void {
    assert(isUInt32(pos), "width of val larger than int32");
    
    mem[pos]   = (val >> 24 & 0xff);
    mem[pos+1] = (val >> 16 & 0xff); 
    mem[pos+2] = (val >>  8 & 0xff); 
    mem[pos+3] = (val & 0xff);
}

export function copy(mem: Memory, pos: number, val: [number]): void {
    mem.set(val, pos);
}

export function clear(mem: Memory) {
    mem.fill(0x00);
}

export function read8(mem: Memory, pos: number): number {
    return mem[pos];
}

export function read16(mem: Memory, pos: number): number {
    return (mem[pos] << 8 | mem[pos+1]) >>> 0;
}

export function read32(mem: Memory, pos: number): number {
    return (
            mem[pos]   << 24 | 
            mem[pos+1] << 16 | 
            mem[pos+2] << 8 | 
            mem[pos+3]
           ) >>> 0;
}

export function create(size: number): Memory {
    return new Uint8Array(size);
}