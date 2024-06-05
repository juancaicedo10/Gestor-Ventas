import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = {
      correo: form.get("correo"),
      contraseña: form.get("contraseña"),
    };
    console.log(data);
    try {
      const response = await axios.post("http://localhost:5000/login", data);
      console.log("Login correcto");
      localStorage.setItem("token", response.data.token);
      navigate("/clientes");
    } catch (error) {
      console.error("Error en el login", error);
    }
  };
  return (
    <div className="w-full h-lvh flex justify-center items-center">
      <form
        action=""
        className="md:min-w-1/2 lg:w-1/3 flex flex-col items-center justify-center w-full h-1/2 rounded-md border-2 shadow-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold py-4">Iniciar Sesion</h1>
        <label htmlFor="correo" className="text-lg">
          Correo Electronico
        </label>
        <input
          type="email"
          name="correo"
          id="correo"
          className="my-2 py-4 border-2 w-[90%] rounded-md"
          required
        />
        <label htmlFor="password" className="text-lg">
          Contraseña
        </label>
        <input
          type="password"
          name="contraseña"
          id="contraseña"
          className="my-2 py-4 border-2 w-[90%] rounded-md
          "
        />
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-4 rounded-lg my-4"
        >
          Iniciar Sesion
        </button>
      </form>
    </div>
  );
}

export default Login;
