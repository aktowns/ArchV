import * as nodeunit        from 'nodeunit';
import * as memory          from "../ArchV/memory";
import * as processor       from "../ArchV/processor";

export var movTest: nodeunit.ITestGroup = {
    
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
    
    simpleRegisterMovs: (test: nodeunit.Test) => {
        var program: [number] = [
            0x01, 0x0a, 0x00, 0x00, 0x00, 0x00, // movrm8 gp1, *0x00000000
            0x04, 0xde, 0x0a,                   // movr8 0xde, gp1
            0x01, 0x0a, 0x00, 0x00, 0x00, 0x00, // movrm8 gp1, *0x00000000
            0x0a                                // hlt
        ];
        
        this.sys.boot(program, 0x1000);

        test.equal(memory.read32(this.mem, 0x00000000), 0xde000000);
        
        program = [
            0x04, 0xad, 0x0a,                   // movr8 0xad, gp1
            0x01, 0x0a, 0x00, 0x00, 0x00, 0x01, // movrm8 gp1, *0x00000001
            0x0a                                // hlt
        ];

        this.sys.boot(program, 0x1000);

        test.equal(memory.read32(this.mem, 0x00000000), 0xdead0000);
        
        program = [
            0x05, 0xbe, 0xef, 0x0a,             // movr16 0xbeef, gp1
            0x02, 0x0a, 0x00, 0x00, 0x00, 0x02, // movrm16 gp1, *0x00000002
            0x0a                                // hlt
        ];

        this.sys.boot(program, 0x1000);

        test.equal(memory.read32(this.mem, 0x00000000), 0xdeadbeef);
        
        test.done();
    },
    
    simpleMemoryMovs: (test: nodeunit.Test) => {
        test.expect(1);
        
        var program = [
            0x04, 0xb0, 0x0a,                   // movr8 0xb0, gp1
            0x04, 0x0b, 0x0b,                   // movr8 0x0b, gp2
            0x01, 0x0a, 0x00, 0x00, 0x00, 0x00, // movrm8 gp1, *0x00000000
            0x01, 0x0b, 0x00, 0x00, 0x00, 0x01, // movrm8 gp2, *0x00000001
            0x01, 0x0a, 0x00, 0x00, 0x00, 0x02, // movrm8 gp1, *0x00000002
            0x01, 0x0b, 0x00, 0x00, 0x00, 0x03, // movrm8 gp2, *0x00000003
            0x0a                                // hlt
        ];

        this.sys.boot(program, 0x1000);
        
        test.equal(memory.read32(this.mem, 0x00000000), 0xb00bb00b);
        
        test.done();
    },
    
    bigMemoryMovs: (test: nodeunit.Test) => {
        test.expect(2);
        
        var program = [
            0x06, 0xca, 0xfe, 0xba, 0xbe, 0x0a, // movr32 0xcafebabe, gp1 
            0x03, 0x0a, 0x00, 0x00, 0x00, 0x00, // movrm32 gp1, *0x00000000
            0x0a                                // hlt
        ];

        this.sys.boot(program, 0x1000);

        test.equal(memory.read32(this.mem, 0x00000000), 0xcafebabe);
        
        program = [
            0x09, 0x1a, 0xbe, 0x11, 0xed, 0x00, 0x00, 0x00, 0x00, // movm32 0x1abe11ed, *0x00000000
            0x0a                                                  // hlt
        ]

        this.sys.boot(program, 0x1000);

        test.equal(memory.read32(this.mem, 0x00000000), 0x1abe11ed);
        
        test.done();
    }
};