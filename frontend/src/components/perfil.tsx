import { useEffect, useState } from "react";
import decodeToken from "../utils/tokenDecored"
import Sidebar from "./Sidebar";
import axios from "axios";

function perfil() {
    const [name, setName] = useState<string>(decodeToken().user.NombreCompleto || '');
    const [correo, setCorreo] = useState<string>(decodeToken().user.CorreoElectronico || '');
    const [Direccion, setDireccion] = useState<string>(decodeToken().user.Direccion || '');
    const [password, setPassword] = useState<string>(decodeToken().user.Contraseña ||'');

    const Id = decodeToken().user.Id;
    const role = decodeToken().user.role;


    useEffect(() => {
      axios.put(`https://backendgestorventas.azurewebsites.net/api/usuarios/${Id}`, {
        NombreCompleto: name,
        CorreoElectronico: correo,
        Direccion: Direccion,
        Contraseña: password
      }).then(res => console.log(res)).catch(err => console.log(err))
        .catch(err => console.log(err));
    }, []);

  return (
    <section>
        <Sidebar />
        <div className="flex items-center justify-center h-dvh ml-[64px]">
            <form action="" className="flex flex-col w-full md:w-1/2 lg:w-1/3 rounded-md shadow-md border p-8 bg-white mx-2">
            <h1 className="text-center font-bold text-4xl text-blue-800">Tu Perfil</h1>
            <label htmlFor="" className="font-normal text-lg">Nombre</label>
            <input type="text" className="py-2 border-2 rounded-md mb-2" value={name} onChange={(e) => setName(e.target.value)}/>
            <label htmlFor="" className="font-normal text-lg">Correo</label>
            <input type="email" className="py-2 border-2 rounded-md mb-2" value={correo} onChange={(e) => setCorreo(e.target.value)}/>
            <label htmlFor="" className="font-normal text-lg">Telefono</label>
            <input type="tel" className="py-2 border-2 rounded-md mb-2" value={Direccion} onChange={(e) => setDireccion(e.target.value)}/>
            <label htmlFor="" className="font-normal text-lg">Contraseña</label>
            <input type="text" className="py-2 border-2 rounded-md" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button className="px-4 rounded-md text-white font-semibold bg-blue-900 my-4 py-4 text-xl">Actualizar</button>
            </form>
        </div>
    </section>
  )
}

export default perfil
