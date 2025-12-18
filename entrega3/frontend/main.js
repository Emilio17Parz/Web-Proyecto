// CONFIGURACIÓN API
const BASE_URL = "http://localhost:4000/api"; 
let MODO = "pila"; // 'pila' | 'cola' | 'lista'

// DATOS EN MEMORIA
let datos = [];

// -------------------------------------------------
// REFERENCIAS DOM
// -------------------------------------------------

const contenedorPila = document.getElementById("contenedorPila");
const contenedorCola = document.getElementById("contenedorCola");
const contenedorLista = document.getElementById("contenedorLista");

const input = document.getElementById("valorInput");
const inputPos = document.getElementById("posInput");
const divPosicion = document.getElementById("divPosicion");

const controlesBasicos = document.getElementById("controlesBasicos");
const controlesLista = document.getElementById("controlesLista");

const codigoView = document.getElementById("codigo");
const lblModo = document.getElementById("lblModo");
const txtAyuda = document.getElementById("txtAyuda");
const badgeConteo = document.getElementById("conteoBadge");

const txtInsertar = document.getElementById("txtInsertar");
const txtEliminar = document.getElementById("txtEliminar");

const tabPila = document.getElementById("tabPila");
const tabCola = document.getElementById("tabCola");
const tabLista = document.getElementById("tabLista");

// Toast
const toastEl = document.getElementById("toast");
const toastBody = document.getElementById("toastMsg");
const bsToast = new bootstrap.Toast(toastEl);

function showToast(msg, type = "primary") {
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  toastBody.textContent = msg;
  bsToast.show();
}

// -------------------------------------------------
// CAMBIO DE MODO
// -------------------------------------------------
tabPila.onclick = () => cambiarModo("pila");
tabCola.onclick = () => cambiarModo("cola");
tabLista.onclick = () => cambiarModo("lista");

function cambiarModo(nuevoModo) {
  MODO = nuevoModo;
  datos = [];
  input.value = "";
  if(inputPos) inputPos.value = "";

  // 1. Resetear estilos tabs
  tabPila.className = "btn btn-outline-primary";
  tabCola.className = "btn btn-outline-success";
  tabLista.className = "btn btn-outline-warning";

  // 2. Ocultar TODO
  contenedorPila.style.display = "none";
  contenedorCola.style.display = "none";
  contenedorLista.style.display = "none";
  
  divPosicion.style.display = "none";
  controlesLista.style.display = "none";
  controlesBasicos.style.display = "none";

  // 3. Activar específico
  if (MODO === "pila") {
    tabPila.classList.add("active");
    contenedorPila.style.display = "flex";
    
    // Mostrar básicos
    controlesBasicos.style.display = "block"; 
    
    lblModo.textContent = "PILA";
    txtAyuda.textContent = "Nota: El último en entrar es el primero en salir (LIFO).";
    txtInsertar.textContent = "Push";
    txtEliminar.textContent = "Pop";
    document.getElementById("btnInsertar").className = "btn btn-primary";

  } else if (MODO === "cola") {
    tabCola.classList.add("active");
    contenedorCola.style.display = "flex";
    
    // Mostrar básicos
    controlesBasicos.style.display = "block";
    
    lblModo.textContent = "COLA";
    txtAyuda.textContent = "Nota: El primero en entrar es el primero en salir (FIFO).";
    txtInsertar.textContent = "Enqueue";
    txtEliminar.textContent = "Dequeue";
    document.getElementById("btnInsertar").className = "btn btn-success";

  } else {
    // LISTA
    tabLista.classList.add("active");
    contenedorLista.style.display = "flex";
    
    // Mostrar controles lista
    controlesLista.style.display = "block";
    divPosicion.style.display = "block";
    
    lblModo.textContent = "LISTA ENLAZADA";
    txtAyuda.textContent = "Nota: Nodos dispersos. Puedes insertar en cualquier lugar.";
  }
  
  codigoView.textContent = "// Estructura seleccionada: " + MODO.toUpperCase();
  render();
}

