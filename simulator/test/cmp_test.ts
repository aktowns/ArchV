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
  
    simpleCmpTest: (test: nodeunit.Test) => {
        test.expect(5);
        
        var program = [
            /* 0x00001000 */ 0x04, 0x33, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, // movr8 33, gp1
            /* 0x00001008 */ 0x04, 0x33, 0x0b, 0x00, 0x00, 0x00, 0x00, 0x00, // movr8 33, gp2
            /* 0x00001010 */ 0x0e, 0x0a, 0x0b, 0x00, 0x00, 0x00, 0x00, 0x00, // cmpr gp1, gp2
            /* 0x00001018 */ 0x0d, 0x00, 0x00, 0x10, 0x28, 0x00, 0x00, 0x00, // jz *0x00001028
            /* 0x00001020 */ 0x04, 0x99, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x00, // movr8 99, gp3
            /* 0x00001028 */ 0x04, 0x99, 0x0d, 0x00, 0x00, 0x00, 0x00, 0x00, // movr8 99, gp4
            /* 0x00001030 */ 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // hlt
        ];

        this.sys.boot(program, 0x1000);

        test.equal(this.cpu.zf, 0x01); 
        test.equal(this.cpu.gp1, 0x33);
        test.equal(this.cpu.gp2, 0x33);
        test.equal(this.cpu.gp3, 0x00);
        test.equal(this.cpu.gp4, 0x99);

        test.done();
    }
};