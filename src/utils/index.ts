import * as fs from "fs";

export const i2hex = (el: { toString: (arg0: number) => string; }) => {
    return ('0' + el.toString(16)).slice(-2);
}

export const uint32 = (b: any) => {
    return (b[0]) | (b[1] << 8) | (b[2] << 16) | (b[3] << 24);
}

export const asUint8Array = (buf: Uint8Array): Uint8Array => {
    if (globalThis.Buffer != null) {
        return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
    }

    return buf
}

export const allocUnsafe = (size: number = 0): Uint8Array => {
    if (globalThis.Buffer?.allocUnsafe != null) {
        return asUint8Array(globalThis.Buffer.allocUnsafe(size))
    }

    return new Uint8Array(size)
}

export const concat = (arrays: Array<ArrayLike<number>>, length?: number): Uint8Array => {
    if (length == null) {
        length = arrays.reduce((acc, curr) => acc + curr.length, 0)
    }

    const output = allocUnsafe(length)
    let offset = 0

    for (const arr of arrays) {
        output.set(arr, offset)
        offset += arr.length
    }

    return asUint8Array(output)
}

export const syncReadFile = (path: fs.PathOrFileDescriptor) => {
    try {
        return fs.readFileSync(path, 'binary');
    } catch (error) {
        if (error instanceof Error ) {
            console.log('File not found! Info: ', error.message);
        }

        throw error;
    }
}

export const syncWriteFile = (path: fs.PathOrFileDescriptor, data: any, encode_type: BufferEncoding) => {
    try {
        return fs.writeFileSync(path, data, {
            encoding: encode_type
        });
    } catch (error) {
        if (error instanceof Error ) {
            console.log('Write error! Info: ', error.message);
        }

        throw error;
    }
}