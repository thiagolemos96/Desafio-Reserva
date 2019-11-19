const enumTipo = require('../enum/tipo');
const enumstatus = require('../enum/status');

async function validarDuracao(inicio, fim){
    const diferenca = Math.floor((fim - inicio)/ (1000 * 60));

    return diferenca
}

async function validarValor(duracao){
    const total = parseFloat(duracao * 0.50);

    return total;
}

module.exports = {
    validarDuracao,
    validarValor,

}