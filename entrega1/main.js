const API = "http://localhost:4000/api/pila";
let pila = [];

// DOM
const contPila = document.getElementById("contenedorPila");
const input = document.getElementById("valorInput");
const codigoC = document.getElementById("codigo");

// Bootstrap components
const modalCodigo = new bootstrap.Modal(document.getElementById("modalCodigo"));
const toastDiv = document.getElementById("toast");
const toastMsg = document.getElementById("toastMsg");
const toast = new bootstrap.Toast(toastDiv);

function showToast(msg, type = "primary") {
  toastDiv.className = `toast text-bg-${type}`;
  toastMsg.textContent = msg;
  toast.show();
}

// BOTONES
document.getElementById("btnPush").onclick = pushValor;
document.getElementById("btnPop").onclick = popValor;
document.getElementById("btnClear").onclick = limpiarPila;
document.getElementById("btnGuardar").onclick = guardarPila;
document.getElementById("btnCargar").onclick = cargarPila;
document.getElementById("btnCodigo").onclick = () => modalCodigo.show();

// -------------------------
// RENDER
function render() {
  contPila.innerHTML = "";
  pila.forEach(v => {
    const div = document.createElement("div");
    div.className = "nodo";
    div.textContent = v;
    contPila.appendChild(div);
  });
}

// -------------------------
// PUSH
function pushValor() {
  const val = input.value.trim();
  if (!val) return showToast("Ingresa un valor.", "warning");

  pila.push(val);
  render();
  input.value = "";

  codigoC.textContent =
`// PUSH
void push(int valor){
    Nodo* nuevo = malloc(sizeof(Nodo));
    nuevo->dato = valor;
    nuevo->sig = cima;
    cima = nuevo;
}`;

  showToast("Elemento insertado.", "success");
}

// -------------------------
// POP
function popValor() {
  if (pila.length === 0) return showToast("La pila está vacía.", "danger");

  pila.pop();
  render();

  codigoC.textContent =
`// POP
int pop(){
    if(cima==NULL) return -1;
    int v = cima->dato;
    Nodo* tmp = cima;
    cima = cima->sig;
    free(tmp);
    return v;
}`;

  showToast("Elemento eliminado.", "info");
}

// -------------------------
// LIMPIAR
function limpiarPila() {
  pila = [];
  render();
  showToast("Pila limpiada.", "secondary");
}

// -------------------------
// GUARDAR
async function guardarPila() {
  await fetch(API, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(pila)
  });
  showToast("Pila guardada en servidor.", "success");
}

// -------------------------
// CARGAR
async function cargarPila() {
  const r = await fetch(API);
  pila = await r.json();
  render();
  showToast("Pila cargada.", "info");
}
