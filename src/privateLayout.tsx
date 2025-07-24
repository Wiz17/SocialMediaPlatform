import { Outlet } from "react-router-dom";
import LeftNav from "./components/leftNav.tsx";

const PrivateLayout: React.FC = () => {
  return (
    <div>
      <LeftNav /> {/* This will render once and stay mounted */}
      <main>
        <Outlet /> {/* Private route content will render here */}
      </main>
    </div>
  );
};

export default PrivateLayout;
