const input: string = await Bun.file("./Day_20/a.txt").text();

type Pulse = { signal: boolean; from: Module; to: Module };
type PulseQueue = Set<Pulse>;

abstract class Module {
  name: string;
  connections: Module[] | undefined;
  constructor(name: string) {
    this.name = name;
    this.connections = undefined;
  }
  registerConnections(connections: Module[]) {
    this.connections = connections;
  }
  abstract recieve(pulse: Pulse, pulseQueue: PulseQueue): void;
  send(signal: boolean, pulseQueue: PulseQueue) {
    if (!this.connections)
      throw new Error("You must register the connections first.");
    this.connections.forEach((connection) =>
      pulseQueue.add({ signal, from: this, to: connection })
    );
  }
}

class FlipFlop extends Module {
  on: boolean;
  constructor(name: string) {
    super(name);
    this.on = false;
  }
  recieve(pulse: Pulse, pulseQueue: PulseQueue) {
    if (!pulse.signal) {
      this.on = !this.on;
      this.send(this.on, pulseQueue);
    }
  }
}

class Conjunction extends Module {
  lastRecievedPulses: Map<Module, boolean>;
  constructor(name: string) {
    super(name);
    this.lastRecievedPulses = new Map<Module, boolean>();
  }
  registerIncommingConnection(from: Module) {
    this.lastRecievedPulses.set(from, false);
  }
  recieve(pulse: Pulse, pulseQueue: PulseQueue) {
    this.lastRecievedPulses.set(pulse.from, pulse.signal);
    this.send(
      !Array.from(this.lastRecievedPulses.values()).every((value) => value),
      pulseQueue
    );
  }
}

class Broadcaster extends Module {
  constructor() {
    super("broadcaster");
  }
  recieve(pulse: Pulse, pulseQueue: PulseQueue): void {
    this.send(pulse.signal, pulseQueue);
  }
}

class Button extends Module {
  constructor() {
    super("button");
  }
  recieve(pulse: Pulse): void {
    throw new Error("Button can not recieve");
  }
}

class Output extends Module {
  constructor() {
    super("output");
  }
  recieve(pulse: Pulse): void {}
}

const unconnectedModules: {
  module: Module;
  connections: string[];
}[] = input.split("\n").map((line) => {
  const [moduleString, connectionsString] = line.split(" -> ");
  const connections = connectionsString.split(", ");
  if (moduleString === "broadcaster")
    return { module: new Broadcaster(), connections };
  const moduleType = moduleString[0];
  const moduleName = moduleString.substring(1, moduleString.length);
  switch (moduleType) {
    case "%":
      return { module: new FlipFlop(moduleName), connections };
    case "&":
      return { module: new Conjunction(moduleName), connections };
  }
  throw new Error("unknown module type");
});
unconnectedModules.push({ module: new Output(), connections: [] });

const modules = unconnectedModules.map((moduleToInitialize) => {
  //get references to connections
  // const connections = unconnectedModules
  //   .filter((unconnectedModule) =>
  //     moduleToInitialize.connections.includes(unconnectedModule.module.name)
  //   )
  //   .map((unconnectedModule) => unconnectedModule.module);
  const connections: Module[] = moduleToInitialize.connections.map(
    (connection) =>
      unconnectedModules.find(
        (unconnectedModule) => unconnectedModule.module.name === connection
      )?.module ?? new Output()
  );
  //register connections
  moduleToInitialize.module.registerConnections(connections);
  //get references to connected conjunctions
  const conjunctions = connections.filter(
    (connection) => connection instanceof Conjunction
  ) as Conjunction[];
  //register as incomming connection for all connected conjunctions
  conjunctions.forEach((conjunction) =>
    conjunction.registerIncommingConnection(moduleToInitialize.module)
  );
  //return only module referenc to build clean module array
  return moduleToInitialize.module;
});

function pressButton(broadcaster: Broadcaster): string {
  const pulseQueue: PulseQueue = new Set<Pulse>([
    { from: new Button(), signal: false, to: broadcaster },
  ]);
  pulseQueue.forEach((pulse) => {
    pulse.to.recieve(pulse, pulseQueue);
  });
  return Array.from(pulseQueue)
    .map(
      (pulse) =>
        `${pulse.from.name} -${pulse.signal ? "high" : "low"}-> ${
          pulse.to.name
        }`
    )
    .join("\n");
}

const broadcaster = modules.find((module) => module.name === "broadcaster");
if (!broadcaster) throw new Error("no broadcaster");

const tries = [pressButton(broadcaster)];
// while (true) {
//   const newTry = pressButton(broadcaster);
//   // console.log(newTry);
//   // console.log()
//   if (tries[0] === newTry) break;
//   tries.push(newTry);
// }
for (let i = 2; i <= 1000; i++) {
  tries.push(pressButton(broadcaster));
}
const cycleLength = tries.length;
const numberOfLowSignals = tries.reduce(
  (acc, tryValue) => acc + (tryValue.match(/-low->/g) || []).length,
  0
);
const numberOfHighSignals = tries.reduce(
  (acc, tryValue) => acc + (tryValue.match(/-high->/g) || []).length,
  0
);
console.log({ cycleLength, numberOfLowSignals, numberOfHighSignals });
const answer = numberOfLowSignals * numberOfHighSignals;
console.log({ answer });
