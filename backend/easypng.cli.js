var LimitPNG=require("./limitPNG");
var l=new LimitPNG(process.argv[2],require("npmlog"));
l.doDefault("-suffix",process.argv[3],function(){
	console.log("Done",arguments);
});
