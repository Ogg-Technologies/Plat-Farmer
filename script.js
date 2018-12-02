var wm = new Vue({
    el: '#app',
    data: {
        tabs: {
            "missions": false,
            "relics": false,
            "primes": true
        },
        missions: missionsDataJson,
        relics: [],
        primes: [],
    },
    methods: {
        tabClicked(tabName) {
            Object.keys(this.tabs).forEach(v => this.tabs[v] = false);
            this.tabs[tabName] = true;
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
