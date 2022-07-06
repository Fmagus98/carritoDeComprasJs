import { getData } from "./fetch.js";
// -----login-----
// acción al tocar el boton crear usuario
const crearUsuarios = document.getElementById("crearUsuario");
crearUsuarios.addEventListener("click", crearUsuario);
function crearUsuario() {
    document.getElementById("sesion2").style.display = "block";
    document.getElementById("sesion3").style.display = "none";
}


//acción al tocar el boton iniciar sesion
const volverIniciarSesiones = document.getElementById("volverIniciarSesion");
volverIniciarSesiones.addEventListener("click", iniciarSesion);
function iniciarSesion() {
    document.getElementById("sesion2").style.display = "none";
    document.getElementById("sesion3").style.display = "block";
}


//objeto constructor de usuarios
function creacionDeUsuarios(nombre, email, contraseña) {
    this.nombre = nombre;
    this.email = email;
    this.contraseña = contraseña;
}
//variables de formulario crear usuario
const sesion = []
const formularioHtml = document.getElementById("crearCuenta");
const nombreHtml = document.getElementById("nombre");
const emailHtml = document.getElementById("email");
const contraseñaHtml = document.getElementById("contraseña");

//variables de formulario iniciar sesion
const emailSesion = document.getElementById("email-log")
const contraseñaSesion = document.getElementById("contraseña-log")

//accion al ingresar los datos al crear usuario
formularioHtml.addEventListener("click", agregarUsuarios);

//agrega usuarios
function agregarUsuarios(e) {
    if (nombreHtml.value != "" && emailHtml.value != "" && contraseñaHtml.value != "") {
        e.preventDefault();
        sesion.push(new creacionDeUsuarios(nombreHtml.value, emailHtml.value, contraseñaHtml.value))
        nombreHtml.value = "";
        emailHtml.value = "";
        contraseñaHtml.value = "";
        swal.fire({
            title: "genial",
            text: "tu cuenta fue creada, ya puedes iniciar sesion",
            icon: "success",
            confirm: "ok"
        })
    }
}
function failSesion(){
    Toastify({
        text: "el email y/o contraseña no son válidos, por favor ingrese los datos de nuevo",
        duration: "4000",
        className: "sesionFail"
    }).showToast();
}

//comprobar datos 
const comprobarSesion = document.getElementById("ingresarALaPagina")
// accion al ingresar los datos en el inicio de sesion
comprobarSesion.addEventListener("click", iniciarUsuario);
//agrega usuarios
function iniciarUsuario(e) {
    if (emailSesion.value != "" && contraseñaSesion.value != "") {
        e.preventDefault();
        if(sesion.length===0){
            failSesion()
        }
        for (let valor = 0; valor < sesion.length; valor++) {
            if (emailSesion.value === sesion[valor].email && contraseñaSesion.value === sesion[valor].contraseña) {
                document.getElementById("sesion1").style.display = "none";
                document.getElementById("webPage").style.display = "block";
            }
            else {
                failSesion()
            }
        }
    }
}
//-----paginaWeb-----

let carrito = []

const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('carrito-contenedor');

const botonTerminar = document.getElementById('terminar')
const finCompra = document.getElementById('fin-compra')
const botonVaciar = document.getElementById('vaciar-carrito')
const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');

