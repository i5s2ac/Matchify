// seeders/industrias.cjs
const mongoose = require('mongoose');

const seedData = [
    {
        nombre: 'Tecnología',
        descripcion: 'Industria enfocada en el desarrollo y aplicación de tecnologías.',
        codigo: 'TEC001',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        nombre: 'Salud',
        descripcion: 'Sector de la salud y servicios médicos.',
        codigo: 'SAL002',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        nombre: 'Finanzas',
        descripcion: 'Sector financiero y de servicios bancarios.',
        codigo: 'FIN003',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        nombre: 'Educación',
        descripcion: 'Sector educativo y formación académica.',
        codigo: 'EDU004',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        nombre: 'Transporte',
        descripcion: 'Industria de transporte y logística.',
        codigo: 'TRA005',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        nombre: 'Alimentación',
        descripcion: 'Industria de producción y distribución de alimentos.',
        codigo: 'ALI006',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        nombre: 'Construcción',
        descripcion: 'Sector de construcción e infraestructura.',
        codigo: 'CON007',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        nombre: 'Energía',
        descripcion: 'Industria de producción y distribución de energía.',
        codigo: 'ENE008',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        nombre: 'Manufactura',
        descripcion: 'Sector de fabricación y manufactura de productos.',
        codigo: 'MAN009',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        nombre: 'Turismo',
        descripcion: 'Industria de servicios turísticos y recreación.',
        codigo: 'TUR010',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

async function seedDatabase() {
    try {
        // Conecta a la base de datos con autenticación
        await mongoose.connect('mongodb://test:test@localhost:27017/Matchify', {
            authSource: "admin", // Si se requiere, especifica la base de datos de autenticación
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Conectado a MongoDB");

        // Importación dinámica de Industria
        const { default: Industria } = await import('../models/Industria.js');

        // Elimina los documentos existentes en la colección
        await Industria.deleteMany({});
        console.log("Colección 'industrias' limpiada");

        // Inserta los datos de seed
        await Industria.insertMany(seedData);
        console.log("Datos de seed insertados correctamente");
    } catch (error) {
        console.error("Error en la operación de seeding:", error);
    } finally {
        mongoose.connection.close();
    }
}

seedDatabase();
