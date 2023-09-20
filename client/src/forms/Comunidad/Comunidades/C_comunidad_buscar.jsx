import React, { useState } from "react";
import {
  Input,
  Button,
  Card,
  CardHeader,
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
} from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import API_URL from "../../../config.js";
import Loading from "../../../components/Loading.jsx";
import { Link as Linky } from "react-router-dom";

const C_comunidad_buscar = () => {
  const [loading, setLoading] = useState(false);
  const [resultadosRetiros, setResultadosRetiros] = useState([]);
  const [nombreRetiroUS, setNombreRetiroUS] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [retiroSelected, setRetiroSelected] = useState();

  // filtrar por comunidad
  const handleBuscarPorComunidad = async () => {
    if (nombreRetiroUS === "") return toast.error("Ingrese el nombre del retiro");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/comunidad/getbyname`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreComunidad: nombreRetiroUS,
        }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error al filtrar las comunidades", {});
      }
      const data = await response.json();
      setResultadosRetiros(data);
      setLoading(false);
    } catch (error) {
      toast.error("Error al filtrar las comunidades");
      setLoading(false);
      console.log(error);
    }
  };

  const formatfecha = (fechaRecibo) => {
    const date = new Date(fechaRecibo);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const formatYear = (fechaRecibo) => {
    const date = new Date(fechaRecibo);
    const year = date.getFullYear();
    return `${year}`;
  };

  return (
    <>
      <Toaster />
      <div className="flex w-full flex-col h-screen ">
        <h2 className="my-4 text-3xl text-center font-extrabold leading-none tracking-tight md:text-5xl lg:text-3xl dark:text-whited">
          Buscar Comunidad
        </h2>
        <div className="grid gap-6 mb-6 md:grid-cols-2 w-11/12 mx-auto  sm:w-3/5 ">
          <Input
            type="text"
            isRequired
            label="Nombre de la comunidad"
            autoComplete="nope"
            placeholder="Ingrese nombre de la comunidad"
            onChange={(e) => setNombreRetiroUS(e.target.value)}
          />
          <Button color="primary" className="w-11/12 sm:w-3/5 mx-auto sm:h-full" onClick={handleBuscarPorComunidad}>
            Filtrar
          </Button>
        </div>
        <Divider className="my-5" />
        {loading ? (
          <Loading />
        ) : resultadosRetiros.length > 0 ? (
          <>
            <div className="gap-2 pb-5 mx-auto sm:grid-cols-2 sm:grid flex w-full flex-row flex-wrap">
              {resultadosRetiros?.map((retiro, idx) => (
                <div
                  key={idx}
                  className="mx-auto min-w-[300px] w-[320px] max-w-[500px] sm:min-w-[500px] cursor-pointer dark:border-white border-1 rounded-xl  "
                  onClick={() => {
                    setRetiroSelected(retiro);
                    onOpen();
                  }}
                >
                  <Card className="w-full h-full grid center hover:bg-neutral-200 dark:hover:bg-neutral-700">
                    <CardHeader className="flex">
                      <div className="flex items-center">
                        <div className="w-[40px]">
                          {retiro.tipo === "Comunidad" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="150" fill="current">
                              <path
                                d="M252.018 219.04q1.76 0 3.401.772.772.361 1.073.361.217 0 .7-.108.156-.036.349-.036.627 0 1.098.579 1.158 1.399 1.158 3.473 0 1.459-1.001 2.135-.543.362-1.219.362-.615 0-1.001-.266-.385-.265-.747-.941-.519-.952-.845-1.368-.325-.417-.796-.754-1.169-.82-2.448-.82-1.242 0-1.972.898-.729.899-.729 2.406 0 2.075 1.049 3.799 1.423 2.304 4.076 2.304.977 0 1.936-.326.959-.325 1.49-.844.458-.434.747-.434.422 0 .724.392.301.392.301.947 0 .699-.422 1.567-.422.869-1.013 1.363-.253.205-1.049.362-.458.085-1.218.446-1.785.857-3.715.857-2.014 0-4.016-.905-2.328-1.049-3.678-3.22-1.327-2.111-1.327-4.414 0-2.678 1.664-4.885 1.448-1.917 3.775-2.93 1.773-.772 3.655-.772Zm16.022 4.776q2.207 0 3.871 1.145 1.194.821 1.918 2.135.747 1.375.747 2.871 0 2.617-2.4 4.45-2.291 1.749-5.246 1.749-2.882 0-4.667-1.641-1.737-1.592-1.737-4.148 0-2.847 2.123-4.656 2.219-1.905 5.391-1.905Zm-.965 2.786q-.531 0-.85.392-.32.392-.32 1.043 0 .723.271 1.972.272 1.248.646 2.213.373.989 1.218.989 1.073 0 1.073-1.363 0-1.013-.271-2.304-.272-1.29-.658-2.098-.398-.82-1.109-.844Zm14.224-2.69q.687 0 .687.977v.205q-.012.193-.012.314 0 .651.386.651.205 0 .639-.519.651-.747 1.64-1.188.989-.44 2.026-.44 2.015 0 2.799 1.472.301.542.494.542.133 0 .627-.482 1.568-1.532 3.558-1.532 1.556 0 2.545.856 1.037.893 1.037 2.678 0 .386-.024 1.302-.024.314-.024 1.894 0 1.013-.012 1.423-.012.253-.012.362 0 .772.482 1.351.289.349.356.464.066.115.066.308 0 1.543-3.63 1.543-1.604 0-2.587-.386-.983-.386-.983-1.013 0-.241.066-.368.067-.126.465-.669.374-.494.374-3.292 0-1.629-.23-2.268-.265-.76-1.061-.76-.398 0-.705.248-.308.247-.405.621-.108.434-.12 2.315.036 2.026.127 2.461.09.434.609 1.206.12.181.12.458 0 1.435-3.751 1.435-2.255 0-3.039-.337-.627-.266-.627-.941 0-.302.078-.422.079-.121.537-.555.265-.253.344-.476.078-.224.114-.815.085-1.326.085-2.677 0-2.364-1.206-2.364-.905 0-1.074 1.013-.144.953-.144 2.726 0 1.327.054 1.737.054.41.295.856.29.519.29.844 0 .784-1.098 1.086-1.194.325-2.629.325-1.857 0-2.726-.295-.868-.296-.868-.935 0-.241.115-.41.114-.169.524-.531.543-.494.627-1.363.133-1.495.133-3.099 0-1.146-.114-1.598-.115-.452-.489-.73-.362-.277-.464-.422-.103-.145-.103-.398 0-.808 1.267-1.278 3.051-1.098 4.571-1.11Zm24.572.603v6.537q0 2.099 1.387 2.099.35 0 .687-.199.338-.199.471-.489.265-.579.265-2.581 0-1.978-.133-2.701-.048-.302-.169-.441-.12-.138-.458-.319-.687-.362-.687-.917 0-.748 1.182-1.037 2.243-.555 4.426-.555 1.218 0 1.218 1.291 0 .132-.012.542-.024.579-.036 1.411v5.319q0 .41.699.748.591.289.591.844 0 1.086-2.569 1.677-1.507.349-2.918.349-.579 0-.79-.132-.211-.133-.248-.519-.06-.748-.458-.748-.145 0-.265.067-.121.066-.736.488-1.218.832-2.617.832-2.316 0-3.268-1.338-.809-1.122-.809-3.775 0-.989.013-1.689v-.555q0-1.037-.187-1.525-.187-.489-.682-.766-.47-.241-.597-.386-.126-.145-.126-.398 0-.917 1.387-1.218 2.363-.519 4.727-.519.712 0 .712.603Zm24.76 3.763.169 4.245q.024.483.15.712.127.229.742.88.181.193.181.543 0 .796-.953 1.11-.953.313-3.401.313-1.664 0-2.352-.289-.711-.302-.711-.977 0-.241.072-.356.072-.114.482-.561.483-.506.483-3.377 0-1.664-.386-2.46-.314-.639-1.158-.639-.808 0-1.109.518-.302.519-.302 1.882v2.388q0 .711.091.977.09.265.597 1.025.132.217.132.494 0 .712-.989 1.05-.989.337-3.087.337-3.353 0-3.353-1.387 0-.289.102-.44.103-.151.489-.428.313-.229.398-.525.084-.295.157-1.453.084-1.375.084-2.882 0-.833-.127-1.092-.126-.259-.729-.633-.519-.326-.519-.796 0-.483.422-.79.422-.308 1.737-.778 1.158-.41 2.231-.693 1.074-.284 1.472-.284.361 0 .609.265.247.266.247.628 0 .036-.012.301-.012.097-.012.169 0 .579.482.579.29 0 .615-.458 1.037-1.496 3.015-1.496 1.52 0 2.605.796.76.567 1.062 1.333.301.766.374 2.249Zm8.649-3.618v7.007q0 .832.151 1.218.15.386.609.712.374.265.5.452.127.187.127.476 0 1.556-3.944 1.556-2.123 0-3.365-.337-.422-.121-.681-.423-.26-.301-.26-.687 0-.326.133-.507.133-.18.675-.578.374-.278.531-.905.157-.627.157-1.869 0-.398-.054-1.49-.055-1.091-.079-1.272-.072-.495-.675-.76-.748-.326-.748-.965 0-.76.977-1.134 1.351-.518 2.894-.88 1.544-.362 2.388-.362.664 0 .664.748Zm-2.388-5.283q1.049 0 1.664.392t.615 1.056q0 .928-.928 1.471-1.472.856-3.558.856-.881 0-1.399-.337-.7-.435-.7-1.206 0-1.038 1.484-1.629 1.507-.603 2.822-.603Zm18.583.965v11.011q0 .941.078 1.207.079.265.441.518.434.302.585.531.15.229.15.555 0 .964-1.941 1.471-1.749.446-3.498.446-.386 0-.501-.114-.114-.115-.15-.549-.061-.615-.434-.615-.205 0-.64.362-1.23 1.001-2.737 1.001-1.87 0-3.365-1.387-.881-.832-1.423-1.918-.724-1.411-.724-2.858 0-1.701.941-3.281.868-1.459 2.364-2.243 1.254-.651 2.472-.651 1.399 0 2.509.627.18.096.289.096.386 0 .386-1.037 0-.446-.211-.681-.211-.235-.754-.404-.76-.242-.76-.845 0-.88 1.749-1.374 3.088-.857 4.137-.857 1.037 0 1.037.989Zm-6.549 6.067q-.784 0-1.242.832-.615 1.109-.615 2.918 0 1.641.591 2.473.422.603 1.146.603.783 0 1.139-.911.356-.91.356-2.936 0-1.858-.422-2.473-.326-.482-.953-.506Zm15.41-2.593q2.098 0 3.558 1.061.771.567 1.079 1.296.308.73.308 2.009l-.025 1.797q0 1.869.266 2.424.132.265.253.337.121.073.507.133.386.06.386.507 0 .579-.465 1.206-.464.627-1.2 1.049-.904.531-1.893.531-1.267 0-2.002-.869-.254-.313-.471-.313-.241 0-.639.301-1.206.881-2.738.881-1.58 0-2.557-.676-.639-.446-1.013-1.164-.374-.717-.374-1.501 0-1.254 1.014-2.219 1.579-1.52 4.727-1.532.7 0 .881-.139.181-.138.181-.645 0-1.278-.266-1.851-.265-.573-.868-.573-.362 0-.645.217-.284.217-.706.796-1.073 1.532-2.243 1.532-.591 0-.965-.35t-.374-.917q0-.579.465-1.157.464-.579 1.26-1.014 2.183-1.157 4.559-1.157Zm-.808 6.983q-.531 0-.923.434t-.392 1.037q0 .579.277.935.278.356.736.356.965 0 .965-1.629 0-.663-.139-.892-.138-.229-.524-.241Zm22.02-10.457v11.011q0 .941.078 1.207.079.265.441.518.434.302.584.531.151.229.151.555 0 .964-1.942 1.471-1.748.446-3.497.446-.386 0-.501-.114-.114-.115-.15-.549-.061-.615-.435-.615-.205 0-.639.362-1.23 1.001-2.737 1.001-1.87 0-3.365-1.387-.881-.832-1.424-1.918-.723-1.411-.723-2.858 0-1.701.941-3.281.868-1.459 2.363-2.243 1.255-.651 2.473-.651 1.399 0 2.508.627.181.096.29.096.386 0 .386-1.037 0-.446-.211-.681-.211-.235-.754-.404-.76-.242-.76-.845 0-.88 1.749-1.374 3.087-.857 4.137-.857 1.037 0 1.037.989Zm-6.549 6.067q-.784 0-1.242.832-.615 1.109-.615 2.918 0 1.641.591 2.473.422.603 1.145.603.784 0 1.14-.911.356-.91.356-2.936 0-1.858-.422-2.473-.326-.482-.953-.506Z"
                                transform="rotate(-90 -225.712 73.508)"
                                style={{ transformOrigin: "314.717px 227.286px" }}
                                fill="currentColor"
                              />
                            </svg>
                          ) : retiro.tipo === "Iglesia" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="150">
                              <path
                                d="M264.429 233.684q1.464 0 2.761.257 1.746.347 1.746 1.477 0 .372-.173.559-.173.186-.88.545-.59.296-.777 1.297-.186 1.002-.186 3.904 0 4.906.244 6.074.09.373.276.572.187.199.649.43.847.385.847 1.117 0 1.028-1.566 1.413-1.695.411-4.148.411-4.187 0-4.187-1.593 0-.577.822-1.078.63-.386.745-1.053.244-1.464.244-6.216 0-3.287-.334-4.212-.18-.526-.86-.95-.527-.347-.706-.578-.18-.231-.18-.591 0-.552.533-.879.533-.328 1.881-.585 1.605-.321 3.249-.321Zm19.003 4.315q.321 0 .565.366.244.366.244.854 0 .527-.327 1.194-.328.668-.79 1.066-.296.257-.296.411 0 .039.026.308.039.27.039.488 0 1.529-1.028 2.569-.924.924-2.382 1.438-1.457.514-3.204.514-.424 0-.835-.052-.334-.038-.513-.038-.681 0-.681.68 0 .437.443.687.443.251 1.201.251.513 0 1.515-.141 2.106-.296 3.108-.296 1.515 0 2.35.501.668.385 1.059 1.079.392.693.392 1.489 0 1.297-.95 2.517-1.13 1.439-3.326 2.132-1.721.54-3.981.54-2.851 0-4.623-.874-.822-.411-1.31-1.078-.488-.668-.488-1.387 0-.501.276-.925.276-.424.7-.604.385-.154.385-.333 0-.142-.321-.411-1.027-.861-1.027-1.785 0-.617.494-1.272.495-.655 1.226-1.014.309-.154.309-.308 0-.18-.386-.54-1.322-1.22-1.322-2.851 0-.86.468-1.643.469-.784 1.304-1.336 2.067-1.348 4.584-1.348 1.002 0 2.235.257 1.169.231 1.605.231 1.4 0 2.787-1.105.308-.231.475-.231Zm-6.973 2.658q-.642 0-1.034.488t-.392 1.297q0 1.387.424 2.222t1.117.835q.681 0 1.079-.52.398-.52.398-1.394 0-1.374-.417-2.138-.417-.764-1.175-.79Zm-2.8 11.686q-.321 0-.321.373 0 .757.822 1.226t2.132.469q1.258 0 1.971-.334.713-.334.713-.937 0-.321-.27-.546-.27-.225-.668-.225-.205 0-.59.051-.719.116-1.606.116-.654 0-1.258-.064-.45-.039-.732-.103-.128-.026-.193-.026Zm18.63-11.044v4.123q0 2.735.084 3.184.083.45.636.694.475.205.635.385.161.18.161.514 0 .424-.302.77-.302.347-.803.488-.924.283-3.12.283-2.479 0-3.48-.373-.463-.167-.758-.52t-.295-.738q0-.308.16-.475.161-.167.7-.398.501-.219.616-1.195.206-1.669.206-4.751 0-3.133-.18-4.032t-.899-1.336q-.539-.308-.738-.584-.199-.276-.199-.674 0-.63.603-1.098.604-.469 1.927-.867.886-.27 2.298-.514 1.413-.244 2.055-.244 1.014 0 1.014 1.259 0 .411-.128 1.887-.167 2.299-.193 4.212Zm14.12 4.431h-6.035q-.398 0-.398.347 0 .834.905 1.573.905.738 1.946.738.616 0 1.367-.237.751-.238 1.239-.585.437-.308.694-.308.334 0 .655.411t.321.848q0 .924-1.156 1.785-2.042 1.528-4.713 1.528-2.697 0-4.52-1.567-.886-.77-1.464-1.862-.758-1.451-.758-3.056 0-2.158 1.31-3.879 1.13-1.489 2.877-2.221 1.31-.552 2.838-.552 2.44 0 4.148 1.386.86.694 1.387 1.644.603 1.079.603 2.106 0 .835-.347 1.368-.346.533-.899.533Zm-5.701-2.402h1.297q.822 0 .822-.757 0-.694-.399-1.13-.398-.437-1.04-.437-.719 0-1.13.565-.385.527-.385 1.066 0 .385.186.539.186.154.649.154Zm12.923-4.635q.643 0 2.094.282.295.051.488.051.218 0 .847-.231.296-.115.501-.115.591 0 1.194.757.488.604.796 1.323.309.719.309 1.246 0 .513-.36.854-.359.34-.899.34-.449 0-.802-.218-.354-.219-1.137-.963-.822-.797-1.361-.797-.36 0-.623.264-.263.263-.263.622 0 .63 1.207 1.182 2.17.976 3.326 2.132.976.976.976 2.388 0 1.785-1.567 2.98-1.348 1.04-3.3 1.04-.501 0-1.824-.167-1.245-.141-1.399-.141-.167 0-.386.038-.372.051-.539.051-.604 0-.95-.308-.527-.475-.976-1.496-.45-1.021-.45-1.753 0-1.181.925-1.181.359 0 .661.237.302.238 1.265 1.265.527.565.873.777.347.212.745.212.424 0 .681-.225.257-.224.257-.597 0-.578-.989-1.053-2.068-1.014-2.986-2.093-.918-1.079-.918-2.491 0-1.528.937-2.633 1.336-1.579 3.647-1.579Zm14.531.886v7.461q0 .886.161 1.297.161.411.649.757.398.283.532.482.135.199.135.507 0 1.657-4.199 1.657-2.26 0-3.583-.36-.449-.128-.725-.449-.277-.321-.277-.732 0-.347.142-.54.141-.192.719-.616.398-.295.565-.963.167-.668.167-1.991 0-.423-.058-1.586-.058-1.162-.083-1.354-.077-.527-.72-.809-.796-.347-.796-1.028 0-.809 1.04-1.207 1.439-.552 3.083-.937 1.643-.386 2.542-.386.706 0 .706.797Zm-2.542-5.625q1.117 0 1.772.417.655.418.655 1.124 0 .989-.989 1.567-1.567.911-3.788.911-.938 0-1.49-.359-.745-.462-.745-1.284 0-1.105 1.58-1.734 1.605-.642 3.005-.642Zm12.113 4.726q2.234 0 3.788 1.13.822.603 1.149 1.38.328.777.328 2.138l-.026 1.914q0 1.99.283 2.581.141.283.269.36.129.077.54.141.411.064.411.539 0 .617-.495 1.284-.494.668-1.278 1.118-.963.565-2.016.565-1.348 0-2.132-.925-.269-.334-.5-.334-.257 0-.681.321-1.284.938-2.915.938-1.682 0-2.723-.719-.68-.476-1.078-1.24t-.398-1.598q0-1.336 1.078-2.363 1.683-1.618 5.034-1.631.745 0 .938-.148.192-.148.192-.687 0-1.361-.282-1.971-.283-.61-.925-.61-.385 0-.687.231-.301.231-.751.848-1.143 1.63-2.389 1.63-.629 0-1.027-.372-.398-.372-.398-.976 0-.616.494-1.233.495-.616 1.342-1.078 2.325-1.233 4.855-1.233Zm-.861 7.435q-.565 0-.982.462-.418.463-.418 1.105 0 .616.296.995.295.379.783.379 1.028 0 1.028-1.734 0-.706-.148-.95t-.559-.257Z"
                                transform="matrix(0 -1 .99056 0 -288.446 -166.793)"
                                style={{ transformOrigin: "301.636px 242.49px" }}
                                fill="currentColor"
                              />
                            </svg>
                          ) : retiro.tipo === "Célula" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="150">
                              <path
                                d="M268.718 233.594q1.875 0 3.622.822.821.386 1.142.386.232 0 .745-.116.167-.039.373-.039.667 0 1.168.617 1.233 1.489 1.233 3.698 0 1.554-1.066 2.273-.578.386-1.297.386-.655 0-1.066-.283-.411-.283-.796-1.002-.552-1.014-.899-1.457-.347-.443-.847-.803-1.246-.873-2.607-.873-1.323 0-2.1.957-.777.956-.777 2.562 0 2.208 1.117 4.045 1.516 2.453 4.341 2.453 1.04 0 2.061-.347t1.586-.899q.488-.462.796-.462.45 0 .771.417t.321 1.008q0 .745-.45 1.669-.449.925-1.078 1.452-.27.218-1.118.385-.488.09-1.297.475-1.9.912-3.955.912-2.145 0-4.276-.963-2.479-1.118-3.917-3.429-1.413-2.247-1.413-4.7 0-2.851 1.773-5.201 1.541-2.042 4.019-3.121 1.888-.822 3.891-.822Zm20.977 12.136h-6.035q-.398 0-.398.347 0 .834.905 1.573.905.738 1.945.738.617 0 1.368-.237.751-.238 1.239-.585.437-.308.694-.308.334 0 .655.411t.321.848q0 .924-1.156 1.785-2.042 1.528-4.713 1.528-2.697 0-4.52-1.567-.886-.77-1.464-1.862-.758-1.451-.758-3.056 0-2.158 1.31-3.879 1.13-1.489 2.877-2.221 1.309-.552 2.838-.552 2.439 0 4.147 1.386.861.694 1.387 1.644.604 1.079.604 2.106 0 .835-.347 1.368-.347.533-.899.533Zm-5.701-2.402h1.297q.821 0 .821-.757 0-.694-.398-1.13-.398-.437-1.04-.437-.719 0-1.13.565-.385.527-.385 1.066 0 .385.186.539.186.154.649.154Zm1.99-10.209q1.169 0 2.08.347.45.167.732.475.283.308.27.617-.026.59-1.092 1.399-1.939 1.503-4.289 1.503-1.322 0-1.322-.951 0-.346.134-.52.135-.173.777-.661.578-.424.707-.559.128-.134.128-.314 0-.116-.154-.385-.051-.09-.051-.193 0-.321.578-.533.577-.212 1.502-.225Zm13.119 8.18v4.123q0 2.735.083 3.184.084.45.636.694.475.205.636.385.16.18.16.514 0 .424-.302.77-.301.347-.802.488-.925.283-3.121.283-2.478 0-3.48-.373-.462-.167-.758-.52-.295-.353-.295-.738 0-.308.161-.475.16-.167.699-.398.501-.219.617-1.195.205-1.669.205-4.751 0-3.133-.18-4.032-.179-.899-.898-1.336-.54-.308-.739-.584-.199-.276-.199-.674 0-.63.604-1.098.603-.469 1.926-.867.886-.27 2.299-.514 1.412-.244 2.054-.244 1.015 0 1.015 1.259 0 .411-.129 1.887-.167 2.299-.192 4.212Zm9.312-1.874v6.96q0 2.234 1.477 2.234.372 0 .732-.212.36-.211.501-.52.282-.616.282-2.748 0-2.106-.141-2.876-.051-.321-.18-.469-.128-.148-.488-.34-.732-.386-.732-.976 0-.797 1.259-1.105 2.388-.591 4.713-.591 1.297 0 1.297 1.375 0 .141-.013.577-.026.617-.039 1.503v5.663q0 .437.745.796.629.309.629.899 0 1.156-2.735 1.785-1.605.373-3.108.373-.616 0-.841-.142-.224-.141-.263-.552-.064-.796-.488-.796-.154 0-.282.071-.129.07-.784.52-1.297.886-2.786.886-2.466 0-3.481-1.426-.86-1.194-.86-4.019 0-1.053.013-1.798v-.591q0-1.104-.199-1.624t-.726-.816q-.501-.256-.635-.411-.135-.154-.135-.423 0-.976 1.477-1.297 2.516-.553 5.033-.553.758 0 .758.643Zm18.119 1.874v4.123q0 2.735.084 3.184.083.45.635.694.475.205.636.385.16.18.16.514 0 .424-.301.77-.302.347-.803.488-.925.283-3.121.283-2.478 0-3.48-.373-.462-.167-.757-.52-.296-.353-.296-.738 0-.308.161-.475.16-.167.7-.398.5-.219.616-1.195.206-1.669.206-4.751 0-3.133-.18-4.032t-.899-1.336q-.54-.308-.739-.584-.199-.276-.199-.674 0-.63.604-1.098.604-.469 1.926-.867.886-.27 2.299-.514 1.412-.244 2.055-.244 1.014 0 1.014 1.259 0 .411-.128 1.887-.167 2.299-.193 4.212Zm9.608-2.619q2.234 0 3.788 1.13.822.603 1.149 1.38.328.777.328 2.138l-.026 1.914q0 1.99.283 2.581.141.283.269.36.129.077.54.141.411.064.411.539 0 .617-.495 1.284-.494.668-1.277 1.118-.964.565-2.017.565-1.348 0-2.131-.925-.27-.334-.501-.334-.257 0-.681.321-1.284.938-2.915.938-1.682 0-2.722-.719-.681-.476-1.079-1.24-.398-.764-.398-1.598 0-1.336 1.079-2.363 1.682-1.618 5.034-1.631.744 0 .937-.148.193-.148.193-.687 0-1.361-.283-1.971-.282-.61-.924-.61-.386 0-.688.231-.301.231-.751.848-1.143 1.63-2.388 1.63-.63 0-1.028-.372t-.398-.976q0-.616.495-1.233.494-.616 1.342-1.078 2.324-1.233 4.854-1.233Zm-.861 7.435q-.565 0-.982.462-.417.463-.417 1.105 0 .616.295.995t.783.379q1.028 0 1.028-1.734 0-.706-.148-.95t-.559-.257Z"
                                transform="matrix(0 -1 .99056 0 -285.068 -166.793)"
                                style={{ transformOrigin: "300.84px 242.49px" }}
                                fill="currentColor"
                              />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="150">
                              <path
                                d="M268.795 233.594q3.301 0 5.766 1.888 1.67 1.297 2.71 3.365 1.014 2.054 1.014 4.109 0 3.031-2.003 5.419-1.695 2.029-4.43 2.915-1.683.54-3.378.54-2.221 0-4.251-.925-2.452-1.117-3.839-3.377-1.349-2.183-1.349-4.816 0-3.056 1.734-5.393 1.541-2.081 4.148-3.057 1.746-.668 3.878-.668Zm-1.22 3.686q-1.079 0-1.708.963-.488.719-.488 1.708 0 1.451.591 3.358t1.49 3.384q.398.629.982 1.002.584.372 1.188.372.976 0 1.573-.732t.597-1.926q0-1.554-.501-3.352-.501-1.798-1.297-3.069-.488-.783-1.13-1.233-.642-.449-1.297-.475Zm19.421 4.777v4.341q0 .77.379 1.258t.969.488q.501 0 1.323-.462.193-.116.385-.116.309 0 .565.373.257.372.257.809 0 .796-.873 1.528-1.824 1.554-4.418 1.554-2.054 0-3.3-1.162-1.246-1.163-1.246-3.063v-5.933q0-.295-.07-.366-.071-.071-.366-.071h-1.323q-.372 0-.475-.122-.103-.122-.103-.571v-.565q.013-.386.296-.565l5.881-3.699q.218-.115.539-.115h1.041q.321 0 .43.147.109.148.109.585v1.733q0 .386.122.501.122.116.52.116h2.376q.475 0 .616.173.141.173.141.738v.758q0 .617-.179.854-.18.238-.655.238h-2.325q-.359 0-.488.128-.128.129-.128.488Zm10.541-3.287q.681 0 .828.192.148.193.264 1.233.064.565.398.565.256 0 .488-.372 1.027-1.606 2.684-1.606 1.168 0 1.913.758.36.373.591.957.231.584.231 1.124 0 .603-.283 1.239-.282.635-.732 1.046-.822.784-2.016.784-.655 0-1.098-.231-.443-.232-1.162-.938-.27-.27-.501-.27-.359 0-.469.405-.109.404-.109 1.701 0 1.94.142 2.646.089.385.25.533.16.147.687.302 1.156.346 1.156 1.207 0 .526-.373.918-.372.392-.988.52-1.233.257-3.622.257-2.273 0-3.454-.398-1.053-.36-1.053-1.246 0-.668.77-1.194.373-.244.514-.443.141-.199.192-.546.206-1.169.206-4.328 0-.578-.128-.828-.129-.25-.514-.405-.912-.359-.912-1.04 0-.616.629-1.059.63-.443 2.106-.88 1.978-.591 3.365-.603Zm15.851-.09q2.35 0 4.122 1.22 1.271.873 2.042 2.273.796 1.464.796 3.056 0 2.787-2.556 4.739-2.439 1.862-5.586 1.862-3.069 0-4.97-1.747-1.849-1.695-1.849-4.417 0-3.031 2.26-4.957 2.363-2.029 5.741-2.029Zm-1.028 2.966q-.565 0-.905.418-.34.417-.34 1.11 0 .771.289 2.1.289 1.329.687 2.356.398 1.053 1.297 1.053 1.143 0 1.143-1.451 0-1.078-.289-2.452-.289-1.374-.7-2.235-.424-.873-1.182-.899Z"
                                transform="matrix(0 -1 .99056 0 -275.274 -166.793)"
                                style={{ transformOrigin: "289.523px 242.49px" }}
                                fill="currentColor"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="flex flex-col flex-grow p-2 gap-1 py-3">
                          <p className="text-md">
                            <b>Nombre:</b> {retiro?.nombreComunidad ?? ""}
                          </p>
                          <p className="text-md">
                            <b>Ubicación:</b> {retiro?.ubicacion ?? ""}
                          </p>
                          <p className="text-md">
                            <b>Horarios:</b> {retiro?.horarios ?? ""}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
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
                <ModalHeader className="flex flex-col gap-1">{retiroSelected?.nombreComunidad ?? ""}</ModalHeader>
                <ModalBody>
                  <Table removeWrapper isStriped aria-label="Example static collection table">
                    <TableHeader>
                      <TableColumn className="font-bold text-xl">Campos</TableColumn>
                      <TableColumn className="font-bold text-xl">Datos</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow key="1">
                        <TableCell className="font-bold">Nombre</TableCell>
                        <TableCell>{retiroSelected?.nombreComunidad ?? ""}</TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell className="font-bold">Ubicación</TableCell>
                        <TableCell>{retiroSelected?.ubicacion ?? ""}</TableCell>
                      </TableRow>
                      <TableRow key="3">
                        <TableCell className="font-bold">Fecha de creación</TableCell>
                        <TableCell>{formatfecha(retiroSelected?.fechacreacion) ?? ""}</TableCell>
                      </TableRow>
                      <TableRow key="4">
                        <TableCell className="font-bold">Horarios</TableCell>
                        <TableCell className="capitalize">{retiroSelected?.horarios ?? ""}</TableCell>
                      </TableRow>
                      <TableRow key="5">
                        <TableCell className="font-bold">Tipo</TableCell>
                        <TableCell className="capitalize">{retiroSelected?.tipo ?? ""}</TableCell>
                      </TableRow>
                      <TableRow key="6">
                        <TableCell className="font-bold">Ofrendas</TableCell>
                        <TableCell>
                          {retiroSelected?.ofrenda?.length > 0 ? retiroSelected?.ofrenda?.join(", ") ?? "" : "N/A"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <h1 className="font-bold text-[18px] -mb-2 mx-auto">Fotos de la comunidad</h1>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-around",
                    }}
                  >
                    {retiroSelected?.fotos.map((imagenSrc, index) => (
                      <img
                        key={index}
                        style={{
                          objectFit: "contain",
                          width: "100%",
                          height: "auto",
                          margin: "5px",
                        }}
                        src={imagenSrc}
                      />
                    ))}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Linky
                    to={`/comunidad/comunidades/${retiroSelected._id}`}
                    state={{ retiroSelected }}
                    className="bg-warning flex items-center px-4 py-2 rounded-xl hover:bg-warning-400"
                  >
                    Editar
                  </Linky>

                  <Button color="primary" onPress={onClose}>
                    Cerrar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default C_comunidad_buscar;
