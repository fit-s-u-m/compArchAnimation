
// Supported instructions
// ADD, SUB, MUL, DIV


// Control signal implementation for our simulation
let horizontalControlWord = [
    
    // Writing to the bus from source 1 and source 2
    [0,0,0,0 ,0,0,1,1 ,0,1],// Writing R0 and R1 to bus
    [0,0,0,0 ,0,1,0,1 ,0,1],// Writing R0 and R2 to bus
    [0,0,0,0 ,1,0,0,1 ,0,1],// Writing R0 and R3 to bus
    [0,0,0,0 ,0,1,1,0 ,0,1],// Writing R1 and R2 to bus
    [0,0,0,0 ,1,0,1,0 ,0,1],// Writing R1 and R3 to bus
    [0,0,0,0 ,1,1,0,0 ,0,1],// Writing R2 and R3 to bus
    
    // Reading form the bus to Destination
    [0,0,0,0 ,0,0,0,1 ,1,0],//Reading from bus to R0
    [0,0,0,0 ,0,0,1,0 ,1,0],//Reading from bus to R1
    [0,0,0,0 ,0,1,0,0 ,1,0],//Reading from bus to R2
    [0,0,0,0 ,1,0,0,0 ,1,0],//Reading from bus to R3

    // ALU opreations
    [1,0,0,0 ,0,0,0,0 ,0,0],//ADD
    [0,1,0,0 ,0,0,0,0 ,0,0],//SUB
    [0,0,1,0 ,0,0,0,0 ,0,0],//MUL
    [0,0,0,1 ,0,0,0,0 ,0,0] //DIV
]

let verticalControlWord = [
    
    // Writing to the bus from source 1 and source 2
    [1,0,0, 0,0,0 ,0,1],// Writing R0 and R1 to bus
    [1,0,0, 0,0,1 ,0,1],// Writing R0 and R2 to bus
    [1,0,0, 0,1,0 ,0,1],// Writing R0 and R3 to bus
    [1,0,0, 0,1,1 ,0,1],// Writing R1 and R2 to bus
    [1,0,0, 1,0,0 ,0,1],// Writing R1 and R3 to bus
    [1,0,0, 1,0,1 ,0,1],// Writing R2 and R3 to bus
    
    // Reading form the bus to Destination
    [1,0,0, 0,0,0 ,1,0],//Reading from bus to R0
    [1,0,0, 0,0,1 ,1,0],//Reading from bus to R1
    [1,0,0, 0,1,0 ,1,0],//Reading from bus to R2
    [1,0,0, 0,1,1 ,1,0],//Reading from bus to R3

    // ALU opreations
    [0,0,0, 0,0,0 ,0,0],//ADD
    [0,0,1, 0,0,0 ,0,0],//SUB
    [0,1,0, 0,0,0 ,0,0],//MUL
    [0,1,1, 0,0,0 ,0,0] //DIV
]

// Opcode of instructions
let opcode = {
    "ADD": [0,0],
    "SUB": [0,1],
    "MUL": [1,0],
    "DIV": [1,1]
};

// Register values to binary
let registersToBinary = [
    [0,0],
    [0,1],
    [1,0],
    [1,1]
]

// Takes instruction -> Opcode
function instructionToOpcode(instruction){
    let binary = opcode[instruction];
    return binary;
}

// Takes registors {R0,R1,R2,R3} -> binary {00,01,10,11}
function registerToBinary(registor){
    let r = parseInt(registor.split('').pop());
    return registersToBinary[r];
}

// Exposing the whole control memory
export function getControlMemory(){
    return horizontalControlWord;
}

// Takes (opcode,sourceOneResistor,sourceTwoResistor,destinationResistor) -> instruction
export function createInstruction(instruction,sourceOne,sourceTwo,destination){
    opcode = instructionToOpcode(instruction);
    sourceOne = registerToBinary(sourceOne);
    sourceTwo = registerToBinary(sourceTwo);
    destination = registerToBinary(destination);
    return [...opcode,...sourceOne,...sourceTwo,...destination];
}

// Takes (opcode) -> control word location
function opcodeToControlWord(opcode){
    let num = opcode[0] + opcode[1];
    switch (num){
        case 0:
            return 10
        case 1:
            if (opcode[0] == 0){
                return 11
            }else {
                return 12
            }
        case 2:
            return 13
        default:
            console.log("Error at opcodeToControlWord(function)!");
    }
}

// Given (sourceResistorOne,sourceResistorTwo) -> finds the control word location that enables sourceResistorOne,sourceResistorTwo
function sourceToControlWord(sourceOne,sourceTwo){
    let num = sourceOne[0] + sourceOne[1] + sourceTwo[0] + sourceTwo[1];
    switch (num){
        case 1:
            if (sourceTwo[0] == 0){
                return 0
            }else {
                return 1
            }
        case 2:
            if (sourceTwo[0] == 1){
                return 2
            }else {
                return 3
            }
        case 3:
            if(sourceOne[0] == 1){
                return 4
            }else {
                return 5
            }
        default:
            console.log("Error at sourceToControlWord(function)!");
    }
}

// Given (destinationResistor) -> finds control word location that enables destinationResistor
function destinationToControlWord(destination){
    let num = destination[0] + destination[1];
    switch (num){
        case 0:
            return 6;
        case 1:
            if (destination[0] == 0){
                return 7;
            }else {
                return 8;
            }
        case 2:
            return 8;
        default:
            console.log("Error at destinationToControlWord(function)!");
    }
}

// Given (instruction) -> control word sequence
function getControlWordSequence(instruction) {
    let sequence = [];

        let opcode = instruction.slice(0,2);
        let sourceOne = instruction.slice(2,4);
        let sourceTwo = instruction.slice(4,6);
        let destination = instruction.slice(6,8);
    
        // Creating a sequence of control words based on the instruction
        sequence.push(sourceToControlWord(sourceOne,sourceTwo));
        sequence.push(opcodeToControlWord(opcode));
        sequence.push(destinationToControlWord(destination));
    
        return sequence;
}

// Given (instruction,implementaionType) -> array of control word
export function getControlWords(instruction, implementaionType = "horizontal"){
    let sequence = getControlWordSequence(instruction)
    let controlWords = []

    if(implementaionType == "horizontal"){
        for(let i = 0; i < sequence.length;i++){
            controlWords.push(horizontalControlWord[sequence[i]]);
        }
    } if (implementaionType == "vertical"){
        let verticalControlWords = []
        for(let i = 0; i < sequence.length;i++){
            controlWords.push(verticalControlWord[sequence[i]]);
        }
        verticalControlWords.push(controlWords);
        controlWords = []
        for(let i = 0; i < sequence.length;i++){
            controlWords.push(horizontalControlWord[sequence[i]]);
        }
        verticalControlWords.push(controlWords);
        controlWords = verticalControlWords;
    }
    return controlWords;
}

// Takes (instruction) -> lighting sequence
function lightingSequence(instruction){
    // Getting the sequence of control instruction with their corresponding control words
    let sequence = getControlWordSequence(instruction);
    let controlWords = getControlWords(instruction);

    // Light sequence decoder
    for(let i = 0; i<sequence.length;i++){
        if (sequence[i] == (0 <= i <= 5)){

        }
        if (sequence[i] == (6 <= i <= 9)){

        }
        else{

        }
    }

    // 
}

