
// $("body").pullToRefresh();

const targetApi = 'https://mainnet.infura.io/';
const web3 = new Web3(new Web3.providers.HttpProvider(targetApi));
function format(value, decimals) {
    while(value.length <= decimals) value = "0" + value;
    var ans = value.slice(0,value.length-decimals) + "."+ value.slice(value.length-decimals,value.length-decimals+1);
    if(ans.charAt(0) == '.') ans = "0" + ans;
    return ans;
}
// var address = "0xa81A143D7664B047c925171E7104805717D8b002";

// localStorage.setItem("public_key", "0xc0cdbbf7433149a65ad4e11f9fae785dda8724a6");
// localStorage.getItem("public_key");
var address = "0xc0cdbbf7433149a65ad4e11f9fae785dda8724a6";
var contract = "0xd26114cd6ee289accf82350c8d8487fedb8a0c07";
var symbol = "OMG";
var ethPrice;

// var href = window.location.href;
// var splits = href.split(window.location.origin + "/token/address/");
// if(splits.length>=2 && splits[splits.length-1] != "" && splits[splits.length-1].substr(0,2) == "0x")
//   address = splits[splits.length-1];
//
// window.history.pushState(address, 'Token', '/token/address/'+address);

// window.onpopstate = function(event) {
//   if(history.state.substr(0,2) == "0x") {
//     address = history.state;
//   } else {
//     window.history.pushState(address, 'Token', '/token/address/'+address);
//   }
//   $("#address").val(address);
//   $("#addressTitle").text(address);
//   $("#submit").trigger('click');
// };

$.getJSON('https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=EUR', function(data){
  ethPrice = parseFloat(data[0].price_usd);
});

// $(document).on('click', 'a', function(e){
//   e.preventDefault();
//   var add = $(this).attr('href');
//   $("#address").val(add);
//   $("#addressTitle").text(add);
//   $("#submit").trigger('click');
// });
$("#address").on('keyup', function (e) {
  if (e.keyCode == 13) {
    $("#submit").trigger('click');
  }
});
$("#submit").click(function(){
  // window.history.pushState($("#address").val(), 'Token', '/token/address/'+$("#address").val());
  renderBalance($("#address").val())
  renderTransactions($("#address").val());
});
function preloader(id, color) {

    $(id).html(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="400" height="100">
      <circle transform="translate(0 0)" cx="0" cy="16" r="0" stroke="${color}" fill="transparent">
        <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0"
          keytimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline" />
      </circle>
      <circle transform="translate(8 0)" cx="0" cy="16" r="0" stroke="${color}" fill="transparent">
        <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0.3"
          keytimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline" />
      </circle>
      <circle transform="translate(16 0)" cx="0" cy="16" r="0" fill="transparent" stroke="${color}">
        <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0.6"
          keytimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline" />
      </circle>
    </svg>`);

}
function renderBalance(address) {
  preloader("#balance", '#fff');
  $.getJSON(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${contract}&address=${address}&tag=latest&apikey=PPY88V5EDNB531PH4Y4MK2KHH59DKXYH63`, function(data){
      $("#balance").html(`<span id="myBalance">${format(data.result, 18)}</span> <span id="tokenSymbol">${symbol}</span>`);
  });

}
function renderTransactions(address) {
  preloader("#myTransactions", '#1C497A');
  $.getJSON(`https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock=4042013&toBlock=latest&address=${contract}&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&apikey=PPY88V5EDNB531PH4Y4MK2KHH59DKXYH63&topic1_2_opr=or&topic1=0x000000000000000000000000${address.substr(2)}&topic2=0x000000000000000000000000${address.substr(2)}`, function(data){
    var transactions = data.result.reverse();
    var transactionsView = "";
    transactions.forEach(function(t) {
      // console.log(t);
      var a = "0x" + t.data.substring(2,t.data.length).replace(/^0+/, '');
      a = new web3.BigNumber(a).toString(10);
      var gasPrice = new web3.BigNumber(t.gasPrice);
      var gasUsed = new web3.BigNumber(t.gasUsed);
      var total = parseFloat(format(gasPrice.mul(gasUsed).toString(10),18))*ethPrice;
      // totat = total.toFixed(2);
      total = parseFloat(total).toFixed(2);


      var from  = "0x" + t.topics[1].substring(2,t.topics[1]).replace(/^0+/, '').toLowerCase();
      var to    = "0x" + t.topics[2].substring(2,t.topics[2]).replace(/^0+/, '').toLowerCase();
      var other;
      if(to == address.toLowerCase()) {
        other = from;
      } else {
        other = to;
      }

      transactionsView += `<li class="item-content">
        <div class="item-inner">
          <div class="item-title">${new moment(parseInt(t.timeStamp,16)*1000).format("DD/MM/YY HH:mm:ss")}</div>
          <div class="item-after"><span class='label label-${other==from?'success':'warning'}'>${other==from?'':'-'}${format(a,18)} ${symbol}</span></div>
        </div>
      </li>`;

        // transactionsView += `<div class="row">
        //                       <div class="col-6 col-xs-6 col-sm-6 col-md-6">
        //                         ${new moment(parseInt(t.timeStamp,16)*1000).format("DD/MM/YY HH:mm:ss")}
        //                       </div>
        //                       <div class="col-6 col-xs-6 col-sm-6 col-md-6 text-right">
        //                         <span class='label label-${other==from?'success':'warning'}'>${other==from?'':'-'}${format(a,18)} ${symbol}</span>
        //                       </div>
        //                     </div>
        //                     <div class="row">
        //                       <div class="col-6 col-xs-6 col-sm-6 col-md-6">
        //                         <small><a href='${other}'>${other.substr(0,other.length/3)}...</a></small>
        //                       </div>
        //                       <div class="col-6 col-xs-6 col-sm-6 col-md-6 text-right">
        //                         <small>Tx fee: ${total} EUR</small>
        //                         </div>
        //                     </div><hr/>`;

    })

    $('#myTransactions').html(transactionsView);

  });
}
function parseData(to, value) {
  value = value * (10**18);
  value = value.toString(16);
  var ans = web3.sha3('transfer(address,uint256)').substr(0,10);
  ans += '000000000000000000000000' + to.substr(2);
  var zeroes = "";
  for(var i=0;i<64-value.length;i++)
    zeroes += "0";
  value = zeroes + value;
  ans += value;
  return ans;
}
function sendTokenTransaction(from, pk, to, value) {
  var privateKey = EthJS.Buffer.Buffer(pk, 'hex')

  var rawTx = {
    nonce: web3.toHex(web3.eth.getTransactionCount(from)),
    gasPrice: web3.toHex(web3.eth.gasPrice.div(4)),
    gasLimit: '0x249f0',
    to: to,
    value: '0x00',
    data: parseData(to, value)
  }

  var tx = new EthJS.Tx(rawTx);
  tx.sign(privateKey);

  var serializedTx = tx.serialize();

  web3.eth.sendRawTransaction(serializedTx.toString('hex'), function(err, hash) {
    if (!err){
      console.log(hash);
    } else {
      console.log(err);
    }
  });
}