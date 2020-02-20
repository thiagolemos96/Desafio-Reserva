const enumStatus = require('../enum/status').status;
const enumTipo = require('../enum/tipo').tipo;
const moment = require('moment');
const lodash = require('lodash');

function subtrair(tempo, valor) {
    return moment(tempo).subtract(valor, 'hour');
}

function somar(tempo, valor) {
    return moment(tempo).add(valor, 'hour');
}

function validarDisponibilidade(reserva, ctx) {
    const resposta = {};
    return new Promise((resolve, reject) => {
        reserva.find({
            where: {
                tipo: ctx.tipo,
                or: [{
                        and: [{
                            inicioEm: {
                                lte: (ctx.inicioEm)
                            }
                        }, {
                            fimEm: {
                                gt: (ctx.inicioEm)
                            }
                        }, {
                            or: [{
                                status: enumStatus.ativo
                            }, {
                                status: enumStatus.pago
                            }]
                        }]
                    },
                    {
                        and: [{
                            inicioEm: {
                                lt: (ctx.fimEm)
                            }
                        }, {
                            fimEm: {
                                gte: (ctx.fimEm)
                            }
                        }, {
                            or: [{
                                status: enumStatus.ativo
                            }, {
                                status: enumStatus.pago
                            }]
                        }]
                    },
                    {
                        and: [{
                            inicioEm: {
                                gt: (ctx.inicioEm)
                            }
                        }, {
                            fimEm: {
                                lt: (ctx.fimEm)
                            }
                        }, {
                            or: [{
                                status: enumStatus.ativo
                            }, {
                                status: enumStatus.pago
                            }]
                        }]
                    }
                ]
            }
        }).then(data => {
            if (data.length === 0) {
                resposta.dados = data;
                resposta.disponivel = true;
                resolve(resposta);
            } else {
                resposta.dados = data;
                resposta.disponivel = false;
                resolve(resposta);
            }
        })
    });
}

function validarMesmoHorarioOutraQuadra(reserva, ctx) {
    const resposta = {};
    return new Promise((resolve, reject) => {
        reserva.find({
            where: {
                tipo: {
                    neq: ctx.tipo
                },
                or: [{
                        and: [{
                            inicioEm: {
                                lte: (ctx.inicioEm)
                            }
                        }, {
                            fimEm: {
                                gt: (ctx.inicioEm)
                            }
                        }, {
                            or: [{
                                status: enumStatus.ativo
                            }, {
                                status: enumStatus.pago
                            }]
                        }]
                    },
                    {
                        and: [{
                            inicioEm: {
                                lt: (ctx.fimEm)
                            }
                        }, {
                            fimEm: {
                                gte: (ctx.fimEm)
                            }
                        }, {
                            or: [{
                                status: enumStatus.ativo
                            }, {
                                status: enumStatus.pago
                            }]
                        }]
                    },
                    {
                        and: [{
                            inicioEm: {
                                gt: (ctx.inicioEm)
                            }
                        }, {
                            fimEm: {
                                lt: (ctx.fimEm)
                            }
                        }, {
                            or: [{
                                status: enumStatus.ativo
                            }, {
                                status: enumStatus.pago
                            }]
                        }]
                    }
                ]
            }
        }).then(data => {
            if (data.length === 0) {
                if (ctx.tipo === enumTipo.HARD) {
                    resposta.dados = lodash.cloneDeep(ctx);
                    resposta.dados.tipo = enumTipo.SAIBRO;
                    resposta.disponivel = true;
                    resolve(resposta);
                } else {
                    resposta.dados = lodash.cloneDeep(ctx);
                    resposta.dados.tipo = enumTipo.HARD;
                    resposta.disponivel = true;
                    resolve(resposta);
                }
            } else {
                resposta.dados = data;
                resposta.disponivel = false;
                resolve(resposta);
            }
        })
    });
}

function validarMesmaQuadraUmaHoraAntes(reserva, ctx) {
    const resposta = {};
    return new Promise((resolve, reject) => {
        let inicio = subtrair(ctx.inicioEm, 1);
        let fim = subtrair(ctx.fimEm, 1);
        reserva.find({
            where: {
                tipo: ctx.tipo,
                and: [{
                    inicioEm: (inicio)
                }, {
                    fimEm: (fim)
                }, {
                    or: [{
                        status: enumStatus.ativo
                    }, {
                        status: enumStatus.pago
                    }]
                }]
            }
        }).then(data => {
            if (data.length === 0) {
                resposta.dados = lodash.cloneDeep(ctx);
                resposta.dados.inicioEm = inicio;
                resposta.dados.fimEm = fim;
                resposta.disponivel = true;
                resolve(resposta);
            } else {
                resposta.dados = data;
                resposta.disponivel = false;
                resolve(resposta);
            }
        })
    });
}

function validarMesmaQuadraUmaHoraDepois(reserva, ctx) {
    const resposta = {};
    return new Promise((resolve, reject) => {
        let inicio = somar(ctx.inicioEm, 1)
        let fim = somar(ctx.fimEm, 1);
        reserva.find({
            where: {
                tipo: ctx.tipo,
                and: [{
                    inicioEm: (inicio)
                }, {
                    fimEm: (fim)
                }, {
                    or: [{
                        status: enumStatus.ativo
                    }, {
                        status: enumStatus.pago
                    }]
                }]
            }
        }).then(data => {
            if (data.length === 0) {
                resposta.dados = lodash.cloneDeep(ctx);
                resposta.dados.inicioEm = inicio;
                resposta.dados.fimEm = fim;
                resposta.disponivel = true;
                resolve(resposta);
            } else {
                resposta.dados = data;
                resposta.disponivel = false;
                resolve(resposta);
            }
        })
    });
}

