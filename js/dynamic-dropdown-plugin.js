const dynamicDropdownPlugin = () => ({
  components: {
    Parameters: (Original, system) => (props) => {
      const [dimensions, setDimensions] = React.useState([]);
      const [selectedValues, setSelectedValues] = React.useState({});

      React.useEffect(() => {
        // Obtén el idioma y el ID de la tabla desde los parámetros de la URL
        const lang = system.getState().spec.json.paths["/{lang}/DB/{id}"].parameters[0].schema.default;
        const tableId = "id_de_la_tabla"; // Sustituir por un ID dinámico según sea necesario

        // Solicita los metadatos de la tabla
        fetch(`https://www.eustat.eus/bankupx/api/v1/${lang}/DB/${tableId}`)
          .then((response) => response.json())
          .then((data) => setDimensions(data.variables || []));
      }, []);

      // Maneja los cambios en los valores seleccionados
      const handleSelectionChange = (code, values) => {
        setSelectedValues((prev) => ({ ...prev, [code]: values }));
      };

      return (
        <>
          {dimensions.map((dimension) => (
            <div key={dimension.code}>
              <label>{dimension.text}</label>
              <select
                multiple
                onChange={(e) =>
                  handleSelectionChange(
                    dimension.code,
                    Array.from(e.target.selectedOptions, (option) => option.value)
                  )
                }
              >
                {dimension.values.map((value, idx) => (
                  <option key={value} value={value}>
                    {dimension.valueTexts[idx]}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <Original {...props} />
        </>
      );
    },
  },
});
