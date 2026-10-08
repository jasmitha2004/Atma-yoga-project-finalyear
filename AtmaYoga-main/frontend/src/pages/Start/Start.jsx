import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Start() {
  const navigate = useNavigate();

  useEffect(() => {
    const completed = localStorage.getItem("questionnaireCompleted");

    if (!completed) {
      navigate("/questionnaire");
    } else {
      navigate("/mood");
    }
  }, [navigate]);

  return (
    <div style={{ padding: "80px 20px", textAlign: "center" }}>
      Preparing your live yoga session...
    </div>
  );
}

export default Start;
