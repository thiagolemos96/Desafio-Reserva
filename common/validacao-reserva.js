const enumTipo = require('../enum/tipo').tipo;
const enumstatus = require('../enum/status').status;

function validarDuracao(duracao){
    if(duracao >= 60 && duracao % 60 == 0){
        return true;
    } else{
        return false;
    }
}

function validarTipo(tipo){
    if(tipo == enumTipo.HARD || tipo == enumTipo.SAIBRO){
        return true;
    }else{
        return false;
    }
}

function validarStatus(status){
    if(status == enumstatus.ativo || status == enumstatus.cancelado || status == enumstatus.pago){
        return true;
    } else {
        return false;
    }
}

function validarHorario(reserva, ctx) {
    return new Promise((resolve, reject) => {
        reserva.find({
            where:{
                tipo: ctx.tipo,
                or: [
                    {and:[{inicioEm : {lte:(ctx.inicioEm)}},{fimEm:{gt:(ctx.inicioEm)}},{or:[{status: enumstatus.ativo},{status: enumstatus.pago}
                        ]}]},
                    {and:[{inicioEm : {lt:(ctx.fimEm)}},{fimEm:{gte:(ctx.fimEm)}},{or:[{status: enumstatus.ativo}, {status: enumstatus.pago}
                        ]} ]},
                    {and:[{inicioEm : {gt:(ctx.inicioEm)}},{fimEm:{lt:(ctx.fimEm)}},{or:[{status: enumstatus.ativo}, {status: enumstatus.pago}
                        ]} ]}
                ]
            }
        })
        .then(data => {
          if(data.length === 0 ){
            resolve(true);
          } else {
            resolve(false);   
          } 
      })
    })
}




module.exports = {
    validarDuracao,
    validarTipo,
    validarStatus,
    validarHorario
}