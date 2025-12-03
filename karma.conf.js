// karma.conf.js
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      // 1) Solo cargamos la lógica “puente” en JS plano
      { pattern: 'src/**/*.logic.js', watched: true },

      // 2) Y los tests que dependen de esa lógica
      { pattern: 'src/**/*.spec.js', watched: true }
    ],

    // EXCLUYE todo lo demás (evita que se cuelen módulos con import/export)
    exclude: [
      'src/**/*.jsx',
      'src/**/*.tsx',
      'src/**/*.{test,spec}.{ts,tsx,jsx}', // por si tienes otros runner
      'src/**/*.js' // <- importante: bloquea TODOS los .js
                    // y luego incluimos explícitamente los *.logic.js arriba
    ],

    reporters: ['spec'],
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity,

    // Hace que los errores aparezcan claros en la consola
    client: { clearContext: false }
  });
};
