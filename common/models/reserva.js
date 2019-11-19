'use strict';
const validacao = require('../validacao')

module.exports = function(Reserva) {
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
    Reserva.disableRemoteMethodByName('updateAll');
    Reserva.disableRemoteMethodByName('upsertWithWhere');


    Reserva.observe('before save', async function validação(ctx, next){
        if(ctx.instance){
            ctx.instance.criadoEm = new Date();
            ctx.instance.duracao = await validacao.validarDuracao(ctx.instance.inicioEm, ctx.instance.fimEm);
            ctx.instance.valor = await validacao.validarValor(ctx.instance.duracao);

            console.log("duração: ", ctx.instance.duracao);
            console.log("valor: ", ctx.instance.valor);
        }
        next();
    })
}
