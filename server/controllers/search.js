
var Product = require('../models/sampleProduct');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

var Images = require('../models/images');

var Songs = require('../models/songs');

var ProductTag = require('../models/productTags');

/*
// post request from client 
exports.searchResult = function(req,res) {
    //var searchKeyword = req.param.clientKeyword;
    var searchKeyword = "%" + req.body.searchKey + "%";

    console.log("search keyword from client js ------ " + searchKeyword);
    console.log("req body from post request search "  + JSON.stringify(req.body));
    console.log("req param from post search @@@@ " + JSON.stringify(req.params));
    console.log("req query from post request rr  " + JSON.stringify(req.query) );

    sequelize.query('select * from Products where productListingName like :keyword',
    {replacements: {keyword:searchKeyword}, type:sequelize.QueryTypes.SELECT }).then(searchResults => {
        console.log("search result is -------   " + JSON.stringify(searchResults));
        console.log("search result length -- " + searchResults.length);
        if (searchResults.length == 0) {
            res.sendStatus(500);
            console.log("search failed lol ");
        }
        else{
            res.sendStatus(200);
            console.log("search success ????? ");
            //res.render('searchResults', {
              //  searchResults: searchResults
            //})
        }
    })
}
*/


//get request from client , search function
exports.searchList = function(req,res) {
    //var searchParams = "%" + req.params.searchResult + "%";
    //var searchParamsWithoutPercentage = req.params.searchResult;
    var searchQuery = "%" + req.query.comeon + "%";
    var searchQueryWithoutPercentage = req.query.comeon;
    console.log("req query get request search prod input from user " + JSON.stringify(req.query));
    console.log("\n req params from get request @@@@  " + JSON.stringify(req.params));
    console.log(" \n lolool body " + JSON.stringify(req.body));
    //console.log("search params list >>>>>>>>   " + searchParams);
    console.log("search query list " + searchQuery);

    var cookieSearchType = req.cookies.searchType
    console.log("cookie search type " + cookieSearchType);

    var reqQueryLength = Object.keys(req.query).length;
    console.log("\n length of req query " + reqQueryLength);
    if (cookieSearchType == "instruments") {
        sequelize.query("select * from Products where productListingName like :clientParams",
        {replacements: {clientParams: searchQuery}, type:sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
            sequelize.query("select pt.productTags from Products p inner join ProductTags pt on p.id = pt.product_id where productListingName like :productListingName",
            {replacements: {productListingName: searchQuery}, type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                console.log("dynamic search >>>>>>>> " + dynamicSearch);
                console.log(JSON.stringify(dynamicSearch));
                console.log("dynamic search length " + dynamicSearch.length);
                console.log("dynamic tag search >>>>  " + dynamicTags);
                console.log(JSON.stringify(dynamicTags));
                console.log(dynamicTags.length);

                res.render('searchResults', {
                    dynamicSearch: dynamicSearch,
                    dynamicTags: dynamicTags,
                    //searchParams: searchParamsWithoutPercentage
                    searchQuery: searchQueryWithoutPercentage,
                    cookieSearchType: cookieSearchType
                });
            });
        })
    }
    else if (cookieSearchType == "songs") {
        if (req.user) { // if user then add to playlist button available
            console.log("user logged in is requesting for search for songs ");
            sequelize.query("select * from Songs where title like :clientParams",
            {replacements: {clientParams: searchQuery}, type:sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                sequelize.query("select st.songTags from Songs s inner join SongTags st on s.id = st.song_id where title like :songListingName",
                {replacements: {songListingName: searchQuery}, type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                    sequelize.query("select * from Playlists where user_id = :currentUserViewing",
                    {replacements: {currentUserViewing: req.user.id}, type:sequelize.QueryTypes.SELECT }).then(playlists => {
                        console.log("dynamic search of songs ----- " + JSON.stringify(dynamicSearch));
                        console.log("dynamic song search length  " + dynamicSearch.length);
                        console.log("dynamic tag of song ---  " + JSON.stringify(dynamicTags));
                        console.log("dynamic tags of song sarch -- " + dynamicTags.length);
                        console.log("\n add to playlist available current user ----\n " + JSON.stringify(playlists));
                        res.render("searchResults", {
                            dynamicSearch: dynamicSearch,
                            dynamicTags: dynamicTags,
                            searchQuery: searchQueryWithoutPercentage,
                            cookieSearchType: cookieSearchType,
                            playlists: playlists
                        })
                    })
                })
            })
        }
        else{
            console.log("user requesting to search for song is not logged in , user id = 1 benjamin")
            sequelize.query("select * from Songs where title like :clientParams",
            {replacements: {clientParams: searchQuery}, type:sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                sequelize.query("select st.songTags from Songs s inner join SongTags st on s.id = st.song_id where title like :songListingName",
                {replacements: {songListingName: searchQuery}, type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                    sequelize.query("select * from Playlists where user_id = 1",
                    { type:sequelize.QueryTypes.SELECT }).then(playlists => {
                        console.log("dynamic search of songs ----- " + JSON.stringify(dynamicSearch));
                        console.log("dynamic song search length  " + dynamicSearch.length);
                        console.log("dynamic tag of song ---  " + JSON.stringify(dynamicTags));
                        console.log("dynamic tags of song sarch -- " + dynamicTags.length);
                        console.log("\n add to playlist available current user ----\n " + JSON.stringify(playlists));
                        res.render("searchResults", {
                            dynamicSearch: dynamicSearch,
                            dynamicTags: dynamicTags,
                            searchQuery: searchQueryWithoutPercentage,
                            cookieSearchType: cookieSearchType,
                            playlists: playlists
                        })
                    })
                })
            })
        }
    } //end of if search type is songs
    else {
        if (req.user) {
            console.log("user requesting to search for all...... / lessons ");
            sequelize.query("select * from Products where productListingName like :clientParams",
            {replacements: {clientParams: searchQuery}, type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                sequelize.query("select * from Songs where title like :clientParams",
                {replacements: {clientParams: searchQuery}, type: sequelize.QueryTypes.SELECT }).then(dynamicSongs => {
                    sequelize.query("select pt.productTags from Products p inner join ProductTags pt on pt.product_id = p.id where productListingName like :clientParams",
                    {replacements: {clientParams: searchQuery} , type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                        sequelize.query("select * from Playlists where user_id = :currentUserViewing",
                        {replacements: {currentUserViewing: req.user.id}, type:sequelize.QueryTypes.SELECT }).then(playlists => {
                            console.log("dynamic search of prod ---- " + JSON.stringify(dynamicSearch));
                            console.log("dynamic search of songs --- " + JSON.stringify(dynamicSongs));
                            res.render("searchResults", {
                                dynamicSearch: dynamicSearch,
                                dynamicTags: dynamicTags,
                                dynamicSongs: dynamicSongs,
                                searchQuery: searchQueryWithoutPercentage,
                                cookieSearchType: cookieSearchType,
                                playlists: playlists
                            })
                        })
                    })
                })
            })
        }
        else{
            console.log("user not logged in requesting to search for all...  & lessons");
            sequelize.query("select * from Products where productListingName like :clientParams",
            {replacements: {clientParams: searchQuery}, type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                sequelize.query("select * from Songs where title like :clientParams",
                {replacements: {clientParams: searchQuery}, type: sequelize.QueryTypes.SELECT }).then(dynamicSongs => {
                    sequelize.query("select pt.productTags from Products p inner join ProductTags pt on pt.product_id = p.id where productListingName like :clientParams",
                    {replacements: {clientParams: searchQuery} , type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                        sequelize.query("select * from Playlists where user_id = 1",
                        { type:sequelize.QueryTypes.SELECT }).then(playlists => {
                            console.log("dynamic search of prod not log in  ---- " + JSON.stringify(dynamicSearch));
                            console.log("dynamic search of songs no log --- " + JSON.stringify(dynamicSongs));
                            res.render("searchResults", {
                                dynamicSearch: dynamicSearch,
                                dynamicTags: dynamicTags,
                                dynamicSongs: dynamicSongs,
                                searchQuery: searchQueryWithoutPercentage,
                                cookieSearchType: cookieSearchType,
                                playlists: playlists
                            })
                        })
                    })
                })
            })
        }
    }
} //end of search function lol


