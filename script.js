var wm = new Vue({
    el: '#app',
    data: {
        currentTab: "primes",
        missions: missionsDataJson,
        relics: [],
        primes: [],
    },
    computed: {
        displayedMissions: function() {

        },
        displayedRelics: function() {
            let relicsToShow = [];
            for (relic of this.relics) {
                // Calculate the average plat for the relic.
                let plat = 0;
                for (drop of relic.drops) {
                    /*
                    Probability of getting a certain rarity from intact relic.
                    Common: 25.33%
                    Uncommon: 11%
                    Rare: 2%
                    */
                    switch (drop.rarity) {
                        case "Common":
                            plat += drop.item.plat * 0.2533;
                            break;
                        case "Uncommon":
                            plat += drop.item.plat * 0.11;
                            break;
                        case "Rare":
                            plat += drop.item.plat * 0.02;
                            break;
                    }
                }
                relic.plat = plat;
                relicsToShow.push(relic);
            }
            relicsToShow.sort(function(a, b) {
                return b.plat - a.plat;
            });
            relicsToShow = relicsToShow.slice(0, 10);
            return relicsToShow;
        },
        displayedPrimes: function() {
            let primesToShow = []
            for (comp of this.primes) {
                comp.plat = this.calculatePlatPrice(comp);
                primesToShow.push(comp);
            }
            primesToShow.sort(function(a, b) {
                return b.plat - a.plat;
            });
            primesToShow = primesToShow.slice(0, 10);
            return primesToShow;
        },
    },
    methods: {
        calculatePlatPrice: function(comp) {
            function getAveragePrice(ordersList) {
                // Uses a list of warframe.market orders to calculate an
                // average price. Returns the average price of that list
                let sum = 0;
                for (let i = 0; i < Math.min(ordersList.length, 3); i++) {
                    order = ordersList[i];
                    sum += order.Price;
                }
                return sum / 3
            }
            let ordersData = comp.Data["Warframe.market"].pc;
            let buyPrice = getAveragePrice(ordersData.OnlineBuyers);
            let sellPrice = getAveragePrice(ordersData.OnlineSellers);
            let plat = (buyPrice + sellPrice) / 2
            return plat;
        },
        tabClicked(tabName) {
            this.currentTab = tabName;
        },
    },
    created: function() {
        // Populate the primes and relics
        let relicsDict = {};
        // let seenRelicNames = [];
        for (prime of primesDataJson) {
            for (comp of prime.Components) {
                // Skip all sets since those don't contain a relic
                if (comp.Name === "Set") {
                    continue;
                }
                // Add shared data from the item to each of the components
                for (dataKey of ["ReleaseDate", "VaultedDate", "EstimatedVaultedDate", "Vaulted"]) {
                    comp[dataKey] = prime[dataKey];
                }
                comp.Name = `${prime.Name} ${comp.Name}`;
                comp.plat = 0;
                this.primes.push(comp);
                // Add new relics to a dict which gets converted to an array
                for (relic of comp.Relics) {
                    if (relic.Name in relicsDict) {
                        relicsDict[relic.Name].drops.push({
                            "rarity": relic.Rarity,
                            "item": comp
                        });
                    } else {
                        relicCopy = {
                            "Name": relic.Name,
                            "Vaulted": relic.Vaulted,
                            "plat": 0,
                            "drops": [{
                                "rarity": relic.Rarity,
                                "item": comp
                            }]
                        }
                        relicsDict[relic.Name] = relicCopy;
                    }

                    // if (seenRelicNames.indexOf(relic.Name)===-1){
                    //     seenRelicNames.push(relic.Name);
                    //     this.relics.push(relic);
                    // }
                }
            }
        }
        this.relics = Object.values(relicsDict);

        // Remove all the relics from the missionsList
        this.missions = this.missions.filter(function(entry) {
            return entry.type != "Relic"
        })

    },
})