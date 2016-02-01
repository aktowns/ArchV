import * as nodeunit        from 'nodeunit';
import * as memory          from "../ArchV/memory";
import * as processor       from "../ArchV/processor";

export var addrTest: nodeunit.ITestGroup = {
    
    setUp: (callback) => {
        this.cpu = new processor.CPU();
        this.mem = memory.create(1024*10); // 10kb
        this.sys = new processor.System(this.cpu, this.mem);
        
        callback();
    },
    
    tearDown: (callback) => {
        this.sys.reboot();
        
        callback();
    },
    
    testSimpleAddr: (test: nodeunit.Test) => {
        var program: number[] = [
            /* 0x00001000 */ 0x04, 0x10, 0x0a, 0x00, // movr8 10, gp1
            /* 0x00001004 */ 0x04, 0x10, 0x0b, 0x00, // movr8 10, gp2 
            /* 0x00001008 */ 0x10, 0x0a, 0x0b, 0x00, // addr gp1, gp2
            /* 0x0000100b */ 0x0a, 0x00, 0x00, 0x00, // hlt
        ];

        this.sys.boot(program, 0x1000);

        test.equal(this.cpu.gp1, 0x20);
        test.equal(this.cpu.gp2, 0x10);

        test.done();
    },
    
    test32bitAddr: (test: nodeunit.Test) => {
        test.expect(2);
        
        var program = [
            /* 0x00001000 */ 0x06, 0x00, 0x00, 0x05, 0x78, 0x0a, 0x00, 0x00, // movr32 1400, gp1
            /* 0x00001008 */ 0x06, 0x00, 0x00, 0x0d, 0x48, 0x0b, 0x00, 0x00, // movr32 3400, gp2 
            /* 0x00001010 */ 0x10, 0x0a, 0x0b, 0x00, 0x00, 0x00, 0x00, 0x00, // addr gp1, gp2
            /* 0x00001018 */ 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00  // hlt
        ];
        
        this.sys.boot(program, 0x1000);

        test.equal(this.cpu.gp1, 0x12c0); // 4800
        test.equal(this.cpu.gp2, 0x0d48);
        
        test.done();
    }
}

