import CandidatoOferta from '../models/CandidatoOferta.js';
import Empresa from "../models/Empresa.js";
import OfertaEmpleo from "../models/OfertaEmpleo.js";
import User from "../models/User.js"; // Verifica que el archivo de User esté bien ubicado

// Buscar todas las candidaturas por empresa
export const findAllCandidatosByEmpresa = async (empresaId) => {
    try {
        return await CandidatoOferta.find({
            'ofertaEmpleo.empresaId': empresaId
        }).populate([
            {
                path: 'ofertaEmpleo',
                match: { empresaId: empresaId }
            },
            {
                path: 'candidato',
                select: ['id', 'username', 'email']
            }
        ]);
    } catch (error) {
        throw new Error(`Error al buscar candidatos por empresa: ${error.message}`);
    }
};

// Buscar un candidato por su ID
export const findCandidatoById = async (candidatoId) => {
    try {
        return await CandidatoOferta.findById(candidatoId);
    } catch (error) {
        throw new Error(`Error al buscar candidato por ID: ${error.message}`);
    }
};

// Actualizar el estado de un candidato
export const updateCandidatoStatus = async (candidatoId, estado) => {
    try {
        const candidato = await findCandidatoById(candidatoId);
        if (!candidato) {
            throw new Error('Candidato no encontrado');
        }
        candidato.estado = estado;
        await candidato.save();
        return candidato;
    } catch (error) {
        throw new Error(`Error al actualizar el estado del candidato: ${error.message}`);
    }
};

// Verificar si el usuario ya ha aplicado a una oferta
export const checkApplication = async (usuarioId, ofertaEmpleoId) => {
    try {
        return await CandidatoOferta.findOne({
            usuarioId: usuarioId,
            ofertaEmpleoId: ofertaEmpleoId
        });
    } catch (error) {
        throw new Error(`Error al verificar la aplicación: ${error.message}`);
    }
};

// Aplicar a una oferta de empleo
export const applyToJobOffer = async (usuarioId, ofertaEmpleoId) => {
    try {
        return await CandidatoOferta.create({
            usuarioId,
            ofertaEmpleoId,
            estado: 'pendiente'
        });
    } catch (error) {
        throw new Error(`Error al aplicar a la oferta de empleo: ${error.message}`);
    }
};

// Obtener conteos de aplicaciones por estado
export const getApplicationCountsByStatusFromDB = async (usuarioId) => {
    try {
        const countAceptadas = await CandidatoOferta.countDocuments({
            usuarioId: usuarioId,
            estado: 'aceptada'
        });
        const countRechazadas = await CandidatoOferta.countDocuments({
            usuarioId: usuarioId,
            estado: 'rechazada'
        });
        const countPendientes = await CandidatoOferta.countDocuments({
            usuarioId: usuarioId,
            estado: 'pendiente'
        });

        return [
            { estado: 'aceptada', cantidad: countAceptadas },
            { estado: 'rechazada', cantidad: countRechazadas },
            { estado: 'pendiente', cantidad: countPendientes }
        ];
    } catch (error) {
        console.error('Error al obtener los conteos de la base de datos:', error);
        throw new Error('Error al obtener los conteos de las solicitudes.');
    }
};
