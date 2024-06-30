import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const sendData = async () => {
            try {
                const response = await Axios.get("http://localhost:3001/auth/logout");
                if (response.data.status) {
                    navigate("/signin");
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.log(error);
                navigate("/");
            }
        };

        sendData();
    }, [navigate]);

    return null;
}

export default Logout;
