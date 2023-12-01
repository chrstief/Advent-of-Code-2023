const input:string = await Deno.readTextFile("./Day_01/b.txt");

const lines = input.split("\n");

const spelledOutNumbers = [
{word:'one',number:'1'},
{word:'two',number:'2'},
{word:'three',number:'3'},
{word:'four',number:'4'},
{word:'five',number:'5'},
{word:'six',number:'6'},
{word:'seven',number:'7'},
{word:'eight',number:'8'},
{word:'nine',number:'9'},
]

function reverseString(str) {
    return str.split("").reverse().join("");
}

const processedLines = lines.map((line) => {
    const firstSpelledOutNumber = spelledOutNumbers
        .map((spelledOutNumber) => ({...spelledOutNumber,position:line.indexOf(spelledOutNumber.word)}))
        .filter((number) => number.position != -1)
        .sort((a, b) => a.position - b.position)
    [0]
    const lastSpelledOutNumber = spelledOutNumbers
        .map((spelledOutNumber) => ({...spelledOutNumber,position:line.lastIndexOf(spelledOutNumber.word)}))
        .filter((number) => number.position != -1)
        .sort((a, b) => b.position - a.position)
    [0]

    if (!firstSpelledOutNumber?.word) return line
    const result = line
        .replace(firstSpelledOutNumber.word, firstSpelledOutNumber.number)
        .split("").reverse().join("") //because there is no replaceLast function
        .replace(lastSpelledOutNumber.word.split("").reverse().join(""), lastSpelledOutNumber.number)
        .split("").reverse().join("")
    
    // console.log(line, result)
    return result

})

const characterLines = processedLines.map((line) => line.split(''))

const initialValue = 0
const answer = characterLines.reduce((accumulator, charakterLine, i) => {
    const firstNumber = charakterLine.find((char) => Number(char))
    const lastNumber = charakterLine.findLast((char) => Number(char))
    // console.log(lines[i], firstNumber, lastNumber)
    if (charakterLine.indexOf(firstNumber!) == charakterLine.lastIndexOf(lastNumber!)) { //edge case: only 1 number
        return accumulator + Number(firstNumber)
    }
    return accumulator + Number(firstNumber + lastNumber)
}, initialValue)

console.log(answer)