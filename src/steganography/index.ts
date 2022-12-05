import Bmp from '../bmp/index';

export class Steganography {
    private bmp: Bmp;
    private input_file: any[];
    private input_buffer: Uint8Array;
    private input_buffer_size: number;
    private output_buffer: Uint8Array;
    private output_buffer_size: number;

    constructor(input_buffer: any[]) {
        this.bmp = new Bmp();


        this.input_file = input_buffer;

        this.input_buffer = new Uint8Array(0);
        this.input_buffer_size = 0;

        this.output_buffer = new Uint8Array(0);
        this.output_buffer_size = 0;
    }

    public encode(){
        this.input_buffer = new Uint8Array(<any>Buffer.from(this.input_file))
        this.input_buffer_size = this.input_buffer.length;

        this.output_buffer = this.bmp.makeBitmapBuffer(this.input_buffer, this.input_buffer_size);
        this.output_buffer_size = this.bmp.getSizeOutBuffer();
    }

    public decode(){
        this.input_buffer = new Uint8Array(<any>Buffer.from(this.input_file))
        this.input_buffer_size = this.input_buffer.length;

        this.output_buffer = this.bmp.excractBuffer(this.input_buffer, this.input_buffer_size);
        this.output_buffer_size = this.bmp.getSizeOutBuffer();
    }

    public getOutputDataSize()
    {
        return this.output_buffer_size;
    }

    public getOutputBuffer(){
        return this.output_buffer;
    }
}