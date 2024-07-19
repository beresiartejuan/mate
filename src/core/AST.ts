import { Token } from "moo";
import { v6 as uuid } from "uuid";

export interface ASTElement {
    value: () => any;
    type: string;
    is_stackable: boolean;
}

export abstract class AST implements ASTElement {
    type: string;
    is_stackable: boolean;

    constructor(public token: Token, stackable: boolean = true) {
        this.type = token.type!;
        this.is_stackable = stackable;
    }

    abstract value(): any;
}

export class StringNode extends AST {
    constructor(token: Token) {
        super(token);
    }

    value(): string {
        return this.token.value;
    }
}

export class NumberNode extends AST {
    constructor(token: Token) {
        super(token);
    }

    value(): number {
        return parseFloat(this.token.value);
    }
}

export class BooleanNode extends AST {
    constructor(token: Token) {
        super(token);
    }

    value(): boolean {
        return this.token.value === "true";
    }
}

export class IdentifierNode extends AST {
    key: string;

    constructor(token: Token) {
        super(token);
        this.key = uuid();
    }

    value() {
        return this.token.value;
    }
}

export class SymbolNode extends AST {
    constructor(token: Token) {
        super(token);
    }

    value() {
        return this.token.value;
    }
}

export class OperatorNode extends AST {
    constructor(token: Token) {
        super(token);
    }

    value() {
        return this.token.value;
    }
}

export class EOF implements ASTElement {
    type: string = "EOF";
    is_stackable: boolean = false;

    value() {
        return null;
    }
}
