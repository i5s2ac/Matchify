import CandidatoOferta from '../models/CandidatoOferta.js';
import Empresa from "../models/Empresa.js";
import OfertaEmpleo from "../models/OfertaEmpleo.js";
import User from "../models/User.js"; // Verifica que el archivo de User esté bien ubicado

// Buscar todas las candidaturas por empresa
export const findAllCandidatosByEmpresa = async (empresaId) => {
    return await CandidatoOferta.findAll({
        include: [
            {
                model: OfertaEmpleo,
                as: 'ofertaEmpleo',  // Asegúrate de que la asociación esté correctamente configurada
                where: { empresaId }, // Filtrar por `empresaId` en la tabla `OfertaEmpleo`
            },
            {
                model: User,
                as: 'candidato', // Incluir los datos del usuario que aplicó
                attributes: ['id', 'username', 'email'] // Asegúrate de seleccionar los campos necesarios
            }
        ]
    });
};

// Buscar un candidato por su ID
export const findCandidatoById = async (candidatoId) => {
    return await CandidatoOferta.findByPk(candidatoId);
};

// Actualizar el estado de un candidato
export const updateCandidatoStatus = async (candidatoId, estado) => {
    const candidato = await findCandidatoById(candidatoId);
    if (!candidato) {
        throw new Error('Candidato no encontrado');
    }
    candidato.estado = estado;
    await candidato.save();
    return candidato;
};

// Verificar si el usuario ya ha aplicado a una oferta
export const checkApplication = async (usuarioId, ofertaEmpleoId) => {
    return await CandidatoOferta.findOne({
        where: { usuarioId, ofertaEmpleoId },
    });
};

// Aplicar a una oferta de empleo
export const applyToJobOffer = async (usuarioId, ofertaEmpleoId) => {
    return await CandidatoOferta.create({
        usuarioId,
        ofertaEmpleoId,
        estado: 'pendiente', // Estado inicial
    });
};

export const getApplicationCountsByStatusFromDB = async (usuarioId) => {
    try {
        console.log(`Obteniendo conteos para usuarioId: ${usuarioId}`);

        // Contar las solicitudes aceptadas
        const countAceptadas = await CandidatoOferta.count({
            where: { usuarioId, estado: 'aceptada' }
        });

        // Contar las solicitudes rechazadas
        const countRechazadas = await CandidatoOferta.count({
            where: { usuarioId, estado: 'rechazada' }
        });

        // Contar las solicitudes pendientes
        const countPendientes = await CandidatoOferta.count({
            where: { usuarioId, estado: 'pendiente' }
        });

        // Retornar los resultados en un formato que puedas usar fácilmente en el frontend
        return [
            { estado: 'aceptada', cantidad: countAceptadas },
            { estado: 'rechazada', cantidad: countRechazadas },
            { estado: 'pendiente', cantidad: countPendientes },
        ];

    } catch (error) {
        console.error('Error al obtener los conteos de la base de datos:', error); // Depuración detallada
        throw new Error('Error al obtener los conteos de las solicitudes.');
    }
};
