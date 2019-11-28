const enumTipo = require('../enum/tipo').tipo;
const enumstatus = require('../enum/status').status;

async function validarDuracao(inicio, fim){
    const diferenca = Math.floor((fim - inicio)/ (1000 * 60));

    return diferenca
}

async function validarValor(duracao){
    const total = parseFloat(duracao * 0.50);

    return total;
}

async function validarTipo(tipo){
    if(tipo == enumTipo.HARD || tipo == enumTipo.SAIBRO){
        return tipo;
    }
}

async function validarStatus(status){
    if(status == enumstatus.ativa || status == enumstatus.cancelada || status == enumstatus.paga){
        return status;
    }
}

async function validarCancelamento(status){
    if(status == enumstatus.cancelada){
        return new Date();
    }
}


module.exports = {
    validarDuracao,
    validarValor,
    validarTipo,
    validarStatus,
    validarCancelamento
}