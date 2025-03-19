let productos = [];

fetch("./js/productos.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`No se pudo cargar productos.json: ${response.status} ${response.statusText}`);
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
        console.error("Error al cargar productos:", error.message);
        const contenedorProductos = document.querySelector("#contenedor-productos");
        contenedorProductos.innerHTML = `<p class='carrito-vacio'>Error al cargar los discos: ${error.message}. Asegúrate de que productos.json esté en ./js/ y las imágenes existan.</p>`;
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
