var wm = new Vue({
    el: '#app',
    data: {
        currentTab: "missions",
        missions: missionsDataJson,
        relics: [],
        primes: [],
    },
    methods: {
        tabClicked(tabName) {
            this.currentTab = tabName;
        },
    },
    created: function(){
        // Populate the primes and relics
        let seenRelicNames = []
        for (prime of primesDataJson){
            for (comp of prime.Components){
                // Skip all sets since those don't contain a relic
                if (comp.Name === "Set"){
                    continue;
                }
                // Add shared data from the item to each of the components
                for (dataKey of ["ReleaseDate", "VaultedDate", "EstimatedVaultedDate", "Vaulted"]){
                    comp[dataKey] = prime[dataKey];
                }
                comp.Name = `${prime.Name} ${comp.Name}`;
                this.primes.push(comp);
                // Add new relics to the relics array
                for (relic of comp.Relics){
                    if (seenRelicNames.indexOf(relic.Name)===-1){
                        seenRelicNames.push(relic.Name);
                        this.relics.push(relic);
                    }
                }
            }
        }

    },
})
