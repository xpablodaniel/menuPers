# MenuPers

MenuPers es un menu del dia interactivo con entradas, plato principal y postre. Permite seleccionar opciones, agregar detalles personalizados y administrar el contenido del JSON desde un panel web.

## Caracteristicas
- Carga de platos desde `menus.json`.
- Submenus dinamicos por item.
- Detalles personalizados por categoria.
- Panel admin para editar y guardar el JSON.
- Diseno centrado y listo para impresion.

## Requisitos
- Python 3.

## Desarrollo local
El proyecto usa `fetch` para cargar `menus.json`, por lo que debe servirse por HTTP y no abrirse con `file://`.

### Iniciar servidor
Desde la carpeta del proyecto:

```bash
python3 serve.py --port 5500
```

O usando el script incluido:

```bash
./serve.sh
```

Abrir en el navegador:

```
http://localhost:5500/indexMenuPers.html
```

### Panel admin
Con el servidor en marcha, abrir:

```
http://localhost:5500/adminMenu.html
```

Desde ahi podes cargar y guardar el contenido de `menus.json`.

Nota: el admin requiere `serve.py` (el servidor basico de Python no expone `/api/menus`).

## Acceso desde otra maquina en la red (opcional)

```bash
python3 serve.py --host 0.0.0.0 --port 5500
```

Reemplazar `localhost` por la IP de la maquina.

## Estructura del proyecto
- `indexMenuPers.html`: pagina principal del menu.
- `indexMenu.js`: logica de carga y submenus.
- `indexMenuPers.css`: estilos del menu.
- `menus.json`: contenido editable del menu.
- `adminMenu.html`, `adminMenu.js`, `adminMenu.css`: panel admin.
- `serve.py`: servidor con API para editar el JSON.
- `serve.sh`: script de arranque rapido.
