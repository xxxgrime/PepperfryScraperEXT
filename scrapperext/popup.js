  let Buttonx  = document.getElementById('thebutton');


    Buttonx.onclick = function(element) {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {code:`
	
          var pagecounter = 1; //to keep track of the url
          var counter = 0; //
          var domdetails;
          var domnamelink;
          var domofferprice;
          var domretailprice;
          var productlist = [];
          var Product = {
              prdtname: "",
              prdtbrand: "",
              prdtmaterial: "",
              prdtwarranty: "",
              prdtviews: "",
              prdtlastbought: "",
              prdttogprice: "",
              prdtdtprice: ""
          }
           var xhttp = new XMLHttpRequest();//setting the xhr object


           //getting scrapping elements;
          function getdom(x)
          {
              //window.scrollTo(0,5000);
              domdetails = x.document.getElementsByClassName("clip-lstvw-prddtls");
              domnamelink = x.document.getElementsByClassName("clip-lstvw-prdcnt");
              domofferprice = x.document.getElementsByClassName("clip-offr-price");
              domretailprice = x.document.getElementsByClassName("clip-retail-price");
              return domdetails.length;
          }

          //function returns the reference to the open window;
	// You the category over here.
          async function getpage()
          { console.log("asdasd")
              var windowref;
              var _page = new Promise((resolve, reject) =>
              {	  // set category url here
                  windowref = window.open("https://www.pepperfry.com/furniture-sofas-one-seater-sofas.html?p=" + pagecounter);
                  windowref.onload = function()
                  {
                      resolve()
                  }
              })
              await _page;
              pagecounter++;
              return windowref;

          }


          //slicing and dicing
          function stringtonumber(thecounter, string)
          {
              var temp = string.slice(string.indexOf(".") + 1, string.length);
              temp = temp.replace(",", "")
              temp = Number(temp)
              return temp
          }


          //view getter function
          async function getviews(link)
          {
              var temp;
              var x;
              var secondaryPage = new Promise(
                  (resolve, reject) =>
                  {
                      temp = window.open(link);
                      temp.onload = function()
                      {

                          x = temp.document.getElementsByClassName("vip-viewd-cnt-wrap")[0].textContent;
                          resolve("dme")
                      }
                  })
              await secondaryPage
              temp.close();
              x = x.slice(x.indexOf("d") + 1, x.indexOf("T")).trim();
              x = Number(x)
              return x
          }

          //sends and recieves the response
          async function send()
          {
              var x = new Promise(
                  (resolve, reject) =>
                  {
                      xhttp.onreadystatechange = function()
                      {
                          if (this.readyState == 4)
                          {

                              console.log(this.responseText)

                          }
                      }
                      xhttp.open("POST", "http://localhost:3000/")
                      xhttp.setRequestHeader("Content-type", "application/json");
                      var data = JSON.stringify(productlist);
                      xhttp.send(data);
                  })
              await x
          }

          var domlist=0;
          //takes the window reference as arguements and returns product list
          async function getarray(refobject)
          {
              var css=0;
              domlist+= getdom(refobject);
              //number of items
              while (counter < 5)
              {
                  productlist[counter]=Object.create(Product)
                  productlist[counter].prdtname = domnamelink[css].firstChild.firstChild.textContent.trim();
                  productlist[counter].prdtbrand = domnamelink[css].children[1].firstChild.textContent.trim()
                  productlist[counter].prdtlink = String(domnamelink[css].firstChild.firstChild)
                  productlist[counter].prdtmaterial = domdetails[css].firstChild.children[2].textContent;
                  productlist[counter].prdtwarranty = domdetails[css].firstChild.children[1].textContent.trim();
                  productlist[counter].prdtdtprice = await stringtonumber(css, domofferprice[css].textContent)
                  productlist[counter].prdtogprice = await stringtonumber(css, domretailprice[css].textContent)
                  productlist[counter].prdtviews=await getviews(productlist[css].prdtlink);

                  counter++;
                  css++;
              }
              //
              var closewindow=new Promise((resolve,reject)=>{
                     refobject.onbeforeunload=function(){
                         resolve();
                     }
                      refobject.close();
              })
              await closewindow;


          }

           async function init()
           {
              for(i=0;i<1;i++){//here we set the number pages to be scanned
                  var windowref = await getpage()
                  await getarray(windowref);
              }
          	await send();

          }
          init();
  `
        });
    });
  };
