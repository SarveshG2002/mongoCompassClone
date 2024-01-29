var url = (new URL(window.location.href)).origin + "/";

function showCollectionInSideBar(id, selfele) {
    // console.log(id)
    let ele = document.getElementById(`collectionDiv${id}`);
    // Make an AJAX request using jQuery
    if (ele.style.display == "") {
        ele.style.display = "none";
        selfele.innerHTML = "chevron_right";
    } else {
        $.ajax({
            url: `${url}getCollectionByDatabaseSidebarPage`,
            type: 'POST',
            data: { dbname: id }, // This will send data in the request body
            success: function (data) {
                // console.log(data);
                document.getElementById(`collectionDiv${id}`).innerHTML = data;
                ele.style.display = "";
                selfele.innerHTML = "expand_more";
            },
            error: function (xhr, status, error) {
                console.error('Error:', status, error);
            }
        });

    }

}



function showCollectioninPanel(dbname) {
    $('#mainContainer').html("Loading....");
    $.ajax({
        url: `${url}getMainCollectionPage`,  // Replace with your server-side endpoint
        type: 'POST',
        data: { 'dbname': dbname },
        success: function (data) {
            // Handle the successful response
            $('#mainContainer').html(data);

            // console.log(data);
            // console.log('database fetch successfulyy');
        },
        error: function (xhr, status, error) {
            // Handle errors
            console.error('Error:', status, error);
        }
    });
}

function showDatabasePanel() {
    $('#mainContainer').html("Loading....");
    $.ajax({
        url: `${url}getMainDatabasePage`,  // Replace with your server-side endpoint
        type: 'GET',
        success: function (data) {
            // Handle the successful response
            $('#mainContainer').html(data);
            // console.log(data);
            // console.log('database fetch successfulyy');
        },
        error: function (xhr, status, error) {
            // Handle errors
            console.error('Error:', status, error);
        }
    });
}



$(document).ready(function () {
    // Attach a click event to the 
    showDatabasePanel();

    // showAllDataOfCollection()
    // Make an AJAX request using jQuery
    $('#fetchDatabase').click(function () {
        // $('#mainContainer').html("Loading....");
        $.ajax({
            url: `${url}getAllDatabaseListSidebarPage`,  // Replace with your server-side endpoint
            type: 'GET',
            success: function (data) {
                // Handle the successful response
                $('#allDatabases').html(data);
                // console.log(data);
                // console.log('database fetch successfulyy');
            },
            error: function (xhr, status, error) {
                // Handle errors
                console.error('Error:', status, error);
            }
        });

    })

    $('#createDatabase').click(function () {
        let databaseName = $("#newDatabaseName").val()
        let collectionName = $("#newCollectionName").val()
        $.ajax({
            url: `${url}createDatabaseAndCollection`,  // Replace with your server-side endpoint
            type: 'POST',
            data: { dbname: databaseName, collectionname: collectionName },
            success: function (data) {
                // Handle the successful response
                // $('#allDatabases').html(data);
                // console.log(data);
                // console.log('database fetch successfulyy');
                modal.css('display', 'none');
                overlay.css('display', 'none');
                $('#fetchDatabase').click();
                openCollectionModal(databaseName)
            },
            error: function (xhr, status, error) {
                // Handle errors
                console.error('Error:', status, error);
            }
        });

    })

    document.getElementById('fetchDatabase').click();
    var openModalBtn = $('#openModalBtn');
    var closeModalBtn = $('#closeModalBtn');

    var modal = $('#myModal');
    var overlay = $('#overlay');

    // var modalHead= $('#modalHead')

    openModalBtn.on('click', function () {
        openCreateDatabaseModal();

    });

    closeModalBtn.on('click', function () {
        modal.css('display', 'none');
        overlay.css('display', 'none');
    });

    // Close the modal if the user clicks outside the modal content
    $(window).on('click', function (event) {
        if (event.target === modal[0]) {
            modal.css('display', 'none');
            overlay.css('display', 'none');
        }
    });

});

function openDocumentModal(){
    let modal = $('#documentModal');
    let overlay = $('#documentoverlay');
    // document.getElementById('modalHead').innerHTML = "Create Database";
    modal.css('display', 'block');
    overlay.css('display', 'block');
    let closedocumentModalBtn = $("#closedocumentModalBtn"); 
    closedocumentModalBtn.on("click",function(){
        modal.css('display', 'none');
        overlay.css('display', 'none');
    })
}

function openCreateDatabaseModal() {
    let modal = $('#myModal');
    let overlay = $('#overlay');
    document.getElementById('modalHead').innerHTML = "Create Database";
    modal.css('display', 'block');
    overlay.css('display', 'block');
}

function openCollectionModal(database) {
    var modal = $('#myModal');
    var overlay = $('#overlay');
    document.getElementById('modalHead').innerHTML = "Create Collection";
    $("#newDatabaseName").val(database)
    modal.css('display', 'block');
    overlay.css('display', 'block');
}

function showAllDataOfCollection(dbname, collectionname) {
    
    // console.log(rowCount,qsort)
    let rowCount=$('#rowCountSelect').val();
    if(!rowCount){
        rowCount=10
    }
    let qsort = $('#quicksort').prop('checked');
// console.log(rowCount, qsort);

    if(!qsort){
        qsort=0;
    }else{
        qsort=1;
    }
    // console.log(rowCount,qsort)
    // debugger
    $('#mainContainer').html("Loading....");
    $.ajax({
        url: `${url}getAllDocumentsByDatabaseAndCollection`,  // Replace with your server-side endpoint
        type: 'POST',
        data: { dbname: dbname, clname: collectionname,rowCount:rowCount,qsort:qsort},
        success: function (data) {
            // Handle the successful response
            // $('#allDatabases').html(data);
            // console.log(data);
            $('#mainContainer').html(data);
            // console.log('database fetch successfulyy');
            // modal.css('display', 'none');
            // overlay.css('display', 'none');
            // $('#fetchDatabase').click();
            // openCollectionModal(databaseName)
        },
        error: function (xhr, status, error) {
            // Handle errors
            console.error('Error:', status, error);
        }
    });
}
