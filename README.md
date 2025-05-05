# IA1_1S2025_P3_G16
Repositorio creado para el proyecto 3 de Inteligencia Artificial

## Integrantes
|Nombre | Carnet|
|------|--------|
| Marco Antonio Solis Gonzalez | 202003220 |
| Max Rodrigo Durán Canteo | 201902219 |
| Luis Mariano Moreira Garcia | 202010770 |


# MANUAL DE USUARIO
**Pagina Principal**
Esta es la vista principal
![principa](img/principal.png)
Aca podremos seleccionar las siguientes opciones
1. Cargar Json
2. Seleccionar Algoritmo

**Cargar Json**: Nos mostrara una ventana emergente para elegir un archivo json a cargar 
![json](img/cargar.png)
El archivo json debera de tener el siguiente formato:
```
{
  "ancho": 5,
  "alto": 5,
  "inicio": [0, 0],
  "fin": [4, 4],
  "paredes": [
    [0, 4],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 4],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4]
  ]
}
```
**Seleccionar Algoritmo**: 
En la esquina superior derecha encontraremos el siguiente listado de opciones:
![ddl](img/ddl.png)
Luego darle click al boton de "Cambiar algoritmo" Aplicara otro metodo de busqueda
![camibar](img/cambiar.png)


**Resolucion del Laberinto**
Una vez cargado el archivo json y establecido el algoritmo con el que resolveremos el laberinto nos mostrara el tablero principal segun el archivo de entrada.
![tablero](img/tablero.png)

**Botones "<" ">"**
Se cuenta con dos botones uno para avanzar y otro para retroceder los cuales se encuentran en la parte inferior de la pantalla.

Al seleccionar ">" avanzará.
![avanzar](img/avanzar.png)

Al seleccionar "<" retrocederá.
![retroceder](img/retroceder.png)



**Controles de vista**
En la esquina superior derecha se encuentra controles para manejar la vista de la camara.
![controles](img/vistaControles.png)

Esto para tener un mejor movimiento de la camara
![movimiento](img/movimientos.png)





# MANUAL TECNICO 




