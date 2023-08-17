import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const C_persona_nuevo = () => {
    const options = ["Pueblo", "Servidor", "Subcoordinador", "Coordinador"];
    const [selectedOption, setSelectedOption] = useState(options[0]);
  
    const handleSelectChange = (selected) => {
      setSelectedOption(selected);
    };
    return (
        <div className="flex w-full flex-col">
          <h2 className="mb-4 text-3xl text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-whited">
            Buscar persona
          </h2>
          <div className="grid gap-6 mb-6 md:grid-cols-2 w-11/12 m-auto sm:w-3/5">
            <p className="font-bold text-[20px]">Seleccione el tipo de persona:</p>
            <Dropdown
              options={options}
              onChange={handleSelectChange}
              value={selectedOption}
            />
            <Input
              type="text"
              label="Nombre completo"
              placeholder="Ingrese el nombre completo"
            />
            <Input
              type="text"
              label="Teléfono"
              placeholder="Ingrese el número de teléfono"
            />
            <Input type="text" label="Trabaja en..." placeholder="Trabajo" />
            <Input
              type="text"
              label="Dirección"
              placeholder="Ingrese una dirección"
            />
          </div>
        </div>
      );
}

export default C_persona_nuevo