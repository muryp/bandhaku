import './syncsimulator'
// await sim.success() // local → pending → synced
await sim.error() // local → pending → local
// await sim.conflict() // synced → conflict + _serverVersion
// await sim.timeout() // local → pending → local setelah 30s
// await sim.partial() // 2 tx → 1 synced, 1 local
// await sim.dump() // Liat DB kapan aja
