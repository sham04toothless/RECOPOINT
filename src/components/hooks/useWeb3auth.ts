import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { createUser } from "../lib/utils"; 

const clientId = "YOUR_WEB3AUTH_CLIENT_ID"; 

export const useWeb3Auth = () => {
  const [web3auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const web3authInstance = new Web3Auth({
          clientId,
          chainConfig: { chainNamespace: "eip155", chainId: "0x1" }, 
        });
        await web3authInstance.initModal();
        setWeb3Auth(web3authInstance);
        const web3authProvider = web3authInstance.provider;

        if (web3authProvider) {
          setProvider(web3authProvider);
          setLoggedIn(true);
          const user = await web3authInstance.getUserInfo();
          setUserInfo(user);

          if (user.email) {
            localStorage.setItem("userEmail", user.email);
            try {
              await createUser(user.email, user.name || "Anonymous User");
            } catch (error) {
              console.error("Error creating user:", error);
            }
          }
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    try {
      const web3authProvider = await web3auth.connect();
      if (web3authProvider) {
        setProvider(web3authProvider);
        setLoggedIn(true);

        const user = await web3auth.getUserInfo();
        setUserInfo(user);

        if (user.email) {
          localStorage.setItem("userEmail", user.email);
          try {
            await createUser(user.email, user.name || "Anonymous User");
          } catch (error) {
            console.error("Error creating user:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    try {
      await web3auth.logout();
      setProvider(null);
      setLoggedIn(false);
      setUserInfo(null);
      localStorage.removeItem("userEmail");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return { login, logout, loggedIn, userInfo, loading };
};