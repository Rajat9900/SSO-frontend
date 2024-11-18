import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function Login() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleGoogleLogin = () => {
    const locationUrl = `${window.location.origin}`;
    const googleClientId = "374413159623-akh2jml1c62ijk2rq2vmcc2qldbpkc0i.apps.googleusercontent.com";
    const targetUrl = `http://accounts.google.com/o/oauth2/auth?redirect_uri=${encodeURIComponent(
      locationUrl
    )}&response_type=token&client_id=${googleClientId}&scope=openid%20email%20profile`;
    window.location.href = targetUrl;
  };

  const handleGitHubLogin = () => {
    const clientId = "Ov23liSKW2HBbzKe5BQ1";
    const redirectUri = `${window.location.origin}`;
    const targetUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=user`;
    window.location.href = targetUrl;
    console.log(targetUrl , "targetUrl")
  };

  useEffect(() => {
    const accessTokenRegex = /access_token=([^&]+)/;
    const isMatch = window.location.href.match(accessTokenRegex);
    if (isMatch) {
      const accessToken = isMatch[1];
      Cookies.set("access_token", accessToken);
      setIsLoggedIn(true);
    }


    const codeRegex = /code=([^&]+)/;
    const codeMatch = window.location.href.match(codeRegex);
    if (codeMatch) {
      const code = codeMatch[1];
      fetch("http://localhost:5000/exchange-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            Cookies.set("github_access_token", data.access_token);
            setIsLoggedIn(true);
          }
        })
        .catch((err) => console.error("GitHub Login Error:", err));
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/secure");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="root">
      <h1>Log in</h1>
      <div className="btn-container">
        <button className="btn btn-primary" onClick={handleGoogleLogin}>
          Log in with Google
        </button>
        <button className="btn btn-secondary" onClick={handleGitHubLogin}>
          Log in with GitHub
        </button>
      </div>
    </div>
  );
}



