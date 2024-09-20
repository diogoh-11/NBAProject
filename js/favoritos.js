function Favorites() {
    var self = this;

    // arenas
    self.playersData = ko.observableArray([])
    self.loadplayers = () => {
        let data = JSON.parse(localStorage.getItem("playerFavorites"))
        let temp = []
        if (data != null) {

            data.forEach(e => {
                $.ajax({
                    type: "GET",
                    url: "http://192.168.160.58/NBA/API/Players/Player",
                    async: false,
                    data: {
                        id: e
                    },
                    dataType: "json",
                    contentType: 'application/json',
                    success: function(response) {
                        temp.push(response)
                    },
                    error: function(e) {
                        console.log(e);
                    }
                });
            });
        } else {
            temp = []
        }

        return temp;
    };
    
    self.playersData(self.loadplayers());

    console.log("PlayersData:", ko.toJS(self.playersData));

    // arenas
    self.arenasData = ko.observableArray([])
    self.loadarenas = () => {
        let data = JSON.parse(localStorage.getItem("arenaFavorites"))
        let temp = []
        if (data != null) {

            data.forEach(e => {
                $.ajax({
                    type: "GET",
                    url: "http://192.168.160.58/NBA/API/Arenas/Arena",
                    async: false,
                    data: {
                        id: e
                    },
                    dataType: "json",
                    contentType: 'application/json',
                    success: function(response) {
                        temp.push(response)
                    },
                    error: function(e) {
                        console.log(e);
                    }
                });
            });
        } else {
            temp = []
        }

        return temp;
    };
    
    self.arenasData(self.loadarenas());

    console.log("ArenasData:", ko.toJS(self.arenasData));

    self.updateLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data))
    };
    
    self.favorites2 = ko.observableArray(JSON.parse(localStorage.getItem("playerFavorites")))

    self.favButton = (id, event) => {
        if (!event.target.classList.contains('active2')) {
            if (self.favorites2.indexOf(id) === -1)
                self.favorites2.push(id)
            self.updateLocalStorage("playerFavorites", self.favorites2())
            event.target.classList.remove('fa-heart-o');
            event.target.classList.add('fa-heart');
            event.target.classList.add('active2');
            console.log(self.favorites2())
        } else {
            self.favorites2.splice(self.favorites2.indexOf(id), 1)
            self.updateLocalStorage("playerFavorites", self.favorites2())
            event.target.classList.remove('fa-heart');
            event.target.classList.add('fa-heart-o');
            event.target.classList.remove('active2');
            console.log(self.favorites2())
        }
    }

    self.favorites = ko.observableArray(JSON.parse(localStorage.getItem("arenaFavorites")));

    self.favButton2 = (id, event) => {
        if (!event.target.classList.contains('active2')) {
            if (self.favorites.indexOf(id) === -1)
                self.favorites.push(id)
            self.updateLocalStorage("arenaFavorites", self.favorites())
            event.target.classList.remove('fa-heart-o');
            event.target.classList.add('fa-heart');
            event.target.classList.add('active2');
            console.log(self.favorites())
        } else {
            self.favorites.splice(self.favorites.indexOf(id), 1)
            self.updateLocalStorage("arenaFavorites", self.favorites())
            event.target.classList.remove('fa-heart');
            event.target.classList.add('fa-heart-o');
            event.target.classList.remove('active2');
            console.log(self.favorites())
        }
    };
    
    
    self.checkButton = function(id) {
        return self.favorites().includes(id)
    };

    self.checkButton = function(id) {
        return self.favorites2().includes(id)
    }
    
    
    
    

}






const f = new Favorites
ko.applyBindings(f);