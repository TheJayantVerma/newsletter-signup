const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    let fName = req.body.FirstName;
    let lName = req.body.LastName;
    let email = req.body.Email;
    console.log(fName + " " + lName + " " + email);

    let data = {
        members : [
            {
                email_address : email,
                status : 'subscribed',
                merge_fields : {
                    FNAME : fName,
                    LNAME : lName
                }
            }
        ]
    };

    let jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/cf900b12ab";
    const options = {
        auth : 'JV11:' + process.env.API_KEY,
        method : "POST"
    };

    const request = https.request(url, options, function(response) {
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });

        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000.");
});

//Audience ID - cf900b12ab


// New API
// proecess.env.API_KEY