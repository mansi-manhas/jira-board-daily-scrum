require("dotenv").config();

const express = require('express'),
    axios = require('axios'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    proxy = require('http-proxy-middleware'),
    XLSX = require('xlsx'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
    zipdir = require('zip-dir');
const httpProxy = require('http-proxy');
const proxy2 = httpProxy.createProxyServer({});

// Required
const CERT_FILE_PATH = process.env.CERT_FILE_PATH;
const CERT_PASS_PATH = process.env.CERT_PASS_PATH;
const HTTP_PORT = process.env.HTTP_PORT || 8083;
const HTTPS_PORT = process.env.HTTPS_PORT || 8083;
const JIRA_USER = process.env.JIRA_USER;
const JIRA_PASSWORD = process.env.JIRA_PASSWORD;

const isVM = process.env.IS_VM;

if (!JIRA_USER) {
    throw new Error(
        "Authorization credentials have not been specified. Add JIRA_USER=<jira username> in .env file.");
}
if (!JIRA_PASSWORD) {
    throw new Error(
        "Authorization credentials have not been specified. Add JIRA_PASSWORD=<jira password> in .env file.");
}
if (!CERT_FILE_PATH) {
    throw new Error(
        "Certificate path has not been passed. Add CERT_FILE_PATH=<path> in .env file.");
}
if (!CERT_PASSWORD) {
    console.warn(
        "If your certificate doesn't have a password, then you're good to go. If it has a password, then add CERT_PASSWORD=<password> in .env file.");
}
if (!HTTP_PORT) {
    console.warn(
        "HTTP port has not been passed. Add HTTP_PORT=<port> in .env file. Using default as 8083");
}
if (!HTTPS_PORT) {
    console.warn(
        "HTTPS port has not been passed. Add HTTPS_PORT=<port> in .env file. Using default as 30401");
}
if(!isVM) {
    console.error("I am not sure if I was started inside a VM or outside. Possibilities of the Dashboard to Timeout. Add IS_VM in .env file with a boolean");
}
const cert = fs.readFileSync(CERT_FILE_PATH);

const commonConfig = {
    cert: fs.readFileSync(CERT_FILE_PATH),
    key: fs.readFileSync(CERT_PASS_PATH)
};

const app = express();
app.use(bodyParser.json({ limit: "10mb", type: "application/json" }));
let baseURL = "https://jira.project.cloud.organization/rest/api/2"; //Enter your organization's base URL for Jira
app.use(cors());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const postURL = "issue";

app.use(express.static(path.join(__dirname, 'build')));

let buff = Buffer.from(JIRA_USER + ":" + JIRA_PASSWORD);
let base64data = buff.toString('base64');
var authString = "Basic " + base64data;

app.get('/user/credentials', function (req, res) {
    var userId = req.body.fields.userId;
    var userKey = req.body.fields.userKey;
    let buff2 = Buffer.from(userId + ":" + userKey);
    let base64data2 = buff2.toString('base64');
    var currentAuthStr = "Basic " + base64data2;
    //let currentAuthStr = btoa(userId + ":" + userKey);
    res.send(currentAuthStr);
});

app.get('/jiraUrl', function (req, res) {
    res.send(baseURL);
});

app.post('/api/createTask', function (req, res) {
    var auth = `Basic ${req.body.fields.credentials}`;
    const jiraConfig = {
        headers: {
            'Authorization': "Basic aTMyOTI0OTpATWFuczYwOTg=",
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    delete req.body.fields.credentials;

    axios.post(`https://<organization>jira.<location>.<organization>.corp/rest/api/2/issue/`, req.body, jiraConfig) ////Enter your organization's issue URL for Jira
        .then(function (response) {
            res.status(response.status);
            res.send(response.data);
        })
        .catch(err => {
            res.sendStatus(500);
            res.send(err.response.data);
        });
});

app.use('/api/*', proxy({
    pathRewrite: {
        '^/api': `/`
    },
    target: `${baseURL}/issue`,
    secure: false
}));
  
app.use('/search', proxy({
    pathRewrite: {
        '^/search': '/'
    },
    target: `${baseURL}/search`,
    secure: false,
    changeOrigin: true,
}));

app.post('/doc/write', function (req, res) {
    var sendData = JSON.stringify(req.body.content);
    fs.writeFileSync(req.body.name, sendData, function (err) {
        if (err) throw err;
    });
    res.send("success");
});

app.post('/doc/delete', function (req, res) {
    fs.unlinkSync(req.body.name, function (err) {
        if (err) throw err;
    });
    res.send("success");
});


app.get('/doc', function (req, res) {
    res.sendFile(path.join(__dirname, 'doc', 'index.html'));
});

app.get('/excelData', function (req, res) {
    // var workbook = XLSX.readFile('Planning.xlsx');
    // var first_sheet_name = "CapacityPlanning"; //workbook.SheetNames[0];
    // var jsonSheet = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name]);
    // res.json(jsonSheet[jsonSheet.length - 1]);
    res.json({});
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const httpServer = http.createServer(app);
//const httpsServer = https.createServer(commonConfig, app);

httpServer.listen(HTTP_PORT, () => console.log('Scrum task Board app listening on port ' + HTTP_PORT + "!"));
//httpsServer.listen(HTTPS_PORT, () => console.log('Scrum task Board (Secure) app listening on port ' + HTTPS_PORT + "!"));