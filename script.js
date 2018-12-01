var wm = new Vue({
    el: '#app',
    data: {
        tabs: {
            "missions": true,
            "relics": false,
            "primes": false
        },
    },
    methods: {
        tabClicked(tabName) {
            Object.keys(this.tabs).forEach(v => this.tabs[v] = false);
            this.tabs[tabName] = true;
        },
    }
})