const responseConstants = require("../../constants/response");

class BaseCURDRepository {
  constructor(model) {
    this.model = model;
  }

  create(docData) {
    return new Promise(async (resolve, reject) => {
      await this.model.collection.insertMany(
        docData,
        { useFindAndModify: true },
        (err, docs) => {
          if (err) reject(responseConstants.SERVER_ERROR);
          console.log("Inserted data : ", docs);
          resolve(responseConstants.SUCCESS);
        }
      );
    });
  }

  read(filter) {
    return new Promise(async (resolve, reject) => {
      await this.model.find(filter, (err, docs) => {
        if (err) reject(responseConstants.SERVER_ERROR);
        docs = docs ? docs.toJSON({ getters: true }) : {};
        resolve(docs);
      });
    });
  }

  readWithDiffrentData(filterField, filterData) {
    return new Promise(async (resolve, reject) => {
      let query = {};
      query[filterField] = { $in: filterData };
      await this.model.find(query, (err, docs) => {
        if (err) reject(responseConstants.SERVER_ERROR);
        docs = docs.length > 0 ? docs.toJSON({ getters: true }) : [];
        resolve(docs);
      });
    });
  }

  update(filter, dataToUpdate) {
    return new Promise(async (resolve, reject) => {
      try {
        let doc = await this.model.findOneAndUpdate(filter, dataToUpdate, {
          new: true,
        });
        resolve(doc);
      } catch (error) {
        reject(responseConstants.SERVER_ERROR);
      }
    });
  }

  delete(filter) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.model.deleteOne(filter);
        resolve(responseConstants.SUCCESS);
      } catch (error) {
        reject(responseConstants.SERVER_ERROR);
      }
    });
  }
}

module.exports = BaseCURDRepository;
