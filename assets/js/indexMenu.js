function cargarMenuDesdeJSON(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} al cargar ${url}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.entrada && !data.principal && !data.postre) {
                throw new Error("El archivo JSON no tiene la estructura esperada.");
            }
            return data;
        })
        .catch(error => {
            if (window.location.protocol === 'file:') {
                console.warn('Abriste el archivo con file://. Usa un servidor local para evitar CORS.');
            }
            console.error('Error al cargar el menú:', error);
            return { entrada: [], principal: [], postre: [] };
        });
}

function llenarSelectConOpciones(selectElement, opciones, subMenuElement, dataCompleta) {
    selectElement.innerHTML = '';
    subMenuElement.innerHTML = '';
    const containerDiv = subMenuElement.closest('div');

    opciones.forEach(opcion => {
        const option = document.createElement('option');
        option.textContent = opcion.nombre;
        option.value = opcion.nombre;

        const tieneSubmenu =
            (opcion.submenu && opcion.submenu.length > 0) ||
            (opcion.submenu_ref && dataCompleta[opcion.submenu_ref]);

        if (tieneSubmenu) {
            option.classList.add('has-submenu');
        }

        selectElement.appendChild(option);
    });

    const updateSubmenu = (selectedOption) => {
        if (!selectedOption) {
            subMenuElement.innerHTML = '';
            if (containerDiv) containerDiv.style.display = 'none';
            return;
        }

        let submenu = selectedOption.submenu;
        if (!submenu && selectedOption.submenu_ref) {
            submenu = dataCompleta[selectedOption.submenu_ref] || [];
        }

        if (submenu && submenu.length > 0) {
            subMenuElement.innerHTML = '';
            submenu.forEach(subOptionText => {
                const subOption = document.createElement('option');
                if (typeof subOptionText === 'string' && subOptionText.trim() === '--') {
                    subOption.textContent = ' ';
                    subOption.value = '';
                } else {
                    subOption.textContent = subOptionText;
                    subOption.value = subOptionText;
                }
                subMenuElement.appendChild(subOption);
            });
            if (containerDiv) containerDiv.style.display = 'block';
        } else {
            subMenuElement.innerHTML = '';
            if (containerDiv) containerDiv.style.display = 'none';
        }
    };

    selectElement.onchange = (event) => {
        const selectedValue = event.target.value;
        const selectedOption = opciones.find(op => op.nombre === selectedValue);
        updateSubmenu(selectedOption);
    };

    const initialOption = opciones.find(op => op.nombre === selectElement.value) || opciones[0];
    updateSubmenu(initialOption);
}

function inicializarMenu() {
    const entradaSelect = document.getElementById('entrada-select');
    const platoPrincipalSelect = document.getElementById('plato-principal-select');
    const postreSelect = document.getElementById('postre-select');
    const entradaSubmenuSelect = document.getElementById('entrada-submenu');
    const platoPrincipalSubmenuSelect = document.getElementById('plato-principal-submenu');
    const postreSubmenuSelect = document.getElementById('postre-submenu');

    cargarMenuDesdeJSON('data/menus.json')
        .then(menuData => {
            llenarSelectConOpciones(entradaSelect, menuData.entrada || [], entradaSubmenuSelect, menuData);
            llenarSelectConOpciones(platoPrincipalSelect, menuData.principal || [], platoPrincipalSubmenuSelect, menuData);
            llenarSelectConOpciones(postreSelect, menuData.postre || [], postreSubmenuSelect, menuData);
        });
}

function calcularPxPorMilimetro() {
    const medidor = document.createElement('div');
    medidor.style.position = 'absolute';
    medidor.style.left = '-9999px';
    medidor.style.top = '0';
    medidor.style.width = '10mm';
    medidor.style.height = '100mm';
    document.body.appendChild(medidor);
    const pxPorMm = medidor.getBoundingClientRect().height / 100;
    document.body.removeChild(medidor);
    return pxPorMm > 0 ? pxPorMm : (96 / 25.4);
}

function actualizarModoCompactoImpresion() {
    const encabezado = document.querySelector('header');
    const contenido = document.querySelector('main');
    if (!encabezado || !contenido) {
        document.body.classList.remove('print-compact');
        return;
    }

    document.body.classList.remove('print-compact');

    const pxPorMm = calcularPxPorMilimetro();
    const altoDisponibleA4 = (297 - 20) * pxPorMm;
    const altoContenido = encabezado.getBoundingClientRect().height + contenido.getBoundingClientRect().height;

    if (altoContenido > altoDisponibleA4) {
        document.body.classList.add('print-compact');
    }
}

window.addEventListener('beforeprint', actualizarModoCompactoImpresion);
window.addEventListener('afterprint', () => {
    document.body.classList.remove('print-compact');
});

window.onload = inicializarMenu;
