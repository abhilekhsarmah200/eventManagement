const searchOrganisersDetails = (array, props, searchKey) => {
  let result = array.filter((item) => {
    let element = item;
    for (let key in element) {
      if (
        props.includes(key) &&
        element?.[key]
          ?.trim()
          ?.toLowerCase()
          .includes(searchKey?.trim()?.toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  });
  return result;
};
export default searchOrganisersDetails;
