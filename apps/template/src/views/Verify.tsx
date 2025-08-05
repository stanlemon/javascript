import { useContext, useEffect } from "react";

import { fetchApi, ApiError } from "../helpers/fetchApi";
import { SessionContext } from "../Session";

export function Verify({ token = null }: { token: string | null }) {
  const { setError, setMessage } = useContext(SessionContext);

  useEffect(() => {
    fetchApi(`/auth/verify/${token}`)
      .then((res) => {
        setMessage("Successfully verified your account!");
      })
      .catch((err: ApiError) => {
        if (err.message === "Bad Request") {
          setError(err.body.message as string);
          console.error(err, err.message, err.body);
        }
      });
  }, []);

  return <></>;
}

export default Verify;
