import type { Lexer, Token } from "moo";
import TokenTypes from "./../tokens/TokenTypes";
import * as AST from "./AST";
import type { ASTElement } from "./AST";

type ASTConstructor<T extends ASTElement> = new (token: Token) => T;

export default class Parser {
    private current_token: Token | undefined;

    constructor(private lexer: Lexer) {
        this.current_token = lexer.next();
    }

    private tokenToASTNode(token: Token): ASTElement {
        const tokenTypeMap: { [key: string]: ASTConstructor<ASTElement> } = {
            [TokenTypes.identifier]: AST.IdentifierNode,
            [TokenTypes.string]: AST.StringNode,
            [TokenTypes.number]: AST.NumberNode,
            [TokenTypes.boolean]: AST.BooleanNode,
            [TokenTypes.rate]: AST.SymbolNode,
            [TokenTypes.question]: AST.SymbolNode,
            [TokenTypes.colon]: AST.SymbolNode,
            [TokenTypes.lparen]: AST.SymbolNode,
            [TokenTypes.rparen]: AST.SymbolNode,
            [TokenTypes.lbrace]: AST.SymbolNode,
            [TokenTypes.rbrace]: AST.SymbolNode,
            [TokenTypes.lbracket]: AST.SymbolNode,
            [TokenTypes.rbracket]: AST.SymbolNode,
            [TokenTypes.semicolon]: AST.SymbolNode,
            [TokenTypes.comma]: AST.SymbolNode,
            [TokenTypes.scope_operator]: AST.SymbolNode,
            [TokenTypes.assignment]: AST.OperatorNode,
            [TokenTypes.dot]: AST.OperatorNode,
            [TokenTypes.plus]: AST.OperatorNode,
            [TokenTypes.minus]: AST.OperatorNode,
            [TokenTypes.asterisk]: AST.OperatorNode,
            [TokenTypes.slash]: AST.OperatorNode,
            [TokenTypes.percent]: AST.OperatorNode,
            [TokenTypes.caret]: AST.OperatorNode,
            [TokenTypes.lessThan]: AST.OperatorNode,
            [TokenTypes.greaterThan]: AST.OperatorNode,
            [TokenTypes.ampersand]: AST.OperatorNode,
            [TokenTypes.exclamation]: AST.OperatorNode,
            [TokenTypes.equal]: AST.OperatorNode,
            [TokenTypes.notEqual]: AST.OperatorNode,
            [TokenTypes.lessThanOrEqual]: AST.OperatorNode,
            [TokenTypes.greaterThanOrEqual]: AST.OperatorNode,
        };

        const NodeClass = tokenTypeMap[token.type!];

        if (!NodeClass) {
            throw new Error(`Unexpected token type: ${token.type}`);
        }

        return new NodeClass(token);
    }

    private isSkipeable(token: Token): boolean {
        return !token.type || token.type === TokenTypes.WS || token.type === TokenTypes.comment || token.type === TokenTypes.newline;
    }

    public eat(): ASTElement {
        const token = this.current_token;
        this.current_token = this.lexer.next();

        if (!token) {
            return new AST.EOF(); // Fin del programa
        }

        if (this.isSkipeable(token)) {
            return this.eat();
        }

        return this.tokenToASTNode(token);
    }
}