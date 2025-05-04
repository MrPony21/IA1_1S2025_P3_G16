function listaACodigosJSON(lista) {
    const resultado = {};
    lista.forEach((item, index) => {
        resultado[index + 1] = item;
    });
    return resultado;
}


function obtenerCoordenadasLibres(mapa) {
    const { ancho, alto, paredes } = mapa;
    const libres = [];

    const esPared = new Set(paredes.map(p => `${p[0]},${p[1]}`));

    for (let x = 0; x < alto; x++) {
        for (let y = 0; y < ancho; y++) {
            if (!esPared.has(`${x},${y}`)) {
                libres.push([x, y]);
            }
        }
    }

    return libres;
}


