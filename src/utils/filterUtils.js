export const filterInterestsBySearchTerm = (interests, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === "") return interests;

  const lowerSearchTerm = searchTerm.toLowerCase();

  return interests
    .map((interest) => {
      const filteredSubInterests =
        interest.subInterests?.filter(
          (subInterest) =>
            subInterest.name.toLowerCase().includes(lowerSearchTerm) ||
            subInterest.description?.toLowerCase().includes(lowerSearchTerm)
        ) || [];

      return {
        ...interest,
        subInterests: filteredSubInterests,
      };
    })
    .filter(
      (interest) =>
        interest.name.toLowerCase().includes(lowerSearchTerm) ||
        interest.description?.toLowerCase().includes(lowerSearchTerm) ||
        interest.subInterests.length > 0
    );
};
