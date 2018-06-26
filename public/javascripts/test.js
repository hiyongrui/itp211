

function setCookie(cname,cvalue,exdays)
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}



var song = document.getElementsByTagName('audio')[0];

var audioFooter = document.querySelector(".audioPlayer");

var sourceFooter = document.querySelector(".sourcePlayer").src.slice(28);
console.log("audio footer from test.js > > " + sourceFooter);

var i = 0;

//var myVar = JSON.parse(htmlDecode("<%= JSON.stringify(songs) %>"));


audioFooter.addEventListener('ended',function() {
    i++;
    nextSong = document.querySelectorAll(".sourcePlayer")[i].src.slice(28);
    audioFooter.src = "songs/" + nextSong;
    console.log("??aaa" + nextSong);
    audioFooter.load();
    audioFooter.play();
    //document.getElementById("nameOfSong").innerHTML = myVar[i].songName.slice(0,-4); <-- another method other than using cookie
    setCookie('songName' , nextSong);   // at first was setCookie after the document.getelement, might be buggy but ^ is reliable
    var getCurrentName = getCookie("songName");
    document.getElementById("nameOfSong").innerHTML = getCurrentName.slice(0,-4);
    if (i==2) {
        i = -1;
    }
},false); 

window.onload = function() { //when load
    var getThis = getCookie('songCookie');
    //setCookie('songName', sourceFooter);
    //song.currentTime = getThis;
    //song.play();    
    var getSong = getCookie('songName');
    /* if (document.cookie.indexOf('songName=') == -1) {
        audioFooter.src = "songs/" + sourceFooter;
        audioFooter.currentTime = getThis;
        audioFooter.play();
    }
    else{ */
    audioFooter.src =  "songs/" + getSong;
    audioFooter.currentTime = getThis;
    //song.currentTime = getThis;
    //song.play();
    audioFooter.load();
    audioFooter.play(); 
    document.getElementById("nameOfSong").innerHTML = getSong.slice(0,-4);
}

window.onbeforeunload = function() { //before exiting page
    var songNameBeforeExit = document.querySelector(".audioPlayer").src.slice(28);
    setCookie('songCookie', audioFooter.currentTime); 
    setCookie('songName' , songNameBeforeExit)   
}



/*
var played = false;
var tillPlayed = getCookie('timePlayed');
function update()
{
    if(!played){
        if(tillPlayed){
        song.currentTime = tillPlayed;
        song.play();
        played = true;
        }
        else {
                song.play();
                played = true;
        }
    }

    else {
    setCookie('timePlayed', song.currentTime);
    }
} */
//setInterval(update,1000);
