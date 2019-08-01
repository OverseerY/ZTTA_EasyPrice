'use strict';

let file_url = 'json/ferms.json';
let headers = ["№", "Наименование, (длина, м), толщина пояса, мм", "Стоимость, сом"];
let expiration_date = "Прайс действителен до ";

function startPoint() {
    loadJson(file_url, function (response) {
        parseJson(response);
    });
}

function loadJson(url, callback) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function parseJson(response) {
    let raw_array  = JSON.parse(response);
    let root_key = Object.keys(raw_array)[1];
    let exp_date = Object.keys(raw_array)[0];
    document.getElementById("expdate").innerText = expiration_date + raw_array[exp_date];
    buildTable(raw_array[root_key])
}

function buildTable(data_array) {
    let table = document.createElement("table");
    table.setAttribute("id", "docsTable");
    table.setAttribute("class", "display");
    table.setAttribute("style", "width:70%");

    let col = [];
    for (let i = 0; i < data_array.length; i++) {
        for (let key in data_array[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    let t_header = table.createTHead();
    let thr = t_header.insertRow(-1);
    for (let i = 0; i < headers.length; i++) {
        let th = document.createElement("th");
        th.innerHTML = headers[i];
        thr.appendChild(th);
    }

    let t_body = table.createTBody();
    for (let i = 0; i < data_array.length; i++) {
        let tr = t_body.insertRow(-1);
        for (let j = 0; j < col.length + 1; j++) {
            let tabCell = tr.insertCell(-1);
            if (j === 0) {
                tabCell.innerHTML = (i+1).toString();
            } else {
                tabCell.innerHTML = data_array[i][col[j - 1]];
            }
        }
    }

    let divContainer = document.getElementById("main_table");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);

    beautifyTable(table.getAttribute("id"));

}

function beautifyTable(mTable) {
    let table_name = '#' + mTable;
    $(document).ready(function () {
        $(document).ready(function () {
            $(table_name).DataTable({
                "columnDefs": [
                    { "width": "65%", "targets": 1 }
                ],
                "paging":   false,
                "info":     false,
                "order": false,
                "searching": false,
                "sort": false,
                language: {
                    url: 'scripts/Russian.json'
                }
            });
        });
    });
}
