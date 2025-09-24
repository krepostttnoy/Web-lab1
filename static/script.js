function validateForm() {
    const x = document.getElementById("hiddenX").value.trim();
    const y = document.forms[0]["y"].value.trim();
    const rBoxes = document.querySelectorAll('input[name="r"]')
    let rValue = Array.from(rBoxes)
        .filter(rBox => rBox.checked)
        .map(rBox => rBox.value)

    console.log(rValue)

    const X = parseInt(x);
    if (isNaN(x) || x < -5 || x > 3 || !Number.isInteger(X)) {
        alert("X has to be a number from -5 to 3");
        return false;
    }

    const Y = parseFloat(y)

    if (Y < -5.0 || Y > 3.0 || isNaN(y) || !Number.isFinite(Y)) {
        alert("Y has to be a number from -5 to 3");
        return false;
    }

    if (!/^-?\d+(\.\d{1,6})?$/.test(y)) {
        alert("Max - 6 symbols after '.' ");
        return false;
    }

    const R = parseInt(rValue[0])
    if (rBoxes < 1 || rBoxes > 5 || !Number.isInteger(R)){
        alert("R has to be a number from 1 to 5");
        return false;
    }

    // if (isNan(rBoxes)) {
    //     alert("Radius must be selected and greater than zero.");
    //     return false;
    // }

    return {x: parseInt(x), y: parseFloat(y), r: rValue};
}

// button functions

let selectedXBtn = null;

function selectX(button) {
    if (selectedXBtn) {
        selectedXBtn.style.border = "";
    }
    button.style.border = "2px solid green";
    selectedXBtn = button;

    document.getElementById("hiddenX").value = button.value;
}

//pagination

const itemsPerPage = 3;
let currentPage = 0;
let pagContainer;

function getItems() {
    return Array.from(document.querySelectorAll('#results-body tr'));
}

function showPage(page){
    const items = getItems();
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    items.forEach((item, index) => {
        item.classList.toggle('hidden', index < startIndex || index >= endIndex);
    });

    updateActiveButtonStates();
}

function createPageButtons() {
    const items = getItems();
    const totalPages = Math.ceil(items.length / itemsPerPage);

    if (pagContainer) pagContainer.remove();

    pagContainer = document.createElement('div');
    pagContainer.classList.add('pagination');
    document.querySelector('.content').appendChild(pagContainer);

    for(let i = 0; i < totalPages; i++){
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i + 1;

        pageBtn.addEventListener('click', () => {
            currentPage = i;
            showPage(currentPage);
        });

        pagContainer.appendChild(pageBtn);
    }
    updateActiveButtonStates();
}

function updateActiveButtonStates(){
    if (!pagContainer) return;
    const pageBtns = pagContainer.querySelectorAll('button');
    pageBtns.forEach((button, index) => {
        button.classList.toggle('active', index === currentPage);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    createPageButtons();
    showPage(currentPage);
});


// ajax

function addRowToTable(data) {
    console.log(data)
    const tbody = document.getElementById("results-body");
    //const trow = tbody.insertRow();

    for(let i = 0; i < data.length; i++){
        const trow = tbody.insertRow(0);

        trow.insertCell(0).textContent = data[i].x;
        trow.insertCell(1).textContent = data[i].y;
        trow.insertCell(2).textContent = data[i].r;
        trow.insertCell(3).textContent = data[i].result ? "hit" : "didn't hit";
        trow.insertCell(4).textContent = data[i].execution_time;
        trow.insertCell(5).textContent = data[i].current_time;
    }

    createPageButtons();
    showPage(currentPage);
}

document.getElementById("pointForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const validation = validateForm();
    if (!validation) return;

    const url = `http://localhost:24052/fcgi-bin/weblab1.jar?x=${validation.x}&y=${validation.y}&r=${validation.r}`;

    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Ошибка сервера: " + resp.status);

        const data = await resp.json();
        addRowToTable(data);
    } catch (err) {
        console.error(err);
        alert("Ошибка сети или сервера");
    }
});


//graph

const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

ctx.strokeStyle = "black";
ctx.fillStyle = "black";
ctx.font = "12px Arial";
ctx.textBaseline = "middle";

// оси
ctx.beginPath();
// X
ctx.moveTo(0, 150);
ctx.lineTo(300, 150);
// Y
ctx.moveTo(150, 0);
ctx.lineTo(150, 300);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(150, 0);
ctx.lineTo(144, 15);
ctx.lineTo(156, 15);
ctx.closePath();
ctx.fill();

ctx.beginPath();
ctx.moveTo(300, 150);
ctx.lineTo(285, 156);
ctx.lineTo(285, 144);
ctx.closePath();
ctx.fill();

function tick(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// OX
tick(200, 145, 200, 155);
tick(250, 145, 250, 155);
tick(50, 145, 50, 155);
tick(100, 145, 100, 155);

// OY
tick(145, 100, 155, 100);
tick(145, 50, 155, 50);
tick(145, 200, 155, 200);
tick(145, 250, 155, 250);

ctx.fillText("R/2", 195, 140);
ctx.fillText("R", 248, 140);

ctx.fillText("-R", 40, 140);
ctx.fillText("-R/2", 90, 140);

ctx.fillText("R/2", 160, 100);
ctx.fillText("R", 160, 50);

ctx.fillText("-R/2", 160, 200);
ctx.fillText("-R", 160, 250);

ctx.fillText("Y", 160, 15);
ctx.fillText("X", 285, 140);

ctx.fillStyle = "rgba(255, 0, 0, 0.4)";

// 4 четверть
ctx.fillRect(150, 150, 50, 100);

// 3 четверть
ctx.beginPath();
ctx.moveTo(150, 150);
ctx.lineTo(200, 150);
ctx.lineTo(150, 50);
ctx.closePath();
ctx.fill();

// 1 четверть
ctx.beginPath();
ctx.moveTo(150, 150);
ctx.arc(150, 150, 100, Math.PI, Math.PI * 1.5, false);
ctx.closePath();
ctx.fill();