
  /** 
  * @description extracts userId and acccommodationId from @req
  */
  export default class UserAccommodationReactionUtils {
  /** 
  * @param {Request} req Node/express request
  * @returns {Object} with userId and accommodatonId properties
  * @description extracts userId and acccommodationId from @req
  */
  static extractAccommodationIdAndUserId({ sessionUser, params }) {
    const { id: userId } = sessionUser;
    const { id: accommodationId } = params;
    return {
      userId,
      accommodationId,
    };
  }
}
