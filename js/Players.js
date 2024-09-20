
    // Example function to perform the search


var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    var initialLayout = localStorage.getItem('layout') || 'null';
    self.layout = ko.observable(initialLayout);

    self.layout.subscribe(function(newValue) {
        localStorage.setItem('layout', newValue);
    });
    self.search = '';
    self.filter = 'null';
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Players');
    self.displayName = 'NBA Players List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(21);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);
    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    }, self);
    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    }, self);
    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);
    self.totalPages = ko.observable(0);
    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };



    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getPlayers...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        console.log(composedUri)
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.records(data.Records);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalRecords);
            //self.SetFavourites();
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
            error: function (jqXHR,errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function sleep(milliseconds) {
        const start = Date.now();
        while (Date.now() - start < milliseconds);
    }

    function showLoading() {
        $("#myModal").modal('show', {
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
        console.log("sPageURL=", sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    showLoading();
    var pg = getUrlParameter('page');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");



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

        if (data.length === 0) {
            alert("No results found.");
            return;
        }
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

    
};

search2= function() {
 $("#searchbar").autocomplete({
    source: function (request, response) {
      SearcUri =
        "http://192.168.160.58/NBA/API/Players/Search?q=" + request.term;
      console.log("accessing:" + SearcUri);
      $.ajax({
        url: SearcUri,
        method: "GET",
        dataType: "json",
        success: function (data) {
          let result = [];

          console.log(data);

          if (data.length) {
            data.forEach(function (item) {
              if (result.length < 10) {
                let obj = {
                  label: item.Name,
                  id: item.Id,
                };
                result.push(obj);
              }
            });

            console.log(result);
          } else {
            console.log("No data received.");
          }
          response(result);
        },
        error: function () {
          console.log("Error ");
        },
      });
    },
    select: function (event, ui) {
      window.location.href = "./playerDetails.html?id=" + ui.item.id;
    },
  });

}


$(document).keypress(function(key) {
    if (key.which == 13) {
        search();
    }
});

self.updateLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
}

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


self.checkButton = function(id) {
    return self.favorites2().includes(id)
}



 };







$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
    
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})





