import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link
      to="/"
      className={"text-2xl font-bold trackinf-tighter transition-all"}
    >
      <p className="hidden lg:block">
        Boutique
        <span className="text-cyan-600">SCIIARK</span>
      </p>
      <p className="flex text-4x1 lg:hidden">
        <span className="-skew-x-6">B</span>
        <span className="text-cyan-600 skew-x-6">SCIIARK</span>
      </p>
    </Link>
  );
};
