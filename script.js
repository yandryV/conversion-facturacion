document.addEventListener("DOMContentLoaded", () => {
  const itemsTableBody = document.getElementById("items-table-body");
  const addItemBtn = document.getElementById("add-item-btn");
  const grandTotalElement = document.getElementById("grand-total");
  const printBtn = document.getElementById("print-btn");

  // --- LÓGICA PARA CAMPOS EDITABLES (Nombre, RUC y Ubicación) ---
  const allEditIcons = document.querySelectorAll(".edit-icon");

  allEditIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const targetName = icon.dataset.target;

      if (targetName === "location") {
        // Lógica especial para la ubicación con su botón de guardar
        document.getElementById("location-display").style.display = "none";
        document.getElementById("location-input").style.display = "inline";
        document.getElementById("save-location-btn").style.display = "inline";
        document.getElementById("location-input").focus();
      } else {
        // Lógica general para nombre y RUC
        const displayEl = document.getElementById(`${targetName}-display`);
        const inputEl = document.getElementById(`${targetName}-input`);
        displayEl.style.display = "none";
        inputEl.style.display = "block";
        inputEl.focus();
      }
    });
  });

  const setupInputSave = (targetName) => {
    const displayEl = document.getElementById(`${targetName}-display`);
    const inputEl = document.getElementById(`${targetName}-input`);

    const save = () => {
      let newValue = inputEl.value;
      displayEl.textContent =
        targetName === "ruc" ? `RUC: ${newValue}` : newValue;
      inputEl.style.display = "none";
      displayEl.style.display = "block";
    };

    inputEl.addEventListener("blur", save); // Guardar cuando se pierde el foco
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") save(); // Guardar al presionar Enter
    });
  };

  setupInputSave("company-name");
  setupInputSave("ruc");

  // Lógica del botón de guardar para la ubicación
  const saveLocationBtn = document.getElementById("save-location-btn");
  saveLocationBtn.addEventListener("click", () => {
    const locationDisplay = document.getElementById("location-display");
    const locationInput = document.getElementById("location-input");
    locationDisplay.textContent = locationInput.value;
    locationDisplay.style.display = "inline";
    locationInput.style.display = "none";
    saveLocationBtn.style.display = "none";
  });
  document.getElementById("location-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveLocationBtn.click();
  });

  // --- LÓGICA PARA CARGAR EL LOGO ---
  const logoUpload = document.getElementById("logo-upload");
  const companyLogo = document.getElementById("company-logo");

  logoUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        companyLogo.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // --- Lógica de la tabla de items (sin cambios) ---
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

  // --- Lógica de impresión (sin cambios) ---
  const prepareForPrint = () => {
    const inputs = itemsTableBody.querySelectorAll("input");
    inputs.forEach((input) => {
      const textSpan = document.createElement("span");
      textSpan.className = "print-text";
      textSpan.textContent = input.value;
      textSpan.style.display = "none";
      input.parentNode.insertBefore(textSpan, input.nextSibling);
    });
  };
  const restoreAfterPrint = () => {
    const textSpans = itemsTableBody.querySelectorAll(".print-text");
    textSpans.forEach((span) => span.remove());
  };
  printBtn.addEventListener("click", () => {
    prepareForPrint();
    window.print();
  });
  window.addEventListener("afterprint", restoreAfterPrint);

  createNewItemRow();
});
