$( document ).ready(function() {
    console.log("home jssss loading, starting timer");
    console.time("timeTakenToLoadData"); //https://medium.freecodecamp.org/how-to-get-the-most-out-of-the-javascript-console-b57ca9db3e6d
    const success = [
        'background: green',
        'color: white',
        'display: block',
        'text-align: center'
    ].join(';');
    const failure = [
        'background: red',
        'color: white',
        'display: block',
        'text-align: center'
    ].join(';');
    console.info('%c /dancing/bears was Successful!', success);
    console.log({data: {
        name: 'Bob',
        age: 'unknown'
    }}); // "mocked" data response
    console.error('%c /dancing/bats failed!', failure);
    
    //on page load keep the user list populated------------START
    $.ajax({
        url: "users/list",
        dataType: "json",
    })
    .done((data) => {
        console.log("getting data!!!");
        if(data) {
            console.log("DATA FOUND --> " + JSON.stringify(data)); 
            if (data.docs.length === 0) { //NOTE: if empty returns { "docs" : [] }
                console.log("no json found, database collection wrong or no data yet..");
            }
            var odata = $.parseJSON(JSON.stringify(data.docs));
            odata.forEach(item => {
                console.log(" ITEM " + JSON.stringify(item));
                setTimeout(function() {
                    console.clear();
                    console.info("cleared console of load item at start...");
                    console.table([['Javascript', 'PHP', 'Perl', 'C++']]);
                    const superhero = { 
                        firstname: 'Peter',
                        lastname: 'Parker',
                    }
                    console.table([superhero]);
                },3000) //3000 = 3 seconds
                $('#myTable > tbody:last-child').append(getRowHtml(item));
            });
            console.timeEnd("timeTakenToLoadData"); //time taken to get the data from mongodb
            console.log("end of timer, clearing console...");
        }
    })
    .fail((err) => {
        console.log("Error retrieving at start...");
    });  
    //-------------------------------------------------------END

    //on add user submit the form----------------------------START
    $("#btnSubmit").click (() => {
        $("#addUserForm").submit();
    });

	$(document).on("submit", '#addUserForm', function(event) {
		event.preventDefault(); 
		var $form = $(this);
		
        $.ajax({
            url: 'users/add',
            data: $form.serializeArray(),
            type: 'POST'
        })
        .done((data) => {
            if(data) {
                var odata = $.parseJSON(JSON.stringify(data.docs));
                console.log("adding odata!!");
                console.log(JSON.stringify(odata));
                odata.forEach(item => {
                    console.log(item);
                    $('#myTable > tbody:last-child').append(getRowHtml(item));
                });
                $('#addUserForm').trigger("reset");
            }
        })
        .fail((err) => {
            console.log("Error");
        });
    });	  
    //-------------------------------------------------------END
	   
    //on click of delete record----------------------------START
    $(document).on("click", ".btn-del-record", function(event) { 
        console.log("clicked on deleted btn");
        //identify the row which we will remove from our table.
        var row = $(this).parent().parent();
        console.log("id --> " + this.id);
        $.ajax({
            url: 'users/delete',
            data: { id:this.id },
            type: 'POST'
        })
        .done((data) => {
            console.log("DATA DELETED...");
            if(data) {
               console.log(data);
               row.remove();
            }
        })
        .fail((err) => {
            console.log("Error deleting");
        });
    });	
    //-------------------------------------------------------END

      //on click of edit record----------------------------START
    //$(document).on("click", ".btn-edit-record", function(event) { 
    $(document).on("click", ".btn-edit-record", function(event) {
        console.log("clicked btn ...");
        console.log($(this));
        var row = $(this).closest("tr");
        var rowID = $(this).closest("tr").data("id");
        console.log(row);
        console.log("row id " + rowID);
        var nameRow = ($(this).closest("tr").children("td:eq(1)").text());
        var addressRow = ($(this).closest("tr").children("td:eq(2)").text());
        var salaryRow = ($(this).closest("tr").children("td:eq(3)").text());
        $("#editUserBTN").on("click", ()=> {
            console.log("clicked to edit user in controller!!!");
            var nameModal = $("#inputModalName").val();
            var addressModal = $("#inputModalAddress").val();
            var salaryModal = $("#inputModalSalary").val();
            console.groupCollapsed("modal inputs");
            console.log("name modal --> " + nameModal);
            console.log("addr modal " + addressModal);
            console.log("salary modal " + salaryModal);
            console.groupEnd();
            $.ajax({
                url: 'users/edit',
                //data: { id:rowID, name:nameText, address: addressText, salary: salaryText },
                data: { id:rowID, name: nameModal, address: addressModal, salary: salaryModal },
                type: 'PUT'
            })
            .done((dataReceived) => {
                if(dataReceived) {
                    data = dataReceived.docs;
                    console.log("done editing, received json from controller...");
                    console.log(data);
                    console.log(row);
                    //replaceEntireTR = getRowHtml(data.docs);
                    $("#editUser").modal("hide");
                    replaceEntireTR = "<tr id=" + data._id + " data-id=" + data._id + ">" + getTD(data._id) +  getTD(data.name) + getTD(data.address) + getTD(data.salary) + getEditBtn(data._id) + getDelBtn(data._id) + "</tr>";
                    console.log(replaceEntireTR);
                    row.replaceWith(replaceEntireTR);
        
                }
            })
            .fail((err) => {
                console.error("red line here - validation cast fail " + JSON.stringify(err));
                console.warn("warning yellow line.");
                console.log("Error editing!!");
            });
        })
    });
    //-------------------------------------------------------END

});

function getRowHtml(item) {
    var thtml = getTD(item._id) 
                + getTD(item.name) 
                + getTD(item.address) 
                + getTD(item.salary)
                + getEditBtn(item._id)
                + getDelBtn(item._id);
    thtml = getTR(thtml, item._id);
    return thtml;
}
function getTD(val) {
    return '<td>'+ val + '</td>';
}

function getTR(val, itemID) {
    return '<tr id=' + itemID + " data-id=" + itemID + ">" + val + '</tr>';
}

function getDelBtn(val) {
    return '<td><button type="button" id='+ val +' class="btn btn-default btn-sm btn-del-record"><span class="fa fa-trash-alt"></span> Delete </button></td>';
}

function getEditBtn(val) {
    return '<td><button type="button" id='+ val +' class="btn btn-default btn-sm btn-edit-record" data-toggle="modal" data-target="#editUser"><span class="fa fa-pencil-alt"></span> Edit </button></td>';
}

$('.deleteBtn').click(function () {
    var record_num = $(this).closest("tr").data('id');
    $.ajax({
      url: '<%-urlPath%>' + record_num,
      type: 'DELETE',
      success: function (result) {
        console.log(result.message);
        var itemToRemove = '.rowRecord[data-id=' + record_num + ']';
        $(itemToRemove).remove();
      },
      error: function (result) {
        alert("Unable to delete student record.");
        console.log(result.message);
      }
    });
  });
