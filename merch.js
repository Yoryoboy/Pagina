let productos = [
    {
        id: 0,
        name: "remera",
        price: 5000,
        stock: 100,
        imgSrc: "./img/shirt.png",
    },
    {
        id: 1,
        name: "campera",
        price: 7000,
        stock: 100,
        imgSrc: "./img/hoodie.png"
    },
    {
        id: 2,
        name: "taza",
        price: 2000,
        stock: 100,
        imgSrc: "./img/mug.png"
    },
    {
        id: 3,
        name: "disco",
        price: 3000,
        stock: 100,
        imgSrc: "./img/paradigma.jpg"
    },
]

//SELECCIONAR ELEMENTOS

// let productoElemento = document.querySelector(".productos");
let carritoItemsElemento = document.querySelector(".cart-items");
let subTotalElemento = document.querySelector(".subtotal");
let comprarButton = document.querySelector('.checkout');

comprarButton.addEventListener('click', comprarButtonClicked);


// RENDERIZAR usando JQUERY

function renderizarProductos() {
    productos.forEach((producto) => {
        $('.productos').append(
        
        `<div class="item">
        <div class="itemContainer">
            <div class="itemImg">
                <img src="${producto.imgSrc}" alt="${producto.name}">
            </div>
            <div class="desc">
                <h2>${producto.name}</h2>
                <h2><small>$</small>${producto.price}</h2>
                <button class="AgregarCarrito" onclick="agregarAlCarrito(${producto.id})">AGREGAR</button>
        </div>
    </div>`
    )});
    
}

renderizarProductos();

//La idea es crear un nuevo array con los productos
//en los que usuario presione el boton de agregar

let carrito = JSON.parse(localStorage.getItem("CARRITO")) || []; //tuve que cambiarlo a esto porque si el usuario borra el local storage, me lanza error al cargarlo
actualizarCarrito();

//Agregar al carrito

function agregarAlCarrito(id) {

    //condicional para chequear si el articulo ya existe en carrito
    if(carrito.some((item) => item.id === id)){
        cambiarNumeroDeUnidades("plus", id);
    }else{

    let  item = productos.find((producto) => producto.id === id)
    
    carrito.push({
     ...item,
     cantidadDeUnidades: 1
    });
    }

    actualizarCarrito();
}

//actualizar carrito

function actualizarCarrito(){
    renderizarItemsCarrito();
    renderSubTotal();

    // Guardar carrito en el local storage
    localStorage.setItem("CARRITO", JSON.stringify(carrito))
}

//calcular y renderizar subtotal

function renderSubTotal(){
    let precioTotal = 0, itemsTotal = 0;

    carrito.forEach((item) => {
        precioTotal += item.price * item.cantidadDeUnidades;
        itemsTotal += item.cantidadDeUnidades;
    });

    subTotalElemento.innerHTML = `Subtotal (${itemsTotal} items): $${precioTotal}`


}

//creando funcion para renderizar items en carrito

function renderizarItemsCarrito(){
    carritoItemsElemento.innerHTML = ""; //borrar elementos de carrito
    carrito.forEach((item) => {
        $('.cart-items').append(
        ` <div class="cart-item">
        <div class="item-info" onclick="sacarItemDeCarrito(${item.id})">
            <img src="${item.imgSrc}" alt="${item.name}">
            <h4>${item.name}</h4>
        </div>
        <div class="unit-price">
            <small>$</small>${item.price}
        </div>
        <div class="units">
            <div class="btn minus" onclick="cambiarNumeroDeUnidades('minus', ${item.id})">-</div>
            <div class="number">${item.cantidadDeUnidades}</div>
            <div class="btn plus" onclick="cambiarNumeroDeUnidades('plus', ${item.id})">+</div>           
        </div>
    </div>`)
    })
}

//sacar articulo de carrito

function sacarItemDeCarrito(id) {
    carrito = carrito.filter((item) => item.id !== id)


    actualizarCarrito()

}

//Cambiar numero de unidades para un articulo

function cambiarNumeroDeUnidades(action, id){
    carrito = carrito.map((item) => { //utilizare el metodo map
    let cantidadDeUnidades = item.cantidadDeUnidades; 

    if(item.id === id) {
        if (action === "minus" && cantidadDeUnidades > 1) {
            cantidadDeUnidades--;
        }else if (action === "plus" && cantidadDeUnidades < item.stock){
            cantidadDeUnidades++;
        }
    }  
    return {
        ...item,
        cantidadDeUnidades,
    };
    })

    actualizarCarrito();

}

function comprarButtonClicked() {
    carritoItemsElemento.innerHTML = '';
    subTotalElemento.innerHTML = `Subtotal (0 items): $0`
}