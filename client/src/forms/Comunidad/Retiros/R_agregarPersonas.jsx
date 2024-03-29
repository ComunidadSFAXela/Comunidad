import React, { useEffect, useState } from "react";
import {
  Button,
  Select,
  SelectItem,
  Card,
  CardHeader,
  CardFooter,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import "react-dropdown/style.css";
import toast, { Toaster } from "react-hot-toast";
import API_URL from "../../../config.js";
import Loading from "../../../components/Loading.jsx";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const R_agregarPersonas = () => {
  const [valueretiro, setValueretiro] = useState(new Set([]));
  const [retiroes, setretiroes] = useState([]);
  const [popOver, setPopOver] = useState(false);

  ///////////////////////////////
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [personSelected, setPersonSelected] = useState();

  const [loading, setLoading] = useState(false);

  const [resultadosPersonas, setResultadosPersonas] = useState([]);

  //fetch para cargar las retiroes
  const buscarretiro = async () => {
    try {
      const response = await fetch(`${API_URL}/retiro/getallname`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        toast.error("Error al obtener la lista de retiroes");
        throw new Error("Error al filtrar las retiroes", {});
      }

      const data = await response.json();
      setretiroes(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    buscarretiro();
  }, []);

  // filtrar por retiro
  const handleBuscarPorretiro = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/persona/getrbyretiro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idretiro: valueretiro.currentKey,
        }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error al filtrar las retiroes", {});
      }
      const data = await response.json();
      setResultadosPersonas(data);
      console.log(data);
      toast.success("Persona por retiro filtrado con éxito");
      setLoading(false);
    } catch (error) {
      toast.error("Error al filtrar las retiroes");
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="flex w-full flex-col h-screen ">
      <Toaster />
      <h2 className="my-4 text-3xl text-center font-extrabold leading-none tracking-tight md:text-5xl lg:text-3xl">
        Filtrar por retiro
      </h2>
      <div className="grid mx-auto gap-6  w-11/12 sm:w-3/5 sm:grid-cols-2">
        <p className="font-bold text-[18px] sm:hidden -mb-2 ">Seleccione el retiro:</p>
        <Select
          label="Retiro"
          variant="bordered"
          placeholder="Seleccione una retiro o Célula"
          selectedKeys={valueretiro}
          className="max-w-xs mx-auto"
          onSelectionChange={setValueretiro}
        >
          {retiroes.length > 0 ? (
            retiroes.map((retiro) => (
              <SelectItem key={retiro?._id} value={retiro?.nombreRetiro} s>
                {retiro?.nombreRetiro ?? ""}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="cargando" text="Cargando retiroes..." disabled />
          )}
        </Select>

        <Button color="primary" onClick={handleBuscarPorretiro} className="sm:h-full">
          Filtrar
        </Button>
      </div>
      <Divider className="my-5" />

      {loading ? (
        <Loading />
      ) : resultadosPersonas.length > 0 ? (
        <>
          <h1 className="text-3xl font-bold mx-auto mb-6 text-center">Personas que están en este retiro</h1>
          <div className="flex w-full flex-row flex-wrap gap-4 pb-5">
            {resultadosPersonas?.map((persona, idx) => (
              <div
                key={idx}
                className="m-auto min-w-[300px] max-w-[500px] sm:min-w-[500px] cursor-pointer dark:border-white border-1 rounded-xl"
                onClick={() => {
                  setPersonSelected(persona);
                  onOpen();
                }}
              >
                <Card className="w-full h-full grid center  hover:bg-neutral-200 dark:hover:bg-neutral-700">
                  <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                      <p className="text-md">
                        <b>Nombre:</b> {persona?.nombre ?? ""}
                      </p>
                      <p className="text-md">
                        <b>Comunidad:</b> {persona?.idcomunidad.nombreComunidad ?? ""}
                      </p>
                      <p className="text-md">
                        <b>Teléfono:</b> {persona?.telefono ?? ""}
                      </p>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardFooter>
                    <p className="text-md">
                      <b>Dones:</b> {persona?.dones?.length > 0 ? persona?.dones?.join(", ") ?? "" : "N/A - "}
                    </p>
                    <p className="w-3/12"></p>
                    <p className="text-md">
                      <b> Tipo:</b> {persona?.tipo ?? ""}
                    </p>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="mx-auto my-10">No hay resultados</p>
      )}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{personSelected?.nombre ?? ""}</ModalHeader>
              <ModalBody>
                <Table removeWrapper isStriped aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn className="font-bold text-xl">Campos</TableColumn>
                    <TableColumn className="font-bold text-xl">Datos</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow key="1">
                      <TableCell className="font-bold">Nombre</TableCell>
                      <TableCell>{personSelected?.nombre ?? ""}</TableCell>
                    </TableRow>
                    <TableRow key="2">
                      <TableCell className="font-bold">Teléfono</TableCell>
                      <TableCell>{personSelected?.telefono ?? ""}</TableCell>
                    </TableRow>
                    <TableRow key="3">
                      <TableCell className="font-bold">Tipo</TableCell>
                      <TableCell>{personSelected?.tipo ?? ""}</TableCell>
                    </TableRow>
                    <TableRow key="4">
                      <TableCell className="font-bold">Trabaja en</TableCell>
                      <TableCell>{personSelected?.trabajaen ?? ""}</TableCell>
                    </TableRow>
                    <TableRow key="5">
                      <TableCell className="font-bold">Dirección</TableCell>
                      <TableCell>{personSelected?.direccion ?? ""}</TableCell>
                    </TableRow>
                    <TableRow key="6">
                      <TableCell className="font-bold">Comunidad</TableCell>
                      <TableCell>{personSelected?.idcomunidad?.nombreComunidad ?? ""}</TableCell>
                    </TableRow>
                    <TableRow key="7">
                      <TableCell className="font-bold">Dones</TableCell>
                      <TableCell>
                        {personSelected?.dones?.length > 0 ? personSelected?.dones?.join(", ") ?? "" : "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow key="8">
                      <TableCell className="font-bold">Retiros</TableCell>
                      <TableCell>
                        {personSelected?.retiros?.length > 0 &&
                          personSelected?.retiros.map((retiro, index) => (
                            <div key={index}>
                              <p className="font-bold">{retiro.idretiro?.nombreRetiro}</p>
                              <p>Q. {retiro?.cuota?.join(", Q. ")}</p>
                            </div>
                          ))}
                      </TableCell>
                    </TableRow>
                    <TableRow key="9">
                      <TableCell className="font-bold">Crecimientos</TableCell>
                      <TableCell>
                        {personSelected?.crecimientos?.length > 0 &&
                          personSelected.crecimientos.map((crecimiento, index) => (
                            <div key={index}>
                              <p className="font-bold">{crecimiento?.idcursocreci?.nombreCursoCreci}</p>
                              <p>Q. {crecimiento?.cuota?.join(", Q. ")}</p>
                            </div>
                          ))}
                      </TableCell>
                    </TableRow>
                    <TableRow key="10">
                      <TableCell className="font-bold">Fecha primer retiro</TableCell>
                      <TableCell>
                        {personSelected?.fechainicio
                          ? format(new Date(personSelected?.fechainicio), "EEEE d 'de' MMMM 'de' yyyy", {
                              locale: es,
                            })
                          : ""}
                      </TableCell>
                    </TableRow>
                    <TableRow key="11">
                      <TableCell className="font-bold">Fecha primer Crecimiento</TableCell>
                      <TableCell>
                        {personSelected?.fechacreci
                          ? format(new Date(personSelected?.fechacreci), "EEEE d 'de' MMMM 'de' yyyy", {
                              locale: es,
                            })
                          : ""}
                      </TableCell>
                    </TableRow>
                    <TableRow key="12">
                      <TableCell className="font-bold">Fecha empezó a ser Servidor</TableCell>
                      <TableCell>
                        {personSelected?.fechaservi
                          ? format(new Date(personSelected?.fechaservi), "EEEE d 'de' MMMM 'de' yyyy", {
                              locale: es,
                            })
                          : ""}
                      </TableCell>
                    </TableRow>
                    <TableRow key="13">
                      <TableCell className="font-bold">Fecha empezó a ser Subcoordinador</TableCell>
                      <TableCell>
                        {personSelected?.fechainicio
                          ? format(new Date(personSelected?.fechainicio), "EEEE d 'de' MMMM 'de' yyyy", {
                              locale: es,
                            })
                          : ""}
                      </TableCell>
                    </TableRow>
                    <TableRow key="14">
                      <TableCell className="font-bold">Fecha empezó a ser Coordinador</TableCell>
                      <TableCell>
                        {personSelected?.fechacordi
                          ? format(new Date(personSelected?.fechacordi), "EEEE d 'de' MMMM 'de' yyyy", {
                              locale: es,
                            })
                          : ""}
                      </TableCell>
                    </TableRow>
                    <TableRow key="15">
                      <TableCell className="font-bold">Permisos</TableCell>
                      <TableCell>
                        {personSelected?.permisos?.length > 0 &&
                          personSelected.permisos?.map((permiso, index) => (
                            <div key={index}>
                              <p className="font-bold">{permiso?.descripcion}</p>
                              <p>
                                {permiso?.fecha
                                  ? format(new Date(permiso.fecha), "EEEE d 'de' MMMM 'de' yyyy", {
                                      locale: es,
                                    })
                                  : ""}
                              </p>
                            </div>
                          ))}
                      </TableCell>
                    </TableRow>
                    <TableRow key="16">
                      <TableCell className="font-bold">Observaciones</TableCell>
                      <TableCell>{personSelected?.observaciones ?? ""}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
export default R_agregarPersonas;
