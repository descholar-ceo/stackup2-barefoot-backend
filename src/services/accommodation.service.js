import models from '../database/models';

const {
  booking,
  accommodation,
  accommodationUserReaction,
} = models;

/**
 * @description accommodation service
 */
export default class AccommodationService {
  static likeAccommodation = { isLike: true, isDislike: false, };

  static dislikeAccommodation = { isLike: false, isDislike: true, };

  /**
   *@description Saves booking information in database
   * @param {Object} bookingInfo trip request data
   * @returns {Object} Saved booking information
    */
  static handleBookAccommodation(bookingInfo) {
    return booking.create(
      bookingInfo,
      {
        fields: [
          'tripRequestId',
          'accommodationId',
          'arrivalDate',
          'departureDate',
        ]
      }
    );
  }

  /**
  *@description retrives accommodation details by id
  * @param {Object} id unique accommodation id
  * @returns {Object} accommodation facility details
  */
  static getAccommodationById(id) {
    return accommodation.findOne({ where: { id, } });
  }

  /**
   *@description Saves user reaction towards an accommodation in db 
   * @param {Number} accommodationId db accommodationId
   * @param {Number} userId a user who liked the accommodation
   * @returns {Promise<Object>} liked accommodation details
  */
  static async handleLikeAccommodation(accommodationId, userId) {
    const { getUserAccommodationReaction, likeAccommodation } = AccommodationService;
    const reactioInfo = { userId, accommodationId };
    if (await getUserAccommodationReaction(reactioInfo)) {
      return accommodationUserReaction
        .update(likeAccommodation, {
          where: reactioInfo
        });
    }
    return accommodationUserReaction
      .create({ userId, accommodationId, ...likeAccommodation });
  }

  /**
   *@description Saves user reaction towards an accommodation in db 
   * @param {Number} accommodationId db accommodationId
   * @param {Number} userId a user who liked the accommodation
   * @returns {Promise<Object>} liked accommodation details
  */
  static async handleDislikeAccommodation(accommodationId, userId) {  
    const { getUserAccommodationReaction, dislikeAccommodation } = AccommodationService;
    if (await getUserAccommodationReaction({ userId, accommodationId })) {
      return accommodationUserReaction
        .update(dislikeAccommodation, {
          where: { userId, accommodationId }
        });
    }
    return accommodationUserReaction
      .create({ userId, accommodationId, ...AccommodationService.dislikeAccommodation });
  }

  /**
   *@description Saves user reaction towards an accommodation in db 
   * @param {Number} accommodationId db accommodationId
   * @param {Number} userId a user who liked the accommodation
   * @returns {Promise<Object>} liked accommodation details
  */
  static handleUnlikeAccommodation(accommodationId, userId) {
    const where = { userId, accommodationId, };
    return accommodationUserReaction
      .update({ isLike: false, }, { where });
  }

  /**
   *@description Saves user reaction towards an accommodation in db 
   * @param {Number} accommodationId db accommodationId
   * @param {Number} userId a user who liked the accommodation
   * @returns {Promise<Object>} liked accommodation details
  */
  static handleUnDislikeAccommodation(accommodationId, userId) {
    return accommodationUserReaction
      .update({ isDislike: false, }, { where: { accommodationId, userId, } });
  }

  /**
   *@description gets a specific user accommodation reaction record from db
   * @param {Object} where fields/columns to use in where clause
   * @returns {Promise<Object>} user accommodation reaction/null
  */
  static getUserAccommodationReaction(where) {
    return accommodationUserReaction.findOne({ where });
  }

  /**
   *@description retrieves number of user likes on a specific accommodation
   * @param {Number} accommodationId a unique accommodation identifier
   * @returns {Promise<Number>} user likes count
  */
  static getAccommodationLikes(accommodationId) {
    return accommodationUserReaction.count({ where: { accommodationId, isLike: true } });
  }

  /**
   *@description retrieves number of user dislikes on a specific accommodation
   * @param {Number} accommodationId a unique accommodation identifier
   * @returns {Promise<Number>} user dislikes count
  */
  static getAccommodationDislikes(accommodationId) {
    return accommodationUserReaction.count({ where: { accommodationId, isDislike: true } });
  }

  /**
   *@description retrieves number of user neutral reactions on a specific accommodation
   * @param {Number} accommodationId a unique accommodation identifier
   * @returns {Promise<Number>} user neutral reactions count
  */
  static getAccommodationNeutralReactions(accommodationId) {
    return accommodationUserReaction.count({
      where: { accommodationId, isDislike: false, isLike: false }
    });
  }
}
