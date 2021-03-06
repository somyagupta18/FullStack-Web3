// connect to Moralis server
const serverUrl = "https://xqfrosxqbx4c.usemoralis.com:2053/server";
const appId = "SlM9liycPFfnOrPqAVYtZ2SYf9thYKMwOGealR8t";
Moralis.start({ serverUrl, appId });

// Cleanup Screen
function clearscreen() {
  document.getElementById("body_space").innerHTML = "<p></p>";
}

// Get all transactions
async function getTransactions() {
  const div = document.getElementById("body_space");
  const address_input = document.getElementById("addressno").value;

  if(address_input){
    // get NFTs
    const options = { chain: "eth", address: address_input, limit: 20 };
    const transactions = (await Moralis.Web3API.account.getNFTTransfers(options)).result;
    clearscreen();
    transactions.forEach(function (transaction) {

      //to show the gas price of each transaction
      // const url = "https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=" + transaction.transaction_hash;
      // fetch(url)
      // .then((response) => response.json())
      // .then((data) => {
      //   div.innerHTML += "<h6><b> Gas price: </b>"+parseInt(data.result.gasPrice,16)/1e18+" ether</h6>";
      // console.log(data);

      // append transaction details
      div.innerHTML += `<h6><b>Transaction hash:</b><br><a href='https://etherscan.io/tx/${transaction.transaction_hash}' target="_blank">${transaction.transaction_hash}</a></h6>`;
      div.innerHTML += "<h6><b>From:</b> " + transaction.from_address + "</h6>";
      div.innerHTML += "<h6><b>To:</b> " + transaction.to_address + "</h6>";
      div.innerHTML += "<h6><b>Timestamp:</b> " + transaction.block_timestamp + "</h6>";
      div.innerHTML += "<p><hr><br></p>";

      });
    // });
    }
  else
    div.innerHTML = "<p>No user address entered</p>";
}

// Fetch acccount Balance
async function getBalance() {
  var div = document.getElementById("body_space");
  const address_input = document.getElementById("addressno").value;
  if(address_input){
    // Fetch balance
    const url = "https://api.etherscan.io/api?module=account&action=balance&address=" + address_input;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // display account balance
        div.innerHTML = "<p><b>ACCOUNT BALANCE: </b>" + data.result / 1e18 + " ether</p>";
      });
    }
    else
      div.innerHTML = "<p>No user address entered</p>";
}

// Get NFTs
async function getNFTs() {
  var div = document.getElementById("body_space");
  let flag = 0;
  const address_input = document.getElementById("addressno").value;
  
  if(address_input){
    const options = { chain: "eth", address: address_input };
    const nfts = await Moralis.Web3.getNFTs(options);
    clearscreen();
    div.innerHTML += "<p>The following are NFTs with contract type ERC721: </p>";

    nfts.forEach(function (nft) {

      //only print the ERC721 NFT details
      if (nft.contract_type == "ERC721") {
        flag=1;
        let url = fixURL(nft.token_uri);
        fetch(url)
          .then((response) => response.json())
          .then((data) => {

            //print metadata of the NFTs
            div.innerHTML += `<b style="font-size:medium; font-family: Verdana, Geneva, Tahoma, sans-serif;">${data.name}</b>`;
            if (data.description)
              div.innerHTML += '<h6>' + data.description + "</h6>";
            else
              div.innerHTML += '<h6>No description available</h6>';
            if (data.image)
              div.innerHTML += "<img width=100 height=100 src='" + fixURL(data.image) + "'/>";
            else
              div.innerHTML += '<h6 style="font-family: sans-serif;">No image available</h6>';
            div.innerHTML += "<p><hr></p>";
          });
      }
    });
  }
  else 
    div.innerHTML = "<p>No user address entered</p>";

  if(flag==0)
    div.innerHTML = "<p>No NFTs owned by this user</p>";
}

//change the URL accordingly
function fixURL(url) {
  if (url.startsWith("ipfs"))
    return (
      "https://ipfs.moralis.io:2053/ipfs/" + url.split("ipfs://ipfs/").slice(-1)
    );
  else
    return url + "?format=json";

}
