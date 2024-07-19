import lexer from "./tokens/lexer";
import Parser from "./core/Parser";
import Interpreter from "./core/Interpreter";
import TokenTypes from "tokens/TokenTypes";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { Command } from "commander";

const program = new Command();
const version = '0.1.0';

program
    .version(version, '-v, --version', 'Show the current version')
    .description('CLI for managing and running mate projects');

program
    .argument('<path_file>', 'Execute a specific file')
    .action((filePath) => {

        const real_path = path.resolve(path.normalize(filePath));

        const file_exist = existsSync(real_path);

        if (!file_exist && path.extname(real_path) !== "uwu") {
            program.error(`The path "${real_path}" does not exist or is not a file without a .mate extension`);
        }

        const code = readFileSync(real_path, { encoding: 'utf8' });

        const all_tokens = lexer.reset(code);

        const parser = new Parser(all_tokens);

        new Interpreter(parser);
    });

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

program.parse(process.argv);