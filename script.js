var wm = new Vue({
    el: '#app',
    data: {
        currentTab: "primes",
        missions: missionsDataJson,
        relics: [],
        primes: [],
    },
    computed:{
        displayedMissions: function(){

        },
        displayedRelics: function(){

        },
        displayedPrimes: function(){
            let primesToShow = []
            for (comp of this.primes){
                comp.plat = this.calculatePlatPrice(comp);
                primesToShow.push(comp);
            }
            primesToShow.sort(function(a, b){
                return b.plat-a.plat;
            });
            primesToShow = primesToShow.slice(0, 10);
            return primesToShow;
        },
    },
    methods: {
        calculatePlatPrice: function(comp){
            function getAveragePrice(ordersList){
                // Uses a list of warframe.market orders to calculate an
                // average price. Returns the average price of that list
                let sum = 0;
                for (let i = 0; i<Math.min(ordersList.length, 3); i++){
                    order = ordersList[i];
                    sum += order.Price;
                }
                return sum/3
            }
            let ordersData = comp.Data["Warframe.market"].pc;
            let buyPrice = getAveragePrice(ordersData.OnlineBuyers);
            let sellPrice = getAveragePrice(ordersData.OnlineSellers);
            let plat = (buyPrice+sellPrice)/2
            return plat;
        },
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

        // Remove all the relics from the missionsList
        this.missions = this.missions.filter(function(entry){
            return entry.type != "Relic"
        })

    },
})
