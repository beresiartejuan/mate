import moo from 'moo';

import TokenTypes from './TokenTypes';
import Tokens from './Tokens';

const lexer = moo.compile({
    // Espacios en blanco, saltos de linea y comentarios
    [TokenTypes.WS]: { match: /[ \t]+/, lineBreaks: true },
    [TokenTypes.newline]: { match: /\r?\n/, lineBreaks: true },
    [TokenTypes.comment]: /\/\/.*?$/,
    // Tipos
    [TokenTypes.string]: { match: /"(?:\\["\\]|[^\n"\\])*"/, value: s => s.slice(1, -1) },
    [TokenTypes.number]: /0|[1-9][0-9]*(?:\.[0-9]+)?/,
    [TokenTypes.boolean]: { match: [Tokens.false, Tokens.true] },
    // Tokens importantes
    [TokenTypes.implementation]: { match: Tokens.use },
    [TokenTypes.scope_operator]: { match: Tokens.scope },
    [TokenTypes.definition]: {
        match: [
            Tokens.definition_class,
            Tokens.definition_function,
            Tokens.definition_let
        ]
    },
    [TokenTypes.stucture]: {
        match: [
            Tokens.structure_if,
            Tokens.structure_else,
            Tokens.structure_for,
            Tokens.structure_while
        ]
    },
    [TokenTypes.type]: {
        match: [
            Tokens.type_string,
            Tokens.type_number,
            Tokens.type_null,
            Tokens.type_boolean,
            Tokens.type_dict,
            Tokens.type_list
        ]
    },
    [TokenTypes.identifier]: /[a-zA-Z_][a-zA-Z0-9_]*/,
    // Operators
    [TokenTypes.assignment]: /=/,
    [TokenTypes.dot]: /\./,
    [TokenTypes.plus]: /\+/,
    [TokenTypes.minus]: /-/,
    [TokenTypes.asterisk]: /\*/,
    [TokenTypes.slash]: /\//,
    [TokenTypes.percent]: /%/,
    [TokenTypes.caret]: /\^/,
    // Logic
    [TokenTypes.lessThan]: /</,
    [TokenTypes.greaterThan]: />/,
    [TokenTypes.ampersand]: /&/,
    [TokenTypes.exclamation]: /!/,
    [TokenTypes.equal]: /==/,
    [TokenTypes.notEqual]: /!=/,
    [TokenTypes.lessThanOrEqual]: /<=/,
    [TokenTypes.greaterThanOrEqual]: />=/,
    // Symbols
    [TokenTypes.rate]: /@/,
    [TokenTypes.question]: /\?/,
    [TokenTypes.colon]: /:/,
    [TokenTypes.lparen]: /\(/,
    [TokenTypes.rparen]: /\)/,
    [TokenTypes.lbrace]: /\{/,
    [TokenTypes.rbrace]: /\}/,
    [TokenTypes.lbracket]: /\[/,
    [TokenTypes.rbracket]: /\]/,
    [TokenTypes.semicolon]: /;/,
    [TokenTypes.comma]: /,/
});

export default lexer;
