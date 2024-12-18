// seeders/20241108234406-demo-industria.cjs

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('industrias', [
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
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('industrias', null, {});
  }
};
