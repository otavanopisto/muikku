import MApi from "~/api/api";

/**
 * autofillLoaders
 */
const autofillLoaders = () => {
  const guiderApi = MApi.getGuiderApi();

  return {
    /**
     * studentsLoader
     * @param searchString searchString
     */
    studentsLoader: (searchString: string) => () =>
      guiderApi.getGuiderStudents({
        q: searchString,
        maxResults: 10,
      }),
  };
};

export default autofillLoaders;
