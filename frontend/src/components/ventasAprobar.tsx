import Sidebar from "./Sidebar"

function ventasAprobar() {
  return (
    <div>
        <Sidebar />
        <div className="ml-[63px]">
        <h1 className="mb-2 py-4 text-3xl text-blue-900 md:text-4xl lg:text-5xl text-center border-b shadow-md bg-gray-50 w-full font-bold">
            Ventas por aprobar
          </h1>
        </div>
    </div>
  )
}

export default ventasAprobar
