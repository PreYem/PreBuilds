import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "../context/SessionContext";



const useRoleRedirect = (allowedRoles: string[] = ["Owner", "Admin"]) => {
  const navigate = useNavigate();
  const { userData } = useSessionContext();

  useEffect(() => {
    if (!userData) {
      navigate("/");
      return;
    }

    if (!allowedRoles.includes(userData.user_role)) {
      navigate("*");
    }
  }, [userData, navigate, allowedRoles]);
};

export default useRoleRedirect;
