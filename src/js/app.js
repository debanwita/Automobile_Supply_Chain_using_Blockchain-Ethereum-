App = {
  web3Provider: null,
  contracts: {},
  
  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      ethereum.enable();
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      ethereum.enable();
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Supply_chain.json", function(supply_chain) {
      
      // Instantiate a new truffle contract from the artifact
      App.contracts.Supply_chain = TruffleContract(supply_chain);

      // Connect provider to interact with contract
      App.contracts.Supply_chain.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var supply_chain_instance;

    web3.eth.getAccounts(function(err, account) {
      if (err === null) {
        App.account = account;
       
        //console.log("hi");
        //console.log(App.account[0]);
      }
    });
    
    App.contracts.Supply_chain.deployed().then(function(instance) {
      supply_chain_instance = instance;
    });

    /*web3.eth.getBalance('0x6a1ac12f4349Ee88e8aC9132d1720a22A5270a91',function(error,result){
      if(error){
         console.log(error)
      }
      else{
         b = result;
         b = b.toNumber();
         b = web3.fromWei(b,"ether");
         console.log(b);
      }
   }) ;*/

  },

  addParts : function(){
    console.log("Inside add part");
    document.getElementById("add_part_btn").style.backgroundColor = "lavender";
    document.getElementById("view_part_btn").style.backgroundColor = "lavender";
    $("#add_part_details_form").show();
    $("#view_part").hide();
  },

  addParts2 : function(){
    console.log("In part2");

    var partid = $('#part_id').val();
    var partname = $('#part_name').val();
    var weight = $('#part_weight').val();
    var partweight = parseInt(weight,10);
    var partmfgdate = $('#part_mfg_date').val();
    var p = $("#part_price").val();
    var price = parseInt(p,10);
    var location = $("#part_location").val();
    var owner = App.account[0];

    console.log(partid);
    console.log(partname);
    console.log(partweight);
    console.log(partmfgdate);
    console.log(owner);
    console.log(location);

    App.contracts.Supply_chain.deployed().then(function(instance) {
      supply_chain_instance = instance;
      supply_chain_instance.addParts(partid,partname,partweight,owner,partmfgdate,price,location);
      window.alert("Insertion Successfull");
    });
    
  },

  viewParts : function(){
    var owner = App.account[0];
    console.log("In view Parts");
    document.getElementById("view_part_btn").style.backgroundColor = "lavender";
    document.getElementById("add_part_btn").style.backgroundColor = "lavender";

    $("#add_part_details_form").hide();
    $("#view_part").show();
    console.log(owner);

    /*
    //to know the balance of owner
    web3.eth.getBalance(owner,function(error,result){
      if(error){
         console.log(error)
      }
      else{
         b = result;
         b = b.toNumber();
         b = web3.fromWei(b,"ether");
         console.log(b);
      }
   }) ;*/


    var myTab = document.getElementById("view_parts_table");
    len = myTab.rows.length;
    i=0;
    while(i<len)
    {
      myTab.deleteRow(0);
      i = i + 1;
    }
    var row = myTab.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    
    cell1.innerHTML = "<b>Sl No<b>";
    cell2.innerHTML = "<b>Part Id<b>";
    cell3.innerHTML = "<b>Part Name<b>";
    cell4.innerHTML = "<b>Part Weight<b>";
    cell5.innerHTML = "<b>MFG Date<b>";
    cell6.innerHTML = "<b>Part Price<b>";
    cell7.innerHTML = "<b>Part Location<b>";

    var table = document.getElementById("view_parts_table");
    App.contracts.Supply_chain.deployed().then(function(instance){
      supply_chain_instance = instance;
      supply_chain_instance.number_of_parts().then(function(no){
        n = no;
        number = parseInt(n,10);
        i = 1;
        count = 1;
        while(i<=number){
          supply_chain_instance.parts_lists(i).then(function(l){
            list = l;
            o = list[3];
            if(o.toUpperCase() === owner.toUpperCase()){
              console.log(list[1]);

              var row = table.insertRow(-1);
              var cell1 = row.insertCell(0);
              var cell2 = row.insertCell(1);
              var cell3 = row.insertCell(2);
              var cell4 = row.insertCell(3);
              var cell5 = row.insertCell(4);
              var cell6 = row.insertCell(5);
              var cell7 = row.insertCell(6);
              
              cell1.innerHTML = count;
              cell2.innerHTML = list[0];
              cell3.innerHTML = list[1];
              cell4.innerHTML = list[2];
              cell5.innerHTML = list[4];
              cell6.innerHTML = list[5];
              cell7.innerHTML = list[6];

              count = count + 1;
            }
          });
          i = i + 1;
        }
      });
    });
  },

  back : function(){
    location.replace("index.html");
  },

  viewSupplierParts: function(){
    console.log("viewSupplier_parts");
    document.getElementById('s_address').value = '' ;
    
    $("#buy_parts").hide();
    $("#build_car").hide();
    $('#track_parts').hide();
    $('#part_details').hide();
    $('#view_parts').show();
    $('#view_parts_table').hide();
  },

  viewSupplierParts2: function(){
    var supplier = $('#s_address').val();
    console.log(supplier);

    $("#buy_parts").hide();
    $("#build_car").hide();
    $('#track_parts').hide();
    $('#part_details').hide();
    $('#view_parts').show();
    $('#view_parts_table').show();

    var myTab = document.getElementById("view_car_parts");
    len = myTab.rows.length;
    console.log(len);
    i=0;
    while(i<len)
    {
      myTab.deleteRow(0);
      i = i + 1;
    }
    var row = myTab.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
  
    
    cell1.innerHTML = "<b>Sl No<b>";
    cell2.innerHTML = "<b>Part Id<b>";
    cell3.innerHTML = "<b>Part Name<b>";
    cell4.innerHTML = "<b>Part Price<b>";
   

    var table = document.getElementById("view_car_parts");
    App.contracts.Supply_chain.deployed().then(function(instance){
      supply_chain_instance = instance;
      supply_chain_instance.number_of_parts().then(function(no){
        n = no;
        number = parseInt(n,10);
        i = 1;
        count = 1;
        while(i<=number){
          supply_chain_instance.parts_lists(i).then(function(l){
            list = l;
            o = list[3];
            if(o.toUpperCase() === supplier.toUpperCase()){
              console.log(list[1]);

              var row = table.insertRow(-1);
              var cell1 = row.insertCell(0);
              var cell2 = row.insertCell(1);
              var cell3 = row.insertCell(2);
              var cell4 = row.insertCell(3);
            
              
              cell1.innerHTML = count;
              cell2.innerHTML = list[0];
              cell3.innerHTML = list[1];
              cell4.innerHTML = list[5];
           

              count = count + 1;
            }
          });
          i = i + 1;
        }
      });
    });


  },

  buyParts: function(){
    console.log("Inside add part");
    document.getElementById("buy_part_btn").style.backgroundColor = "lavender";
    document.getElementById("build_car_btn").style.backgroundColor = "lavender";
    document.getElementById("track_btn").style.backgroundColor = "lavender";

    $("#buy_parts").show();
    $("#build_car").hide();
    $('#track_parts').hide();
    $('#part_details').hide();
    $('#view_parts').hide();
    $('#view_parts_table').hide();
  },

   buyParts2 : function(){ //changed function
    console.log("Inside add part2");
    var seller_address= $('#seller_address').val();
    var partid = $('#part_id').val();
    var trdate = $('#tr_date').val();
    var owner = App.account[0];
    console.log(seller_address);
    console.log(partid);
    console.log(owner);

    App.contracts.Supply_chain.deployed().then(function(instance){
      supply_chain_instance = instance;
      supply_chain_instance.buyParts(owner,seller_address,partid,trdate);

      supply_chain_instance.number_of_parts().then(function(i){
        var n = i;
        no = parseInt(n,10);
        
        j= 1;
        while(j<=no){
          supply_chain_instance.parts_lists(j).then(function(p){
            part = p;
            pid = part[0];
            if(pid.toUpperCase() === partid.toUpperCase()){
              a = part[5];
              const amount = parseInt(a,10);
              const amountToSend = web3.toWei(amount, "ether"); //convert to wei value
              transactionObject = {
                from: owner,
                to: seller_address,
                value: amountToSend
              } 

              web3.eth.sendTransaction(transactionObject,function(error, result){
                if(!error)
                  console.log(result);
                else
                  console.log(error);
              });
            }
          })
          j = j + 1;
        }
      });
      /*
      //transfer ether from one account to anothe account
      const amount = 20; //willing to send 20 ethers
      const amountToSend = web3.toWei(amount, "ether"); //convert to wei value
      transactionObject = {
        from: owner,
        to: seller_address,
        value: amountToSend
      } 

      web3.eth.sendTransaction(transactionObject,function(err, result){
        if(!error)
          console.log(result);
        else
          console.log(error.code);
      });*/

      window.alert("Transaction Successfull !!");
      document.getElementById("buy_part_btn").style.backgroundColor = "lavender";
      document.getElementById("build_car_btn").style.backgroundColor = "lavender";
      document.getElementById("track_btn").style.backgroundColor = "lavender";
      

      $("#buy_parts").hide();
      $("#build_car").hide();
      $('#track_parts').hide();
      $("#part_details").hide();
      $('#view_parts_table').hide();

      document.getElementById('seller_address').value = '';
      document.getElementById('part_id').value = '' ;
      document.getElementById('tr_date').value = '';
      
    });
    
  },

  buildCar: function(){
    console.log("Inside build car");
    document.getElementById("buy_part_btn").style.backgroundColor = "lavender";
    document.getElementById("build_car_btn").style.backgroundColor = "lavender";
    document.getElementById("track_btn").style.backgroundColor = "lavender";
    

    $("#buy_parts").hide();
    $("#build_car").show();
    $('#track_parts').hide();
    $("#part_details").hide();
    $('#view_parts').hide();
    $('#view_parts_table').hide();
  },

  buildCar2: function(){
    console.log("Inside build Car2");
    var vin= $('#vin').val();
    var model_name = $('#model_name').val();
    var mfg_location = $('#mfg_location').val();
    var mfg_date = $('#mfg_date').val();
    var price = $('#price').val();
    var pid1 = $('#pid1').val();
    var pid2 = $('#pid2').val();
    var pid3 = $('#pid3').val();
    var pid4 = $('#pid4').val();
    var owner = App.account[0];

    console.log(vin);
    console.log(model_name);
    console.log(mfg_location);
    console.log(mfg_date);
    console.log(price);
    console.log(pid1);
    console.log(pid2);
    console.log(pid3);
    console.log(pid4);
    console.log(owner);

    App.contracts.Supply_chain.deployed().then(function(instance){
      supply_chain_instance = instance;
      supply_chain_instance.buildCar(vin,model_name,mfg_location,mfg_date,price,pid1,pid2,pid3,pid4,owner);
      window.alert("Insertion Successful !!");
    });
  },

  trackParts : function(){
    console.log("Inside Track Parts");
    document.getElementById("buy_part_btn").style.backgroundColor = "lavender";
    document.getElementById("build_car_btn").style.backgroundColor = "lavender";
    document.getElementById("track_btn").style.backgroundColor = "lavender";
    $("#buy_parts").hide();
    $("#build_car").hide();
    $('#track_parts').show();
    $("#part_details").hide();
    $('#view_parts').hide();
    $('#view_parts_table').hide();
  },

  trackParts2 : function(){
    $("#part_details").show();

    console.log("In track parts 2");
    var owner = App.account[0];
    console.log(owner);
    var vin = $('#vin1').val();
    if(vin===""){
      alert("Please enter a VIN !!");
      $("#vin1").focus();
    }
    else{
      
      App.contracts.Supply_chain.deployed().then(function(instance){
        supply_chain_instance = instance;
        supply_chain_instance.number_of_cars().then(function(no){
          n = no;
          number = parseInt(n,10);
          console.log(number);
          i = 1;
         
          while(i<=number){
            supply_chain_instance.cars_lists(i).then(function(l){
              list = l;
              o = list[9];
              if(o.toUpperCase() === owner.toUpperCase()) //check validity of owners (pick the vehicle iff it is owner by the same manufacturer who called the function)
              {
                console.log(list[1]);
                document.getElementById("model").value = list[1];
                document.getElementById("mfg_l").value = list[2];
                document.getElementById("mfg_d").value = list[3];
                document.getElementById("car_price").value = list[4];
                
                document.getElementById("p_id1").value = list[5];
                /*start*/
                supply_chain_instance.number_of_buyed_parts().then(function(x){
                  var items = x;
                  var items = parseInt(items,10);
                  //console.log(items);
                  j = 1;
                  while(j<=items){
                    supply_chain_instance.list_of_buy_part_details(j).then(function(y){
                      part = y;
                      if(part[2].toUpperCase() === list[5].toUpperCase()){
                        document.getElementById("ps1").value = part[1];
                        console.log(part[1]);
                      }
                    });
                    j = j + 1;
                  }
                  
                });

                supply_chain_instance.number_of_parts().then(function(x){
                  var items = x;
                  items = parseInt(items,10);
                  console.log(items);
                  j = 1;
                  while(j<=items){
                    supply_chain_instance.parts_lists(j).then(function(y){
                      part = y;
                      console.log(part[0]);
                      if(part[0].toUpperCase() === list[5].toUpperCase()){
                        document.getElementById("pmfg1").value = part[4];
                        document.getElementById("pl1").value = part[6];
                      }
                    });
                    j = j + 1;
                  }
                });
                /*end*/


                //battery
                document.getElementById("p_id2").value = list[6];
                /*start*/
                supply_chain_instance.number_of_buyed_parts().then(function(x){
                  var items = x;
                  var items = parseInt(items,10);
                  //console.log(items);
                  j = 1;
                  while(j<=items){
                    supply_chain_instance.list_of_buy_part_details(j).then(function(y){
                      part = y;
                      if(part[2].toUpperCase() === list[6].toUpperCase()){
                        document.getElementById("ps2").value = part[1];
                        console.log(part[1]);
                      }
                    });
                    j = j + 1;
                  }
                  
                });

                supply_chain_instance.number_of_parts().then(function(x){
                  var items = x;
                  items = parseInt(items,10);
                  console.log(items);
                  j = 1;
                  while(j<=items){
                    supply_chain_instance.parts_lists(j).then(function(y){
                      part = y;
                      console.log(part[0]);
                      if(part[0].toUpperCase() === list[6].toUpperCase()){
                        document.getElementById("pmfg2").value = part[4];
                        document.getElementById("pl2").value = part[6];
                      }
                    });
                    j = j + 1;
                  }
                });
                /*end*/

                //brake
                document.getElementById("p_id3").value = list[7];
                /*start*/
                supply_chain_instance.number_of_buyed_parts().then(function(x){
                  var items = x;
                  var items = parseInt(items,10);
                  //console.log(items);
                  j = 1;
                  while(j<=items){
                    supply_chain_instance.list_of_buy_part_details(j).then(function(y){
                      part = y;
                      if(part[2].toUpperCase() === list[7].toUpperCase()){
                        document.getElementById("ps3").value = part[1];
                        console.log(part[1]);
                      }
                    });
                    j = j + 1;
                  }
                  
                });

                supply_chain_instance.number_of_parts().then(function(x){
                  var items = x;
                  items = parseInt(items,10);
                  console.log(items);
                  j = 1;
                  while(j<=items){
                    supply_chain_instance.parts_lists(j).then(function(y){
                      part = y;
                      console.log(part[0]);
                      if(part[0].toUpperCase() === list[7].toUpperCase()){
                        document.getElementById("pmfg3").value = part[4];
                        document.getElementById("pl3").value = part[6];
                      }
                    });
                    j = j + 1;
                  }
                });
                /*end*/

                //wheel
                document.getElementById("p_id4").value = list[8];
                /*start*/
                supply_chain_instance.number_of_buyed_parts().then(function(x){
                  var items = x;
                  var items = parseInt(items,10);
                  //console.log(items);
                  j = 1;
                  while(j<=items){
                    supply_chain_instance.list_of_buy_part_details(j).then(function(y){
                      part = y;
                      if(part[2].toUpperCase() === list[8].toUpperCase()){
                        document.getElementById("ps4").value = part[1];
                        console.log(part[1]);
                      }
                    });
                    j = j + 1;
                  }
                  
                });

                supply_chain_instance.number_of_parts().then(function(x){
                  var items = x;
                  items = parseInt(items,10);
                  console.log(items);
                  j = 1;
                  while(j<=items){
                    supply_chain_instance.parts_lists(j).then(function(y){
                      part = y;
                      console.log(part[0]);
                      if(part[0].toUpperCase() === list[8].toUpperCase()){
                        document.getElementById("pmfg4").value = part[4];
                        document.getElementById("pl4").value = part[6];
                      }
                    });
                    j = j + 1;
                  }
                });
                /*end*/
              }
            });
            i = i + 1;
          }
        });
      });
    }
  },
  buycar : function(){ 
  console.log("Inside car");
  document.getElementById("buy_car_btn").style.backgroundColor = "lavender";
  document.getElementById("track1_btn").style.backgroundColor = "lavender";
  document.getElementById("track_btn").style.backgroundColor = "lavender";

  $("#buy_cars").show();
  $("#track_car").hide();
  $("#car_details").hide();
  $("#track_parts").hide();
  $("#part_details").hide();
  },

  buycar2 : function(){
    console.log("Inside add part2");
    console.log("myaddress");
    var seller_address= $('#seller_address').val();
    var carid = $('#car_id').val();
    var trdate = $('#tr_date1').val();
    
    var owner = App.account[0];

    console.log(seller_address);
    console.log(carid);
    console.log(owner);

    App.contracts.Supply_chain.deployed().then(function(instance){
      supply_chain_instance = instance;
      supply_chain_instance.buyCar(owner,seller_address,carid,trdate);

      supply_chain_instance.number_of_cars().then(function(i){
        var n = i;
        no = parseInt(n,10);
        
        j= 1;
        while(j<=no){
          supply_chain_instance.cars_lists(j).then(function(c){
            car = c;
            cid = car[0];
            if(cid.toUpperCase() === carid.toUpperCase()){
              a = car[4];
              const amount = parseInt(a,10);
              const amountToSend = web3.toWei(amount, "ether"); //convert to wei value
              transactionObject = {
                from: owner,
                to: seller_address,
                value: amountToSend
              } 

              web3.eth.sendTransaction(transactionObject,function(error, result){
                if(!error)
                  console.log(result);
                else
                  console.log(error);
              });
            }
          })
          j = j + 1;
        }
      });

      window.alert("Transaction Successfull !!");
      document.getElementById("buy_car_btn").style.backgroundColor = "lavender";
      document.getElementById("track1_btn").style.backgroundColor = "lavender";
      document.getElementById("track1_btn").style.backgroundColor = "lavender";
      

      $("#buy_cars").hide();
      $("#track_car").hide();
      $("#car_details").hide();
      $("#track_parts").hide();
      $("#part_details").hide();
      
      document.getElementById('seller_address').value = '';
      document.getElementById('car_id').value = '' ;
      document.getElementById('tr_date1').value = '';
      
    });
    
  },
  trackCar : function(){
    console.log("Inside Track car");
    document.getElementById("buy_car_btn").style.backgroundColor = "lavender";
    document.getElementById("track1_btn").style.backgroundColor = "lavender";
    document.getElementById("track_btn").style.backgroundColor = "lavender";
    $("#buy_cars").hide();
    $('#track_car').show();
    $("#car_details").hide();
    $("#track_parts").hide();
    $("#part_details").hide();
  },

  trackCar2 : function(){
    $("#car_details").show();
    $("#buy_cars").hide();
    $('#track_car').hide();
    $("#track_parts").hide();
    $("#part_details").hide();
    
    console.log("In track car 2");
    var owner = App.account[0];
    document.getElementById("buy_car_btn").style.backgroundColor = "lavender";
    document.getElementById("track1_btn").style.backgroundColor = "lavender";
    document.getElementById("track_btn").style.backgroundColor = "lavender";
    console.log(owner);
    var seller = $('#s1').val();
    if(seller===""){
      alert("Please enter an address !!");
      $("#s1").focus();
    }
    else{
      var myTab = document.getElementById("view_cars_table");
    len = myTab.rows.length;
    i=0;
    while(i<len)
    {
      myTab.deleteRow(0);
      i = i + 1;
    }
    var row = myTab.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    
    
    cell1.innerHTML = "<b>Sl.No.<b>";
    cell2.innerHTML = "<b>Vehicle No<b>";
    cell3.innerHTML = "<b>Model Name<b>";
    cell4.innerHTML = "<b>MFG location<b>";
    cell5.innerHTML = "<b>MFG Date<b>";
    cell6.innerHTML = "<b>Car Price<b>";
    var table = document.getElementById("view_cars_table");
    App.contracts.Supply_chain.deployed().then(function(instance){
      supply_chain_instance = instance;
      supply_chain_instance.number_of_cars().then(function(no){
        n = no;
        number = parseInt(n,10);
        i = 1;
        count = 1;
        while(i<=number){
          supply_chain_instance.cars_lists(i).then(function(l){
            list = l;
            o = list[9];
            if(o.toUpperCase() === seller.toUpperCase()){
              console.log(list[1]);

              var row = table.insertRow(-1);
              var cell1 = row.insertCell(0);
              var cell2 = row.insertCell(1);
              var cell3 = row.insertCell(2);
              var cell4 = row.insertCell(3);
              var cell5 = row.insertCell(4);
              var cell6 = row.insertCell(5);
              
              cell1.innerHTML = count;
              cell2.innerHTML = list[0];
              cell3.innerHTML = list[1];
              cell4.innerHTML = list[2];
              cell5.innerHTML = list[3];
              cell6.innerHTML = list[4];
            

              count = count + 1;
            }
          });
          i = i + 1;
        }
      });
    });
   }
  },
  trackcarparts : function(){
    console.log("Inside Track Parts");
    document.getElementById("buy_car_btn").style.backgroundColor = "lavender";
    document.getElementById("track1_btn").style.backgroundColor = "lavender";
    document.getElementById("track_btn").style.backgroundColor = "lavender";
    $("#buy_cars").hide();
    $("#track_car").hide();
    $("#car_details").hide();
    $('#track_parts').show();
    $("#part_details").hide();
  },
  trackcarparts2 : function(){
    $("#part_details").show();

    console.log("In track parts 2");
    var owner = App.account[0];
    console.log(owner);
    var vin = $('#vin1').val();
    if(vin===""){
      alert("Please enter a VIN !!");
      $("#vin1").focus();
    }
    else{
      
      App.contracts.Supply_chain.deployed().then(function(instance){
        supply_chain_instance = instance;
        supply_chain_instance.number_of_cars().then(function(no){
          n = no;
          number = parseInt(n,10);
          console.log(number);
          i = 1;
         
          while(i<=number){
            supply_chain_instance.cars_lists(i).then(function(l){
              list = l;
              o = list[9];
              if(o.toUpperCase() === owner.toUpperCase()) //check validity of owners (pick the vehicle iff it is owner by the same customer who called the function)
              {
                console.log(list[1]);
                document.getElementById("model").value = list[1];
                document.getElementById("mfg_l").value = list[2];
                document.getElementById("mfg_d").value = list[3];
                document.getElementById("car_price").value = list[4];
                
                document.getElementById("p_id1").value = list[5];
                /*start*/
                supply_chain_instance.number_of_buyed_parts().then(function(x){
                  var items = x;
                  var items = parseInt(items,10);
                  //console.log(items);
                  j = 1;
                  while(j<=items){
                    supply_chain_instance.list_of_buy_part_details(j).then(function(y){
                      part = y;
                      if(part[2].toUpperCase() === list[5].toUpperCase()){
                        document.getElementById("ps1").value = part[1];
                        console.log(part[1]);
                      }
                    });
                    j = j + 1;
                  }
                  
                });

                supply_chain_instance.number_of_parts().then(function(x){
                  var items = x;
                  items = parseInt(items,10);
                  console.log(items);
                  j = 1;
                  while(j<=items){
                    supply_chain_instance.parts_lists(j).then(function(y){
                      part = y;
                      console.log(part[0]);
                      if(part[0].toUpperCase() === list[5].toUpperCase()){
                        document.getElementById("pmfg1").value = part[4];
                        document.getElementById("pl1").value = part[6];
                      }
                    });
                    j = j + 1;
                  }
                });
                /*end*/


                //battery
                document.getElementById("p_id2").value = list[6];
                /*start*/
                supply_chain_instance.number_of_buyed_parts().then(function(x){
                  var items = x;
                  var items = parseInt(items,10);
                  //console.log(items);
                  j = 1;
                  while(j<=items){
                    supply_chain_instance.list_of_buy_part_details(j).then(function(y){
                      part = y;
                      if(part[2].toUpperCase() === list[6].toUpperCase()){
                        document.getElementById("ps2").value = part[1];
                        console.log(part[1]);
                      }
                    });
                    j = j + 1;
                  }
                  
                });

                supply_chain_instance.number_of_parts().then(function(x){
                  var items = x;
                  items = parseInt(items,10);
                  console.log(items);
                  j = 1;
                  while(j<=items){
                    supply_chain_instance.parts_lists(j).then(function(y){
                      part = y;
                      console.log(part[0]);
                      if(part[0].toUpperCase() === list[6].toUpperCase()){
                        document.getElementById("pmfg2").value = part[4];
                        document.getElementById("pl2").value = part[6];
                      }
                    });
                    j = j + 1;
                  }
                });
                /*end*/

                //brake
                document.getElementById("p_id3").value = list[7];
                /*start*/
                supply_chain_instance.number_of_buyed_parts().then(function(x){
                  var items = x;
                  var items = parseInt(items,10);
                  //console.log(items);
                  j = 1;
                  while(j<=items){
                    supply_chain_instance.list_of_buy_part_details(j).then(function(y){
                      part = y;
                      if(part[2].toUpperCase() === list[7].toUpperCase()){
                        document.getElementById("ps3").value = part[1];
                        console.log(part[1]);
                      }
                    });
                    j = j + 1;
                  }
                  
                });

                supply_chain_instance.number_of_parts().then(function(x){
                  var items = x;
                  items = parseInt(items,10);
                  console.log(items);
                  j = 1;
                  while(j<=items){
                    supply_chain_instance.parts_lists(j).then(function(y){
                      part = y;
                      console.log(part[0]);
                      if(part[0].toUpperCase() === list[7].toUpperCase()){
                        document.getElementById("pmfg3").value = part[4];
                        document.getElementById("pl3").value = part[6];
                      }
                    });
                    j = j + 1;
                  }
                });
                /*end*/

                //wheel
                document.getElementById("p_id4").value = list[8];
                /*start*/
                supply_chain_instance.number_of_buyed_parts().then(function(x){
                  var items = x;
                  var items = parseInt(items,10);
                  //console.log(items);
                  j = 1;
                  while(j<=items){
                    supply_chain_instance.list_of_buy_part_details(j).then(function(y){
                      part = y;
                      if(part[2].toUpperCase() === list[8].toUpperCase()){
                        document.getElementById("ps4").value = part[1];
                        console.log(part[1]);
                      }
                    });
                    j = j + 1;
                  }
                  
                });

                supply_chain_instance.number_of_parts().then(function(x){
                  var items = x;
                  items = parseInt(items,10);
                  console.log(items);
                  j = 1;
                  while(j<=items){
                    supply_chain_instance.parts_lists(j).then(function(y){
                      part = y;
                      console.log(part[0]);
                      if(part[0].toUpperCase() === list[8].toUpperCase()){
                        document.getElementById("pmfg4").value = part[4];
                        document.getElementById("pl4").value = part[6];
                      }
                    });
                    j = j + 1;
                  }
                });
                /*end*/
              }
            });
            i = i + 1;
          }
        });
      });
    }
  },
  buyCars : function(){ 
    console.log("Inside car");
    document.getElementById("buy_car_btn").style.backgroundColor = "lavender";
    document.getElementById("track1_btn").style.backgroundColor = "lavender";
    
  
    $("#buy_cars").show();
    $("#track_car").hide();
    $("#car_details").hide();
    
    },
  
    buyCars2 : function(){
      console.log("Inside add part2");
      var seller_address= $('#seller_address').val();
      var carid = $('#car_id').val();
      var trdate = $('#tr_date1').val();
      var owner = App.account[0];
      console.log(seller_address);
      console.log(carid);
      console.log(owner);
  
      App.contracts.Supply_chain.deployed().then(function(instance){
        supply_chain_instance = instance;
        supply_chain_instance.buyCar(owner,seller_address,carid,trdate);
  
        supply_chain_instance.number_of_cars().then(function(i){
          var n = i;
          no = parseInt(n,10);
          
          j= 1;
          while(j<=no){
            supply_chain_instance.cars_lists(j).then(function(c){
              car = c;
              cid = car[0];
              if(cid.toUpperCase() === carid.toUpperCase()){
                a = car[4];
                const amount = parseInt(a,10);
                const amountToSend = web3.toWei(amount, "ether"); //convert to wei value
                transactionObject = {
                  from: owner,
                  to: seller_address,
                  value: amountToSend
                } 
  
                web3.eth.sendTransaction(transactionObject,function(error, result){
                  if(!error)
                    console.log(result);
                  else
                    console.log(error);
                });
              }
            })
            j = j + 1;
          }
        });
  
        window.alert("Transaction Successfull !!");
        document.getElementById("buy_car_btn").style.backgroundColor = "lavender";
        document.getElementById("track1_btn").style.backgroundColor = "lavender";
       
  
        $("#buy_cars").hide();
        $("#track_car").hide();
        $("#car_details").hide();
        
        
        document.getElementById('seller_address').value = '';
        document.getElementById('car_id').value = '' ;
        document.getElementById('tr_date1').value = '';
        
      });
      
    },
    trackCars : function(){
      console.log("Inside Track car");
      document.getElementById("buy_car_btn").style.backgroundColor = "lavender";
      document.getElementById("track1_btn").style.backgroundColor = "lavender";
     
      $("#buy_cars").hide();
      $('#track_car').show();
      $("#car_details").hide();
      
    },
  
    trackCars2 : function(){
      $("#car_details").show();
      $("#buy_cars").hide();
      $('#track_car').hide();
      
      
      console.log("In track car 2");
      var owner = App.account[0];
      document.getElementById("buy_car_btn").style.backgroundColor = "lavender";
      document.getElementById("track1_btn").style.backgroundColor = "lavender";
      console.log(owner);
      var seller = $('#s1').val();
      if(seller===""){
        alert("Please enter an address !!");
        $("#s1").focus();
      }
      else{
        var myTab = document.getElementById("view_cars_table");
      len = myTab.rows.length;
      i=0;
      while(i<len)
      {
        myTab.deleteRow(0);
        i = i + 1;
      }
      var row = myTab.insertRow(-1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      var cell6 = row.insertCell(5);
      
      
      cell1.innerHTML = "<b>Sl.No.<b>";
      cell2.innerHTML = "<b>Vehicle No<b>";
      cell3.innerHTML = "<b>Model Name<b>";
      cell4.innerHTML = "<b>MFG location<b>";
      cell5.innerHTML = "<b>MFG Date<b>";
      cell6.innerHTML = "<b>Car Price<b>";
      var table = document.getElementById("view_cars_table");
      App.contracts.Supply_chain.deployed().then(function(instance){
        supply_chain_instance = instance;
        supply_chain_instance.number_of_cars().then(function(no){
          n = no;
          number = parseInt(n,10);
          i = 1;
          count = 1;
          while(i<=number){
            supply_chain_instance.cars_lists(i).then(function(l){
              list = l;
              o = list[9];
              if(o.toUpperCase() === seller.toUpperCase()){
                console.log(list[1]);
  
                var row = table.insertRow(-1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);
                
                cell1.innerHTML = count;
                cell2.innerHTML = list[0];
                cell3.innerHTML = list[1];
                cell4.innerHTML = list[2];
                cell5.innerHTML = list[3];
                cell6.innerHTML = list[4];
              
  
                count = count + 1;
              }
            });
            i = i + 1;
          }
        });
      });
     }
    },

 

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});