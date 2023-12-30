import { useContext, useState } from "react";
import { ProfileData, SessionContext } from "../Session";
import { Header, Input } from "../components";
import fetchApi, { ApiError } from "../helpers/fetchApi";

export type ProfileForm = {
  name: string;
  email: string;
};
export const DEFAULT_PROFILE_DATA: ProfileForm = {
  name: "",
  email: "",
};

export function Profile() {
  const { token, user, setUser, setMessage } = useContext(SessionContext);
  const [errors, setErrors] = useState<Partial<ProfileForm>>({});
  const [profile, setProfile] = useState<ProfileForm>({
    ...DEFAULT_PROFILE_DATA,
    name: user?.name ?? "",
    email: user?.email ?? "",
  });

  const storeProfile = (key: keyof ProfileForm, value: string) => {
    setProfile({ ...profile, [key]: value });
  };

  const saveProfile = () => {
    setErrors({});
    fetchApi<ProfileData, ProfileForm>("/auth/user", token, "put", profile)
      .then((newProfile) => {
        setProfile(newProfile);
        setUser(newProfile);
        setErrors({});
        setMessage("Profile saved.");
      })
      .catch((err: ApiError) => {
        if (err.code === 400) {
          setErrors({ ...(err.body.errors as ProfileForm) });
        }
      });
  };

  return (
    <>
      <Header level={2}>Profile</Header>
      <Input
        name="name"
        label="Name"
        value={profile.name}
        error={errors.name}
        onChange={(value) => storeProfile("name", value)}
      />
      <Input
        name="email"
        label="Email"
        value={profile.email}
        error={errors.email}
        onChange={(value) => storeProfile("email", value)}
      />
      <button onClick={saveProfile}>Save</button>
    </>
  );
}

export default Profile;