const selectCategorias = document.getElementById('selectCategorias')
const buscador = document.getElementById('search')
const stockProductos = await getData();
console.log(stockProductos)
//filtro
selectCategorias.addEventListener('change', () => {
    selectCategorias.value == "all" ? mostrarProductos(stockProductos) : mostrarProductos(stockProductos.filter(elemento => elemento.categoria === selectCategorias.value))
})
//Buscador
buscador.addEventListener('input', (e) => {
    console.log(e.target.value);
    let buscaBusca = stockProductos.filter(producto => producto.nombre.toLowerCase().includes(e.target.value.toLowerCase()))
    mostrarProductos(buscaBusca)
    console.log(buscaBusca)
})
//logica Ecommerce
mostrarProductos(stockProductos)
function mostrarProductos(array) {
    contenedorProductos.innerHTML = ""
    array.forEach(producto => {
        let div = document.createElement('div')
        div.className = 'producto'
        div.innerHTML = `<div class="card">
                            <div class="card-image">
                                <img src="${producto.img}">
                                <span class="card-title">${producto.nombre}</span>
                            </div>
                            <div class="card-content">
                                <p>${producto.categoria}</p>
                                <p>${producto.desc}</p>
                                <p class="precio"> $${producto.precio}</p>
                                <button id="agregar${producto.id}" class="boton-agregar">comprar</button>
                            </div>
                        </div>`
        contenedorProductos.appendChild(div)
        const boton = document.getElementById(`agregar${producto.id}`)
        boton.addEventListener('click', () => {
            agregarAlCarrito(producto.id)
            actualizarCarrito()
        })
    })
}
const eliminarDelCarrito = (prodId) => {
    const item = carrito.find((prod) => prod.id === prodId)
    const indice = carrito.indexOf(item)
    carrito.splice(indice, 1)
    actualizarCarrito()
}
const actualizarCarrito = () => {
    contenedorCarrito.innerHTML = ""
    carrito.forEach((prod) => {
        let div = document.createElement('div')
        div.classList.add('productoEnCarrito')
        div.innerHTML = `<p>${prod.nombre}</p>
                                <p>Precio: $${prod.precio}</p>
                                <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
                                <button class="botonCantidad" id="restarCantidad${prod.id}">-</button>
                                <button class="botonCantidad" id="sumarCantidad${prod.id}">+</button>
                                <button class="boton-eliminar" id="eliminarDelCarrito${prod.id}"><i class="fas fa-trash-alt"></i></button>`
        contenedorCarrito.appendChild(div)
        const restarCantidades = document.getElementById(`restarCantidad${prod.id}`)
        restarCantidades.addEventListener('click', () => {
            restarCantidad(prod.id)
        })
        const sumarCantidades = document.getElementById(`sumarCantidad${prod.id}`)
        sumarCantidades.addEventListener('click', () => {
            sumarCantidad(prod.id)
        })
        const eliminandoDelCarrito = document.getElementById(`eliminarDelCarrito${prod.id}`)
        eliminandoDelCarrito.addEventListener('click', () => {
            eliminarDelCarrito(prod.id)
        })
    })
    const sumaContadorCarrito = carrito.reduce((acc, item) => acc+ item.cantidad,0)
    contadorCarrito.innerText = sumaContadorCarrito;
    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)
    localStorage.setItem('carrito', JSON.stringify(carrito))
}
botonVaciar.addEventListener('click', () => {
    carrito.length = 0;
    actualizarCarrito()
})

const agregarAlCarrito = (prodId) => {
    const productoRepetido = carrito.find(prod => prod.id === prodId)
    console.log(productoRepetido)
    if (productoRepetido) {
        productoRepetido.cantidad++
    }
    else {
        const item = stockProductos.find(prod => prod.id === prodId)
        carrito.push(item)
    }
    actualizarCarrito()
}

const sumarCantidad = (prodId) => {
    const prod = carrito.map(prod => {
        if (prod.id === prodId) {
            prod.cantidad++
            actualizarCarrito()
        }
    })
}

const restarCantidad = (prodId) => {
    carrito.map(prod => {
        if (prod.id === prodId) {
            if (prod.cantidad != 1) {
                prod.cantidad--
                actualizarCarrito()
            }
        }
    })
}

function recuperar() {

    let recuperarLS = JSON.parse(localStorage.getItem('carrito'))
    if (recuperarLS) {
        for (const elemento of recuperarLS) {
            actualizarCarrito(elemento)
            carrito.push(elemento)
            actualizarCarrito()
        }
    }
}
recuperar()




