var http  = require('http')
var url  = require('url')
var fs = require('fs')

// Events in nodejs
var events = require('events')

// File uploads in nodejs
var formidable = require('formidable')


// ##############################################
// Create a  server using createServer method ('http)
// Read Query params using url.parse(url, true).query
// Response can be sent using res.write(), res.end()
// Header can be sent using res.writeHead(status_code, {'Content-Type':'text/html'})
// ##############################################

http.createServer((req, res)=>{
    res.writeHead(200, {'Content-Type': 'text/html'})
    var q_params = url.parse(req.url, true).query
    res.write(q_params.name + " "+ q_params.age + " " + q_params.address)
    res.end("") //without this response will never end(browser will be loading continuously...)

}).listen(8540, ()=>{
    console.log("server is up and running...")
})



//#######################  File operations: ########################


// File operations: Read file

http.createServer((req, res)=>{
    fs.readFile('mytextfile.html', (err, data)=>{
        res.writeHead(200, {'Content-Type':'text/html'})
        res.write(data)
        res.end() 
        // return res (optional, either return or not, it works!)
    })

}).listen(8541, ()=>{
    console.log("server is up and running...")
})

// The File System module has methods for creating new files:
// fs.open(): create empty file
// fs.writeFile(): to create new file and write/rewrite if file exists
// fs.appendFile(): to append if file exists/create new file if not exists, and write content
// same syntax for writeFile, appendFile
// fs.unlink(): to delete file
// fs.rename(): to renaming files

http.createServer((req, res)=>{
    fs.appendFile('myappendedfile.html', "this is data!\n", (err)=>{
        if(err) throw err
        console.log("Sucessfully appended!")
        res.writeHead(200, {'Content-Type':'text/html'})
        res.write("Succesfully appended")
        res.end()
    })

}).listen(8542, ()=>{
    console.log("server is up and running...")
})


http.createServer((req, res)=>{
    fs.open('mynewcreatedfile.txt', 'w', (err, file)=>{
        if(err) throw err
        res.writeHead(200, {'Content-Type':'text/html'})
        res.write("Successfully created!")
        res.end()
    })

}).listen(8543, ()=>console.log("Server is up and running..."))


// To delete a file with the File System module,  use the fs.unlink() method.

// The fs.unlink() method deletes the specified file:

http.createServer((res, req)=>{
    fs.unlink('mynewcreatedfile.txt', (err)=>{
        if(err) throw err
        console.log("successfully deleted mytextfile.html file")
    })
}).listen(8544, ()=>console.log("server is up and running..."))


// Rename Files:

// fs.rename('mynewfile1.txt', 'myrenamedfile.txt', function (err) {
//     if (err) throw err;
//     console.log('File Renamed!');
//   });






//#######################  Node.js URL Module: #######################

// var url = require('url');
// var adr = 'http://localhost:8080/default.htm?year=2017&month=february';
// var q = url.parse(adr, true);

// console.log(q.host); //returns 'localhost:8080'
// console.log(q.pathname); //returns '/default.htm'
// console.log(q.search); //returns '?year=2017&month=february'

// var qdata = q.query; //returns an object: { year: 2017, month: 'february' }
// console.log(qdata.month); //returns 'february'


// ####################### Nodejs as file server: #######################

http.createServer((req, res)=>{
    url_from_req = req.url
    query_string = url.parse(url_from_req, true)
    filename = query_string.pathname
    fs.readFile('.'+filename, (err, data)=>{
        if(err){
            res.writeHead(404, {'Content-Type':'text/html'})
            res.end("404, Not Found!")
        }
        else{
            res.writeHead(200, {'Content-Type':'text/html'})
            res.end(data)
        }
    })

}).listen(8900, ()=>console.log("Running server as a file server!"))




// #######################   Event handling in nodejs #######################


// creating an EventEmitter object
var myevent = new events.EventEmitter()

// define handler function or directly use arrow function as callback while registering
function myCustomEventHandler(){
    console.log("myCustomEventName triggered.......!")
}

// register event and eventHandler
myevent.on("myCustomEventName", myCustomEventHandler)

// triggering the event
myevent.emit("myCustomEventName")




// ####################### File Upload in Nodejs #######################

// There is a very good module for working with file uploads, called "Formidable".
// The Formidable module can be downloaded and installed using NPM:


http.createServer((req, res)=>{
res.writeHead(200, {'Content-Type':'text/html'})
if(req.url == "/fileupload"){
    var form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files)=>{
        if(err) throw err
        console.log(`\n File uploaded.....!!!! ${files.filetoupload.path}\n`)
        // move file from default upload path to custom path
        var old_path = files.filetoupload.path
        var new_path = `./${files.filetoupload.name}`
        fs.rename(old_path, new_path, (err)=>{
            if(err) throw err
            console.log(`File  successfully moved to ./${files.filetoupload.name}~`)
            res.end("File upload successfull!")
        })
    })
}
else{
    // enctype="multipart/form-data" is important in form tag!!!
    res.write('<form action="/fileupload" method="POST" enctype="multipart/form-data">')
    res.write('<input type=file name="filetoupload"/><br><br>')
    res.write('<input type="submit"/>')
    res.write("</form>")
    res.end()
}
}).listen(8808, ()=>console.log("File upload server is running..."))



