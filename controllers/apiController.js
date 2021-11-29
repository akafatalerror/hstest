const formidable = require("formidable");
const db = require("../models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getUserFromRequest = require("../lib/getUserFromRequest");
const {UserRoles} = require("../lib/types");
const fs = require("fs");

module.exports = async function apiController(request, response){

    const [_empty, api, controller, param] = request.url.split('/')

    switch (controller) {

        case 'login': {
            if (request.method === 'POST') {

                const form = formidable({ multiples: true });

                form.parse(request, async (err, fields) => {
                    if (err) {
                        showResponse(response, 400, {error: err})
                        return;
                    }

                    if(fields.login === undefined || fields.password === undefined){
                        showResponse(response, 400, {error: 'All fields are required'});
                        return;
                    }

                    try {
                        const user = await db.User.findOne({where:{login: fields.login}})
                        if (user && bcrypt.compareSync(fields.password, user.password)) {
                            // Create token
                            const token = jwt.sign(
                                { id: user.id, login: user.login, role: user.role },
                                process.env.TOKEN_KEY,
                                {
                                    expiresIn: "24h",
                                }
                            );

                            user.token = token;
                            user.save();

                            showResponse(response, 200, {token: token})
                            return;
                        }
                    } catch (e){
                        console.log(e)
                    }

                    showResponse(response, 404, {error: 'User not found'})
                });

            }
            break;
        }

        default: {

            let user;
            try{
                user = getUserFromRequest(request)
            } catch (e){
                showResponse(response, 403, {error: e.message})
                return;
            }

            //роуты для которых требуется авторизация
            switch (controller){
                case 'tasks': {
                    if (request.method === 'GET') {
                        const tasks = await db.Task.findAll({where: {isDone: false}});
                        showResponse(response, 200, tasks)
                        return;
                    }
                    break;
                }

                case 'task': {
                    const task = await db.Task.findOne({where: {id: param}})
                    if(request.method === 'POST' && param){
                        task.isDone = true;
                        task.save()
                    }
                    showResponse(response, 200, task)
                    return;
                    break;
                }

                case 'upload': {
                    if(user.role === UserRoles.ROLE_ADMIN && request.method === 'POST'){

                        const form = formidable({ multiples: true });
                        form.parse(request, async (err, fields, files) => {
                            if (err) {
                                showResponse(response, 400, err)
                                return;
                            }

                            const tasks = await db.Task.findAll({});

                            if(files.tasksfile){
                                fs.readFile(files.tasksfile.filepath, 'utf8', function (err,data) {
                                    if(data.length > 0){
                                        data.trim()
                                            .split("\n")
                                            .forEach(row => {
                                                const [full, category, ts, title, description] = row.match(/^(.+?)\s(.+?)\s(.+?);\s(.+);$/)
                                                if(tasks.filter(item => item.description === description).length === 0){
                                                    const task = db.Task.create({
                                                            category: category,
                                                            taskDate: (new Date(ts)).toISOString(),
                                                            title: title,
                                                            description: description,
                                                            isDone: false,
                                                            createdAt: (new Date()).toISOString(),
                                                            updatedAt: (new Date(ts)).toISOString()
                                                        })

                                                    ;;
                                                }
                                            })
                                    }
                                });
                            }

                            response.writeHead(200, { 'Content-Type': 'application/json' });
                            response.end();
                        });
                        return;
                    }

                    showResponse(response, 403, 'Access denied')
                    return;
                }
            }
        }

    }
}

function showResponse(response, code, body){
    response.writeHead(code, { 'Content-Type': typeof body === 'object' ? 'application/json' : 'text/plain'});
    response.end(body ? JSON.stringify(body) : '');
    return;
}
