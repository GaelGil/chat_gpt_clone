import UserProfile from "../components/User/UserProfile";
import { useParams } from "react-router-dom";

// home component
const ProfilePage: React.FC = () => {
  const { userId } = useParams();

  return (
    <div className="home">
      {userId ? <UserProfile userId={userId} /> : <p>User ID not found.</p>}{" "}
    </div>
  );
};

export default ProfilePage;
