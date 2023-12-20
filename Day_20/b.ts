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
  recieve(pulse: Pulse): void {}
}

class Rx extends Module {
  on: boolean = false;
  constructor() {
    super("Rx");
  }
  recieve(pulse: Pulse): void {
    if (!pulse) this.on = true;
  }
}
const rx = new Rx();

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

const modules = unconnectedModules.map((moduleToInitialize) => {
  const connections: Module[] = moduleToInitialize.connections.map(
    (connection) => {
      if (connection == "rx") return rx;
      return (
        unconnectedModules.find(
          (unconnectedModule) => unconnectedModule.module.name === connection
        )?.module ?? new Output(connection)
      );
    }
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

// const tries = [pressButton(broadcaster)];
// while (true) {
//   const newTry = pressButton(broadcaster);
//   console.log(newTry);
//   console.log();
//   if (tries[0] === newTry) break;
//   tries.push(newTry);
// }
// console.log(tries.length);

let tries = 0;
while (!rx.on) {
  pressButton(broadcaster);
  tries++;
}
console.log(tries);
