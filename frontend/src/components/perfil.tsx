import { useState } from "react";
import decodeToken from "../utils/tokenDecored"
import Sidebar from "./Sidebar";
function perfil() {
    const [name, setName] = useState<string>(decodeToken().user.Nombre || '');
    const [correo, setCorreo] = useState<string>(decodeToken().user.CorreoElectronico || '');
    const [Direccion, setDireccion] = useState<string>(decodeToken().user.Direccion || '');
    const [password, setPassword] = useState<string>(decodeToken().user.Contraseña ||'');
    console.log(decodeToken())
  return (
    <section>
        <Sidebar />
        <div className="flex items-center justify-center h-dvh ml-12">
            <form action="" className="flex flex-col w-full md:w-1/2 lg:w-1/3 rounded-md shadow-md border p-8">
            <h1 className="text-center font-bold text-3xl text-blue-600">Tu Perfil</h1>
            <label htmlFor="">Nombre</label>
            <input type="text" className="py-2" value={name} onChange={(e) => setName(e.target.value)}/>
            <label htmlFor="">Correo</label>
            <input type="email" className="py-2" value={correo} onChange={(e) => setCorreo(e.target.value)}/>
            <label htmlFor="">Telefono</label>
            <input type="tel" className="py-2" value={Direccion} onChange={(e) => setDireccion(e.target.value)}/>
            <label htmlFor="">Contraseña</label>
            <input type="password" className="py-2" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button className="py-2 px-4 rounded-md text-white font-semibold bg-blue-700 my-4">Actualizar</button>
            </form>
        </div>
    </section>
  )
}

export default perfil
