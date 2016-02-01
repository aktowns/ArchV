import {assert, isUInt32, format8, format32} from "./utils";
import * as memory from "./memory";
import {opcodes} from "./opcodes"

export type Register = number;

export class CPU {
    private _gp1: Register = 0;
    private _gp2: Register = 0;
    private _gp3: Register = 0;
    private _gp4: Register = 0;
    private _gp5: Register = 0;
    private _gp6: Register = 0;
    private _gp7: Register = 0;
    private _gp8: Register = 0;
    private _gp9: Register = 0;

    private _err: Register = 0;

    private _zf: Boolean   = false;
    private _sp: Register  = 0;
    private _eip: Register = 0;
    
    public get gp1(): Register { return this._gp1; }
    public set gp1(v: Register) { 
        assert(isUInt32(v), "register set larger than width");
        this._gp1 = v;
    }
    public get gp2(): Register { return this._gp2; }
    public set gp2(v: Register) { 
        assert(isUInt32(v), "register set larger than width");
        this._gp2 = v;
    }
    public get gp3(): Register { return this._gp3; }
    public set gp3(v: Register) { 
        assert(isUInt32(v), "register set larger than width");
        this._gp3 = v;
    }
    public get gp4(): Register { return this._gp4; }
    public set gp4(v: Register) { 
        assert(isUInt32(v), "register set larger than width");
        this._gp4 = v;
    }
    public get gp5(): Register { return this._gp5; }
    public set gp5(v: Register) { 
        assert(isUInt32(v), "register set larger than width");
        this._gp5 = v;
    }
    public get gp6(): Register { return this._gp6; }
    public set gp6(v: Register) { 
        assert(isUInt32(v), "register set larger than width");
        this._gp6 = v;
    }
    public get gp7(): Register { return this._gp7; }
    public set gp7(v: Register) { 
        assert(isUInt32(v), "register set larger than width");
        this._gp7 = v;
    }
    public get gp8(): Register { return this._gp8; }
    public set gp8(v: Register) { 
        assert(isUInt32(v), "register set larger than width");
        this._gp8 = v;
    }
    public get gp9(): Register { return this._gp9; }
    public set gp9(v: Register) { 
        assert(isUInt32(v), "register set larger than width");
        this._gp9 = v;
    }
    public get err(): Register { return this._err; }
    public set err(v: Register) { 
        assert(isUInt32(v), "register set larger than width");
        this._err = v;
    }
    public get sp(): Register { return this._sp; }
    public set sp(v: Register) { 
        assert(isUInt32(v), "register set larger than width");
        this._sp = v;
    }
    public get eip(): Register { return this._eip; }
    public set eip(v: Register) { 
        assert(isUInt32(v), "register set larger than width");
        this._eip = v;
    }

    public get zf(): Register { return this._zf ? 1 : 0 }
    public set zf(v: Register) {
        assert(v == 0 || v == 1, "zeroflag register should be 1 or 0");
        this._zf = (v == 1);
    }
    
    public clear() {
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
        this._zf = false;
    }
    
    public print_registers() {
        console.log(`
            gp1: ${format32(this._gp1)} gp2: ${format32(this._gp2)} gp3: ${format32(this._gp3)}
            gp4: ${format32(this._gp4)} gp5: ${format32(this._gp5)} gp6: ${format32(this._gp6)}
            gp7: ${format32(this._gp7)} gp8: ${format32(this._gp8)} gp9: ${format32(this._gp9)}
            err: ${format32(this._err)}  sp: ${format32(this._sp)} eip: ${format32(this._eip)}
            zf: ${this.zf}
        `.replace(/^\s+/mg, '').replace(/\n/g, ' '));
    }
}

export class System {
    private cpu: CPU;
    private memory: memory.Memory;
    
    public constructor(cpu: CPU, memory: memory.Memory) {
        this.cpu = cpu;
        this.memory = memory;    
    }
    
    public load(code: number[], offset: number = 0x00) {
        memory.copy(this.memory, offset, code);
    }
    
    public start(offset: number = 0x00) {
        this.cpu.eip = offset;
        this.process();
    }
    
    public boot(code: number[], offset: number = 0x00) {
        this.load(code, offset);
        this.start(offset);
    }
    
    public reboot() {
        this.cpu.clear();
        memory.clear(this.memory);
    }
    
    private read8(): number {
        return this.memory[this.cpu.eip++];
    }
    
    private read16(): number {
        return this.memory[this.cpu.eip++] << 8 | this.memory[this.cpu.eip++] & 0xffff;
    }
    
    private read32(): number {
        return (this.memory[this.cpu.eip++] << 24 | 
                this.memory[this.cpu.eip++] << 16 | 
                this.memory[this.cpu.eip++] << 8  | 
                this.memory[this.cpu.eip++]) >>> 0;
    }
    
    private process() {        
        while (this.cpu.eip < this.memory.length) {
            // this.cpu.print_registers();
            
            var op = this.read8();
            var f = opcodes(this.memory, this.cpu)[op];
            
            switch (op) {
                /* nop              */ case 0x00: f(); break;
                /* movrm8  reg, mem */ case 0x01: /* VV */
                /* movrm16 reg, mem */ case 0x02: /* VV */
                /* movrm32 reg, mem */ case 0x03: f(this.read8(), this.read32());  break;
                /* movr8   val, reg */ case 0x04: f(this.read8(), this.read8());   break;
                /* movr16  val, reg */ case 0x05: f(this.read16(), this.read8());  break;
                /* movr32  val, reg */ case 0x06: f(this.read32(), this.read8());  break;
                /* movm8   val, mem */ case 0x07: f(this.read8(), this.read32());  break;
                /* movm16  val, mem */ case 0x08: f(this.read16(), this.read32()); break;
                /* movm32  val, mem */ case 0x09: f(this.read32(), this.read32()); break;
                /* hlt              */ case 0x0a: f(); return; /* !! */
                /* jmp     mem      */ case 0x0b: /* VV */
                /* jnz     mem      */ case 0x0c: f(this.read32()); break;
                /* jz      mem      */ case 0x0d: f(this.read32()); break;
                /* cmpr    reg, reg */ case 0x0e: f(this.read8(), this.read8()); break;
                /* addr    reg, reg */ case 0x10: f(this.read8(), this.read8()); break;
                default:
                    throw new Error(`unknown opcode ${format8(op)}`);
            }
        }
    }
}
