import { useParams } from "react-router-dom";
import EventForm from "./EventForm";

export default function EditEvent() {
  const { id } = useParams();

  return <EventForm mode="edit" eventId={id} />;
}
