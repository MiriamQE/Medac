document.addEventListener("DOMContentLoaded", () => {
  loadSavedData();
});

let editIndex = null; // Variable global para saber qué campo se está editando

// Función para cargar datos guardados al iniciar la aplicación
function loadSavedData() {
  const appointments = getAppointments(); // Cargar citas desde cookies
  const tableBody = document.getElementById("table-body");

  if (appointments.length === 0) {
    // Muestra fila con mensaje "dato vacío"
    tableBody.innerHTML = `
      <tr id="empty-row">
        <td colspan="8" style="text-align: center;">Dato vacío</td>
      </tr>
    `;
  } else {
    // Carga las citas en la tabla
    appointments.forEach((appointment, index) => {
      addRowToTable(appointment, index);
    });
  }
}

// Función para obtener citas guardadas desde cookies
function getAppointments() {
  const savedData = document.cookie
    .split("; ")
    .find((row) => row.startsWith("appointments="));
  return savedData ? JSON.parse(decodeURIComponent(savedData.split("=")[1])) : [];
}

// Función para guardar citas en cookies
function saveAppointment(newAppointment) {
  const appointments = getAppointments();
  appointments.push(newAppointment);
  document.cookie = `appointments=${encodeURIComponent(JSON.stringify(appointments))};path=/`;
}

// Función para añadir o guardar un registro
function handleAddOrEdit() {
  const name = document.getElementById("name").value.trim();
  const surname = document.getElementById("surname").value.trim();
  const dni = document.getElementById("dni").value.trim();
  const date = document.getElementById("date").value.trim();
  const time = document.getElementById("time").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const remarks = document.getElementById("remarks").value.trim();

// Valida que todos los campos estén completos
  if (!name || !surname || !dni || !date || !time || !phone || !remarks) {
    alert("Por favor, completa todos los campos antes de continuar.");
    return;
  }

  const errors = {};

  // Error de campos
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
    errors.name = "El nombre solo puede contener letras y espacios.";
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(surname)) {
    errors.surname = "El apellido solo puede contener letras y espacios.";
  }
  if (!/^\d{8}[a-zA-Z]$/.test(dni) || dni.length !== 9) {
    errors.dni = "El DNI debe tener exactamente 8 números seguidos de una letra.";
  }
  if (!/^\d{2}:\d{2}$/.test(time)) {
    errors.time = "La hora debe redactarse en formato HH:MM, usando solo números y el símbolo ':'";
  }
  if (isNaN(phone) || phone.length !== 9) {
    errors.phone = "El teléfono debe tener 9 dígitos.";
  }

  if (Object.keys(errors).length > 0) {
    showValidationErrors(errors);
    return;
  }

  const newAppointment = { name, surname, dni, date, time, phone, remarks };

  // Si se está editando un registro, actualizarlo
  if (editIndex !== null) {
    const appointments = getAppointments();
    appointments[editIndex] = newAppointment; // Reemplaza el registro editado
    document.cookie = `appointments=${encodeURIComponent(JSON.stringify(appointments))};path=/`;
    editIndex = null;
  } else {
    // Si no se está editando, agregar un nuevo registro
    saveAppointment(newAppointment);
  }

  reloadTable(); // Recarga la tabla después de añadir o editar el registro
  clearInputs(); // Limpia los campos de entrada

  // Cambiar el texto del botón de vuelta a "Añadir registro"
  const saveButton = document.getElementById("add-row-button");
  saveButton.textContent = "Añadir registro";
}

// Función para mostrar los errores de validación
function showValidationErrors(errors) {
  let errorMessage = "Se encontraron los siguientes errores:\n\n";
  for (const key in errors) {
    errorMessage += `- ${errors[key]}\n`;
  }
  alert(errorMessage);
}

// Función para añadir un registro a la tabla
function addRowToTable(record, index) {
  const tableBody = document.getElementById("table-body");
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
    <td>${record.name}</td>
    <td>${record.surname}</td>
    <td>${record.dni}</td>
    <td>${record.date}</td>
    <td>${record.time}</td>
    <td>${record.phone}</td>
    <td>${record.remarks}</td>
    <td>
      <button onclick="editRow(${index})">Editar</button>
      <button onclick="deleteRow(${index})">Eliminar</button>
    </td>
  `;

  tableBody.appendChild(newRow);
}

// Función para editar un registro
function editRow(index) {
  const appointments = getAppointments();
  const appointment = appointments[index];

  document.getElementById("name").value = appointment.name;
  document.getElementById("surname").value = appointment.surname;
  document.getElementById("dni").value = appointment.dni;
  document.getElementById("date").value = appointment.date;
  document.getElementById("time").value = appointment.time;
  document.getElementById("phone").value = appointment.phone;
  document.getElementById("remarks").value = appointment.remarks;

  // Cambiar el texto del botón a "Guardar cambios"
  const saveButton = document.getElementById("add-row-button");
  saveButton.textContent = "Guardar cambios";
  editIndex = index;
}

// Función para eliminar un registro
function deleteRow(index) {
  const appointments = getAppointments();
  // Elimina el registro del array
  appointments.splice(index, 1);
  // Actualización de cookies
  document.cookie = `appointments=${encodeURIComponent(JSON.stringify(appointments))};path=/`;
  // Recarga la tabla
  reloadTable();
}

// Función para recargar la tabla
function reloadTable() {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";
  const appointments = getAppointments();

  if (appointments.length === 0) {
    // Muestra mensaje "dato vacío"
    tableBody.innerHTML = `
      <tr id="empty-row">
        <td colspan="8" style="text-align: center;">Dato vacío</td>
      </tr>
    `;
  } else {
    // Agrega las citas a la tabla
    appointments.forEach((appointment, index) => {
      addRowToTable(appointment, index);
    });
  }
}

// Función para limpiar los campos
function clearInputs() {
  document.getElementById("name").value = "";
  document.getElementById("surname").value = "";
  document.getElementById("dni").value = "";
  document.getElementById("date").value = "";
  document.getElementById("time").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("remarks").value = "";
}