// -------------------------------------------------
// RENDERIZADO
// -------------------------------------------------
function render() {
  let contenedor;
  if (MODO === "pila") contenedor = contenedorPila;
  else if (MODO === "cola") contenedor = contenedorCola;
  else contenedor = contenedorLista;

  contenedor.innerHTML = ""; 
  badgeConteo.textContent = `${datos.length} elementos`;

  datos.forEach((valor) => {
    const div = document.createElement("div");
    div.textContent = valor;
    div.classList.add("nodo", "anim-entrada");

    if (MODO === "pila") div.classList.add("nodo-pila");
    else if (MODO === "cola") div.classList.add("nodo-cola");
    else div.classList.add("nodo-lista");

    contenedor.appendChild(div);
  });
}

// -------------------------------------------------
// OPERACIONES PILA/COLA
// -------------------------------------------------
document.getElementById("btnInsertar").onclick = () => {
  const val = input.value.trim();
  if (!val) return showToast("Escribe un valor", "warning");

  datos.push(val);
  render();
  input.value = "";
  input.focus();

  if (MODO === "pila") {
    mostrarCodigo(`// PILA PUSH
void push(int valor) {
    Nodo* nuevo = (Nodo*)malloc(sizeof(Nodo));
    nuevo->dato = ${val};
    nuevo->sig = cima;
    cima = nuevo;
}`);
    showToast(`Push: "${val}"`, "primary");
  } else {
    mostrarCodigo(`// COLA ENQUEUE
void encolar(int valor) {
    Nodo* nuevo = malloc(sizeof(Nodo));
    nuevo->dato = ${val};
    nuevo->sig = NULL;
    if (final) final->sig = nuevo;
    else frente = nuevo;
    final = nuevo;
}`);
    showToast(`Enqueue: "${val}"`, "success");
  }
};

document.getElementById("btnEliminar").onclick = () => {
  if (datos.length === 0) return showToast("Estructura vacía.", "danger");
  let eliminado = "";

  if (MODO === "pila") {
    eliminado = datos.pop(); 
    mostrarCodigo(`// PILA POP
int pop() {
    if (!cima) return -1;
    Nodo* temp = cima;
    cima = cima->sig;
    free(temp);
    return ${eliminado};
}`);
  } else {
    eliminado = datos.shift();
    mostrarCodigo(`// COLA DEQUEUE
int desencolar() {
    if (!frente) return -1;
    Nodo* temp = frente;
    frente = frente->sig;
    if (!frente) final = NULL;
    free(temp);
    return ${eliminado};
}`);
  }
  render();
};

// -------------------------------------------------
// OPERACIONES LISTA
// -------------------------------------------------
document.getElementById("btnInsInicio").onclick = () => {
  const val = input.value.trim();
  if (!val) return showToast("Valor requerido", "warning");
  datos.unshift(val);
  render();
  mostrarCodigo(`// LISTA: Insertar al Inicio
void insertarInicio(int v) {
    Nodo* nuevo = crearNodo(${val});
    nuevo->sig = cabeza;
    cabeza = nuevo;
}`);
};

document.getElementById("btnInsFinal").onclick = () => {
  const val = input.value.trim();
  if (!val) return showToast("Valor requerido", "warning");
  datos.push(val);
  render();
  mostrarCodigo(`// LISTA: Insertar al Final
void insertarFinal(int v) {
    Nodo* nuevo = crearNodo(${val});
    if (!cabeza) { cabeza = nuevo; return; }
    Nodo* temp = cabeza;
    while (temp->sig) temp = temp->sig;
    temp->sig = nuevo;
}`);
};

