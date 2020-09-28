var user = JSON.parse(localStorage.getItem('user'));
profile = user[0].id;
var auth = localStorage.getItem('auth');
res = JSON.parse(auth);

function carregarUser() {
    $.ajax
        ({
            url: "http://localhost:3000/users/" + profile + "",
            type: "GET",
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                "Authorization": "Bearer " + res
            },
            error: function () {
                $("body").html(`<style>
                body {
                    font-family: Arial, Helvetica, sans-serif;
                    text-align: center;
                }
                b {
                    font-size: 25px;
                }
                </style>`+
                    "<b>O servidor não conseguiu processar o pedido<b>" +
                    "<br>" +
                    "<button onclick=logout()>Back</button>"
                );
            },
            success: function (retorno) {

                $.each(retorno, function (i, res) {
                    var item = `
                    <div id=` + "req" + i + `>
                        <p>Name</p><input id="name" type="text" value="`+ res.name + `" disabled>
                        <p>Password</p><input class="password" type="password" id="password" disabled>
                        <img disabled class="image" onclick="mostrarOcultarSenha()" id="reveal"
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABDUlEQVQ4jd2SvW3DMBBGbwQVKlyo4BGC4FKFS4+TATKCNxAggkeoSpHSRQbwAB7AA7hQoUKFLH6E2qQQHfgHdpo0yQHX8T3exyPR/ytlQ8kOhgV7FvSx9+xglA3lM3DBgh0LPn/onbJhcQ0bv2SHlgVgQa/suFHVkCg7bm5gzB2OyvjlDFdDcoa19etZMN8Qp7oUDPEM2KFV1ZAQO2zPMBERO7Ra4JQNpRa4K4FDS0R0IdneCbQLb4/zh/c7QdH4NL40tPXrovFpjHQr6PJ6yr5hQV80PiUiIm1OKxZ0LICS8TWvpyyOf2DBQQtcXk8Zi3+JcKfNafVsjZ0WfGgJlZZQxZjdwzX+ykf6u/UF0Fwo5Apfcq8AAAAASUVORK5CYII=" />
                        <p>Password confirmation</p><input class="password" type="password" id="passwordConfirmation" disabled>                    
                        <p>Email</p><input id="email" type="text" value="`+ res.email + `" disabled>
                        <p>Cell number</p><input id="cellNumber" type="text" value="`+ res.cellNumber + `" disabled>
                        <p>City</p><input id="city" type="text" value="`+ res.city + `" disabled>
                        <p>UF</p><input id="uf" type="text" value="`+ res.uf + `" disabled>
                    </div>`
                    $("#userPerf").append(item);
                });
            },
            statusCode: {
                404: function () {
                    alert('Page not found');
                    window.location.reload(false);
                },

                401: function () {
                    alert('Unathorized');
                    document.location.href = "./login.html"
                },

                400: function () {
                    alert('Wrong password');
                },

                500: () => {
                    alert('Wrong email')
                }
            }
        });

}



function saveUser() {
    var username = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    var passConfirm = document.getElementById("passwordConfirmation").value;
    var email = document.getElementById("email").value;
    var cellNumber = document.getElementById("cellNumber").value;
    var city = document.getElementById("city").value;
    var uf = document.getElementById("uf").value;
    function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    if (username === "") {
        alert('Invalid username');
    }
    else if (password === "") {
        alert('Insert your actual password and confirm');
    }

    else if (password != passConfirm) {
        alert('Passwords do not match')
    }

    else if (validateEmail(email) == false) {
        alert('Invalid email')
    }

    else {
        var data = {
            "name": username,
            "senha": password,
            "email": email,
            "cellNumber": cellNumber,
            "city": city,
            "uf": uf
        };
        $.ajax({
            url: "http://localhost:3000/users/" + profile + "",
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data),
            headers: {
                "Authorization": "Bearer " + res
            },
            dataType: 'json',
            statusCode: {
                200: function () {
                    alert('User created');
                    window.location.reload(true);
                },

                404: function () {
                    alert('Page not found');
                    window.location.reload(false);
                },

                400: function () {
                    alert('User already exist');
                },

                500: () => {
                    alert('Server error')
                    window.location.reload(false);
                }
            }
        });
    }
}






