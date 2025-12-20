export const transformInterestsForDisplay = (interests) => {
  if (!interests || !Array.isArray(interests)) return [];

  return interests.map((interest) => ({
    id: interest.id,
    subInterest: {
      id: interest.id,
      name: interest.name,
      interest: {
        id: interest.interest?.id,
        name: interest.interest?.name,
      },
    },
  }));
};

export const sortEventsByDate = (events) => {
  if (!events || !Array.isArray(events)) return [];

  return [...events].sort(
    (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
  );
};