function validarOutraQuadraUmaHoraAntes(reserva, ctx) {
    const resposta = {};
    return new Promise((resolve, reject) => {
        let inicio = subtrair(ctx.inicioEm, 1);
        let fim = subtrair(ctx.fimEm, 1);
        reserva.find({
            where: {
                tipo: {
                    neq: ctx.tipo
                },
                and: [{
                    inicioEm: inicio
                }, {
                    fimEm: fim
                }, {
                    or: [{
                        status: enumStatus.ativo
                    }, {
                        status: enumStatus.pago
                    }]
                }]
            }
        }).then(data => {
            if (data.length === 0) {
                if (ctx.tipo === enumTipo.HARD) {
                    resposta.dados = lodash.cloneDeep(ctx);
                    resposta.dados.inicioEm = inicio;
                    resposta.dados.fimEm = fim;
                    resposta.dados.tipo = enumTipo.SAIBRO;
                    resposta.disponivel = true;
                    resolve(resposta);
                } else {
                    resposta.dados = lodash.cloneDeep(ctx);
                    resposta.dados.inicioEm = inicio;
                    resposta.dados.fimEm = fim;
                    resposta.dados.tipo = enumTipo.HARD;
                    resposta.disponivel = true;
                    resolve(resposta);
                }
                resolve(resposta);
            } else {
                resposta.dados = data;
                resposta.disponivel = false;
                resolve(resposta);
            }
        })
    });
}

function validarOutraQuadraUmaHoraDepois(reserva, ctx) {
    const resposta = {};
    return new Promise((resolve, reject) => {
        let inicio = somar(ctx.inicioEm, 1);
        let fim = somar(ctx.fimEm, 1);
        reserva.find({
            where: {
                tipo: {
                    neq: ctx.tipo
                },
                and: [{
                    inicioEm: inicio
                }, {
                    fimEm: fim
                }, {
                    or: [{
                        status: enumStatus.ativo
                    }, {
                        status: enumStatus.pago
                    }]
                }]
            }
        }).then(data => {
            if (data.length === 0) {
                if (ctx.tipo === enumTipo.HARD) {
                    resposta.dados = lodash.cloneDeep(ctx);
                    resposta.dados.inicioEm = inicio;
                    resposta.dados.fimEm = fim;
                    resposta.dados.tipo = enumTipo.SAIBRO;
                    resposta.disponivel = true;
                    resolve(resposta);
                } else {
                    resposta.dados = lodash.cloneDeep(ctx);
                    resposta.dados.inicioEm = inicio;
                    resposta.dados.fimEm = fim;
                    resposta.dados.tipo = enumTipo.HARD;
                    resposta.disponivel = true;
                    resolve(resposta);
                }
                resolve(resposta);
            } else {
                resposta.dados = data;
                resposta.disponivel = false;
                resolve(resposta);
            }
        })
    });
}

function validarMesmaQuadraDuasHoraAntes(reserva, ctx) {
    const resposta = {};
    return new Promise((resolve, reject) => {
        let inicio = subtrair(ctx.inicioEm, 2);
        let fim = subtrair(ctx.fimEm, 2);
        reserva.find({
            where: {
                tipo: ctx.tipo,
                and: [{
                    inicioEm: (inicio)
                }, {
                    fimEm: (fim)
                }, {
                    or: [{
                        status: enumStatus.ativo
                    }, {
                        status: enumStatus.pago
                    }]
                }]
            }
        }).then(data => {
            if (data.length === 0) {
                resposta.dados = lodash.cloneDeep(ctx);
                resposta.dados.inicioEm = inicio;
                resposta.dados.fimEm = fim;
                resposta.disponivel = true;
                resolve(resposta);
            } else {
                resposta.dados = data;
                resposta.disponivel = false;
                resolve(resposta);
            }
        })
    });
}

function validarMesmaQuadraDuasHoraDepois(reserva, ctx) {
    const resposta = {};
    return new Promise((resolve, reject) => {
        let inicio = somar(ctx.inicioEm, 2);
        let fim = somar(ctx.fimEm, 2);
        reserva.find({
            where: {
                tipo: ctx.tipo,
                and: [{
                    inicioEm: (inicio)
                }, {
                    fimEm: (fim)
                }, {
                    or: [{
                        status: enumStatus.ativo
                    }, {
                        status: enumStatus.pago
                    }]
                }]
            }
        }).then(data => {
            if (data.length === 0) {
                resposta.dados = lodash.cloneDeep(ctx);
                resposta.dados.inicioEm = inicio;
                resposta.dados.fimEm = fim;
                resposta.disponivel = true;
                resolve(resposta);
            } else {
                resposta.dados = data;
                resposta.disponivel = false;
                resolve(resposta);
            }
        })
    });
}

module.exports = {
    validarDisponibilidade,
    validarMesmoHorarioOutraQuadra,
    validarMesmaQuadraUmaHoraAntes,
    validarMesmaQuadraUmaHoraDepois,
    validarOutraQuadraUmaHoraAntes,
    validarOutraQuadraUmaHoraDepois,
    validarMesmaQuadraDuasHoraAntes,
    validarMesmaQuadraDuasHoraDepois
}