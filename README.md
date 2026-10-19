# Calculadora de desarrollos

PWA para triatlón y contrarreloj. Dado el cassette, la potencia media y la cadencia objetivo, estima la velocidad
en llano y propone **tres platos de dentado par y correlativos** (grande, medio y bajo) con la tabla de velocidades
de cada marcha. Funciona sin conexión y se puede instalar en el móvil o el ordenador.

- Español e inglés (español por defecto) y modo claro/oscuro (claro por defecto).
- Cassettes SRAM Red/Force de 11, 12 y 13 velocidades, Shimano de 11 y 12 velocidades y cassette personalizado de 11 a 13 piñones.
- Sin dependencias ni paso de compilación: HTML, CSS y JavaScript puros.

## Publicar en GitHub Pages con GitHub Actions

1. Crea un repositorio nuevo en GitHub y sube todo el contenido de esta carpeta, incluida `.github/`, a la raíz de la rama `main`.
2. En el repositorio, ve a **Settings → Pages → Build and deployment** y en *Source* elige **GitHub Actions**.
3. Cada `git push` a `main` ejecuta el workflow `.github/workflows/deploy.yml` y publica el sitio. También puedes lanzarlo a mano desde la pestaña **Actions → Desplegar en GitHub Pages → Run workflow**.
4. La primera vez, el despliegue tarda uno o dos minutos. La URL aparece en el resumen del workflow y suele ser `https://<usuario>.github.io/<repositorio>/`.
5. Ábrela en el móvil y usa **Añadir a pantalla de inicio** (iOS) o **Instalar app** (Android y Chrome de escritorio).

Si el despliegue falla la primera vez con un error de permisos o de entorno, revisa que el paso 2 esté hecho antes de lanzar el workflow.

Todas las rutas son relativas, así que funciona igual en la raíz de un dominio propio o en la subruta de un repositorio.

## Estructura

| Archivo | Función |
|---|---|
| `index.html` | Interfaz, cálculo y textos en ambos idiomas |
| `manifest.webmanifest` | Nombre, colores e iconos de la app instalada |
| `sw.js` | Service worker: caché para uso sin conexión |
| `fonts/` | Tipografías autoalojadas (IBM Plex y Barlow Semi Condensed, licencia SIL OFL 1.1) |
| `icons/` | Iconos PNG y SVG |
| `.github/workflows/deploy.yml` | Despliegue automático en GitHub Pages |
| `.nojekyll` | Evita el procesado de Jekyll si se publica desde una rama en vez de con Actions |

## Actualizar la app

Edita los archivos y haz `git push` a `main`. El workflow sustituye la versión de `CACHE` en `sw.js` por el identificador del commit,
así que los dispositivos que ya tienen la app instalada reciben los cambios sin tocar nada más. Si publicas sin Actions, sube a mano la
versión de `CACHE` (`desarrollos-v2`, `desarrollos-v3`…) en cada cambio.

## Modelo de cálculo

Potencia en rueda = potencia × eficiencia = ½·ρ·CdA·v³ + Crr·m·g·v, en llano y sin viento. Valores por defecto:
CdA 0,23 m², masa 85 kg, Crr 0,004, ρ 1,19 kg/m³, eficiencia 97,5 %, rueda 700×28c (2136 mm).
Para cada plato par se busca el piñón más cercano a la velocidad objetivo; encaja si está en la banda central del cassette
(un tercio de los piñones) y la cadencia necesaria queda dentro de la tolerancia (±6 rpm por defecto). «Grande» es el mayor
plato par que encaja y «Medio» y «Bajo» son los dos pares inmediatamente inferiores.

## Limitaciones

- Perfil llano y sin viento: con subidas o viento cambia la velocidad media real y, con ella, el piñón óptimo.
- Se asume plato único (1x) o el plato grande de un 2x.
- Los dentados de SRAM están contrastados con fichas del fabricante y tiendas; los de Shimano son los habituales de la serie. Si el tuyo difiere, usa «Personalizado».

## Varias apps en la misma cuenta de GitHub

Todas las apps de `usuario.github.io/<repo>/` comparten **origen**, y por tanto `localStorage` y el espacio de cachés. Esta app lo respeta:

- Cachés del service worker con prefijo `desarrollos-`; al activarse solo borra las suyas.
- Claves de `localStorage` con prefijo `desarrollos:`.
- Si despliegas otras apps desde esta misma plantilla, cambia `PREFIX`/`CACHE` en `sw.js`, el workflow y `NS` en `index.html`.

## Versión visible

El pie de la app muestra `v <hash> · <fecha UTC>` del commit desplegado (lo rellena el workflow). En local muestra `v dev`.
