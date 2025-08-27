import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { getDefaultPhoto } from "../../api/helper";

const UserProfile = ({ userId }: { userId?: string }) => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        console.log(user);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, user, setUser, navigate]);

  return (
    <div className="flex-1 overflow-y-auto justify-center items-center">
      <div className="max-w-4xl mx-auto px-8 py-6 space-y-6">
        <div>
          {loading ? (
            <div className="text-center py-4">
              <h3 className="mt-3">Loading Profile...</h3>
            </div>
          ) : user ? (
            <div className="justify-center items-center">
              <img
                src={user.pfp || getDefaultPhoto()}
                alt="Profile Avatar"
                className="mb-2 rounded-circle"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                }}
              />
              <div className="">
                <h4>
                  <span className="text-primary-600"> @{user.username}</span>
                </h4>
                <div className="d-flex gap-3 mt-2">
                  <div
                    className="text-back-300"
                    onClick={() => navigate(`/edit-profile/${user.id}`)}
                  >
                    Edit Profile
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <h3>No profile data found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
