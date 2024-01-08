function setDatabase() {

}

function showCollectionInSideBar(id, selfele) {
  // console.log(id)
  let ele = document.getElementById(`collectionDiv${id}`);
  // Make an AJAX request using jQuery
  if (ele.style.display == "") {
    ele.style.display = "none";
    selfele.innerHTML = "chevron_right";
  } else {
    $.ajax({
      url: 'http://localhost:3000/getCollectionByDatabaseSidebarPage',
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



  // ele.style.display = (ele.style.display == "") ? "none" : "";
  //  = (ele.style.display != "") ? "chevron_right" : "expand_more";
}



$(document).ready(function () {
  // Attach a click event to the button

  // Make an AJAX request using jQuery
  $('#fetchDatabase').click(function () {
    $.ajax({
      url: 'http://localhost:3000/getAllDatabaseListSidebarPage',  // Replace with your server-side endpoint
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
    let databaseName=$("#newDatabaseName").val()
    let collectionName=$("#newCollectionName").val()
    $.ajax({
      url: 'http://localhost:3000/createDatabaseAndCollection',  // Replace with your server-side endpoint
      type: 'POST',
      data: {dbname:databaseName,collectionname:collectionName},
      success: function (data) {
        // Handle the successful response
        // $('#allDatabases').html(data);
        // console.log(data);
        // console.log('database fetch successfulyy');
        modal.css('display', 'none');
        overlay.css('display', 'none');
        $('#fetchDatabase').click();
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
      document.getElementById('modalHead').innerHTML="Create Database";
      modal.css('display', 'block');
      overlay.css('display', 'block');
      
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

  function openCollectionModal(database){
    var modal = $('#myModal');
    var overlay = $('#overlay');
      document.getElementById('modalHead').innerHTML="Create Collection";
      $("#newDatabaseName").val(database)
      modal.css('display', 'block');
      overlay.css('display', 'block');
    }

  

  


document.addEventListener('DOMContentLoaded', function () {

});