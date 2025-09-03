import UserProfile from "../components/User/UserProfile";
import { useParams } from "react-router-dom";

// home component
const ProfilePage: React.FC = () => {
  const { userId } = useParams();

  return (
    <>{userId ? <UserProfile userId={userId} /> : <p>User ID not found.</p>} </>
  );
};

export default ProfilePage;
