import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

import { useUser } from "../../context/UserContext";

const EditProfile = () => {
  const { user, loading } = useUser();

  return (
    <>
      <Container className="vh-100 d-flex align-items-center">
        <Row className="justify-content-center w-100">
          <Col xs={12} md={5} className="mb-4">
            <Card
              className="shadow-sm rounded"
              style={{ minHeight: "220px", padding: "1rem" }}
            >
              <Card.Body className="d-flex flex-column justify-content-center text-center">
                {loading ? (
                  <>
                    <Spinner animation="border" variant="primary" />
                    <Card.Title className="mt-3">Loading Profile...</Card.Title>
                  </>
                ) : user ? (
                  <>
                    <Card.Title className="mb-2 fs-3">
                      {user.username}
                    </Card.Title>
                    <Card.Subtitle className="text-muted">
                      {user.email}
                    </Card.Subtitle>
                  </>
                ) : (
                  <Card.Title>No profile data found</Card.Title>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EditProfile;
