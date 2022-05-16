const generarTokenId = () => {
    const random = Math.random().toString(32).substring(2);
    const fecha = Date.now().toString(32);
    return random + fecha; // retorna las 2 variables concatenadas
}

export default generarTokenId;