        var countDownDate = new Date("July 31, 2021 20:30:00").getTime();
        var x = setInterval(function(){
        var now = new Date().getTime();
        var distance =countDownDate-now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        var seconds = Math.floor((distance % (1000 * 60)) / 1000).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        document.getElementById("timer").innerHTML = hours + ": "
        + minutes + ": " + seconds + "";
        if (distance < 0) {
            clearInterval(x);
            document.body.innerHTML="";
            document.body.innerHTML="<center><div class='card' style='margin-top:20%;width:50%;padding:2vw 0;' ><h2>Test Over!</h2></div></center>"
        }
        }, 1000);