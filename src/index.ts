import chalk from "chalk";
import {Steganography} from "./steganography";
import {syncReadFile, syncWriteFile} from "./utils";

const yargs = require("yargs");
const argv = require('yargs/yargs')(process.argv.slice(2)).argv;

const usage = chalk.keyword('violet')(
    '\nUsage: node build/index.js' +
    ' -i <input file path>' +
    ' -o <output file path>' +
    ' -d <decode (optional)>' +
    ' -e <output file encoding \'binary\' | \'utf-8\' (default=binary)>'
);

const options = yargs.usage(usage)
    .option("i", {alias:"input", describe: "Input file path", type: "string", demandOption: true })
    .option("o", {alias:"output", describe: "Output file path", type: "string", demandOption: true })
    .option("d", {alias:"decode", describe: "The input file is a bmp image to be decoded", type: "Optional", demandOption: false })
    .option("e", {alias:"encode_type", describe: "Output file encoding type. Valid options: binary | utf-8. Default=utf-8", type: "string", demandOption: false })
    .help(true).argv;

if(yargs.argv.input == null && yargs.argv.output == null){

    console.log(yargs.argv)

    console.error(chalk.red("Input or output file path was not specified. Please, view usage."))
    yargs.showHelp();
    process.exit(-1);
}

try {
    const data = syncReadFile(yargs.argv.input);
    if(data)
    {
        if(yargs.argv.decode === undefined) {
            console.info(chalk.green('[*] Initialization'));
            const steganography = new Steganography(<any>data);

            console.info(chalk.green('[*] Encode'));
            steganography.encode();

            console.info(chalk.green('[*] Saving data'));
            syncWriteFile(
                yargs.argv.output,
                steganography.getOutputBuffer(),
                yargs.argv.encoding_type ? yargs.argv.encoding_type : 'binary'
            )

            console.info(chalk.green(`[*] Output file:\t${yargs.argv.output}`))
            console.info(chalk.green(`[*] Size of data:\t${steganography.getOutputDataSize()}`))
        }

        if(yargs.argv.decode)
        {
            console.info(chalk.green('[*] Initialization'));
            const steganography = new Steganography(<any>data);

            console.info(chalk.green('[*] Decode'));
            steganography.decode();

            console.info(chalk.green('[*] Saving data'));
            syncWriteFile(
                yargs.argv.output,
                steganography.getOutputBuffer(),
                yargs.argv.encoding_type ? yargs.argv.encoding_type : 'utf-8'
            )

            console.info(chalk.green(`[*] Output file:\t${yargs.argv.output}`))
            console.info(chalk.green(`[*] Size of data:\t${steganography.getOutputDataSize()}`))
        }
    }
    else
    {
        throw new Error('File or data is not exist!')
    }
}catch (e) {
    if(e instanceof Error)
        throw new Error("Input file open error! Message: " + e.message)
}

process.exit(-1);