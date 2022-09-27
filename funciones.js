const Productos = document.getElementById('Productos');
const items = document.getElementById('items');
const footer= document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateCarrito = document.getElementById('template-carrito').content;
const templateFooter = document.getElementById('template-footer').content;
const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        crearFilaCarrito();
    }
});

Productos.addEventListener('click', e => {
    agregarCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e);
})

const fetchData = async () => {
    try{
        const res = await fetch('datos.json');
        const data = await res.json();
        CrearTarjetas(data);
    } catch (error) {

    }
}

const CrearTarjetas = data =>  {
    data.forEach(producto =>{
        templateCard.querySelector('h2').textContent = producto.titulo;
        templateCard.querySelector('p').textContent = producto.precio;
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl);
        templateCard.querySelector('.BotonComprar').dataset.id = producto.id;
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone)
    })
    Productos.appendChild(fragment);
}

const agregarCarrito = e => {
    if (e.target.classList.contains('BotonComprar')){
        setearCarrito(e.target.parentElement);
    }
    e.stopPropagation();
}

const setearCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.BotonComprar').dataset.id,
        titulo: objeto.querySelector('h2').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }
    carrito[producto.id] = {...producto};
    crearFilaCarrito();  
}

const crearFilaCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id;
        templateCarrito.querySelectorAll('td')[0].textContent = producto.titulo;
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        templateCarrito.querySelector('.sumarUnidad').dataset.id = producto.id;
        templateCarrito.querySelector('.restarUnidad').dataset.id = producto.id;
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio;
        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.appendChild(fragment);

    crearFooterCarrito();

    localStorage.setItem('carrito', JSON.stringify(carrito));
}

const crearFooterCarrito = () =>{
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0);

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const btnVaciarCarrito = document.getElementById('vaciar-carrito');
    btnVaciarCarrito.addEventListener('click', () => {
        carrito = {};
    crearFilaCarrito();
    })

    const btnAceptarCarrito = document.getElementById('aceptarCarrito');
    btnAceptarCarrito.addEventListener('click', () => {
        Swal.fire(
            'Se ha confirmado su compra',
            'Por favor proceda a pagar',
            'success'
          )
    })
}

const btnAccion = e => {
    if(e.target.classList.contains('sumarUnidad')){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1;
        carrito[e.target.dataset.id] = {...producto};
        crearFilaCarrito();
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        crearFilaCarrito()
    }
    e.stopPropagation()
}

