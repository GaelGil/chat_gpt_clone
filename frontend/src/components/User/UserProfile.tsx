import { useUser } from "../../context/UserContext";
import { getDefaultPhoto } from "../../api/helper";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  if (!user)
    return (
      <div className="flex-1 overflow-y-auto justify-center items-center">
        <div className="max-w-4xl mx-auto px-8 py-6 space-y-6">
          <div className="text-center py-4">
            <h3>No profile data found</h3>
          </div>
        </div>
      </div>
    );

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
                    className="text-secondary-300 cursor-pointer"
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
