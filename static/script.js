function validateForm() {
    const x = document.getElementById("hiddenX").value.trim();
    const y = document.forms[0]["y"].value.trim();
    const yNums = [-5, -4, -3, -2, -1, 0, 1, 2, 3]
    const rBoxes = document.forms[0]["r"];
    let rValue = null;

    const X = Number(x); // берём значение из выбранной кнопки
    if (isNaN(x) || x < -5 || x > 3) {
        alert("X должен быть числом от -5 до 3!");
        return false;
    }

    if(!(yNums.includes(parseInt(y))) || isNaN(y)){
        alert("Y has to be from -5 to 3");
        return false;
    }

    if (rBoxes.length === undefined) {
        if (rBoxes.checked) rValue = rBoxes.value;
    }
    else {
        for (let i = 0; i < rBoxes.length; i++) {
            if (rBoxes[i].checked) {
                rValue = rBoxes[i].value;
                break;
            }
        }
    }

    if (rValue === null || isNaN(rValue) || parseInt(rValue) <= 0){
        alert("Radius must be selected and greater than zero.");
        return false;
    }

    return { x: parseInt(x), y: parseInt(y), r: parseInt(rValue) };
}

function addRowToTable(data) {
    const tbody = document.getElementById("results-body");
    const trow = tbody.insertRow();

    trow.insertCell(0).textContent = data.x;
    trow.insertCell(1).textContent = data.y;
    trow.insertCell(2).textContent = data.r;
    trow.insertCell(3).textContent = data.result ? "hit" : "did not hit";
    trow.insertCell(4).textContent = data.executionTime;
    trow.insertCell(5).textContent = data.currentTime;
}

document.getElementById("pointForm").addEventListener("submit", async function(e) {
    e.preventDefault(); // блокируем стандартный сабмит

    const validation = validateForm();
    if (!validation) return; // если невалидно, ничего не отправляем

    const params = new URLSearchParams(validation).toString();
    const url = "/calculate?" + params;

    try {
        const resp = await fetch(url); // GET без заголовков
        if (!resp.ok) throw new Error("Ошибка сервера: " + resp.status);

        const data = await resp.json(); // парсим JSON
        addRowToTable(data); // вставляем в таблицу
    } catch(err) {
        console.error(err);
        alert("Ошибка сети или сервера");
    }
});