// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Local variables
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Teams/');
    self.displayName = 'NBA Team Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.Opened = ko.observable('');
    // Data Record
    self.Id = ko.observable('');
    self.Acronym = ko.observable('');
    self.Name = ko.observable('');
    self.ConferenceId = ko.observable('');
    self.ConferenceName = ko.observable('');
    self.DivisionId = ko.observable('');
    self.DivisionName = ko.observable('');
    self.StateId = ko.observable('');
    self.StateName = ko.observable('');
    self.City = ko.observable('');
    self.Logo = ko.observable('');
    self.History = ko.observable('');
    self.Seasons = ko.observableArray([]);
    self.Players = ko.observableArray([]);
    self.displayedPlayers = ko.observableArray([]);
    self.cardsPerPage = 24;

    // Page Events
    self.activate = function (id, acronym) {
        console.log('CALL: getTeam...');
        var composedUri = `${self.baseUri()}${id}?acronym=${acronym}`;
        
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
    
            // Check if data is not null or undefined
            if (data) {
                self.Id(data.Id || '');
                self.Acronym(data.Acronym || '');
                self.Name(data.Name || '');
                self.ConferenceId(data.ConferenceId || '');
                self.ConferenceName(data.ConferenceName || '');
                self.DivisionId(data.DivisionId || '');
                self.DivisionName(data.DivisionName || '');
                self.StateId(data.StateId || '');
                self.StateName(data.StateName || '');
                self.City(data.City || '');
                self.Logo(data.Logo || '');
                self.History(data.History || '');
                self.Seasons(data.Seasons || []);
                self.Players(data.Players || []);
                console.log(data)
            } else {
                console.error('Data is null or undefined!');
            }
        });
    };

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
    var acr = getUrlParameter('acronym');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg,acr);
    }
    console.log("VM initialized!");


    self.loadMore = function () {
        var currentSliceEnd = self.displayedPlayers().length + self.cardsPerPage;
        var newSlice = self.Players.slice(0, currentSliceEnd);
        self.displayedPlayers(newSlice);
    };

    self.loadMore();

    // Initial loading
    self.activate(pg, acr);

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

};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})

