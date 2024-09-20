// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Seasons/');
    self.displayName = 'NBA Arena Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.Flag = ko.observable('');
    self.Players = ko.observableArray([]);
    self.Teams = ko.observableArray([]);
    self.displayedTeams = ko.observableArray([]);
    self.displayedPlayers = ko.observableArray([]);
    self.cardsPerPage = 24;


    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getSeasons...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Name(data.Name);
            self.Flag(data.Flag);
            self.Players(data.Players);
            self.Teams(data.Teams);
        });
    };

    search = function() {
        console.log("search");
        self.search = $("#searchbar").val();
    
        if (self.search.trim() === "") {
            // Refresh the page
            location.reload();
            return;
        }
    
    
        var changeuri = 'http://192.168.160.58/NBA/API/Players/search?q=' + self.search;
        self.playerslist = [];
        ajaxHelper(changeuri, 'GET').done(function(data) {
            console.log(data);
            showLoading();
            if (self.filter != 'null') {
                p = self.filter;
                var auto = []
                for (var a = 0; a < data.length; a++) {
                    var v = data[a];
                    if (v.Nationality == p) {
                        auto.push(v);
                    }
                }
                self.records(auto);
                self.totalRecords(auto.length);
                for (var info in auto) {
                    self.playerslist.push(auto[info]);
                }
            } else {
                self.records(data);
                self.totalRecords(data.length);
                for (var info in data) {
                    self.playerslist.push(data[info]);
                }
            }
            $("#pagination").addClass("d-none");
            $("#line").addClass("d-none");
            hideLoading();
    
        });
    }

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function showLoading() {
        $('#myModal').modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");


    self.loadMore = function () {
        // Get the starting index of the current slice, ignoring the first 24 Players
        var currentSliceStart = self.displayedPlayers().length + 24;
    
        // Check if there are more Players to display
        if (currentSliceStart < self.Players().length) {
            // Calculate the ending index of the current slice
            var currentSliceEnd = currentSliceStart + self.cardsPerPage;
    
            // Get a new slice of Players
            var newSlice = self.Players.slice(currentSliceStart, currentSliceEnd);
    
            // Filter out Players that are already displayed
            newSlice = newSlice.filter(function(player) {
                return self.displayedPlayers.indexOf(player) === -1;
            });
    
            // Display the new slice of Players
            self.displayedPlayers(self.displayedPlayers().concat(newSlice));
        }
    };

    self.loadMoreTeams = function () {
        // Get the starting index of the current slice, ignoring the first 24 Players
        var currentSliceStart = self.displayedTeams().length + 24;
    
        // Check if there are more Players to display
        if (currentSliceStart < self.Teams().length) {
            // Calculate the ending index of the current slice
            var currentSliceEnd = currentSliceStart + self.cardsPerPage;
    
            // Get a new slice of Players
            var newSlice = self.Teams.slice(currentSliceStart, currentSliceEnd);
    
            // Filter out Players that are already displayed
            newSlice = newSlice.filter(function(team) {
                return self.displayedTeams.indexOf(team) === -1;
            });
    
            // Display the new slice of Players
            self.displayedTeams(self.displayedTeams().concat(newSlice));
        }
    };
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})
