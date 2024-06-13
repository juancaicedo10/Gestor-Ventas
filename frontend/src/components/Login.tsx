import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState<any>("");
  const [isLoading ,setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const form = new FormData(e.target);
    const data = {
      correo: form.get("correo"),
      contraseña: form.get("contraseña"),
    };
    console.log(data);
    try {
      const response = await axios.post("https://backendgestorventas.azurewebsites.net/login", data);
      console.log("Login correcto");
      localStorage.setItem("token", response.data.token);
      console.log(response.data)
      navigate("/clientes");
    } catch (error) {
      setError("Correo o contraseña incorrectos");
      console.error("Error en el login", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: any) => {
    if (e.target.value === "") {
      setError(null);
    }
  };
  return (
    <div className="w-full h-lvh flex flex-col justify-center items-center px-2">
      <h2 className="font-extrabold text-6xl py-5 text-blue-900">Bienvenido</h2>
      <form
        action=""
        className="p-2 sm:w-1/2 md:min-w-1/2 lg:w-1/4 flex flex-col items-center justify-center w-full rounded-md border-2 border-gray-300 shadow-lg bg-white"
        onSubmit={handleSubmit}
      >
        <h3 className="text-3xl font-bold py-4 text-blue-800">
          Iniciar Sesion
        </h3>
        <label htmlFor="correo" className="text-lg w-full">
          Correo Electronico
        </label>
        <input
          type="email"
          name="correo"
          id="correo"
          className={`p-2 mb-4 border-2 rounded-md w-full ${
            error ? "border-red-500" : ""
          }`}
          required
        />
        <label htmlFor="password" className="text-lg w-full">
          Contraseña
        </label>
        <input
          type="password"
          name="contraseña"
          id="contraseña"
          onChange={handleChange}
          className={`p-2 border-2 w-full rounded-md ${
            error ? "border-red-500" : ""
          }`}
        />
        {error && <p className="text-red-500 w-full">{error}</p>}
        <button
          type="submit"
          className={`w-full py-3 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-lg my-4 ${isLoading ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed' 
            : 'bg-blue-800 hover:bg-blue-900 text-white'}`}
          disabled={isLoading}
        >
         { isLoading ? 'Cargado...' : 'Iniciar Sesion' }
        </button>
      </form>
    </div>
  );
}

export default Login;
