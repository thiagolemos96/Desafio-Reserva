'use strict';
const validacao = require('../validacao-disponibilidade');
const app = require('../../server/server');

module.exports = function (Disponibilidade) {

    Disponibilidade.disableRemoteMethodByName('patchOrCreate');
    Disponibilidade.disableRemoteMethodByName('replaceOrCreate');
    Disponibilidade.disableRemoteMethodByName('disponibilidade_prototype_patchAttributes');
    Disponibilidade.disableRemoteMethodByName('exists_head_disponibilidades_id');
    Disponibilidade.disableRemoteMethodByName('exists_get_disponibilidades_id_exists');
    Disponibilidade.disableRemoteMethodByName('replaceById_post_disponibilidades_id_replace');
    Disponibilidade.disableRemoteMethodByName('createChangeStream_get_disponibilidades_change_stream');
    Disponibilidade.disableRemoteMethodByName('createChangeStream_post_disponibilidades_change_stream');
    Disponibilidade.disableRemoteMethodByName('count');
    Disponibilidade.disableRemoteMethodByName('findOne');
    Disponibilidade.disableRemoteMethodByName('replaceOrCreate_post_disponibilidades_replaceOrCreate');
    Disponibilidade.disableRemoteMethodByName('upsertWithWhere');

    async function consultaDisponibilidade (body, ctx, cb) {
        body.inicioEm = new Date(body.inicioEm);
        body.fimEm = new Date(body.fimEm);
        body.tipo = body.tipo.toUpperCase();

        const Reserva = app.models.Reserva;
        const disponibilidadeValidada = await validacao.validarDisponibilidade(Reserva, body);

        if (!disponibilidadeValidada.disponivel && disponibilidadeValidada.disponivel === false) {
            Promise.all([
                    validacao.validarMesmoHorarioOutraQuadra(Reserva, body),
                    validacao.validarMesmaQuadraUmaHoraAntes(Reserva, body),
                    validacao.validarMesmaQuadraUmaHoraDepois(Reserva, body),
                    validacao.validarOutraQuadraUmaHoraAntes(Reserva, body),
                    validacao.validarOutraQuadraUmaHoraDepois(Reserva, body),
                    validacao.validarMesmaQuadraDuasHoraAntes(Reserva, body),
                    validacao.validarMesmaQuadraDuasHoraDepois(Reserva, body)
                ]).then((resultadoDaPromisse) => {
                    try{
                        const filtrado = resultadoDaPromisse.map((item) => {
                            return item.disponivel === true? item.dados : null;
                        })
                        cb(null, filtrado);
                    } catch(error){
                        cb(null, error);
                    }
                }).catch(error => {
                    cb(null, error);
                });
        } else {
            body.duracao = Math.floor((body.fimEm - body.inicioEm) / (1000 * 60));
            cb(null, body);
        }
    }

    Disponibilidade.on('attached', () => {
        Disponibilidade.create = (body, ctx, cb) => {
            consultaDisponibilidade(body, ctx, cb);
        }
    });
};