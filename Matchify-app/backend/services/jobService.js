import {
    createJobOffer,
    searchJobOffers,
    getEmpresasByIds,
    getUserById,
    getJobOfferById,
    updateJobOffer,
    deleteJobOffer,
    getJobOffersByCompany,
    getActiveJobOffers,
} from '../repositories/jobRepository.js';

// Servicio para crear una nueva oferta de empleo
export const createJobOfferService = async (jobData) => {
    try {
        const newJobOffer = await createJobOffer(jobData);
        return newJobOffer;
    } catch (error) {
        throw new Error(`Error al crear la oferta de empleo: ${error.message}`);
    }
};

// Servicio para buscar ofertas de empleo con filtros
export const searchJobOffersService = async (filters, userId) => {
    try {
        const ofertas = await searchJobOffers(filters);

        // Si no se encuentran ofertas, devolver un array vacío
        if (!ofertas.length) return [];

        // Obtener las empresas relacionadas
        const empresaIds = [...new Set(ofertas.map(oferta => oferta.empresaId))];
        const empresas = await getEmpresasByIds(empresaIds);

        // Obtener el usuario que hace la búsqueda
        const usuario = await getUserById(userId);
        if (!usuario) throw new Error('Usuario no encontrado');

        // Vincular la información de empresas y usuario a cada oferta
        const ofertasConEmpresaYUsuario = ofertas.map(oferta => ({
            ...oferta.toJSON(),
            empresa: empresas.find(empresa => empresa.id === oferta.empresaId),
            usuario: usuario.username,
        }));

        return ofertasConEmpresaYUsuario;
    } catch (error) {
        throw new Error(`Error buscando ofertas de empleo: ${error.message}`);
    }
};

export const updateJobOfferService = async (id, updatedData) => {
    try {
        // Si el campo 'estatus' está presente en los datos de actualización, se valida
        if (updatedData.estatus && !['Activo', 'Inactivo'].includes(updatedData.estatus)) {
            throw new Error('Valor de estatus inválido. Solo se permiten "Activo" o "Inactivo".');
        }

        // Intentar actualizar la oferta de trabajo
        const result = await updateJobOffer(id, updatedData);

        // Si no se actualiza ninguna fila, lanzar un error
        if (result[0] === 0) {
            throw new Error('Oferta de empleo no encontrada o no se pudo actualizar.');
        }

        return result;
    } catch (error) {
        throw new Error(`Error actualizando la oferta de empleo: ${error.message}`);
    }
};


// Servicio para eliminar una oferta de empleo
export const deleteJobOfferService = async (id) => {
    try {
        await deleteJobOffer(id);
    } catch (error) {
        throw new Error(`Error eliminando la oferta de empleo: ${error.message}`);
    }
};

// Servicio para obtener ofertas de empleo por empresa (y opcionalmente por usuario)
export const getJobOffersByCompanyService = async (empresaId, userId = null) => {
    try {
        const ofertas = await getJobOffersByCompany(empresaId, userId);
        return ofertas;
    } catch (error) {
        throw new Error(`Error obteniendo ofertas de empleo por empresa: ${error.message}`);
    }
};

// Servicio para obtener una oferta de empleo por ID
export const getJobOfferByIdService = async (id) => {
    try {
        const oferta = await getJobOfferById(id);  // Llama a la función del repositorio
        return oferta;
    } catch (error) {
        throw new Error(`Error obteniendo la oferta de empleo: ${error.message}`);
    }
};

// Servicio para obtener las ofertas de empleo activas
export const getActiveJobOffersService = async () => {
    try {
        const ofertas = await getActiveJobOffers();
        return ofertas;
    } catch (error) {
        throw new Error(`Error obteniendo ofertas activas: ${error.message}`);
    }
};


