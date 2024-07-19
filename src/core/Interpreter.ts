import TokenTypes from "./../tokens/TokenTypes";
import Parser from "./Parser";
import * as AST from "./AST";
import type { ASTElement } from "./AST";
import { Token } from "moo";

export default class Interpreter {
    current_tokens: ASTElement[] = [];
    actual_token: ASTElement;
    stack: ASTElement[] = [];

    constructor(protected parser: Parser) {
        this.actual_token = this.parser.eat();

        while (true) {

            // if (`${this.actual_token.type}Clause` in this) {
            //     (this as any)[`${this.actual_token.type}Clause`]();
            // }

            if (this.actual_token instanceof AST.EOF) {
                break;
            }

            if (this.actual_token instanceof AST.SymbolNode && this.actual_token.type === TokenTypes.semicolon) {
                this.resolveStack();
                console.log(this.stack[0]);
                this.actual_token = this.parser.eat();
                this.current_tokens = [this.actual_token];
                continue;
            }

            this.stack.push(this.actual_token);
            this.current_tokens.push(this.actual_token);
            this.actual_token = this.parser.eat();
        }

        process.exit();
    }

    resolveStack() {
        let tokens = [...this.stack];

        // Convert tokens to RPN
        let outputQueue: ASTElement[] = [];
        let operatorStack: ASTElement[] = [];

        for (let token of tokens) {

            if (token instanceof AST.NumberNode || token instanceof AST.IdentifierNode || token instanceof AST.StringNode) {
                outputQueue.push(token);
            }

            if (token instanceof AST.OperatorNode) {
                while (
                    operatorStack.length > 0 &&
                    operatorStack[operatorStack.length - 1] instanceof AST.OperatorNode &&
                    this.getPrecedence(token) <= this.getPrecedence(operatorStack[operatorStack.length - 1])
                ) {
                    outputQueue.push(operatorStack.pop()!);
                }
                operatorStack.push(token);
            }

            if (token instanceof AST.SymbolNode && token.type === TokenTypes.lparen) {
                operatorStack.push(token);
            }

            if (token instanceof AST.SymbolNode && token.type === TokenTypes.rparen) {
                while (
                    operatorStack.length > 0 &&
                    !(operatorStack[operatorStack.length - 1] instanceof AST.SymbolNode && operatorStack[operatorStack.length - 1].type === TokenTypes.lparen)
                ) {
                    outputQueue.push(operatorStack.pop()!);
                }
                operatorStack.pop();
            }

        }

        while (operatorStack.length > 0) {
            outputQueue.push(operatorStack.pop()!);
        }

        // Evaluate RPN
        let evalStack: ASTElement[] = [];

        for (let token of outputQueue) {
            if (token instanceof AST.NumberNode || token instanceof AST.IdentifierNode || token instanceof AST.StringNode) {
                evalStack.push(token);
            }

            if (token instanceof AST.OperatorNode) {
                let right = evalStack.pop()!;
                let left = evalStack.pop()!;
                let result = this.evaluateOperation(left, right, token);
                evalStack.push(result);
            }
        }

        this.stack = evalStack;
    }

    getPrecedence(token: ASTElement): number {
        switch (token.type) {
            case TokenTypes.plus:
                return 1
            case TokenTypes.minus:
                return 1;
            case TokenTypes.asterisk:
                return 2;
            case TokenTypes.slash:
                return 2;
            case TokenTypes.caret:
                return 3;
            default:
                return 0;
        }
    }

    evaluateOperation(left: ASTElement, right: ASTElement, operator: ASTElement): ASTElement {
        let leftValue = left.value();
        let rightValue = right.value();

        switch (operator.type) {
            case TokenTypes.plus:
                if (left instanceof AST.NumberNode && right instanceof AST.NumberNode) {
                    return new AST.NumberNode({
                        type: TokenTypes.number,
                        value: (leftValue + rightValue).toString()
                    } as Token);
                }

                if (left instanceof AST.StringNode && right instanceof AST.StringNode) {
                    return new AST.StringNode({
                        type: TokenTypes.string,
                        value: (left.value() + right.value())
                    } as Token);
                }

                throw new Error("Tipos no coinciden");
            case TokenTypes.minus:
                if (left instanceof AST.NumberNode && right instanceof AST.NumberNode) {
                    return new AST.NumberNode({
                        type: TokenTypes.number,
                        value: (leftValue - rightValue).toString()
                    } as Token);
                }

                throw new Error("Tipos no coinciden");
            case TokenTypes.asterisk:
                if (left instanceof AST.NumberNode && right instanceof AST.NumberNode) {
                    return new AST.NumberNode({
                        type: TokenTypes.number,
                        value: (leftValue - rightValue).toString()
                    } as Token);
                }

                if (left instanceof AST.StringNode && right instanceof AST.NumberNode) {
                    return new AST.StringNode({
                        type: TokenTypes.string,
                        value: left.value().repeat(right.value())
                    } as Token);
                }

                throw new Error("Tipos no coinciden");
            case TokenTypes.slash:
                if (left instanceof AST.NumberNode && right instanceof AST.NumberNode) {
                    return new AST.NumberNode({
                        type: TokenTypes.number,
                        value: (leftValue / rightValue).toString()
                    } as Token);
                }

                throw new Error("Tipos no coinciden");
            case TokenTypes.caret:
                if (left instanceof AST.NumberNode && right instanceof AST.NumberNode) {
                    return new AST.NumberNode({
                        type: TokenTypes.number,
                        value: Math.pow(leftValue, rightValue).toString()
                    } as Token);
                }

                throw new Error("Tipos no coinciden");
            default:
                throw new Error(`Unknown operator: ${operator.type}`);
        }
    }

    EOFClause() {
        process.exit();
    }
}
