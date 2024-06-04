import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = {
      correo: form.get('correo'),
      contraseña: form.get('contraseña')
    }
    console.log(data)
    try {
      const response = await axios.post('http://localhost:5000/login', data);
      console.log('Login correcto');
      localStorage.setItem('token', response.data.token);
      navigate('/clientes');
    } catch (error) {
      console.error('Error en el login', error);
    }
  }
    return (
      <div className='w-full h-dvh flex flex-col items-center justify-center'>
        <h1 className='text-green-400 font-bold text-3xl sm:text-4xl md:text-3xl lg:text-5xl'>Bienvenido</h1>
        <form action="" className='flex flex-col items-center w-full h-3/4 rounded-md border' onSubmit={handleSubmit}>
          <label htmlFor="correo" className='text-lg'>Correo Electronico</label>
          <input type="email" name="correo" id="correo" className='my-2 py-2 border-2 w-[90%]'/>
          <label htmlFor="password" className='text-lg'>Contraseña</label>
          <input type="password" name="contraseña" id="contraseña" className='my-2 py-2 border-2 w-[90%]
          '/>
          <button type="submit" className='bg-green-400 text-white font-bold py-2 px-4 rounded-lg'>Iniciar Sesion</button>
        </form>
      </div>
    );
}

export default Login;