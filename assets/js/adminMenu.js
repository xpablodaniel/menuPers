const loadButton = document.getElementById('load-button');
const saveButton = document.getElementById('save-button');
const menuJson = document.getElementById('menu-json');
const statusEl = document.getElementById('status');

function setStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.dataset.state = isError ? 'error' : 'ok';
}

async function loadMenu() {
    setStatus('Cargando menu...');
    try {
        const response = await fetch('/api/menus');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        menuJson.value = JSON.stringify(data, null, 2);
        setStatus('Menu cargado.');
    } catch (error) {
        setStatus('No se pudo cargar el menu. Verifica el servidor.', true);
        console.error(error);
    }
}

async function saveMenu() {
    let payload;
    try {
        payload = JSON.parse(menuJson.value);
    } catch (error) {
        setStatus('JSON invalido. Corrige el formato.', true);
        return;
    }

    setStatus('Guardando cambios...');
    try {
        const response = await fetch('/api/menus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        setStatus('Menu guardado correctamente.');
    } catch (error) {
        setStatus('No se pudo guardar el menu.', true);
        console.error(error);
    }
}

loadButton.addEventListener('click', loadMenu);
saveButton.addEventListener('click', saveMenu);

loadMenu();
