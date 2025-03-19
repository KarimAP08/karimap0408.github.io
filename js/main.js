let productos = [];

fetch("./js/productos.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("No se pudo cargar productos.json: " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        productos = data;
        console.log("Productos cargados desde productos.json:", productos);
        if (productos.length > 0) {
            cargarProductos(productos);
        } else {
            console.warn("El archivo productos.json está vacío.");
            cargarProductos([]);
        }
    })
    .catch(error => {
        console.error("Error al cargar productos:", error);
        const contenedorProductos = document.querySelector("#contenedor-productos");
        contenedorProductos.innerHTML = "<p class='carrito-vacio'>Error al cargar los discos. Asegúrate de que productos.json esté en ./js/ y las imágenes existan.</p>";
    });

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");
const aside = document.querySelector("aside");

botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}));

function cargarProductos(productosElegidos) {
    console.log("Productos a cargar:", productosElegidos);
    contenedorProductos.innerHTML = "";

    if (productosElegidos.length === 0) {
        contenedorProductos.innerHTML = "<p class='carrito-vacio'>No hay discos disponibles en esta categoría.</p>";
        return;
    }

    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}" onerror="this.src='https://via.placeholder.com/250x250?text=Imagen+No+Disponible';">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;
        contenedorProductos.append(div);
    });

    actualizarBotonesAgregar();
}

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        const categoriaId = e.currentTarget.id;
        console.log("Categoría seleccionada:", categoriaId);

        if (categoriaId !== "todos") {
            const productosFiltrados = productos.filter(producto => producto.categoria.id === categoriaId);
            console.log("Productos filtrados:", productosFiltrados);
            if (productosFiltrados.length > 0) {
                const categoriaNombre = productosFiltrados[0].categoria.nombre;
                tituloPrincipal.innerText = categoriaNombre;
                cargarProductos(productosFiltrados);
            } else {
                tituloPrincipal.innerText = "Categoría no encontrada";
                cargarProductos([]);
            }
        } else {
            tituloPrincipal.innerText = "Todos los discos";
            cargarProductos(productos);
        }
    });
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {
    Toastify({
        text: "Disco agregado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #1E3A8A, #3B82F6)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
        onClick: function () { }
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productoAgregado) {
        if (productosEnCarrito.some(producto => producto.id === idBoton)) {
            const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
            productosEnCarrito[index].cantidad++;
        } else {
            productoAgregado.cantidad = 1;
            productosEnCarrito.push(productoAgregado);
        }

        actualizarNumerito();
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    } else {
        console.error("Producto no encontrado:", idBoton);
    }
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}