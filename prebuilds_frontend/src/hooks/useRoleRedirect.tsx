import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useRoleRedirect = (userData, allowedRoles = ["Owner", "Admin"]) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate("*");
      return;
    }

    if (!allowedRoles.includes(userData.user_role)) {
      console.log(userData);
      navigate("*");
    }
  }, [userData, navigate, allowedRoles]);
};

export default useRoleRedirect;
