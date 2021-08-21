function harvesterHaulerManager(room, creepsWithRole) {

    if (creepsWithRole.length == 0) return

    let immovableHarvesters = room.find(FIND_MY_CREEPS, {
        filter: harvester => harvester.memory.role == "harvester" && harvester.findParts("move") == 0 && harvester.memory.task && (!harvester.memory.hauler || harvester.memory.hauler == creep.name) && harvester.pos.getRangeTo(room.get(harvester.memory.task)) > 1
    })

    for (let creep of creepsWithRole) {

        if (immovableHarvesters.length > 0) {

            creep.say("P")

            let harvester = creep.pos.findClosestByRange(immovableHarvesters)
            harvester.memory.hauler = creep.name

            let source = room.get(harvester.memory.task)

            if (creep.pos.getRangeTo(source) == 1) {

                creep.move(creep.pos.getDirectionTo(harvester))

                creep.pull(harvester)

                harvester.move(creep)

            } else {

                if (creep.pull(harvester) == ERR_NOT_IN_RANGE) {

                    creep.advancedPathing({
                        origin: creep.pos,
                        goal: { pos: harvester.pos, range: 1 },
                        plainCost: false,
                        swampCost: false,
                        defaultCostMatrix: room.memory.defaultCostMatrix,
                        avoidStages: [],
                        flee: false,
                        cacheAmount: 1,
                    })
                } else {

                    harvester.move(creep)

                    creep.advancedPathing({
                        origin: creep.pos,
                        goal: { pos: source.pos, range: 1 },
                        plainCost: false,
                        swampCost: false,
                        defaultCostMatrix: room.memory.defaultCostMatrix,
                        avoidStages: [],
                        flee: false,
                        cacheAmount: 1,
                    })
                }
            }
        } else {

            creep.isFull()
            const isFull = creep.memory.isFull

            if (isFull) {

                let lowTowers = room.find(FIND_MY_STRUCTURES, {
                    filter: s => s.structureType == STRUCTURE_TOWER && s.store.getUsedCapacity() < 500
                })

                if (lowTowers) {

                    let lowTower = creep.pos.findClosestByRange(lowTowers)

                    creep.advancedTransfer(lowTower)

                } else {

                    let essentialStructures = room.find(FIND_MY_STRUCTURES, {
                        filter: s => (s.structureType == STRUCTURE_EXTENSION ||
                                s.structureType == STRUCTURE_SPAWN ||
                                s.structureType == STRUCTURE_TOWER && s.store.getUsedCapacity() < 710) &&
                            s.store.getUsedCapacity() < s.store.getCapacity()
                    })

                    if (essentialStructures) {

                        let essentialStructure = creep.pos.findClosestByRange(essentialStructures)

                        essentialStructuresTransfer(essentialStructure)

                    } else {

                        let storage = room.get("storage")

                        if (storage && storage.store[RESOURCE_ENERGY] <= 30000) {

                            creep.advancedTransfer(storage)

                        } else {

                            let controllerContainer = room.get("controllerContianer")

                            if (controllerContainer && controllerContainer.store.getFreeCapacity() >= creep.store.getUsedCapacity()) {

                                creep.advancedTransfer(controllerContainer)

                            } else {

                                if (storage && storage.store.getFreeCapacity() >= creep.store.getUsedCapacity()) {

                                    creep.advancedTransfer(storage)
                                }
                            }
                        }
                    }
                }

                function essentialStructuresTransfer(essentialStructure) {

                    room.visual.text("☀️", essentialStructure.pos.x, essentialStructure.pos.y + 0.25, { align: 'center' })

                    if (creep.advancedTransfer(essentialStructure) == 0) {

                        essentialStructuresAlt = room.find(FIND_MY_STRUCTURES, {
                            filter: s => (s.structureType == STRUCTURE_EXTENSION ||
                                    s.structureType == STRUCTURE_SPAWN ||
                                    s.structureType == STRUCTURE_TOWER && s.store.getUsedCapacity() < 710) &&
                                s.store.getUsedCapacity() < s.store.getCapacity() && s.id != essentialStructure.id
                        })

                        let essentialStructureAlt = creep.pos.findClosestByRange(essentialStructuresAlt)

                        if (essentialStructuresAlt.length > 0 && creep.store[RESOURCE_ENERGY] > essentialStructureAlt.store.getFreeCapacity()) {

                            if (creep.pos.getRangeTo(essentialStructureAlt) > 1) {

                                creep.advancedPathing({
                                    origin: creep.pos,
                                    goal: { pos: essentialStructureAlt.pos, range: 1 },
                                    plainCost: false,
                                    swampCost: false,
                                    defaultCostMatrix: creep.memory.defaultCostMatrix,
                                    avoidStages: [],
                                    flee: false,
                                    cacheAmount: 10,
                                })
                            }
                        } else if (storage && storage.store.getFreeCapacity() >= creep.store.getUsedCapacity()) {

                            creep.advancedPathing({
                                origin: creep.pos,
                                goal: { pos: storage.pos, range: 1 },
                                plainCost: false,
                                swampCost: false,
                                defaultCostMatrix: creep.memory.defaultCostMatrix,
                                avoidStages: [],
                                flee: false,
                                cacheAmount: 10,
                            })
                        }
                    }
                }
            } else {


            }
        }

        creep.avoidHostiles()
    }
}

module.exports = harvesterHaulerManager