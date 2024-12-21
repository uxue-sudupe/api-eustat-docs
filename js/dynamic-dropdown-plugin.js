const dynamicDropdownPlugin = () => ({
  components: {
    Parameters: (Original, system) => (props) => {
      // Elementos HTML que se utilizarán
      const container = document.createElement('div');
      const tableSelector = document.createElement('select');
      const dimensionsContainer = document.createElement('div');

      // Configuración inicial del selector de tablas
      tableSelector.id = 'table-selector';
      tableSelector.innerHTML = '<option value="">-- Selecciona una tabla --</option>';
      dimensionsContainer.id = 'dimensions-container';

      // Función para cargar el catálogo de tablas
      const fetchCatalog = async () => {
        try {
          const lang = "es"; // Cambia dinámicamente si es necesario
          const response = await fetch(`https://www.eustat.eus/bankupx/api/v1/${lang}/DB`);
          const data = await response.json();

          data.forEach((table) => {
            const option = document.createElement('option');
            option.value = table.id;
            option.textContent = table.text;
            tableSelector.appendChild(option);
          });
        } catch (error) {
          console.error('Error al cargar el catálogo de tablas:', error);
        }
      };

      // Función para cargar las dimensiones de una tabla seleccionada
      const fetchDimensions = async (tableId) => {
        dimensionsContainer.innerHTML = ''; // Limpia las dimensiones previas
        if (!tableId) return;

        try {
          const lang = "es"; // Cambia dinámicamente si es necesario
          const response = await fetch(`https://www.eustat.eus/bankupx/api/v1/${lang}/DB/${tableId}`);
          const data = await response.json();

          data.variables.forEach((dimension) => {
            const dimensionContainer = document.createElement('div');
            const label = document.createElement('label');
            const select = document.createElement('select');
            select.multiple = true;

            label.textContent = dimension.text;
            dimension.values.forEach((value, idx) => {
              const option = document.createElement('option');
              option.value = value;
              option.textContent = dimension.valueTexts[idx];
              select.appendChild(option);
            });

            dimensionContainer.appendChild(label);
            dimensionContainer.appendChild(select);
            dimensionsContainer.appendChild(dimensionContainer);
          });
        } catch (error) {
          console.error('Error al cargar las dimensiones:', error);
        }
      };

      // Evento de cambio en el selector de tablas
      tableSelector.addEventListener('change', (event) => {
        const selectedTable = event.target.value;
        fetchDimensions(selectedTable);
      });

      // Cargar catálogo de tablas al inicializar
      fetchCatalog();

      // Ensamblar elementos
      container.appendChild(tableSelector);
      container.appendChild(dimensionsContainer);

      // Devuelve el contenedor junto con los parámetros originales
      return (
        <>
          {container}
          <Original {...props} />
        </>
      );
    },
  },
});

