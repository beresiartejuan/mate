import { Token } from "moo";
import TokenTypes from "../tokens/TokenTypes";

export function isSkipeableToken(token: Token): boolean {
    return (
        !token.type ||
        token.type === TokenTypes.WS ||
        token.type === TokenTypes.comment ||
        token.type === TokenTypes.newline
    );
}

export function isSeparatorToken(token: Token): boolean {

    const tokenType = token.type;

    return (
        tokenType === TokenTypes.lparen ||
        tokenType === TokenTypes.rparen
    );
}

export function isOperationToken(token: Token): boolean {

    const tokenType = token.type;

    return (
        tokenType === TokenTypes.plus ||
        tokenType === TokenTypes.minus ||
        tokenType === TokenTypes.asterisk ||
        tokenType === TokenTypes.slash ||
        tokenType === TokenTypes.percent ||
        tokenType === TokenTypes.caret ||
        tokenType === TokenTypes.lessThan ||
        tokenType === TokenTypes.greaterThan ||
        tokenType === TokenTypes.equal ||
        tokenType === TokenTypes.notEqual ||
        tokenType === TokenTypes.lessThanOrEqual ||
        tokenType === TokenTypes.greaterThanOrEqual ||
        tokenType === TokenTypes.assignment
    );
}