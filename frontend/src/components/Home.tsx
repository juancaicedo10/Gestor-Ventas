function Home() {
    return (
      <div className='w-full h-dvh flex flex-col items-center justify-center'>
        <h1 className='text-green-400 font-bold text-3xl sm:text-4xl md:text-3xl lg:text-5xl'>Bienvenido</h1>
        <form action="post" className='flex flex-col items-center w-full h-3/4 rounded-md border '>
          <label htmlFor="correo" className='text-lg'>Correo Electronico</label>
          <input type="email" name="correo" id="correo" className='my-2 py-2 border-2 w-[90%]'/>
          <label htmlFor="password" className='text-lg'>Contraseña</label>
          <input type="password" name="password" id="password" className='my-2 py-2 border-2 w-[90%]
          '/>
          <button type="submit" className='bg-green-400 text-white font-bold py-2 px-4 rounded-lg'>Iniciar Sesion</button>
        </form>
      </div>
    );
}

export default Home;