//get request for tag , after searching for product name..
exports.searchForTag = function(req,res) {
    console.log("JIBAI DOG WTF");
    var searchForTag =  "%" + req.query.tag + "%";
    console.log("search tag param new function ----- " + searchForTag);
    console.log(req.params.searchResult);
    console.log(" req query get request tag --- " + JSON.stringify(req.query));
    console.log("\n req params for tag ----  " + JSON.stringify(req.params));
    console.log(" \n lolool req.body for tag --  " + JSON.stringify(req.body));


    sequelize.query("select * from ProductTags pt inner join Products p on pt.product_id = p.id where pt.productTags like :clientTagParams ", 
    {replacements: {clientTagParams: searchForTag}, type: sequelize.QueryTypes.SELECT }).then(searchTag => {
        console.log("search tag result >>>>>> " + searchTag);
        console.log(JSON.stringify(searchTag));
        res.render('searchTag', {
            searchTag: searchTag
        })
    })
}


//another function for filtering, lowest price - popular - category
exports.searchFilter = function(req,res) {
    console.log("knn smrt dog");
    //var searchParams = "%" + req.params.searchResult + "%";
    //var searchParamsWithoutPercentage = req.params.searchResult;
    var searchQuery = "%" + req.params.searchResult + "%";
    var searchQueryWithoutPercentage = req.params.searchResult;

    console.log("search filter req query -- " + JSON.stringify(req.query));
    console.log("search filter req param ...  " + JSON.stringify(req.params));
    console.log("search filter body ----   " + JSON.stringify(req.body));

    var priceSortType = req.query.sortedBy;
    console.log("price sort type >>> " + priceSortType);

    console.log("search query result --- " + searchQuery);

    var cookieSearchType = req.cookies.searchType
    console.log("cookie search type from filter function ---  " + cookieSearchType);
    console.log("req quey category --- " + req.query.category);

    var inputMin = req.cookies.inputMin;
    var inputMax = req.cookies.inputMax;
    console.log("min price ---> " + inputMin + "max price ---- " + inputMax);

    if (priceSortType == "mostRecent") {
        console.log("MOST RECENT@@@@@@@@@@@@ ");
        if (req.query.category && req.query.condition) { // 1) if most recent , Java , new condition
            if (req.query.category == "None") { //if category is none display all
                sequelize.query("select * from Products where productListingName like :clientParams and productListingCondition = :condition",
                {replacements: {clientParams: searchQuery, condition: req.query.condition} , type:sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                    sequelize.query("select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id \
                    where productListingName like :clientParams and productListingCondition = :condition",
                    {replacements: {clientParams: searchQuery, productCategory: req.query.category, condition: req.query.condition}, type:sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                        console.log("filter category is none , most recent lol  " + JSON.stringify(dynamicSearch,null,"       "));
                        console.log("filter category tag is none -============> " + JSON.stringify(dynamicTags,null,2));
                        console.log(dynamicSearch.length);
                        console.log(dynamicTags.length);
                        res.render("searchResults", {
                            dynamicSearch: dynamicSearch,
                            dynamicTags: dynamicTags,
                            searchQuery: searchQueryWithoutPercentage,
                            cookieSearchType: cookieSearchType
                        })
                    })
                })
            }
            else{
                console.log("GG NOT HERE???");
                sequelize.query("select * from Products where productListingName like :clientParams and productListingType = :productCategory and productListingCondition = :condition",
                {replacements: {clientParams: searchQuery, productCategory: req.query.category, condition: req.query.condition} , type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                    sequelize.query("select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id \
                            where productListingName like :clientParams and productListingType = :productCategory and productListingCondition = :condition",
                            {replacements: {clientParams: searchQuery, productCategory: req.query.category, condition: req.query.condition}, type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                                console.log(" filter result of both category and condition --- " + JSON.stringify(dynamicSearch));
                                console.log("\n tag filter result of both category and condition .. \n " + JSON.stringify(dynamicTags));
                                res.render("searchResults", {
                                    dynamicSearch: dynamicSearch,
                                    dynamicTags: dynamicTags,
                                    searchQuery: searchQueryWithoutPercentage,
                                    cookieSearchType: cookieSearchType
                                })
                    })
                });
            }
            
        }

        else if (req.query.condition) { // 2) if most recent , new condition only
            console.log("ONLY CONDITION???? ");
            sequelize.query("select * from Products where productListingName like :clientParams and productListingCondition = :condition",
            {replacements: {clientParams: searchQuery, condition: req.query.condition} , type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                sequelize.query("select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id where productListingName like :clientParams and productListingCondition = :condition",
                {replacements: {clientParams: searchQuery, condition: req.query.condition} , type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                    console.log("filter result of only condition zzzzzzzzz  \n " + JSON.stringify(dynamicSearch));
                    console.log("\n tag result of condiiton only zzzzzzz \n " + JSON.stringify(dynamicTags));
                    res.render("searchResults", {
                        dynamicSearch: dynamicSearch,
                        dynamicTags: dynamicTags,
                        searchQuery: searchQueryWithoutPercentage,
                        cookieSearchType: cookieSearchType
                    })
                })
            })
        }

        else if (req.query.category) { // 3) if most recent , category only
            console.log(" @@@@@@@@@@@@@ CATEGORY ONLY @@@@@@@@@@ ");
            if (req.query.category == "None") { //if category is none display all
                sequelize.query("select * from Products where productListingName like :clientParams",
                {replacements: {clientParams: searchQuery} , type:sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                    sequelize.query("select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id where productListingName like :clientParams",
                    {replacements: {clientParams: searchQuery}, type:sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                        console.log("filter category is none lol ============ " + JSON.stringify(dynamicSearch,null,"       "));
                        console.log("filter category tag is none -============> " + JSON.stringify(dynamicTags,null,2));
                        console.log(dynamicSearch.length);
                        console.log(dynamicTags.length);
                        res.render("searchResults", {
                            dynamicSearch: dynamicSearch,
                            dynamicTags: dynamicTags,
                            searchQuery: searchQueryWithoutPercentage,
                            cookieSearchType: cookieSearchType
                        })
                    })
                })
            }
            else { //else display most recent , specific category
                sequelize.query("select * from Products where productListingName like :clientParams and productListingType = :productCategory",
                {replacements: {clientParams: searchQuery, productCategory: req.query.category} , type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                    sequelize.query("select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id where productListingName like :clientParams and productListingType = :productCategory",
                    {replacements: {clientParams: searchQuery, productCategory: req.query.category} , type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                        console.log("filter category only -------------------->   " + JSON.stringify(dynamicSearch));
                        console.log("filter category tag only -------------->    " + JSON.stringify(dynamicTags));
                        console.log("dynamic search fail length ??  " + dynamicSearch.length);
                        res.render("searchResults", {
                            dynamicSearch: dynamicSearch,
                            dynamicTags: dynamicTags,
                            searchQuery: searchQueryWithoutPercentage,
                            cookieSearchType: cookieSearchType
                        })
                    })
                })
           }
        }

    } //end of if pricesorttype is most recent...

    else if (priceSortType == "descending") { // descending
        console.log("price sort is descending.............");
        if (req.query.category && req.query.condition) {
            if (req.query.category =="None") { // if category is none, display all for descending,condition
                sequelize.query("select * from Products where productListingName like :clientParams and productListingCondition = :condition order by pricing desc",
                {replacements: {clientParams: searchQuery, condition: req.query.condition}, type:sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                    sequelize.query("select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id \
                        where productListingName like :clientParams and productListingCondition = :condition order by pricing desc",
                    {replacements: {clientParams: searchQuery, condition: req.query.condition}, type:sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                        console.log("filter category none ----> condition,price descending " + JSON.stringify(dynamicSearch));
                        console.log("filter category tag none ----> condition,price descending  " + JSON.stringify(dynamicTags));
                        console.log(dynamicSearch.length);
                        console.log(dynamicTags.length);
                        res.render("searchResults", {
                            dynamicSearch: dynamicSearch,
                            dynamicTags: dynamicTags,
                            searchQuery: searchQueryWithoutPercentage,
                            cookieSearchType: cookieSearchType
                        })
                    })
                })
            }
            else{ //else category not none, display all for descending,category,condition
                console.log("category is not none , filtering descending, condition ......... ");
                sequelize.query("select * from Products where productListingName like :clientParams and productListingType = :productCategory and productListingCondition = :condition order by pricing desc",
                {replacements: {clientParams: searchQuery, productCategory: req.query.category, condition: req.query.condition}, type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                    sequelize.query("select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id\
                        where productListingName like :clientParams and productListingType = :productCategory and productListingCondition = :condition order by pricing desc",
                        {replacements: {clientParams: searchQuery, productCategory: req.query.category, condition: req.query.condition}, type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                            console.log("filter category not none ----> category,condition price descending" + JSON.stringify(dynamicSearch));
                            console.log("filter tag category not none ~~~~ category, condition price descending" + JSON.stringify(dynamicTags));
                            res.render("searchResults", {
                                dynamicSearch: dynamicSearch,
                                dynamicTags: dynamicTags,
                                searchQuery: searchQueryWithoutPercentage,
                                cookieSearchType: cookieSearchType
                            })
                    })
                })
            }
        } //end of descending, if req.quey.categoery && req.query.condition

        else if (req.query.condition) {
            console.log("only condition for descending .....");
            sequelize.query("select * from Products where productListingName like :clientParams and productListingCondition = :condition order by pricing desc",
            {replacements: {clientParams: searchQuery, condition: req.query.condition}, type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                sequelize.query("select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id where productListingName like :clientParams and productListingCondition = :condition order by pricing desc",
                {replacements: {clientParams: searchQuery, condition: req.query.condition}, type:sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                    console.log("filter result of descending , only condition -----> \n " + JSON.stringify(dynamicSearch));
                    console.log("filter result of tags descending , only condition ~~~~~ \n " + JSON.stringify(dynamicTags));
                    res.render("searchResults", {
                        dynamicSearch: dynamicSearch,
                        dynamicTags: dynamicTags,
                        searchQuery: searchQueryWithoutPercentage,
                        cookieSearchType: cookieSearchType
                    })
                })
            })
        }

        else if (req.query.category) { // descending, only category...
            console.log("only category for descending... ");
            if (req.query.category == "None") { // if category none, display all descending
                sequelize.query("select * from Products where productListingName like :clientParams order by pricing desc",
                {replacements: {clientParams: searchQuery}, type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                    sequelize.query("select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id where productListingName like :clientParams order by pricing desc",
                    {replacements: {clientParams: searchQuery}, type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                        console.log("filter descending for category is none all --->  " + JSON.stringify(dynamicSearch));
                        console.log("filter tag descending for category is none ~~~ " + JSON.stringify(dynamicTags));
                        res.render("searchResults", {
                            dynamicSearch: dynamicSearch,
                            dynamicTags: dynamicTags,
                            searchQuery: searchQueryWithoutPercentage,
                            cookieSearchType: cookieSearchType
                        })
                    })
                })
            }
            else { // else display descending , specific category
                sequelize.query("select * from Products where productListingName like :clientParams and productListingType = :productCategory order by pricing desc",
                {replacements: {clientParams: searchQuery, productCategory: req.query.category}, type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                    sequelize.query('select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id where productListingName like :clientParams and productListingType = :productCategory order by pricing desc',
                    {replacements: {clientParams: searchQuery, productCategory: req.query.category} , type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                        console.log("filter category only for descending ------->  \n " + JSON.stringify(dynamicSearch));
                        console.log("filter tag category only for descending ~~~~~ \n " + JSON.stringify(dynamicTags));
                        res.render("searchResults", {
                            dynamicSearch: dynamicSearch,
                            dynamicTags: dynamicTags,
                            searchQuery: searchQueryWithoutPercentage,
                            cookieSearchType: cookieSearchType
                        })
                    })
                })
            }
        }
    } // end of else if price sort is descending...

    else if (priceSortType == "ascending") { //else price sort == "ascending"
        console.log("price sort is ascending .............. ");
        if (req.query.category && req.query.condition) {
            if (req.query.category == "None") {
                sequelize.query("select * from Products where productListingName like :clientParams and productListingCondition = :condition order by pricing asc",
                {replacements: {clientParams: searchQuery, condition: req.query.condition}, type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                    sequelize.query("select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id \
                        where productListingName like :clientParams and productListingCondition = :condition order by pricing asc",
                    {replacements: {clientParams: searchQuery, condition: req.query.condition} , type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                        console.log("filter category none ---> condition , price ascending \n " + JSON.stringify(dynamicSearch));
                        console.log("filter category tag none ~~~~ condition, price descending \n " + JSON.stringify(dynamicTags));
                        res.render("searchResults", {
                            dynamicSearch: dynamicSearch,
                            dynamicTags: dynamicTags,
                            searchQuery: searchQueryWithoutPercentage,
                            cookieSearchType: cookieSearchType
                        })
                    })
                })
            }
            else { //else category not none , display all for acsending , category condition 
                console.log("category none , filter acscending , condition ....... ");
                sequelize.query("select * from Products where productListingName like :clientParams and productListingType = :productCategory and productListingCondition = :condition order by pricing asc",
                {replacements: {clientParams: searchQuery, productCategory: req.query.category, condition: req.query.condition}, type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                    sequelize.query("select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id\
                        where productListingName like :clientParams and productListingType = :productCategory and productListingCondition = :condition order by pricing asc",
                    {replacements: {clientParams: searchQuery, productCategory: req.query.category, condition: req.query.condition}, type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                        console.log("filter category not none ---> category condition price ascending \n " + JSON.stringify(dynamicSearch));
                        console.log("filter category tag not none ---> category , condition , price descending " + JSON.stringify(dynamicTags));
                        res.render("searchResults", {
                            dynamicSearch: dynamicSearch,
                            dynamicTags: dynamicTags,
                            searchQuery: searchQueryWithoutPercentage,
                            cookieSearchType: cookieSearchType
                        })
                    })
                })
            } //end of ascending , if req.query.category && req.query.condition
        }

        else if (req.query.condition) {
            console.log("only condition for asc ");
            sequelize.query("select * from Products where productListingName like :clientParams and productListingCondition = :condition order by pricing asc",
            {replacements: {clientParams: searchQuery , condition: req.query.condition}, type:sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                sequelize.query("select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id where productListingName like :clientParams and productListingCondition = :condition order by pricing asc",
                {replacements: {clientParams: searchQuery, condition: req.query.condition}, type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                    console.log("filtering result of ascending , only coniditon ----> \n " + JSON.stringify(dynamicSearch));
                    console.log("filtering result of tags descending , only conidtion --- \n " + JSON.stringify(dynamicTags));
                    res.render("searchResults", {
                        dynamicSearch: dynamicSearch,
                        dynamicTags: dynamicTags,
                        searchQuery: searchQueryWithoutPercentage,
                        cookieSearchType: cookieSearchType
                    })
                })
            })
        }

        else if (req.query.category) { //ascending, only category...
            console.log("only category for ascending...");
            if (req.query.category == "None") { // if category none , display all ascending
                sequelize.query("select * from Products where productListingName like :clientParams order by pricing asc",
                {replacements: {clientParams: searchQuery}, type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                    sequelize.query(" select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id where productListingName like :clientParams order by pricing asc",
                    {replacements: {clientParams: searchQuery}, type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                        console.log("filter ascending for category is none all ---> \n " + JSON.stringify(dynamicSearch));
                        console.log("filter ascending for tag category is none ~~~ \n " + JSON.stringify(dynamicTags));
                        res.render("searchResults", {
                            dynamicSearch: dynamicSearch,
                            dynamicTags: dynamicTags,
                            searchQuery: searchQueryWithoutPercentage,
                            cookieSearchType: cookieSearchType
                        })
                    })
                })
            }
            else { //else display ascending , specific category
                sequelize.query("select * from Products where productListingName like :clientParams and productListingType = :productCategory order by pricing asc",
                {replacements: {clientParams: searchQuery, productCategory: req.query.category} , type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                    sequelize.query("select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id where productListingName like :clientParams and productListingType = :productCategory order by pricing asc",
                    {replacements: {clientParams: searchQuery, productCategory: req.query.category} , type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                        console.log("filter category only for ascedning --> \n " + JSON.stringify(dynamicSearch));
                        console.log("filter tags category only for descending -~~~~ \n " + JSON.stringify(dynamicTags));
                        res.render("searchResults", {
                            dynamicSearch: dynamicSearch,
                            dynamicTags: dynamicTags,
                            searchQuery: searchQueryWithoutPercentage,
                            cookieSearchType: cookieSearchType
                        })
                    })
                })
            } // end of else statement for display acs , specific category
        } // end of else if req.query.category only 
    } //end of sort price =="ascending"
    
    else{ //most rating sort
        console.log("price sort type is most ratings .... ");
        // doesntw ork....
        if (req.query.category && req.query.condition && req.query.min) {
            if (req.query.category == "None") {
                sequelize.query("select * from Products where productListingName like :clientParams and productListingCondition = :condition and pricing > :min and pricing < :max",
                {replacements: {clientParams: searchQuery, condition: req.query.condition, min: inputMin, max: inputMax}, type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                    sequelize.query("select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id \
                        where productListingName like :clientParams and productListingCondition = :condition and pricing > :min and pricing < :max",
                    {replacements: {clientParams: searchQuery, condition: req.query.condition, min: inputMin, max: inputMax }, type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                        console.log("input min and max filtering ----- \n " + JSON.stringify(dynamicSearch));
                        console.log("input min and max filtering tags --> \n " + JSON.stringify(dynamicTags));
                        res.render("searchResults", {
                            dynamicSearch: dynamicSearch,
                            dynamicTags: dynamicTags,
                            searchQuery: searchQueryWithoutPercentage,
                            cookieSearchType: cookieSearchType
                        })
                    })
                })
            }
        }

        if (req.query.category && req.query.condition) {
            if (req.query.category == "None") {
                sequelize.query("select * from Products where productListingName like :clientParams and productListingCondition = :condition order by rating desc",
                {replacements: {clientParams: searchQuery, condition: req.query.condition}, type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                    sequelize.query('select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id \
                        where productListingName like :clientParams and productListingCondition = :condition order by rating desc',
                    {replacements: {clientParams: searchQuery, condition: req.query.condition}, type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                        console.log("filter category none for most rating ---> condiiton , category none \n " + JSON.stringify(dynamicSearch));
                        console.log("tagg filter category none for most rating stars --> condition, category none \n " + JSON.stringify(dynamicTags));
                        res.render("searchResults", {
                            dynamicSearch: dynamicSearch,
                            dynamicTags: dynamicTags,
                            searchQuery: searchQueryWithoutPercentage,
                            cookieSearchType: cookieSearchType
                        })
                    })
                })
            }
            else { // else category not none , display all most rating , category condition
                console.log("most rating... category none , most rating, condition .... ");
                sequelize.query("select * from Products where productListingName like :clientParams and productListingType = :productCategory and productListingCondition = :condition order by rating desc",
                {replacements: {clientParams: searchQuery, productCategory: req.quer.category, condition: req.query.condition} , type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                    sequelize.query("select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id\
                        where productListingName like :clientParams and productListingType = :productCategory and productListingCondition = :condition order by rating desc",
                    {replacements: {clientParams: searchQuery, productCategory: req.query.category, condition: req.query.condition} , type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                        console.log("filter category not none for most rating --> category condition rating desc \n " + JSON.stringify(dynamicSearch));
                        console.log("filter tag category not none for  -->  catgeory , condition , rating desc \n " + JSON.stringify(dynamicTags));
                        res.render("searchResults", {
                            dynamicSearch: dynamicSearch,
                            dynamicTags: dynamicTags,
                            searchQuery: searchQueryWithoutPercentage,
                            cookieSearchType: cookieSearchType
                        })
                    })
                })
            } // end of most rating if req.query.category && req.query.condition
        }

        else if (req.query.condition) {
            console.log("only condition for most rating..... ");
            sequelize.query("select * from Products where productListingName like :clientParams and productListingCondition = :condition order by rating desc",
            {replacements: {clientParams: searchQuery, condition: req.query.condition}, type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                sequelize.query("select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id where productListingName like :clientParams and productListingCondition = :condition order by rating desc",
                {replacements: {clientParams: searchQuery, condition: req.query.comeon} , type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                    console.log("filtering condition only for most rating \n " + JSON.stringify(dynamicSearch));
                    console.log("filtering tag for condition only most rating \n " + JSON.stringify(dynamicTags));
                    res.render("searchResults", {
                        dynamicSearch: dynamicSearch,
                        dynamicTags: dynamicTags,
                        searchQuery: searchQueryWithoutPercentage,
                        cookieSearchType: cookieSearchType
                    })
                })
            })
        }
        
        else if (req.query.category) {
            console.log("only category for most rating.....");
            if (req.query.category == "None") { //if category none , display all rating descednnig
                sequelize.query("select * from Products where productListingName like :clientParams order by rating desc",
                {replacements: {clientParams: searchQuery}, type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                    sequelize.query("select pt.productTags from ProductTags pt inner join Products p on pt.product_id = p.id where productListingName like :clientParams order by rating desc",
                    {replacements: {clientParams: searchQuery} , type: sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                        console.log("filtering finally most rating for category is none all \n " + JSON.stringify(dynamicSearch));
                        console.log("filtering tag finally for most rating for category is none \n " + JSON.stringify(dynamicTags));
                        res.render("searchResults", {
                            dynamicSearch: dynamicSearch,
                            dynamicTags: dynamicTags,
                            searchQuery: searchQueryWithoutPercentage,
                            cookieSearchType: cookieSearchType
                        })
                    })
                })
            }
            else { // else display most rating , specific category
                sequelize.query("select * from Products where productListingName like :clientParams and productListingType = :productCategory order by rating desc",
                {replacements: {clientParams: searchQuery, productCategory: req.query.category} , type: sequelize.QueryTypes.SELECT }).then(dynamicSearch => {
                    sequelize.query("select pt.productTags from ProductTags pt inner join Products p on pt.product_Id = p.id where productListingName like :clientParams and productListingType = :productCategory order by rating desc",
                    {replacements: {clientParams: searchQuery, productCategory: req.query.category}, type:sequelize.QueryTypes.SELECT }).then(dynamicTags => {
                        console.log("filtering category only for most rating \n " + JSON.stringify(dynamicSearch));
                        console.log("filtering tag category only for most rating \n " + JSON.stringify(dynamicTags));
                        res.render("searchResults", {
                            dynamicSearch: dynamicSearch,
                            dynamicTags: dynamicTags,
                            searchQuery: searchQueryWithoutPercentage,
                            cookieSearchType: cookieSearchType
                        })
                    })
                })
            }
        }

    } // end of last else statement

} //end of searchFilter() finally..

// Search authorisation middleware
exports.hasAuthorization = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};