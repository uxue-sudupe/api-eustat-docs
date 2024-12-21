const dynamicDropdownPlugin = () => ({
  components: {
    Parameters: (Original, system) => (props) => {
      const [tables, setTables] = React.useState([]); // Almacena las tablas disponibles
      const [dimensions, setDimensions] = React.useState([]); // Almacena las dimensiones de la tabla seleccionada
      const [selectedTable, setSelectedTable] = React.useState(null); // Tabla seleccionada
      const lang = "es"; // Idioma predeterminado, se puede personalizar

      // Obtén las tablas al cargar la página
      React.useEffect(() => {
        fetch(`https://www.eustat.eus/bankupx/api/v1/${lang}/DB`)
          .then((response) => response.json())
          .then((data) => setTables(data))
          .catch((error) => console.error("Error fetching tables:", error));
      }, []);

      // Obtén las dimensiones de la tabla seleccionada
      const fetchDimensions = (tableId) => {
        fetch(`https://www.eustat.eus/bankupx/api/v1/${lang}/DB/${tableId}`)
          .then((response) => response.json())
          .then((data) => setDimensions(data.variables || []))
          .catch((error) => console.error("Error fetching dimensions:", error));
      };

      // Maneja la selección de una tabla
      const handleTableChange = (event) => {
        const tableId = event.target.value;
        setSelectedTable(tableId);
        fetchDimensions(tableId); // Obtén las dimensiones de la tabla seleccionada
      };

      return (
        <div>
          {/* Selector de tablas */}
          <div>
            <label htmlFor="tableSelector">Selecciona una tabla:</label>
            <select id="tableSelector" onChange={handleTableChange}>
              <option value="">-- Selecciona una tabla --</option>
              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.text}
                </option>
              ))}
            </select>
          </div>

          {/* Desplegables de dimensiones */}
          {selectedTable && dimensions.length > 0 && (
            <div>
              <h3>Dimensiones de la tabla seleccionada:</h3>
              {dimensions.map((dimension) => (
                <div key={dimension.code}>
                  <label>{dimension.text}</label>
                  <select multiple>
                    {dimension.values.map((value, idx) => (
                      <option key={value} value={value}>
                        {dimension.valueTexts[idx]}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Render original de parámetros */}
          <Original {...props} />
        </div>
      );
    },
  },
});
