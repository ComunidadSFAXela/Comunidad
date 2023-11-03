import React from "react";
import comunidad from "/comunidad.svg";
import UMG from "/umg.png";

const AboutPage = () => {
  return (
    <>
      <div className="flex flex-col items-center flex-wrap">
        <img src={comunidad} alt="Logo Comunidad San Francisco de Asís" className="h-3/6 w-3/6 sm:h-1/6 sm:w-1/6" />
        <h1 className="text-2xl font-extrabold text-center p-6">Comunidad San Francisco de Asís, Quetzaltenango</h1>
        <div className="w-8/12 sm:w-6/12 mb-8">
          <h2 className="text-xl font-bold mt-8">Misión</h2>
          <h3>
            Compartir el mensaje del Evangelio a través de la evangelización y la enseñanza de la fe católica, brindando
            un espacio para la oración, el crecimiento espiritual y el servicio a los más necesitados.
          </h3>
          <h2 className="text-xl font-bold mt-8">Visión</h2>
          <h3>
            Ser una comunidad católica fraterna y solidaria que inspire a vivir el amor y la misericordia de Dios en el
            mundo, fortaleciendo la fe y creando un espacio de encuentro espiritual.
          </h3>
        </div>
      </div>
      <footer className="fixed bottom-0 w-full bg-neutral-200 dark:bg-neutral-800">
        <span className="flex flex-row flex-nowrap gap-2 justify-center py-5">
          <img src={UMG} className="-mt-2 h-10 w-10" alt="Logo Universidad Mariano Gálvez de Guatemala" />
          Sistema creado por Cristopher Paiz, estudiante de la Universidad Mariano Gálvez de Guatemala, sede
          Quetzaltenango, {new Date().getFullYear()}
          <img src={UMG} className="-mt-2 h-10 w-10" alt="Logo Universidad Mariano Gálvez de Guatemala" />
        </span>
      </footer>
    </>
  );
};

export default AboutPage;
