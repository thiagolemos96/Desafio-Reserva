'use strict';
const validacao = require('../validacao-reserva');
const enumStatus = require('../../enum/status').status;

module.exports = function(Reserva) {

    async function validaEntradaAntesDeSalvar(ctx, next) {
        try{
            if(ctx.instance){
                ctx.instance.tipo = ctx.instance.tipo.toUpperCase();
                const duracao = Math.floor((ctx.instance.fimEm - ctx.instance.inicioEm)/ (1000 * 60));
                const duracaoValidada = validacao.validarDuracao(duracao);
                const statusValidada = validacao.validarStatus(ctx.instance.status);
                const horarioValidado = await validacao.validarHorario(Reserva, ctx.instance);
                const tipoValidado = validacao.validarTipo(ctx.instance.tipo);
                
                if(!horarioValidado){
                    let error = new Error();
                        error.message = 'O horário solicitado não está disponível, favor selecione um outro horário.';
                        error.code = "HORARIO_INVALIDO"
                        error.statusCode = 422;
                    
                    next(error);
                    return;
                } else if(!statusValidada){
                    let error = new Error();
                        error.statusCode = 400;
                        error.message = 'Status Invalido';
                    
                        next(error);
                    return;
                } else if(!duracaoValidada){
                    let error = new Error();
                        error.statusCode = 422;
                        error.message = 'Duração Invalida';
                
                    next(error);
                    return;
                } else if(!tipoValidado){
                    let error = new Error();
                        error.statusCode = 400;
                        error.message = 'Tipo Invalidoß';
                    
                    next(error);
                    return
                } else {
                    ctx.instance.criadoEm = new Date();
                    ctx.instance.duracao = duracao;
                    ctx.instance.valor = parseFloat(duracao * 0.50);

                    next();
                    return;
                }

            }
        } catch(error){
            next(error);
            return;
        }
}

    Reserva.disableRemoteMethodByName('patchOrCreate');
    Reserva.disableRemoteMethodByName('replaceOrCreate');
    Reserva.disableRemoteMethodByName('reserva_prototype_patchAttributes');
    Reserva.disableRemoteMethodByName('exists_head_reservas_id');
    Reserva.disableRemoteMethodByName('exists_get_reservas_id_exists');
    Reserva.disableRemoteMethodByName('replaceById_post_reservas_id_replace');
    Reserva.disableRemoteMethodByName('createChangeStream_get_reservas_change_stream');
    Reserva.disableRemoteMethodByName('createChangeStream_post_reservas_change_stream');
    Reserva.disableRemoteMethodByName('count');
    Reserva.disableRemoteMethodByName('findOne');
    Reserva.disableRemoteMethodByName('replaceOrCreate_post_reservas_replaceOrCreate');
    Reserva.disableRemoteMethodByName('upsertWithWhere');

    Reserva.on('attached', function(){
        Reserva.deleteById = function (id, ctx, cb){
            Reserva.updateAll({id: id},{
                status: enumStatus.cancelado,
                canceladaEm: new Date()
            }, cb);
       };
    });

    Reserva.observe('before save', (ctx, next) => {
        validaEntradaAntesDeSalvar(ctx, next);
    });

}
