var roleUpgrader = require('role.upgrader');

module.exports = {
    run: function(creep) {
            
        creep.checkRoom()

        let constructionSite = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

        if (!constructionSite) {

            roleUpgrader.run(creep);

        }
        else {
            
            creep.hasEnergy()
            
            if (creep.memory.hasEnergy == true) {
    
                creep.say("🚧")
                
                target = constructionSite
    
                creep.constructionBuild(target)
            }
            else {
                
                let storage = creep.room.storage
                
                if (storage) {
                    
                    creep.say("S 5k")
                    
                    let target = storage
                    
                    if (target.store[RESOURCE_ENERGY] >= 5000) {
                        
                        creep.energyWithdraw(target)
                    }
                }
                else {

                    creep.searchSourceContainers()
                            
                        if (creep.container != null && creep.container) {
                                
                            creep.say("SC")
                                
                            let target = creep.container
                                
                            creep.energyWithdraw(target)
                    } else {
        
                        let droppedResources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                            filter: (s) => s.resourceType == RESOURCE_ENERGY && s.energy >= creep.store.getCapacity() * 0.5
                        });
        
                        if (droppedResources) {
        
                            creep.say("💡")
                            
                            target = droppedResources
        
                            creep.pickupDroppedEnergy(target)
                        }
                    }
                }
            }
        }
    }
};