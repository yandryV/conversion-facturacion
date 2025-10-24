//tallas.js
document.addEventListener("DOMContentLoaded", function () {
  const orderTable = document.getElementById("orderTable");
  const addRowBtn = document.getElementById("addRowBtn");
  const generateExcelBtn = document.getElementById("generateExcelBtn");
  const clientNameInput = document.getElementById("clientName");
  const teamNameInput = document.getElementById("teamName");

  // Agregar fila inicial
  addRow();

  // Evento para agregar fila
  addRowBtn.addEventListener("click", addRow);

  // Evento para generar Excel
  generateExcelBtn.addEventListener("click", generateExcel);

  function addRow() {
    const tbody = orderTable.querySelector("tbody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
            <td><input type="text" placeholder="Talla superior"></td>
            <td><input type="text" placeholder="Talla inferior"></td>
            <td><input type="text" placeholder="Número"></td>
            <td><input type="number" placeholder="Cantidad" min="1"></td>
            <td><input type="text" placeholder="Nombre en camiseta"></td>
            <td>
                <select>
                    <option value=""></option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                </select>
            </td>
            <td>
                <select>
                    <option value=""></option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                </select>
            </td>
            <td><input type="text" placeholder="Observaciones"></td>
            <td><button class="btn btn-danger remove-row">Eliminar</button></td>
        `;

    tbody.appendChild(newRow);

    // Agregar evento para eliminar fila
    newRow.querySelector(".remove-row").addEventListener("click", function () {
      if (tbody.children.length > 1) {
        tbody.removeChild(newRow);
      } else {
        alert("Debe haber al menos una fila");
      }
    });
  }

  function generateExcel() {
    // Validar datos básicos
    if (!clientNameInput.value.trim() || !teamNameInput.value.trim()) {
      alert("Por favor, complete el nombre del cliente y el equipo");
      return;
    }

    // Crear libro de trabajo
    const wb = XLSX.utils.book_new();

    // Crear hoja de datos
    const data = [];

    // Agregar título
    data.push(["LISTA DE NOMBRE, NÚMERO Y TALLA"]);
    data.push([]);

    // Agregar información del cliente
    data.push([
      "NOMBRE DEL CLIENTE:",
      clientNameInput.value,
      "",
      "",
      "EQUIPO:",
      teamNameInput.value,
    ]);
    data.push([]);

    // Agregar encabezados de la tabla
    data.push([
      "TALLA SUPERIOR",
      "TALLA INFERIOR",
      "NUMERO EN CAMISETA",
      "CANTIDAD",
      "NOMBRE EN CAMISETA",
      "HOMBRE",
      "MUJER",
      "OBSERVACIONES",
      "REFERENCIA DE TALLAS\nimportante que lo tome en cuenta",
    ]);

    // Agregar filas de datos
    const rows = orderTable.querySelectorAll("tbody tr");
    let hasData = false;

    rows.forEach((row) => {
      const inputs = row.querySelectorAll("input, select");
      const rowData = [];

      for (let i = 0; i < inputs.length - 1; i++) {
        // -1 para excluir el botón de eliminar
        if (inputs[i].type === "select-one") {
          rowData.push(inputs[i].value);
        } else {
          rowData.push(inputs[i].value);
        }

        // Verificar si hay al menos un dato en esta fila
        if (inputs[i].value.trim() !== "") {
          hasData = true;
        }
      }

      // Agregar referencia de tallas vacía
      rowData.push("");

      data.push(rowData);
    });

    if (!hasData) {
      alert("Por favor, complete al menos una fila de datos");
      return;
    }

    // Agregar filas vacías para separar
    data.push([]);
    data.push([]);

    // Agregar referencias de tallas
    data.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Talla 2 para niño de 1 a 2 años",
    ]);
    data.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Talla 4 para niño de 3 a 4 años",
    ]);
    data.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Talla 6 para niños de 5 a 6 años",
    ]);
    data.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Talla 8 para niños de 7 a 8 años",
    ]);
    data.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Talla 10 para niño de 9 a 10 años",
    ]);
    data.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Talla 12 para niños de 11 a 12 años",
    ]);
    data.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Talla 14 para niños 13 a 14 años",
    ]);
    data.push([]);
    data.push(["", "", "", "", "", "", "", "", "ADULTOS"]);
    data.push(["", "", "", "", "", "", "", "", "34 - XS"]);
    data.push(["", "", "", "", "", "", "", "", "36 - S"]);
    data.push(["", "", "", "", "", "", "", "", "38 - M"]);
    data.push(["", "", "", "", "", "", "", "", "40 - L"]);
    data.push([]);
    data.push(["", "", "", "", "", "", "", "", "42- XL"]);
    data.push([]);
    data.push(["", "", "", "", "", "", "", "", "Nota importante:"]);
    data.push([]);
    data.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Tomando en cuenta las características del niño",
    ]);
    data.push(["", "", "", "", "", "", "", "", "Si es muy alto o gordito."]);

    // Crear hoja de trabajo
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Ajustar anchos de columnas
    const colWidths = [
      { wch: 15 }, // TALLA SUPERIOR
      { wch: 15 }, // TALLA INFERIOR
      { wch: 20 }, // NUMERO EN CAMISETA
      { wch: 10 }, // CANTIDAD
      { wch: 20 }, // NOMBRE EN CAMISETA
      { wch: 10 }, // HOMBRE
      { wch: 10 }, // MUJER
      { wch: 20 }, // OBSERVACIONES
      { wch: 40 }, // REFERENCIA DE TALLAS
    ];
    ws["!cols"] = colWidths;

    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, "Pedidos");

    // Generar archivo y descargar
    const fileName = `Pedido_${clientNameInput.value.replace(
      /\s+/g,
      "_"
    )}_${teamNameInput.value.replace(/\s+/g, "_")}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }
});
