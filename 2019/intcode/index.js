class IntCode {
    constructor(output = (str) => console.log(str)) {
        this._output = output;
        this._memory = [];
        this._pointer = 0;
        this._relativePointer = 0;
    }
    setMemory(program) {
        this._memory = program.slice(0);
    }
    input(value) {
        this.setValueAt(this._nextInputOperandMode, this.getValueAt(this._pointer + 1), value);
        this._pointer += 2;
        this._continue();
    }
    execute() {
        this._pointer = 0;
        this._continue();
    }

    _continue() {
        var nextInstruction = this._memory[this._pointer];
        while (nextInstruction) {
            // console.log(this._pointer, this._memory);
            var offset = this.processInstruction(nextInstruction);
            if (offset === 0) {
                break;
            }
            this._pointer += offset;
            nextInstruction = this._memory[this._pointer];
        }
    }

    // returns pointer offset after execution
    processInstruction(instruction) {
        // console.log('processInstruction', instruction, this._pointer, this._relativePointer);
        var opCode = instruction % 100;
        instruction -= opCode;
        instruction = instruction / 100;
        var operand1Mode = instruction % 10;
        instruction -= operand1Mode;
        instruction = instruction / 10;
        var operand2mode = instruction % 10;
        instruction -= operand2mode;
        instruction = instruction / 10;
        var operand3mode = instruction % 10;
        // console.log(opCode, operand1Mode, operand2mode, operand3mode);
        return this.processOpCode(opCode, operand1Mode, operand2mode, operand3mode);
    }

    processOpCode(opCode, operand1Mode, operand2mode, operand3mode) {
        // console.log(`opCode: ${opCode}\top1m: ${operand1Mode}\t op2m: ${operand2mode}\t op1 ${this._memory[this._pointer + 1]}\t op2? ${this._memory[this._pointer + 2]}\t op3? ${this._memory[this._pointer + 3]}`);
        var offset = 0;
        switch (opCode) {
            case 1:
                this.setValueAt(
                    operand3mode,
                    this.getValueAt(this._pointer + 3),
                    this.getValueWithMode(operand1Mode, this._pointer + 1)
                    + this.getValueWithMode(operand2mode, this._pointer + 2)
                );
                offset = 4;
                break;
            case 2:
                this.setValueAt(
                    operand3mode,
                    this.getValueAt(this._pointer + 3),
                    this.getValueWithMode(operand1Mode, this._pointer + 1)
                    * this.getValueWithMode(operand2mode, this._pointer + 2)
                );
                offset = 4;
                break;
            case 3:
                this._nextInputOperandMode = operand1Mode;
                break;
            case 4:
                this._output(this.getValueWithMode(operand1Mode, this._pointer + 1));
                offset = 2;
                break;
            case 5:
                if (this.getValueWithMode(operand1Mode, this._pointer + 1)) {
                    offset = this.getValueWithMode(operand2mode, this._pointer + 2) - this._pointer;
                } else {
                    offset = 3;
                }
                break;
            case 6:
                if (!this.getValueWithMode(operand1Mode, this._pointer + 1)) {
                    offset = this.getValueWithMode(operand2mode, this._pointer + 2) - this._pointer;
                } else {
                    offset = 3;
                }
                break;
            case 7:
                this.setValueAt(
                    operand3mode,
                    this.getValueAt(this._pointer + 3),
                    this.getValueWithMode(operand1Mode, this._pointer + 1)
                    < this.getValueWithMode(operand2mode, this._pointer + 2)
                        ? 1 : 0
                );
                offset = 4;
                break;
            case 8:
                this.setValueAt(
                    operand3mode,
                    this.getValueAt(this._pointer + 3),
                    this.getValueWithMode(operand1Mode, this._pointer + 1)
                    === this.getValueWithMode(operand2mode, this._pointer + 2)
                        ? 1 : 0
                );
                offset = 4;
                break;
            case 9:
                this._relativePointer += this.getValueWithMode(operand1Mode, this._pointer + 1);
                offset = 2;
                break;
            case 99:
                break;
        }
        // console.log(offset);
        // console.log(this._relativePointer);
        return offset;
    }

    getValueWithMode(mode, pointer) {
        if (mode === 2) {
            return this.getValueAt(this._relativePointer + this.getValueAt(pointer));
        } else {
            return mode ? this.getValueAt(pointer) : this.getPointedValueAt(pointer);
        }
    }

    getValueAt(pointer) {
        return this._memory[pointer] || 0;
    }

    getPointedValueAt(pointer) {
        return this._memory[this.getValueAt(pointer)] || 0;
    }

    setValueAt(mode = 0, pointer, value) {
        this._memory[pointer + (mode === 2 ? this._relativePointer : 0)] = value;
    }
}

module.exports = IntCode;
