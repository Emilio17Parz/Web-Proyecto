// CONFIGURACIÓN API
const BASE_URL = "http://localhost:4000/api"; 
let MODO = "pila"; // 'pila' | 'cola' | 'lista'

// DATOS EN MEMORIA
let datos = [];

// ELEMENTOS DOM
const contenedorPila = document.getElementById("contenedorPila");
const contenedorCola = document.getElementById("contenedorCola");
const input = document.getElementById("valorInput");
const codigoView = document.getElementById("codigo");
const lblModo = document.getElementById("lblModo");
const txtAyuda = document.getElementById("txtAyuda");
const badgeConteo = document.getElementById("conteoBadge");

// Textos de botones dinámicos
const txtInsertar = document.getElementById("txtInsertar");
const txtEliminar = document.getElementById("txtEliminar");

// Botones Tabs
const tabPila = document.getElementById("tabPila");
const tabCola = document.getElementById("tabCola");

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
// CAMBIO DE MODO (TABS)
// -------------------------------------------------
tabPila.onclick = () => cambiarModo("pila");
tabCola.onclick = () => cambiarModo("cola");

function cambiarModo(nuevoModo) {
  MODO = nuevoModo;
  datos = []; // Limpiamos memoria visual al cambiar

  // Actualizar UI activa
  if (MODO === "pila") {
    // Solo tocamos la clase 'active'
    tabPila.classList.add("active");
    tabCola.classList.remove("active");
    
    contenedorPila.style.display = "flex";
    contenedorCola.style.display = "none";
    
    lblModo.textContent = "PILA";
    txtInsertar.textContent = "Push";
    txtEliminar.textContent = "Pop ";
    txtAyuda.textContent = "Nota: El último en entrar es el primero en salir.";
    
    // Cambiar color del botón principal
    document.getElementById("btnInsertar").className = "btn btn-primary";

  } else {
    // Solo tocamos la clase 'active'
    tabCola.classList.add("active");
    tabPila.classList.remove("active");
    
    contenedorPila.style.display = "none";
    contenedorCola.style.display = "flex";
    
    lblModo.textContent = "COLA";
    txtInsertar.textContent = "Enqueue";
    txtEliminar.textContent = "Dequeue";
    txtAyuda.textContent = "Nota: El primero en entrar es el primero en salir.";
    
    // Cambiar color del botón principal
    document.getElementById("btnInsertar").className = "btn btn-success";
  }
  
  codigoView.textContent = "// Seleccionaste " + MODO.toUpperCase();
  render();
}

// -------------------------------------------------
// RENDERIZADO
// -------------------------------------------------
function render() {
  // Elegir contenedor correcto
  const contenedor = MODO === "pila" ? contenedorPila : contenedorCola;
  contenedor.innerHTML = ""; // Limpiar visualmente
  
  badgeConteo.textContent = `${datos.length} elementos`;

  datos.forEach((valor, index) => {
    const div = document.createElement("div");
    div.textContent = valor;
    
    // Clases CSS según modo
    if (MODO === "pila") {
      div.className = "nodo nodo-pila anim-entrada";
    } else {
      div.className = "nodo nodo-cola anim-entrada";
    }
    
    contenedor.appendChild(div);
  });
}

// -------------------------------------------------
// OPERACIONES (INSERTAR)
// -------------------------------------------------
document.getElementById("btnInsertar").onclick = () => {
  const val = input.value.trim();
  if (!val) return showToast("Escribe un valor primero", "warning");

  // Lógica común: agregar al arreglo
  datos.push(val);
  render();
  input.value = "";
  input.focus();

  // Mostrar código C según estructura
  if (MODO === "pila") {
    // Pila: Push
    mostrarCodigo(`// PILA PUSH
void push(int valor) {
    Nodo* nuevo = (Nodo*)malloc(sizeof(Nodo));
    nuevo->dato = ${val};
    nuevo->sig = cima;
    cima = nuevo;
    printf("Elemento insertado en la cima");
}`);
    showToast(`Elemento "${val}" apilado.`, "primary");
  } else {
    // Cola: Enqueue
    mostrarCodigo(`// COLA ENQUEUE
void encolar(int valor) {
    Nodo* nuevo = (Nodo*)malloc(sizeof(Nodo));
    nuevo->dato = ${val};
    nuevo->sig = NULL;
    if (final == NULL) {
        frente = nuevo;
    } else {
        final->sig = nuevo;
    }
    final = nuevo;
}`);
    showToast(`Elemento "${val}" encolado.`, "success");
  }
};

// -------------------------------------------------
// OPERACIONES (ELIMINAR)
// -------------------------------------------------
document.getElementById("btnEliminar").onclick = () => {
  if (datos.length === 0) return showToast("La estructura está vacía.", "danger");

  let eliminado = "";

  if (MODO === "pila") {
    // PILA: Saca el último  - pop() de JS
    eliminado = datos.pop();
    
    // Pila: Pop Code
    mostrarCodigo(`// PILA POP
int pop() {
    if (cima == NULL) return -1;
    int v = cima->dato;
    Nodo* temp = cima;
    cima = cima->sig;
    free(temp);
    return v; // Retorna ${eliminado}
}`);

  } else {
    // COLA: Saca el primero - shift() de JS
    eliminado = datos.shift(); // shift elimina el índice 0

    // Cola: Dequeue Code
    mostrarCodigo(`// COLA DEQUEUE
int desencolar() {
    if (frente == NULL) return -1;
    int v = frente->dato;
    Nodo* temp = frente;
    frente = frente->sig;
    if (frente == NULL) final = NULL;
    free(temp);
    return v; // Retorna ${eliminado}
}`);
  }

  render();
  showToast(`Elemento "${eliminado}" eliminado.`, "info");
};

// -------------------------------------------------
// LIMPIAR
// -------------------------------------------------
document.getElementById("btnClear").onclick = () => {
  datos = [];
  render();
  mostrarCodigo("// Estructura limpiada\nfree_all();");
  showToast("Todo limpio.", "secondary");
};

// -------------------------------------------------
// PERSISTENCIA (GUARDAR/CARGAR)
// -------------------------------------------------

// Guardar en cualquier momento
document.getElementById("btnGuardar").onclick = async () => {
  try {
    const url = `${BASE_URL}/${MODO}`; // /api/pila o /api/cola
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
    showToast(`¡${MODO.toUpperCase()} guardada en servidor!`, "success");
  } catch (e) {
    showToast("Error al conectar con servidor.", "danger");
    console.error(e);
  }
};

// Cargar estructura guardada
document.getElementById("btnCargar").onclick = async () => {
  try {
    const url = `${BASE_URL}/${MODO}`;
    const res = await fetch(url);
    const data = await res.json();
    
    datos = data; // Reemplazamos lo actual con lo del server
    render();
    showToast(`¡${MODO.toUpperCase()} cargada!`, "info");
    mostrarCodigo(`// Datos cargados desde archivo JSON del servidor
// Estructura: ${MODO}
load_from_file("${MODO}.json");`);
  } catch (e) {
    showToast("Error al cargar datos.", "danger");
  }
};

// Utilidad para efecto de escritura en el código
function mostrarCodigo(texto) {
  codigoView.style.opacity = 0;
  setTimeout(() => {
    codigoView.textContent = texto;
    codigoView.style.opacity = 1;
  }, 100);
}

// Iniciar
render();