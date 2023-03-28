require("dotenv").config();
var express = require('express'); // requre the express framework
var app = express();
var fs = require('fs'); //require file system object\
const ftp = require("basic-ftp")
const cors = require('cors');
var css = require('css-convert-json');
app.use(cors())


app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

const PORT = process.env.PORT;
let error = false;
const ftpHost = process.env.FTP_HOST_ADDRESS;
const ftpUserName = process.env.FTP_USER_NAME;
const ftpPassword = process.env.FTP_PASSWORD;
let botProp;
let userID;
const invalid = {
    invalid: "invalid"
}
const valid = {
    valid: "valid"
}

// Endpoint to get  bot prop

async function get(userID, pass, res) {
    const client = new ftp.Client()
    client.ftp.verbose = true;
    try {
        await client.access({
            host: ftpHost,
            user: ftpUserName,
            password: ftpPassword,
            secure: true
        })
        file = await client.list(`./site/wwwroot/${userID}/`)
        await client.downloadTo(`temp/${userID}novaBotStyles.css`, `./site/wwwroot/${userID}/novaBotStyles.css`)
        await client.downloadTo(`temp/${userID}botproperties.json`, `./site/wwwroot/${userID}/botproperties.json`)
        fs.readFile(__dirname + `/temp/${userID}botproperties.json`, 'utf8', function (err, data) {
            if (err) {
                error = true;
            }
            botProp = JSON.parse(data);
            password = botProp.generalSettings.botSecret.substring(0, 8);
            if (password === pass) {
                error = false;
            }
            else {
                return res.status(404).send(invalid)
            }

        });
        if (!error) {
            fs.readFile(__dirname + `/temp/${userID}novaBotStyles.css`, 'utf8', function (err, data) {
                if (err) {
                    return res.status(404).send(invalid)
                }

                else {
                    app.use('/static', express.static('./temp/Haytest'))
                    return res.status(200).send({
                        botProp: botProp,
                        botCss: data
                    })

                }
            });
        }
        else {
            return res.status(404).send(invalid)
        }


    }
    catch (err) {
        console.log("error " + err)
        return res.status(404).send(invalid)
    }
    client.close()

};
async function upload(userID, res, isBotLink, isMsgLink, botCss) {
    const client = new ftp.Client()
    client.ftp.verbose = true;
    try {
        await client.access({
            host: ftpHost,
            user: ftpUserName,
            password: ftpPassword,
            secure: true
        })
        file = await client.list(`./site/wwwroot/${userID}/`)
        await client.uploadFrom(`temp/${userID}botProperties.json`, `./site/wwwroot/${userID}/botProperties.json`);
        if (isBotLink === "false") {
            await client.uploadFrom(`temp/${userID}boticon.png`, `./site/wwwroot/${userID}/boticon.png`);
        }

        if (isMsgLink === "false") {
            await client.uploadFrom(`temp/${userID}msgicon.png`, `./site/wwwroot/${userID}/msgicon.png`);
        }
        if (botCss) {
            await client.uploadFrom(`temp/${userID}novaBotStyles.css`, `./site/wwwroot/${userID}/novaBotStyles.css`);
        }
        res.status(200).send(valid)

    }
    catch (err) {
        console.log("error " + err)
        return res.status(404).send(invalid)
    }
    client.close()

};
app.post("/login", function (req, res) {
    userID = req.body.userID;
    if (userID) {
        fs.writeFile(`./temp/${req.body.userID}botProperties.json`, " ", function (err) {
            if (err) {
                res.status(404).send(invalid)
            }
            else {
                get(req.body.userID, req.body.password, res)
                // upload(userID, res)
            }
        })
    }
    else {
        res.status(404).send(invalid)
    }

})

app.post("/image", function (req, res) {
    // const buffer = fs.readFileSync(req.body.base64);
    userID = req.headers.userid
    const da = req.body.base64;
    const up = da.split(",")
    const buffer = Buffer.from(up[1], "base64")
    fs.writeFile(`./temp/${userID}${req.body.name}.png`, buffer, function (err) {
        if (err) {
            error = true;
        }
        else {
            error = false;
        }
    })
    if (!error) {
        fs.writeFile(`./temp/Haytest/${req.body.name}.png`, buffer, function (err) {
            if (err) {
                error = true;
            }
            else {
                error = false;
            }
        })
    }

})
app.post("/botprop", function (req, res) {
    console.log(req.headers.userid)
    console.log(req.headers.link)
    console.log(req.headers.link2)
    console.log(req.body)
    app.use('/static', express.static('./temp/Haytest'))
    userID = req.headers.userid
    const isBotLink = req.headers.link
    const isMSgLink = req.headers.link2
    if (userID) {
        if (req.body.botCss) {
            const data = css.toCSS(req.body.botCss)
            fs.writeFile(`./temp/${userID}novaBotStyles.css`, data, function (err) {
                if (err) {
                    // res.status(404).send(invalid)
                    error = true;
                }
                else {
                    error = false;
                }
            })
        }
        if (!error) {
            fs.writeFile(`./temp/${userID}botProperties.json`, JSON.stringify(req.body.botProp), function (err) {
                if (err) {
                    res.status("404").send(invalid)
                }
                else {
                    error = false;
                }
            })
        }
        if (!error) {
            if (req.body.botCss) {

                const data = css.toCSS(req.body.botCss)
                fs.writeFile(`./temp/Haytest/novaBotStyles.css`, data, function (err) {
                    if (err) {
                        // res.status(404).send(invalid)
                        error = true;
                    }
                    else {
                        error = false;
                    }
                })
            }
        }
        if (!error) {
            req.body.botProp.generalSettings.rootSite = process.env.LOCAL_URL;
            fs.writeFile(`./temp/Haytest/botProperties.json`, JSON.stringify(req.body.botProp), function (err) {
                if (err) {
                    res.status("404").send(invalid)
                }
                else {
                    upload(userID, res, isBotLink, isMSgLink, req.body.botCss)
                }
            })
        }


    }
    else {
        res.status("404").send(invalid)
    }
})

// Create a server to listen at port 8080
var server = app.listen(PORT, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("REST API demo app listening at http://%s:%s", host, port)
})