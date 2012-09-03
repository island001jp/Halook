var halook = {};
halook.hbase = {};
halook.dataArray = null;
halook.hbase.dataArray = [];

var data_list = [];
//var time = 1346638518210;
var time = (new Date()).getTime() - 60 * 60 * 24 * 1000;
var region_number = 2;
var region_server_number = 2;

event_list = ["", 
              "", 
              "", 
              "", 
              "Compaction_minor", 
              "Compaction_minor", 
              "Compaction_minor",
              "Compaction_major", 
              "Split",
              "Compaction_minor,Split"];

for(var i=0; i<60*24; i++){
	time += 60000;
	if (Math.random() > 0.2){
		region_number += Math.floor(Math.random() * 5 );
		region_server_number += Math.floor( Math.random() * 5 );
	}else{
		region_number -= Math.floor(Math.random() * 5 );
		region_server_number -= Math.floor(Math.random() * 5 );
	}
	
	var output = {}
	output.timestamp = time;
	output.data = {
		region_number			: region_number,
		region_server_number 	: region_server_number
	};
	output.event = event_list[Math.floor( Math.random() * 10 )];
	
	halook.hbase.dataArray.push(output);
	//console.log(output);
	//console.log(new Date(time));
	//console.log((new Date(time)).getSeconds());
	
}

