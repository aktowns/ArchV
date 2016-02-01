import * as nodeunit        from 'nodeunit';
import * as memory          from "../ArchV/memory";
import * as processor       from "../ArchV/processor";

export var countTest: nodeunit.ITestGroup = {
        
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

    // example: 
    //  count to 20 then stop     
    countToTwenty: (test: nodeunit.Test) => {
        var program = [ 
            /* 0x00001000 */ 0x04, 0x01, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x00, // movr8 1, gp3 
            /* 0x00001008 */ 0x04, 0x14, 0x0d, 0x00, 0x00, 0x00, 0x00, 0x00, // movr8 20, gp4
            /* 0x00001010 */ 0x0e, 0x0a, 0x0d, 0x00, 0x00, 0x00, 0x00, 0x00, // cmpr gp1, gp4
            /* 0x00001018 */ 0x0d, 0x00, 0x00, 0x10, 0x30, 0x00, 0x00, 0x00, // jz *0x00001030
            /* 0x00001020 */ 0x10, 0x0a, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x00, // addr gp1, gp3
            /* 0x00001028 */ 0x0b, 0x00, 0x00, 0x10, 0x10, 0x00, 0x00, 0x00, // jmp *0x00001010
            /* 0x00001030 */ 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // hlt
        ];

        this.sys.boot(program, 0x1000);

        test.equal(this.cpu.zf, 1);
        test.equal(this.cpu.gp1, 20);

        test.done();
    }
    
}