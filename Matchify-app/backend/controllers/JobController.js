import {
    createJobOffer,
    searchJobOffers,
    getEmpresasByIds,
    getUserById,
    getJobOfferById,
    updateJobOffer,
    deleteJobOffer,
    getJobOffersByCompany,
} from '../repositories/jobRepository.js';


import OfertaEmpleo from '../models/OfertaEmpleo.js';  // Asegúrate de que la ruta sea correcta

export const createJobOfferController = async (req, res) => {
    const {
        titulo,
        descripcion,
        empresaId,
        userId,
        fechaCierre,
        tags,
        modalidad,
        tipoTrabajo,
        Funciones_Requerimiento,
        Estudios_Requerimiento,
        Experiencia_Requerimiento,
        Conocimientos_Requerimiento,
        Competencias_Requerimiento,
    } = req.body;

    // Validar campos obligatorios
    if (!titulo || !descripcion || !empresaId || !userId) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
    }

    // Validar que la fecha de cierre sea mayor a la fecha actual
    if (fechaCierre && new Date(fechaCierre) <= new Date()) {
        return res.status(400).json({ success: false, message: 'La fecha de cierre debe ser posterior a la fecha actual.' });
    }

    // Validar que los tags sean un array
    if (tags && !Array.isArray(tags)) {
        return res.status(400).json({ success: false, message: 'Los tags deben ser un arreglo.' });
    }

    try {
        // Crear una nueva oferta de trabajo
        const nuevaOferta = await OfertaEmpleo.create({
            titulo,
            descripcion,
            empresaId,
            userId,
            tags: tags || [], // Manejar tags opcionalmente
            fechaPublicacion: new Date(), // Asignar la fecha de publicación actual
            estatus: 'Activo',
            fechaCierre,
            modalidad,
            tipoTrabajo,
            Funciones_Requerimiento,
            Estudios_Requerimiento,
            Experiencia_Requerimiento,
            Conocimientos_Requerimiento,
            Competencias_Requerimiento,
        });

        // Responder con éxito
        return res.status(201).json({ success: true, oferta: nuevaOferta });
    } catch (error) {
        // Mostrar detalles del error en la consola
        console.error('Error al crear la oferta de empleo:', error);

        // Verificar si es un error de validación de Sequelize
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ success: false, message: 'Error de validación', errors: error.errors });
        }

        // Responder con un mensaje de error genérico
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};


// Buscar ofertas de empleo con filtros
export const searchJobOffersController = async (req, res) => {
    const { q, ubicacion, tipoTrabajo, modalidad } = req.query;
    const userId = req.query.userId;

    try {
        const filters = {
            estatus: 'Activo',
            ...(q && { titulo: { [Op.iLike]: `%${q}%` } }),
            ...(ubicacion && { ubicacion: { [Op.iLike]: `%${ubicacion}%` } }),
            ...(tipoTrabajo && { tipoTrabajo }),
            ...(modalidad && { modalidad }),
        };

        const ofertas = await searchJobOffers(filters);
        if (!ofertas.length) {
            return res.status(200).json({ success: true, ofertas: [] });
        }

        const empresaIds = [...new Set(ofertas.map(oferta => oferta.empresaId))];
        const empresas = await getEmpresasByIds(empresaIds);

        const usuario = await getUserById(userId);
        if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

        const ofertasConEmpresaYUsuario = ofertas.map(oferta => ({
            ...oferta.toJSON(),
            empresa: empresas.find(empresa => empresa.id === oferta.empresaId),
            usuario: usuario.username,
        }));

        return res.status(200).json({ success: true, ofertas: ofertasConEmpresaYUsuario });
    } catch (error) {
        console.error('Error fetching job offers:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Actualizar una oferta de empleo
export const updateJobOfferController = async (req, res) => {
    if (req.method === 'PUT') {
        const { id } = req.params;
        const updatedData = req.body;

        try {
            const oferta = await updateJobOffer(id, updatedData);
            return res.status(200).json({ success: true, oferta });
        } catch (error) {
            console.error('Error updating job offer:', error);
            return res.status(500).json({ success: false, message: error.message });
        }
    } else {
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }
};

// Eliminar una oferta de empleo
export const deleteJobOfferController = async (req, res) => {
    const { id } = req.params;

    if (req.method === 'DELETE') {
        try {
            await deleteJobOffer(id);
            return res.status(200).json({ success: true, message: 'Job offer deleted' });
        } catch (error) {
            console.error('Error deleting job offer:', error);
            return res.status(500).json({ success: false, message: error.message });
        }
    } else {
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }
};

// Obtener ofertas de empleo por empresaId
export const getJobOffersByCompanyController = async (req, res) => {
    const { empresaId, userId } = req.query;

    try {
        const ofertas = await getJobOffersByCompany(empresaId, userId);
        return res.status(200).json({ success: true, ofertas });
    } catch (error) {
        console.error('Error fetching job offers:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};