document.getElementById("btnInsPos").onclick = () => {
  const val = input.value.trim();
  const pos = parseInt(inputPos.value);
  if (!val) return showToast("Valor requerido", "warning");
  if (isNaN(pos) || pos < 0 || pos > datos.length) return showToast("Posición inválida", "danger");

  datos.splice(pos, 0, val);
  render();
  mostrarCodigo(`// LISTA: Insertar en Posición ${pos}
void insertarPos(int v, int pos) {
    if (pos == 0) { insertarInicio(v); return; }
    Nodo* nuevo = crearNodo(${val});
    Nodo* ant = cabeza;
    for(int i=0; i<pos-1; i++) ant = ant->sig;
    nuevo->sig = ant->sig;
    ant->sig = nuevo;
}`);
};

document.getElementById("btnEliInicio").onclick = () => {
  if (datos.length === 0) return showToast("Lista vacía", "danger");
  datos.shift();
  render();
  mostrarCodigo(`// LISTA: Eliminar Inicio
void eliminarInicio() {
    if (cabeza) {
        Nodo* temp = cabeza;
        cabeza = cabeza->sig;
        free(temp);
    }
}`);
};

document.getElementById("btnEliFinal").onclick = () => {
  if (datos.length === 0) return showToast("Lista vacía", "danger");
  datos.pop();
  render();
  mostrarCodigo(`// LISTA: Eliminar Final
void eliminarFinal() {
    if (!cabeza) return;
    if (!cabeza->sig) { free(cabeza); cabeza=NULL; return; }
    Nodo* temp = cabeza;
    while(temp->sig->sig) temp = temp->sig;
    free(temp->sig);
    temp->sig = NULL;
}`);
};

document.getElementById("btnEliPos").onclick = () => {
  const pos = parseInt(inputPos.value);
  if (datos.length === 0) return showToast("Lista vacía", "danger");
  if (isNaN(pos) || pos < 0 || pos >= datos.length) return showToast("Posición inválida", "danger");

  datos.splice(pos, 1);
  render();
  mostrarCodigo(`// LISTA: Eliminar Posición ${pos}
void eliminarPos(int pos) {
    if (pos==0) { eliminarInicio(); return; }
    Nodo* ant = cabeza;
    for(int i=0; i<pos-1; i++) ant = ant->sig;
    Nodo* elim = ant->sig;
    ant->sig = elim->sig;
    free(elim);
}`);
};

document.getElementById("btnEliVal").onclick = () => {
  const val = input.value.trim();
  if (!val) return showToast("Escribe valor", "warning");
  const idx = datos.indexOf(val);
  if (idx === -1) return showToast("Valor no encontrado", "danger");

  datos.splice(idx, 1);
  render();
  mostrarCodigo(`// LISTA: Eliminar por Valor "${val}"
void eliminarValor(int val) {
    // Buscar nodo y re-enlazar
    free(nodo);
}`);
};

// -------------------------------------------------
// PERSISTENCIA
// -------------------------------------------------
document.getElementById("btnClear").onclick = () => {
  datos = [];
  render();
  mostrarCodigo("// Limpieza total\nfree_all();");
  showToast("Todo limpio.", "secondary");
};

document.getElementById("btnGuardar").onclick = async () => {
  try {
    const url = `${BASE_URL}/${MODO}`;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
    showToast(`¡${MODO.toUpperCase()} guardada!`, "success");
  } catch (e) {
    showToast("Error servidor.", "danger");
  }
};

document.getElementById("btnCargar").onclick = async () => {
  try {
    const url = `${BASE_URL}/${MODO}`;
    const res = await fetch(url);
    const data = await res.json();
    datos = data;
    render();
    showToast(`¡${MODO.toUpperCase()} cargada!`, "info");
    mostrarCodigo(`// Cargar ${MODO}.json`);
  } catch (e) {
    showToast("Error cargar.", "danger");
  }
};

function mostrarCodigo(texto) {
  codigoView.style.opacity = 0;
  setTimeout(() => {
    codigoView.textContent = texto;
    codigoView.style.opacity = 1;
  }, 100);
}

render();