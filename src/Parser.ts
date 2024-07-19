import lexer from "./tokens/lexer";
import TokenTypes from "./tokens/TokenTypes";
import Tokens from "./tokens/Tokens";
import { Lexer, Token } from "moo";
import Types from "./tokens/types";

const example_code = `2 + 3`

export default class Parser {
    all_tokens: Token[];
    tokens: Lexer;
    actual_token?: Token;
    parent?: Parser;

    constructor(tokens: Lexer, parent: Parser | null) {

        if (parent) this.parent = parent;
        this.tokens = tokens;
        this.all_tokens = Array.from(this.tokens);
        this.actual_token = this.tokens.next();

        while (this.actual_token) {

            if (this.isSkipeableToken(this.actual_token)) {
                this.nextToken();
                continue;
            }

            const token_type = this.actual_token.type!;

            if (`${token_type}Clause` in this) {
                (this as any)[`${token_type}Clause`]();
            }

            this.nextToken();

        }

    }

    isStackeableToken(token: Token): boolean {
        return (
            !token.type ||
            token.type === TokenTypes.number ||
            token.type === TokenTypes.string ||
            token.type === TokenTypes.identifier ||
            token.type === TokenTypes.boolean
        )
    }

    isSkipeableToken(token: Token): boolean {
        return (
            !token.type ||
            token.type === TokenTypes.WS ||
            token.type === TokenTypes.comment ||
            token.type === TokenTypes.newline
        );
    }

    nextToken() {
        this.actual_token = this.tokens.next();

        if (this.actual_token && this.isSkipeableToken(this.actual_token)) {
            this.nextToken();
        }
    }

    definitionClause() {

        const definition_token = this.actual_token;

        this.nextToken();

        if (this.actual_token?.type !== TokenTypes.identifier) {
            console.log(`Unexpected token: An identifier was expected on line ${this.actual_token?.line} after ${definition_token?.value}`);
            process.exit();
        }

        if (`${definition_token?.value}Definition` in this) {
            (this as any)[`${definition_token?.value}Definition`]();
        }
    }

    fnDefinition() {
        // ...
    }

    letDefinition() {

        const identifier = this.actual_token!;

        this.nextToken();

        const postIdentifier = this.actual_token;

        if (!postIdentifier) {
            console.log(`You must defined ${identifier.value} at line ${identifier.line}`);
            process.exit();
        }

        if (postIdentifier.type == TokenTypes.colon) {

        }

        if (postIdentifier.type == TokenTypes.assignment) {

            const expresion: Token[] = [];

            this.nextToken();

            while (this.actual_token?.type !== TokenTypes.semicolon) {
                if (this.actual_token) expresion.push(this.actual_token);
                this.nextToken();
            }

            // Evaluar la expresión con un arbol binario

            return;

        }

        console.log(`Unexpected token: ${this.actual_token?.value} at line ${this.actual_token?.line}`);
        process.exit();

    }
}

new Parser(lexer.reset(example_code), null);