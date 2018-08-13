

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

//var i = 0;
 var i = getCookie("i");
//var myVar = JSON.parse(htmlDecode("<%= JSON.stringify(songs) %>"));

function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

console.log('total song ' + totalSongs.length);
var minusOneFromTotalSongs = totalSongs.length - 1;
console.log('minus one alr ' + minusOneFromTotalSongs);

audioFooter.addEventListener('ended',function() {
    if (i==minusOneFromTotalSongs) {
        i = -1;
    }
    i++;
    console.log("value of i " + i);
    nextSong = document.querySelectorAll(".sourcePlayer")[i].src.slice(28);
    audioFooter.src = "/songs/" + nextSong;
    console.log("??aaa" + nextSong);
    audioFooter.load();
    audioFooter.play();
    //document.getElementById("nameOfSong").innerHTML = myVar[i].songName.slice(0,-4); <-- another method other than using cookie
    setCookie('songName' , nextSong);   // at first was setCookie after the document.getelement, might be buggy but ^ is reliable
    setCookie('i', i);
    var getCurrentName = getCookie("songName");
    document.getElementById("nameOfSong").innerHTML = getCurrentName.slice(0,-4);

    var nextSongImage = document.querySelectorAll(".sourcePlayer")[i];
    var nextSongImageAttr = nextSongImage.getAttribute("data-image");
    console.log(nextSongImage);
    console.log(nextSongImageAttr);
    document.querySelector(".imageOfSong").src = "/images/" + nextSongImageAttr;
    setCookie("songImage", nextSongImageAttr);

},false); 

window.onload = function() { //when load
    var getSortPriceType = getCookie("priceSortType");
    var getInput = getCookie("searchInputCookie");
    var getType = getCookie("searchType");
    var getProductFilterType = getCookie("productFilterType");
    var selectedCondition = getCookie("selectedCondition");
    $("[name=option]").val([getSortPriceType]);
    $("#searchInput").val(getInput);
    $("#searchType").val(getType);

    if (window.location.pathname == "/search/searchResult") {
        console.log("cookie onload get sort price type --->  " + getSortPriceType);
        $("#mostRecent").prop("checked", true);
        $(".productFilterType").val("None");
        console.log("search val on load page search results " + $("#searchInput").val() );
    }
    else if (window.location.pathname == "/search/prod/filter") {
        $("[name=optionCondition").val([selectedCondition]);
        $(".productFilterType").val(getProductFilterType);
    }
    else{ //else is not any of the two url, set to default instruments , val must match the option value.
        $("#searchType").val("instruments");
    }
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
    audioFooter.src =  "/songs/" + getSong;
    audioFooter.currentTime = getThis;
    //song.currentTime = getThis;
    //song.play();
    audioFooter.load();
    audioFooter.play(); 
    document.getElementById("nameOfSong").innerHTML = getSong.slice(0,-4);
    var getSongImage = getCookie("songImage");

    if (!getSongImage) {
        console.log("hello song image does not exist???");
        console.log(document.querySelector(".imageOfSong"));
        document.querySelector(".imageOfSong").src = "/images/noMusic.png";
    }
    else{
        document.querySelector(".imageOfSong").src = "/images/" + getSongImage;
    }
}

window.onbeforeunload = function() { //before exiting page
    var songNameBeforeExit = document.querySelector(".audioPlayer").src.slice(28);
    setCookie('songCookie', audioFooter.currentTime); 
    setCookie('songName' , songNameBeforeExit);
    //var songImageBeforeExit = document.querySelector(".imageOfSong").getAttribute("data-image");
    var songImageBeforeExit = document.querySelector(".imageOfSong").src.slice(29);
    alert("before exit " + songImageBeforeExit);
    console.log(" exit " + songImageBeforeExit);
    setCookie("songImage", songImageBeforeExit);
    //setCookie('i', i);
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
