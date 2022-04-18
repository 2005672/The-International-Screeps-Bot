import './creepFunctions'

import { sourceHarvesterManager } from './roleManagers/commune/sourceHarvesterManager'
import { controllerUpgraderManager } from './roleManagers/commune/controllerUpgraderManager'
import { mineralHarvesterManager } from './roleManagers/commune/mineralHarvesterManager'
import { antifaManager } from './roleManagers/antifa/antifaManager'
import { maintainerManager } from './roleManagers/commune/maintainerManager'
import { builderManager } from './roleManagers/commune/builderManager'
import { scoutManager } from './roleManagers/international/scoutManager'
import { constants } from 'international/constants'
import { customLog } from 'international/generalFunctions'
import { haulerManager } from './roleManagers/commune/haulerManager'
import { source2RemoteHarvesterManager } from './roleManagers/remote/source2RemoteHarvesterManager'
import { remoteHaulerManager } from './roleManagers/remote/remoteHaulerManager'
import { claimerManager } from './roleManagers/international/claimerManager'
import { meleeDefenderManager } from './roleManagers/commune/meleeDefenderManager'
import { hubHaulerManager } from './roleManagers/commune/hubHaulerManager'
import { fastFillerManager } from './roleManagers/commune/fastFillerManager'
import { source1RemoteHarvesterManager } from './roleManagers/remote/source1RemoteHarvesterManager'
import { remoteReserverManager } from './roleManagers/remote/remoteReserver'

export function roleManager(room: Room) {

    // If CPU logging is enabled, get the CPU used at the start

    if (Memory.cpuLogging) var managerCPUStart = Game.cpu.getUsed()

    // Construct managers

    const managers: Record<CreepRoles, Function> = {
        sourceHarvester: sourceHarvesterManager,
        hauler: haulerManager,
        controllerUpgrader: controllerUpgraderManager,
        builder: builderManager,
        maintainer: maintainerManager,
        mineralHarvester: mineralHarvesterManager,
        hubHauler: hubHaulerManager,
        fastFiller: fastFillerManager,
        meleeDefender: meleeDefenderManager,
        source1RemoteHarvester: source1RemoteHarvesterManager,
        source2RemoteHarvester: source2RemoteHarvesterManager,
        remoteHauler: remoteHaulerManager,
        remoteReserver: remoteReserverManager,
        scout: scoutManager,
        claimer: claimerManager,
        antifa: antifaManager,
    }

    // Loop through each role in managers

    for (const role of constants.creepRoles) {

        // Get the CPU used at the start

        const roleCPUStart = Game.cpu.getUsed(),

        // Get the manager using the role

        manager = managers[role],

        // Get the amount of creeps with the role

        creepsOfRoleAmount = room.myCreeps[role].length

        // Iterate if there are no creeps of manager's role

        if (room.myCreeps[role].length == 0) continue

        // Run manager

        manager(room, room.myCreeps[role])

        // Log role stats

        customLog(role + 's', 'Creeps: ' + creepsOfRoleAmount + ', CPU: ' + (Game.cpu.getUsed() - roleCPUStart).toFixed(2) + ', CPU Per Creep: ' + ((Game.cpu.getUsed() - roleCPUStart) / creepsOfRoleAmount).toFixed(2), undefined)
    }

    // If CPU logging is enabled, log the CPU used by this manager

    if (Memory.cpuLogging) customLog('Role Manager', 'CPU: ' + (Game.cpu.getUsed() - managerCPUStart).toFixed(2) + ', CPU Per Creep: ' + ((Game.cpu.getUsed() - managerCPUStart) / room.myCreepsAmount).toFixed(2), undefined, constants.colors.lightGrey)
}
