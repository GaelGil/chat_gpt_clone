import UserProfile from "../components/User/UserProfile";
import Navigation from "../components/Layout/NavBar";
// home component
const ProfilePage: React.FC = () => {
  return (
    <>
      <Navigation />
      <UserProfile />
    </>
  );
};

export default ProfilePage;
