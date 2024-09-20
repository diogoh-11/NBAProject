$(document).ready(function() {
    $("a").on('click', function(event) {
        var hash = this.hash;
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 800, function() {
            window.location.hash = hash;
        });

    });
    $('.carousel').carousel({
        interval: 7000
    })
    $('.col-lg-4').hover(
        function() {
            $(this).animate({
                marginTop: "-=3%",
            }, 200);
        },

        function() {
            $(this).animate({
                marginTop: "0%"
            }, 200);
        }
    );
});




    function showSeasonSelect() {
        // Exibe o select
        document.getElementById("seasonSelect").style.display = "block";
    }

    function hideSeasonSelect() {
        // Oculta o select
        document.getElementById("seasonSelect").style.display = "none";
    }
