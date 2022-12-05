import {BmpFileHeader, BmpFileInfo} from "./types";
import {uint32, concat} from "../utils";

export default class Bmp{
    protected header: BmpFileHeader;
    protected file: BmpFileInfo;
    protected size_out_buffer: number;

    constructor() {
        this.header = <BmpFileHeader>{
            magic: new Uint8Array([66, 77]),
            size_in_bytes: new Uint8Array([0, 0, 0, 0]),
            app_data: new Uint8Array([0, 0, 0, 0]),
            data_offset: new Uint8Array([40+14, 0, 0, 0])
        };

        this.file = <BmpFileInfo>{
            hd_size: new Uint8Array([40, 0, 0, 0]),
            weidth: new Uint8Array([0, 0, 0, 0]),
            heigth: new Uint8Array([0, 0, 0, 0]),
            color_planes: new Uint8Array([1, 0]),
            bits_per_pixel: new Uint8Array([24, 0]),
            compression: new Uint8Array([0, 0, 0, 0]),
            bits_size: new Uint8Array([0, 0, 0, 0]),
            horizontal_resolution: new Uint8Array([22, 27, 0, 0]),
            vertical_resolution: new Uint8Array([17, 43, 0, 0]),
            number_colours: new Uint8Array([0, 0, 0, 0]),
            important_colors: new Uint8Array([0, 0, 0, 0]),
        };

        this.size_out_buffer = 0;
    }

    public getRound_size(size: number): number{
        let round_corner = Math.trunc(Math.sqrt(size));
        while(round_corner*round_corner < size)
            round_corner++;

        return round_corner;
    }

    public getRealSize(round_size: number): number{
        return this.getRound_size(round_size / 3);
    }

    public makeBitmapBuffer(input_buffer: Uint8Array, buffer_size: number): Uint8Array{
        const realSize = this.getRealSize(buffer_size);
        const weidth = realSize;
        const heigth = realSize;


        const paddingSize = (4 - 3 * weidth % 4) % 4;
        const sizeData = weidth*heigth*3 + heigth*paddingSize;
        const sizeAll = sizeData + 40 + 14;

        this.header.size_in_bytes[0] = (sizeAll);
        this.header.size_in_bytes[1] = (sizeAll >> 8);
        this.header.size_in_bytes[2] = (sizeAll >> 16);
        this.header.size_in_bytes[3] = (sizeAll >> 24);

        this.file.weidth[0] = (weidth);
        this.file.weidth[1] = (weidth >> 8);
        this.file.weidth[2] = (weidth >> 16);
        this.file.weidth[3] = (weidth >> 24);

        this.file.heigth[0] = (heigth);
        this.file.heigth[1] = (heigth >> 8);
        this.file.heigth[2] = (heigth >> 16);
        this.file.heigth[3] = (heigth >> 24);

        this.file.horizontal_resolution[0] = (sizeData);
        this.file.horizontal_resolution[1] = (sizeData >> 8);
        this.file.horizontal_resolution[2] = (sizeData >> 16);
        this.file.horizontal_resolution[3] = (sizeData >> 24);

        let fileOffset = 0;
        let outputBuffer: Uint8Array = new Uint8Array(sizeAll);

        const header_data = Object.keys(this.header).map((k, i) => Object.values(this.header)[i])
        const file_data = Object.keys(this.file).map((k, i) => Object.values(this.file)[i])
        const header_data_length = header_data.reduce((a, c) => a + c.length, 0);
        const file_data_length = file_data.reduce((a, c) => a + c.length, 0);


        outputBuffer.set(concat(header_data, header_data_length), fileOffset);
        fileOffset += 14; // plus offset of FileHeader

        outputBuffer.set(concat(file_data, file_data_length), fileOffset)
        fileOffset += 40; // plus offset of FileInfo

        let offset = 0;
        this.header.size_in_bytes[0] = (paddingSize >> 8) & 0x00FF;
        this.header.size_in_bytes[1] = paddingSize & 0x00FF;

        for(let y = 0; y < heigth; y++)
        {
            for(let x = 0; x < weidth; x++)
            {
                let value = input_buffer[y * realSize + x + offset];
                let value1 = input_buffer[y * realSize + x + offset + 1];
                let value2 = input_buffer[y * realSize + x + offset + 2];

                let pixel: Uint8Array = new Uint8Array([value, value1, value2]);
                outputBuffer.set(pixel, fileOffset)

                fileOffset += 3;
                offset += 2;
            }
        }

        this.size_out_buffer = sizeAll;

        return outputBuffer;
    }

    public excractBuffer(input_buffer: Uint8Array, buffer_size: number): any {
        const header = input_buffer.slice(14);
        const file = input_buffer.slice(14, buffer_size);

        const widthOffset = 4;

        let wh = uint32(file.slice(widthOffset));
        let inOffset = 40+14; // Header + File

        let outputOffset = 0;
        let outputBuffer: Uint8Array = new Uint8Array((wh**2)*3);

        for(let x = 0; x < wh; x++)
        {
            for(let y = 0; y < wh; y++)
            {
                let buffer: Uint8Array = new Uint8Array(input_buffer.slice(inOffset, inOffset + 3))

                outputBuffer.set(buffer, outputOffset)

                outputOffset += 3;
                inOffset += 3;
            }
        }

        // clear null bytes
        outputBuffer.filter(el => el != 0x0)

        // set data size
        this.size_out_buffer = outputBuffer.length;

        return outputBuffer;
    }

    public getSizeOutBuffer(): number{
        return this.size_out_buffer;
    }
}

module.exports = Bmp;