document.addEventListener("DOMContentLoaded", () => {
  const itemsTableBody = document.getElementById("items-table-body");
  const addItemBtn = document.getElementById("add-item-btn");
  const grandTotalElement = document.getElementById("grand-total");
  const printBtn = document.getElementById("print-btn");
  const locationDisplay = document.getElementById("location-display");
  const locationInput = document.getElementById("location-input");
  const editIcon = document.querySelector(".edit-icon");
  const saveLocationBtn = document.getElementById("save-location-btn");

  let itemId = 0;

  const createNewItemRow = () => {
    itemId++;
    const row = document.createElement("tr");
    row.classList.add("item-row");
    row.setAttribute("data-id", itemId);
    row.innerHTML = `
            <td><input type="number" class="item-qty" value="1" min="1"></td>
            <td class="description-cell">
                <input type="text" placeholder="Descripción del producto/servicio">
                <i class="fas fa-trash-alt delete-icon"></i>
            </td>
            <td><input type="number" class="item-price" value="0.00" step="0.01" min="0"></td>
            <td class="item-total">$ 0.00</td>
            <td class="characteristics-cell"><input type="text" placeholder="Características adicionales"></td>
        `;
    itemsTableBody.appendChild(row);
  };

  const updateTotals = () => {
    let grandTotal = 0;
    const rows = itemsTableBody.querySelectorAll("tr");

    rows.forEach((row) => {
      const qty = parseFloat(row.querySelector(".item-qty").value) || 0;
      const price = parseFloat(row.querySelector(".item-price").value) || 0;
      const total = qty * price;
      row.querySelector(".item-total").textContent = `$ ${total.toFixed(2)}`;
      grandTotal += total;
    });

    grandTotalElement.textContent = `$ ${grandTotal.toFixed(2)}`;
  };

  // --- NUEVO: Funciones para preparar/restaurar la impresión ---

  // Reemplaza los inputs con texto plano para una impresión limpia
  const prepareForPrint = () => {
    const inputs = itemsTableBody.querySelectorAll("input");
    inputs.forEach((input) => {
      const textSpan = document.createElement("span");
      textSpan.className = "print-text";
      textSpan.textContent = input.value;
      textSpan.style.display = "none"; // Oculto por defecto, visible solo al imprimir
      input.parentNode.insertBefore(textSpan, input.nextSibling);
    });
  };

  // Elimina el texto plano y restaura los inputs
  const restoreAfterPrint = () => {
    const textSpans = itemsTableBody.querySelectorAll(".print-text");
    textSpans.forEach((span) => span.remove());
  };

  // --- Event Listeners ---
  addItemBtn.addEventListener("click", createNewItemRow);

  itemsTableBody.addEventListener("click", (e) => {
    if (e.target.closest(".delete-icon")) {
      e.target.closest("tr").remove();
      updateTotals();
    }
  });

  itemsTableBody.addEventListener("input", (e) => {
    if (
      e.target.classList.contains("item-qty") ||
      e.target.classList.contains("item-price")
    ) {
      updateTotals();
    }
  });

  editIcon.addEventListener("click", () => {
    locationDisplay.style.display = "none";
    locationInput.style.display = "inline";
    saveLocationBtn.style.display = "inline";
    locationInput.focus();
  });

  saveLocationBtn.addEventListener("click", () => {
    locationDisplay.textContent = locationInput.value;
    locationDisplay.style.display = "inline";
    locationInput.style.display = "none";
    saveLocationBtn.style.display = "none";
  });

  locationInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      saveLocationBtn.click();
    }
  });

  // --- LÓGICA DE IMPRESIÓN ACTUALIZADA ---
  printBtn.addEventListener("click", () => {
    prepareForPrint(); // Prepara el contenido antes de llamar a print()
    window.print();
  });

  // El evento 'afterprint' se dispara cuando el diálogo de impresión se cierra
  window.addEventListener("afterprint", restoreAfterPrint);

  createNewItemRow();
});
