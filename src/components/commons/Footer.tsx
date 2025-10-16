import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="py-16 bg-gray-950 px-flex justify-between gap-10 text-slate-200 text-sm felx-wrap mt-10 md:flex-noweap">
      <div
        className={
          "text-2xl font-bold trackinf-tighter transition-all text-white flex-1 cursor-pointer"
        }
        onClick={() => navigate("/")}
      >
        Boutique SCIIARk
      </div>
      <div className="flex flex-col gap-4 flex-1">
        <p className="font-semibold uppercase tracking-tighter">
          no se que poner aquiii
        </p>
        <button
          onClick={() => window.open("/sidebar", "_blank")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors w-fit"
        >
          Ir a otra página
        </button>
      </div>
    </footer>
  );
};
