//引入模块
var http=require('http');
var url=require('url');
var fs=require('fs');
var querystring=require('querystring');

//kay:车牌号，val:密码
var num={
	12061036:'3334',
	215363718579:'8579'	,
	13632129:'3144',
	10493402:'2312',
	20524945:'4151',
	6130308:'9832',
	10467996:'3241',
	21535071:'5121',
	21308978:'3372',
	14449764:'3223',
	21308978:'3372',
	7072575:'6081',
	21129465:'4452',
	2751343:'8865',
	21163245:'4211',
	1318650:'4234',
	20011958:'1947',
	1800873:'9179',
	7505789:'4079',
	2751343:'8865',
	1800873:'9179',
	21273281:'2842',
	6863864:'6236',
	13004131:'1312',
	12048743:'3332',
	21121225:'1307',
	6854950:'5342',
	12334084:'2434',
	452358:'2577',
	1650841:'2470',
	3524183:'1214',
	7649162:'7597',
	5496565:'8871',
	2389564:'4223',
	1347971:'6693',
	6130253:'4055',
	3145698:'4980',
	7880476:'5430',
	12090589:'2234',
	1343855:'8172',
	7651382:'2359',
	251367:'1238',
	2314568:'7290',
	443523:'5410',
	5580651:'1427',
	321546:'1691',
	5580726:'7270',
	4552378:'6683',
	2501084:'4282',
	1963285:'1991',
	5196502:'4683',
	317743:'5890',
	5465806:'4089',
	6136537:'2222',
	1974833:'8170',
	7651322:'0656',
	1344527:'4968',
	7649150:'3647',
	2008026:'0620',
	2805902:'6408',
	457821:'5430',
	1956213:'7820',
	5328442:'5093',
	2512876:'4690',
	1870905:'5633',
	4114173:'2810',
	961470:'3342',
	6960077:'9814',
	1343857:'2831',
	1498437:'9836',
	6960080:'2813',
	1343856:'8362',
	4114172:'8259',
	914189:'0781',
	2008146:'7151',
	5580738:'4363',
	21117352:'5223',
	6853728:'3601',
	6141573:'9412',
	5589387:'2806',
	12360872:'3341',
	6383164:'1263',
	6678418:'2323',
	4111038:'4850',
	515943:'7414',
	515931:'1080',
	1967999:'8200',
	2210384:'9885',
	1803470:'3230',
	1328389:'8689',
	04343:'5951',
	1726198:'8923',
	1777100:'5288',
	829841:'6978',
	21147952:'3801',
	12208415:'2441',
	5503575:'1763',
	12012147:'1142',
	7670486:'9457',
	3462592:'8162',
	3652992:'6736',
	7039712:'4237',
	6300755:'1234',
	7650244:'9457',
	893899:'8477',
	2782026:'7751',	
	6286320:'3422',
	1386256:'4591',
	961470:'3342',
	5328442:'5093',
	1974833:'8170',
	1343857:'2831',
	7649162:'7597',
	2008146:'7151',
	12532381:'3332',
	6956751:'2125',
	13508123:'2331',
	13585044:'2323',
	12203427:'4141',
	13986116:'3224',
	14846904:'3214',
	14293570:'2121',
	14711810:'4231',
	19510865:'3223'
}



//创建服务器对象
//req：客服端请求的一些信息，res：服务器端向客户端返回的响应信息
var server=http.createServer(function(req,res){ 
	var parseUrl=url.parse(req.url); 
    var data=querystring.parse(parseUrl.query); //get方式取数据
    var fromCss='css';
    var fromHtml='html';
    var MongoClient = require('mongodb').MongoClient;
	var DB_CONN_STR = 'mongodb://localhost:27017/keydb'; //# 数据库为 runoob
	var operateData = function(db, callback) {
		//连接到表 keys
	    var collection = db.collection('keys');
	     switch(parseUrl.pathname){
	     	case '/':
	     		readFile('index.html',req,res,fromHtml);
	            break;
	        case '/js/ajax.js': //引入ajax.js文件，方便前端使用
	            readFile('js/ajax.js',req,res);
	            break;
	        case '/styles/public.css': 
	        	readFile('styles/public.css',req,res,fromCss);
	        	break;
	        case '/index':
	             readFile('index.html',req,res,fromHtml);
	             break;             
	        case '/deblocking':
	             readFile('deblocking.html',req,res,fromHtml);
	             break;        
	        case '/addInfo':
	        	 readFile('addInfo.html',req,res,fromHtml);
	        	 break;
	        	 
	        	 //点击查询解锁码
	       	case '/inquiry':  
	       			//查询前端传给后端的值是否存在
	       		 	var whereStr={'plateNum':data.val};  	      
	       		 	//err：出错内容，result：元素本身
				 	collection.find(whereStr).toArray(function(err,result){
				    	if(err){//如果出错，就将出错的原因打印出来
				    		console.log('Error'+err);return;
				    	}
				    	 //如果查询的车牌号存在
				    	if(result!=null && result.length!=0){
				    		res.end(JSON.stringify(result[0].password));//将其对应的密码传给前端
				    		callback(result);result
				    		return;
				    	}else{
		       		 	 	var notFound='没有查找到车辆相关信息';
		            	 	res.end(JSON.stringify(notFound));
				    	}
				    });
	       		 break;
	       		 //添加车辆信息
	       	case '/add': 
	       			//查询添加的车牌号是否已存在
	       			var whereStr={'plateNum':data.val1}; 
	       			var passStr={'password':data.val2}; 
				 	collection.find(whereStr).toArray(function(err,result){ 
				 		//如果已经存在
				    	if(result.length!=0 && result!=null){
				    		console.log('您所添加的车辆已存在');
		       	      		res.end(JSON.stringify(true));	
		       	      		return;
				    	}	
				    	//如果不存在就添加到数据库中
				    	var data ={"plateNum":whereStr.plateNum,'password':passStr.password};
				    	console.log(data);
						collection.insert(data, function(err, result) { 
						        if(err)
						        {
						            console.log('Error:'+ err);
						            return;
						        }     
						        callback(result);
						        res.end(JSON.stringify(false))	
						});
				  });
	       		 break;
	        default:
	            res.writeHead(404,{
	                'content-type':'text/html;charset=utf-8'
	            });
	            readFile('404.html',req,res);
	            break;
	     } 
	};
	MongoClient.connect(DB_CONN_STR, function(err, db) {
	    console.log("连接成功！");
	    operateData(db, function(result) {
	        console.log(result);
	        db.close();
	    });
	});
     
}).listen(8080,'0.0.0.0');//监听
function readFile(file,req,res,from){
    var htmlSrc=__dirname+'/'+file;  
    fs.readFile(htmlSrc,function(err,data){
        if(err){
            readFile('404.html',req,res);
        }else{        	
        	if(from=='css'){
        		 res.writeHead(200,{
               		 'content-type':'text/css;charset=utf-8'
           		});           		 
        	}else{
        		 res.writeHead(200,{
                	'content-type':'text/html;charset=utf-8'
           		 }); 
        	}           
            res.end(data);
        }
    });
}

