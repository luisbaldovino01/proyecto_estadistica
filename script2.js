let filas = []; // Guardar datos ingresados

function agregarFilas() {
    const numFilas = parseInt(document.getElementById("numFilas").value);

    //obtenemos el div donde se agregarán las filas y lo limpia
    const filasInputDiv = document.getElementById("filasInput");
    filasInputDiv.innerHTML = "";

    // Crea el formulario con el número de filas especificado por el usuario
    for (let i = 0; i < numFilas; i++) {
        const filaDiv = document.createElement("div");
        filaDiv.innerHTML = `
            <label for="valor${i}">Valor ${i + 1}:</label>
            <input type="text" id="valor${i}" placeholder="Dato a agregar" required>
            <label for="repeticiones${i}">Repeticiones:</label>
            <input type="number" id="repeticiones${i}" placeholder="Número de repeticiones" required>
        `;
        filasInputDiv.appendChild(filaDiv);
    }

    //se inicializa un nuevo arreglo para guardar los datos ingresados en las filas
    filas = new Array(numFilas);
}

function generarTablaFrecuencia() { 
    const tablaFrecuencia = {}; //objeto vacio

    for (let i = 0; i < filas.length; i++) { //recorrerá las filas del formulario
        const valor = document.getElementById(`valor${i}`).value;
        const repeticiones = parseInt(document.getElementById(`repeticiones${i}`).value);

        if (valor) { //comprobar que valor no este vacio
            for (let j = 0; j < repeticiones; j++) {
                if (tablaFrecuencia[valor]) { //verificar que el valor este en la tabla de frecuencia
                    tablaFrecuencia[valor].absoluta++;  //recuento de cuántas veces aparece el valor particular
                } else {
                    tablaFrecuencia[valor] = { absoluta: 1, relativa: 0 };
                }
            }
        }
    }

    const totalDatos = Object.values(tablaFrecuencia).reduce((total, item) => total + item.absoluta, 0);
    let frecuenciaAcumulada = 0;
    let frecuenciaAcumulada_relativa = 0;

    for (const key in tablaFrecuencia) {
        tablaFrecuencia[key].relativa = (tablaFrecuencia[key].absoluta * 100 / totalDatos).toFixed(2);
        frecuenciaAcumulada += tablaFrecuencia[key].absoluta;
        frecuenciaAcumulada_relativa += parseFloat(tablaFrecuencia[key].relativa);
        tablaFrecuencia[key].acumulada = frecuenciaAcumulada;
        tablaFrecuencia[key].acumulada_relativa = frecuenciaAcumulada_relativa.toFixed(2);
    }

    const table = document.createElement("table");
    table.innerHTML = `<tr><th>Valor</th><th>Frecuencia Absoluta</th><th>Frecuencia Absoluta Acumulada</th><th>Frecuencia Relativa</th><th>Frecuencia Relativa Acumulada</th></tr>`;

    let totalAbsoluta = 0;
    let totalAcumulada = 0;
    let totalRelativa = 0;
    let totalAcumuladaRelativa = 0;

    for (const key in tablaFrecuencia) {
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);

        cell1.textContent = key;
        cell2.textContent = tablaFrecuencia[key].absoluta;
        cell3.textContent = tablaFrecuencia[key].acumulada;
        cell4.textContent = tablaFrecuencia[key].relativa;
        cell5.textContent = tablaFrecuencia[key].acumulada_relativa;

        totalAbsoluta += tablaFrecuencia[key].absoluta;
        totalAcumulada += tablaFrecuencia[key].acumulada;
        totalRelativa += parseFloat(tablaFrecuencia[key].relativa);
        totalAcumuladaRelativa += parseFloat(tablaFrecuencia[key].acumulada_relativa);
    }

    const totalRow = table.insertRow();
    const cellTotal = totalRow.insertCell(0);
    const cellTotalAbsoluta = totalRow.insertCell(1);
    const cellTotalAcumulada = totalRow.insertCell(2);
    const cellTotalRelativa = totalRow.insertCell(3);
    const cellTotalAcumuladaRelativa = totalRow.insertCell(4);

    cellTotal.textContent = 'Total';
    cellTotalAbsoluta.textContent = totalAbsoluta;
    cellTotalRelativa.textContent = totalRelativa.toFixed(1);

    const tablaFrecuenciaDiv = document.getElementById("tablaFrecuencia");
    tablaFrecuenciaDiv.innerHTML = "";
    tablaFrecuenciaDiv.appendChild(table);

    const canvas = document.getElementById("graficoBarras");
    const ctx = canvas.getContext('2d');

    const valores = Object.keys(tablaFrecuencia);
    const frecuencias = valores.map(valor => tablaFrecuencia[valor].absoluta);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: valores,
            datasets: [{
                label: 'Frecuencia',
                data: frecuencias,
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },
        barThickness: 5,
        categorySpacing: 5
    });
}

function limpiarPagina() {
    location.reload();
}
