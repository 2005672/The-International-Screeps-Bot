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
                    
                    creep.say("S >= 10k")
                    
                    let target = storage
                    
                    if (target.store[RESOURCE_ENERGY] >= 10000) {
                        
                        creep.energyWithdraw(target)
                    }
                }
                else {
                    
                    creep.searchSourceContainers()
                    
                    if (container != null) {
                        
                        creep.say("SC")
                        
                        let target = container
                        
                        creep.energyWithdraw(target)
                    }
                }
            }
        }
    }
};