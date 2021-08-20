var roleUpgrader = require('role.upgrader')

function builderManager(room, creepsWithRole) {

    const anchorPoint = room.get("anchorPoint")

    if (!anchorPoint) return

    let mySites = room.get("mySites")

    if (mySites.length == 0) {

        for (let creep of creepsWithRole) {

            roleUpgrader.run(creep)
            return
        }
    }

    let targetSite = findObjectWithId(room.memory.targetSite)

    if (!targetSite) {

        if (creepsWithRole.length == 1) {


            targetSite = creepsWithRole[0].pos.findClosestByRange(mySites)
            room.memory.targetSite = targetSite.id

        } else {

            targetSite = room.memory.targetSite = new RoomPosition(anchorPoint.x, anchorPoint.y, anchorPoint.roomName).findClosestByRange(mySites)
            room.memory.targetSite = targetSite.id
        }
    }

    if (!targetSite) return

    room.visual.text("🚧", targetSite.pos.x, targetSite.pos.y + 0.25, { align: 'center' })

    for (let creep of creepsWithRole) {

        creep.isFull()
        const isFull = creep.memory.isFull

        if (isFull) {

            creep.say("🚧")

            creep.buildSite(targetSite)

        } else {

            let terminal = creep.room.get("terminal")

            if (terminal && terminal.store[RESOURCE_ENERGY] >= 30000) {

                creep.say("T")

                creep.advancedWithdraw(terminal)
            } else {

                let storage = creep.room.get("storage")

                if (storage) {

                    creep.say("S")

                    if (storage.store[RESOURCE_ENERGY] >= 35000) {

                        creep.advancedWithdraw(storage)
                    }
                } else {

                    let container = creep.searchSourceContainers()

                    if (container) {

                        creep.say("SC")

                        creep.advancedWithdraw(container)

                    } else {

                        let droppedEnergy = findDroppedEnergyOfAmount(creep.store.getFreeCapacity())

                        if (droppedEnergy) {

                            creep.say("💡")

                            creep.pickupDroppedEnergy(droppedEnergy)
                        }
                    }
                }
            }
        }

        creep.avoidHostiles()
    }
}

module.exports = builderManager