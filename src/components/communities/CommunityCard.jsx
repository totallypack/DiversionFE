import { Card, CardBody, Badge, Button } from "reactstrap";

export default function CommunityCard({ community, onJoin, onLeave, onClick }) {
  const handleJoinClick = (e) => {
    e.stopPropagation();
    onJoin(community.id);
  };

  const handleLeaveClick = (e) => {
    e.stopPropagation();
    onLeave(community.id);
  };

  return (
    <Card
      style={{ cursor: "pointer", height: "100%" }}
      onClick={() => onClick(community.id)}
    >
      <CardBody>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="mb-0">{community.name}</h5>
          {community.isPrivate && (
            <Badge color="secondary" pill>
              Private
            </Badge>
          )}
        </div>

        {community.description && (
          <p
            className="text-muted mb-2"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {community.description}
          </p>
        )}

        {community.interestName && (
          <Badge color="info" className="mb-2">
            {community.interestName}
          </Badge>
        )}

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            {community.memberCount} {community.memberCount === 1 ? "member" : "members"}
          </small>

          {community.isMember ? (
            community.userRole === "Owner" ? (
              <Badge color="primary">Owner</Badge>
            ) : (
              <Button
                color="secondary"
                outline
                size="sm"
                onClick={handleLeaveClick}
              >
                Leave
              </Button>
            )
          ) : (
            !community.isPrivate && (
              <Button color="dark" size="sm" onClick={handleJoinClick}>
                Join
              </Button>
            )
          )}
        </div>
      </CardBody>
    </Card>
  );
}
