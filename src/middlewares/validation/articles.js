import Error from '../../helpers/errorHandler';
import * as validate from '../../helpers';

/**
 * A class to handle actions performed on articles
 */
class articles {
  /**
   * @param {object} req Request sent to the route
   * @param {object} res Response from server
   * @param {object} next If no error continue
   * @returns {object} Object representing the response returned
   */
  static create(req, res, next) {
    const result = validate.validation.createArticle(req.body);
    if (result.error) {
      return Error.joiErrorHandler(res, result);
    }
    next();
  }

  /**
   * @param {object} req Request sent to the route
   * @param {object} res Response from server
   * @param {object} next If no error continue
   * @returns {object} Object representing the response returned
   */
  static update(req, res, next) {
    const response = validate.validation.updateArticle(req.body);
    req.body = {
      title: req.body.title && req.body.title.trim(),
      body: req.body.body && req.body.body.trim(),
      description: req.body.description && req.body.description.trim(),
      readTime: req.body.body && validate.generator.readtime(req.body.body)
    };
    Object.keys(req.body).forEach(
      key => req.body[key] || (key !== 'readTime' && delete req.body[key])
    );
    return !response.error ? next() : Error.joiErrorHandler(res, response);
  }

  /**
   * @param {object} req Request sent to the route
   * @param {object} res Response from server
   * @param {object} next Log errors
   * @returns {object} Object representing the response returned
   */
  static slug(req, res, next) {
    const response = validate.validation.articleSlug(req.params);
    if (response.error) {
      Error.joiErrorHandler(res, response);
    } else {
      next();
    }
  }

  /**
   * Validate pagination queries
   * @param {object} req Request sent to the route
   * @param {object} res Response from server
   * @param {object} next Log errors
   * @returns {object} Object representing the response returned
   */
  static pagination(req, res, next) {
    const duplicated = validate.parameters.duplication(req.query);
    if (Object.keys(duplicated).length) {
      return res.status(400).send({ errors: duplicated });
    }

    const { error } = validate.validation.queryParameters(req.query);
    return !error ? next() : Error.joiErrorHandler(res, { error });
  }
}

export default articles;
