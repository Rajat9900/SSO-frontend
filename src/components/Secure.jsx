import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Secure() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [isGitHubUser, setIsGitHubUser] = useState(false);

  const getUserDetails = async (accessToken) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
      );
      const data = await response.json();
      setUserDetails(data);
    } catch (err) {
      console.error("Google User Error:", err);
    }
}

  const getGitHubDetails = async (accessToken) => {
    try {
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });
      const data = await response.json();
      console.log(data , "user github data ")
      setUserDetails(data);
      setIsGitHubUser(true);
    } catch (err) {
      console.error("GitHub User Error:", err);
    }
  };

  useEffect(() => {
    const googleToken = Cookies.get("access_token");
    const githubToken = Cookies.get("github_access_token");

    if (googleToken) {
      getUserDetails(googleToken);
    } else if (githubToken) {
      getGitHubDetails(githubToken);
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="user-profile">
      {userDetails ? (
        <div className="card">
          <img
            src={
              isGitHubUser
                ? userDetails.avatar_url
                : userDetails.picture
            }
            alt={`Profile  of ${userDetails.name}`}
            className="profile-pic"
          />
          <h1 className="name">{userDetails.name || userDetails.login}</h1>
          <p className="email">{userDetails.email || "Email not available"}</p>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
