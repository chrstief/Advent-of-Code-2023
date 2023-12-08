const input: string = await Bun.file("./Day_08/a.txt").text();
const lines = input.split('\n')

// console.log(lines)

const directions = lines[0]
// console.log(directions)

const nodes = lines.slice(2).map(node => {
    const matches = node.match(/\w{3}/g)??[]
    // console.log(matches)
    return ({location:matches[0],L:matches[1],R:matches[2]})
})
// console.log(nodes)

let step = 0
let stepOffset = 0
let currentNode = nodes.find(node => node.location == 'AAA')
// console.log(currentNode)
while (currentNode?.location != 'ZZZ') {
    const direction = directions[step - stepOffset]
    if(!direction) console.log({step},{stepOffset},directions.length)
    console.log(direction)
    currentNode = nodes.find(node => node.location == currentNode[direction])
    console.log(currentNode?.location)
    step++
    if (step%directions.length==0) stepOffset+=directions.length
}
console.log(step)