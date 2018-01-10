var express = require('express')
var mysql = require('mysql')
var body = require('body-parser')
var multer = require('multer')
var fs = require('fs')
var path = require('path')
var app = express()
var pool = mysql.createPool({
	host:'127.0.0.1',
	user:'root',
	password:'root',
	database:'login',
	port:'3306'
})

app.use(body.urlencoded({}))
app.use(multer({dest:'./images'}).any())

app.post('/images',(req,res)=>{
	var file = req.files[0]
	var oldname = file.filename
	var h = path.parse(file.originalname).ext
	var newname = file.filename+h
	fs.rename('./images/'+oldname,'./images/'+newname,function(err){
		if(err){
			console.log(err)
			return
		}
		res.send('/images/'+newname)
	})
})

function SQl(da){
	pool.getConnection(function(err,connection){
		if(err){
    		console.log('connection'+err)
    		return
    	}
		connection.query(da.sql,da.arr,function(err,data){
			if(err){
    		console.log('query'+err)
    		return
    	      }
			da.data(data)
			connection.end()  
		})
	})
}
SQl({
	sql:'select * from login where uid=?',
	arr:[1],
	data:function(da){
		console.log(da)
	}
})
app.post('/loginup',(req,res)=>{
	var user = req.body.user
    var pass = req.body.pass
    var img = req.body.img
    pool.getConnection(function(err,connection){
    	if(err){
    		console.log(err)
    		return
    	}
    	var sql = 'select user from login where user=?'
    	connection.query(sql,[user],function(err,data){
    		if(err){
    		console.log(err)
    		return
    	    }
    		if(data == ''){
             var sql1 = 'insert into login(user,pass,img) values(?,?,?)'
             connection.query(sql1,[user,pass,img],function(err,data1){
    				if(err){
    		          console.log(err)
    		          return
    	             }
    				res.send('ok')
    				connection.end()
    			})
    		}else{
    			res.send('no ok')
    		}
    		
    	})
    })
	
})

//登录

app.post('/loginin',(req,res)=>{
	var user = req.body.user
    var pass = req.body.pass
    pool.getConnection(function(err,connection){
    	if(err){
    		console.log(err)
    		return
    	}
    	var sql = 'select * from login where user=?'
    	connection.query(sql,[user],function(err,data){
    		if(err){
    		console.log(err)
    		return
    	    }
    		console.log(data)
    		if(data == ''){
    			res.send('用户名不存在')
    		}else{
    			if(data[0].pass == pass){
    				res.send(data[0].img)
    			}else{
    				res.send('密码错误')
    			}
    		}
    		connection.end()
    	})
    })
	
})

app.use(express.static('./'))
app.listen(8000,function(){
	console.log('ok')
})


