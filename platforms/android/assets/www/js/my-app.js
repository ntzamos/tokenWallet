
// Define Dom7
var $$ = Dom7;

// $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page


 // Initialize app
 // Init App
var myApp = new Framework7({
    title: 'MyWallet',
    pushState: true,
    swipePanel: 'left'
});

var myApp = new Framework7();

function changeAddress(add) {
  address = add;
  myApp.formDeleteData('walletInfo');
  var storedData = myApp.formStoreData('walletInfo', {
      'address': address,
      'privateKey': '',
    });
  $("#myqrcode").html('');
  var qrcode = new QRCode(document.getElementById("myqrcode"), {
  	width : 250,
  	height : 250
  });

	qrcode.makeCode(address);
  $("#myaddress").text(address);

  renderBalance(contract, address)
  renderTransactions(contract, address);
}

function qrScan(){
  console.log(typeof cordova);
  console.log(cordova);
  if( typeof cordova === 'undefined' || cordova === null ){
      myApp.prompt('Enter your address:', '', function (value) {
        changeAddress(value);
      });
  } else {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if(!result.cancelled && result.format == "QR_CODE") {
              changeAddress(result.text);
            }
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
   );
 }
}
// Handle Cordova Device Ready Event
$(document).ready(function() {
    console.log("Device is ready!");

    var storedData = myApp.formGetData('walletInfo');
    if(storedData && storedData.address) {
        changeAddress(storedData.address);
    } else {
      changeAddress("0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98");
      // myApp.prompt('Enter your address:', '', function (value) {
      //   changeAddress(value);
      // });
    }
});
var mainView = myApp.addView('.view-main', {
    // Don't worry about that Material doesn't support it
    // F7 will just ignore it for Material theme
    dynamicNavbar: true
});

// myApp.initPullToRefresh('.homeContent');
// Add 'refresh' listener on it
var ptrHome = $$('.homeContent');
ptrHome.on('refresh', function (e) {
    renderBalance(contract, address);
    renderTransactions(contract, address);
    myApp.pullToRefreshDone();
});
$$('.changeAddress').on('click', function (e) {

    myApp.confirm('Are you sure?', 'Changing address', function () {
        qrScan();
    });
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
// myApp.onPageInit('history', function (page) {
//     // Do something here for "about" page
//     renderTransactions(address);
// })


//
// // Option 2. Using one 'pageInit' event handler for all pages:
// $$(document).on('pageInit', function (e) {
//     // Get page data from event data
//     var page = e.detail.page;
//
//     if (page.name === 'about') {
//         // Following code will be executed for page with data-page attribute equal to "about"
//         myApp.alert('Here comes About page');
//     }
// })
//
// // Option 2. Using live 'pageInit' event handlers for each page
// $$(document).on('pageInit', '.page[data-page="about"]', function (e) {
//     // Following code will be executed for page with data-page attribute equal to "about"
//     myApp.alert('Here comes About page');
// })
