export function assert(ev: boolean, msg: string): void {
    if (!ev) {
        throw new Error(`Assertion Failed: ${msg}`);
    }
}

export function isUInt8(val: number): boolean {
    return (val >= 0 && val <= 255);
}

export function isUInt16(val: number): boolean {
    return (val >= 0 && val <= 65535);
}

export function isUInt24(val: number): boolean {
    return (val >= 0 && val <= 16777215);
}

export function isUInt32(val: number): boolean {
    return (val >= 0 && val <= 4294967295);
}

export function format(inp: number, padding = ""): string {
    var str = inp.toString(16);
    return "0x" + (padding + str).substring(str.length);
}

export function format8(inp: number): string {
    return format(inp, "00");
}

export function format16(inp: number): string {
    return format(inp, "0000");
}

export function format32(inp: number): string {
    return format(inp, "00000000");
}

export function toByteArray(val: number): [number] {
    if (isUInt8(val)) {
        return [val];
    } else if (isUInt16(val)) {
        return [val >> 8 & 0xff,
                val      & 0xff];
    } else if (isUInt24(val)) {
        return [val >> 16 & 0xff,
                val >>  8 & 0xff,
                val       & 0xff];
    } else if (isUInt32(val)) {
        return [val >> 24 & 0xff,
                val >> 16 & 0xff, 
                val >>  8 & 0xff, 
                val       & 0xff];
    } else {
        throw new Error("given val is > 32 bit");
    }
}
