var LimitPNG=require("./limitPNG");
const express = require('express');
const path = require('path');
const app = express();
const formidable = require('formidable');
const fs = require('fs');
const os = require('os');
var crypto = require('crypto');
var queue = require('queue');
var fsex=require("fs-extra");
var q = queue();
q.autostart=true;
q.concurrency=1;
q.start();
var success_data={};
fs.mkdir(os.tmpdir()+"/EasyPNGD",function(err){});


app.listen(3000,function(){
    console.log('server is running at port 3000.');
})

app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",'EPNG');
    next();  
});  

app.use('/get', express.static(os.tmpdir()+"/EasyPNGD/"));
app.get("/check/:md5",function(req,res){
	var md5=req.params.md5;
	var nimgfile=os.tmpdir()+"/EasyPNGD/"+md5+".png";
	fs.exists(nimgfile,function(ex){
		if(!ex)return res.json({code:-1,error:"file not exists"});
		res.json({code:0,error:"file exists"});
	});
});

app.post("/upload",function(req,res){
    var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		var imgfile=files.file.path;
		//md5
		var md5sum = crypto.createHash('md5');
		var stream = fs.createReadStream(imgfile);
		stream.on('data', function(chunk) {
			md5sum.update(chunk);
		});
		stream.on('end', function() {
			var md5 = md5sum.digest('hex').toLowerCase();
			//copy to tmp
			var nimgfile=os.tmpdir()+"/EasyPNGD/"+md5+".png";
			fsex.copy(imgfile,nimgfile, err => {
				if (err) return res.json({code:-1,error:err});
				res.json({code:0,md5:md5});
			})
		});
    });
})

app.get("/process/:mode/:md5",function(req,res){
	var mode=req.params.mode;
	var md5=req.params.md5;
	var nimgfile=os.tmpdir()+"/EasyPNGD/"+md5+".png";
	var ximgfile=os.tmpdir()+"/EasyPNGD/"+md5+"_"+mode.replace("-","_")+".png";
	fs.exists(nimgfile,function(ex){
		if(!ex)return res.json({code:-1,error:"file not exists"});
		if(typeof(success_data[md5+"_"+mode])!="undefined"){
			res.json({code:0,data:success_data[md5+"_"+mode],id:md5+"_"+mode.replace("-","_"),queue:q.length});
			return;
		}
		fs.exists(ximgfile,function(ex){
			if(ex)return res.json({code:0,data:null,id:md5+"_"+mode.replace("-","_"),queue:q.length});
			success_data[md5+"_"+mode]={
				mode:mode,
				md5:md5,
				type:"pending"
			}
			q.push(function(cb) {
				var l=new LimitPNG(nimgfile,require("npmlog"));
				l.doDefault("-suffix",mode,function(){
					success_data[md5+"_"+mode]={
						mode:mode,
						md5:md5,
						type:"done",
						data:arguments
					}
					cb();
				});
				success_data[md5+"_"+mode]={
					mode:mode,
					md5:md5,
					type:"processing"
				}
			});
			res.json({code:0,id:md5+"_"+mode.replace("-","_"),data:success_data[md5+"_"+mode]});
		});
	});
});