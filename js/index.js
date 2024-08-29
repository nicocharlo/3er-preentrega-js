function cargarFondo() {
    const colorGuardado = localStorage.getItem("colorFondo");

    if (colorGuardado) {
        document.body.style.backgroundColor = colorGuardado;
        colorActual = (colorGuardado === "gray");
    } else {
        const colorPorDefecto = "red";
        document.body.style.backgroundColor = colorPorDefecto;
        colorActual = true;
        localStorage.setItem("colorFondo", colorPorDefecto);
    }

    actualizarSlider(colorActual);
}

let colorActual = true;

document.getElementById("agregarProducto").addEventListener("click", agregarProducto);
document.getElementById("eliminarTodos").addEventListener("click", mostrarConfirmacion);

function mostrarConfirmacion() {
    Swal.fire({
        title: 'Confirmación',
        text: '¿Estás seguro de que quieres eliminar todos los productos?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarTodos();
        }
    });
}

function agregarProducto() {
    const nombre = document.getElementById("nombreProducto").value;
    const precio = parseFloat(document.getElementById("precioProducto").value);

    if (nombre && !isNaN(precio)) {
        const producto = { nombre, precio };

        let productos = JSON.parse(localStorage.getItem("productos")) || [];
        productos.push(producto);

        localStorage.setItem("productos", JSON.stringify(productos));
        mostrarProductos();

        document.getElementById("nombreProducto").value = '';
        document.getElementById("precioProducto").value = '';

        Toastify({
            text: "Producto agregado con éxito",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#4CAF50",
        }).showToast();
    } else {
        console.log("Por favor, ingresa un nombre y un precio válido.");
    }
}

function mostrarProductos() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = '';

    if (productos.length > 0) {
        let contenido = "<h2>Productos y Precios</h2><ul>";

        productos.forEach((producto, index) => {
            contenido += `
                <li style="margin-bottom: 10px;">
                    ${producto.nombre}: $${producto.precio.toFixed(2)}
                    <button onclick="eliminarProducto(${index})">Eliminar</button>
                </li>`;
        });

        const productoMasBarato = productos.reduce((min, p) => p.precio < min.precio ? p : min, productos[0]);
        contenido += `<h3>El producto más barato es: ${productoMasBarato.nombre} con un precio de $${productoMasBarato.precio.toFixed(2)}</h3>`;
        
        contenido += "</ul>";
        resultadoDiv.innerHTML = contenido;
    } else {
        resultadoDiv.innerHTML = "<p>No hay productos almacenados.</p>";
    }
}

function eliminarProducto(index) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.splice(index, 1);
    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductos();
}

function eliminarTodos() {
    localStorage.removeItem("productos");
    mostrarProductos();
}

function cambiarFondo() {
    const nuevoColor = colorActual ? "gray" : "red";
    document.body.style.backgroundColor = nuevoColor;
    localStorage.setItem("colorFondo", nuevoColor);
    colorActual = !colorActual;
    actualizarSlider(colorActual);
}

function actualizarSlider(colorActual) {
    const boton = document.getElementById("cambiarColor");
    const slider = document.querySelector(".slider");
    if (colorActual) {
        slider.classList.remove("inactivo");
        boton.checked = true;
    } else {
        slider.classList.add("inactivo");
        boton.checked = false;
    }
}

mostrarProductos();
cargarFondo();

document.getElementById("cambiarColor").addEventListener("change", cambiarFondo);