function editUser() {
    if (document.getElementById("name").disabled === true) {
        document.getElementById("name").disabled = false;
        document.getElementById("password").disabled = false;
        document.getElementById("passwordConfirmation").disabled = false;
        document.getElementById("reveal").disabled = false;
        document.getElementById("email").disabled = false;
        document.getElementById("cellNumber").disabled = false;
        document.getElementById("city").disabled = false;
        document.getElementById("uf").disabled = false;
        document.getElementById("saveUser").disabled = false;
        document.getElementById("editUser").innerHTML = 'Cancel';
    }
    else {
        document.getElementById("name").disabled = true;
        document.getElementById("password").disabled = true;
        document.getElementById("passwordConfirmation").disabled = true;
        document.getElementById("reveal").disabled = true;
        document.getElementById("email").disabled = true;
        document.getElementById("cellNumber").disabled = true;
        document.getElementById("city").disabled = true;
        document.getElementById("uf").disabled = true;
        document.getElementById("saveUser").disabled = true;
        document.getElementById("editUser").innerHTML = 'Edit user';
    }
}

function logout() {
    localStorage.setItem("auth", "");
    localStorage.setItem("user", "");
    document.location.href = "./login.html"
}

function mostrarOcultarSenha() {
    var senha = document.getElementById("password");
    if (senha.type == "password") {
        senha.type = "text";
    } else {
        senha.type = "password";
    }
}

function createProject() {
    document.getElementById("listProjects").innerHTML = `
    <p>Title</p><input id="title" type="text">
    <p>Description</p><input id="description" type="text">
    <p>Date</p><input type="date" id="date">
    <button id="createProject" onclick="saveProject()">Create project</button>
    `
}

function saveProject() {
    var user = JSON.parse(localStorage.getItem('user'));
    var userId = user[0].id
    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;
    var date = document.getElementById("date").value;
    if (title === "") {
        alert('Invalid title');
    }
    else if (description === "") {
        alert('Invalid description');
    }
    else if (date === "") {
        alert('Invalid date');
    }

    else {
        var data = {
            "id": userId,
            "title": title,
            "description": description,
            "date": date
        };
        $.ajax({
            url: "http://localhost:3000/projects",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: () => {
                alert('Project created');
                window.location.reload(true);
            },
            dataType: 'json',
            statusCode: {
                404: function () {
                    alert('Page not found');
                    window.location.reload(false);
                },

                400: function () {
                    alert('Error');
                },

                500: () => {
                    alert('Server error')
                    window.location.reload(false);
                }
            }
        });
    }
}

function carregarProjetos() {
    $.ajax
        ({
            url: "http://localhost:3000/projects/" + profile + "",
            type: "GET",
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                "Authorization": "Bearer " + res
            },
            error: function () {
                $("body").html(`<style>
                body {
                    font-family: Arial, Helvetica, sans-serif;
                    text-align: center;
                }
                b {
                    font-size: 25px;
                }
                </style>`+
                    "<b>O servidor não conseguiu processar o pedido<b>" +
                    "<br>" +
                    "<button onclick=logout()>Back</button>"
                );
            },
            success: function (retorno) {

                $.each(retorno, function (i, res) {
                    var item = `
                    <div id=` + "req" + i + `>
                        <p>Title</p><input id="title" type="text" value="`+ res.title + `" disabled>
                        <p>Description</p><input id="description" type="text" value="`+ res.description + `" disabled>
                        <p>Date</p><input id="date" type="text" value="`+ res.date + `" disabled>
                    </div>`
                    $("#listProjects").append(item);
                });
            },
            statusCode: {
                404: function () {
                    alert('Page not found');
                    window.location.reload(false);
                },

                401: function () {
                    alert('Unathorized');
                    document.location.href = "./login.html"
                },

                400: function () {
                    alert('Wrong password');
                },

                500: () => {
                    alert('Wrong email')
                }
            }
        });

}