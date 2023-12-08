const input: string = await Bun.file("./Day_08/a.txt").text();
const lines = input.split('\n')

// console.log(lines)

const directions = lines[0]
// console.log(directions)

const nodes = lines.slice(2).map(node => {
    const matches:string[] = node.match(/\w{3}/g)
    // console.log(matches)
    return ({location:matches[0],L:matches[1],R:matches[2]})
})
// console.log(nodes)

let step = 0
let stepOffset = 0
let currentNodes = nodes.filter(node => node.location[2] == 'A')
// console.log(currentNodes)
while (currentNodes.some(node => node.location[2] != 'Z')) {
    const direction = directions[step - stepOffset]
    // if(!direction) console.log({step},{stepOffset},directions.length)
    // console.log(direction)
    currentNodes = currentNodes.map(currentNode=>nodes.find(node => node.location == currentNode[direction as keyof typeof currentNode]))
    // console.log(currentNode?.location)
    step++
    if (step%directions.length==0) stepOffset+=directions.length
}
console.log(step)