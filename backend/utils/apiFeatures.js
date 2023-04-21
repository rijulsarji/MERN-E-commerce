class ApiFeatures {
  constructor(query, queryStr) {
    // https://www.google.com?keyword=samosa
    // query is keyword
    // queryStr is samosa
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword ? {
      name: {
        $regex: this.queryStr.keyword,  // if we write samosa or samomosa, it should show samosa. for that we use regex (regular expression)
        $options: "i"     // i means case-insensitive
      }
    } : {}

    this.query = this.query.find({...keyword})

    return this;    // this will return the class itself
  }

  filter() {
    // we need to make a copy of queryStr so the original value doesn't get messed up.
    // if we simply wrote queryCopy = this.queryStr, it would be passed as reference and values would change on changing the copy.
    const queryCopy = {...this.queryStr}

    // remove some fields for category
    const removeFields = ["keyword", "page", "limit"]   // these fields are not to be included in filter
    
    removeFields.forEach(key => delete queryCopy[key])

    // filter for price and rating since they need a range.

    // we need price[gt] and price[lt] for range. however mongodb accepts parameters with $ sign. so we'll first convert queryCopy to string and add $ to gt and lt and then proceed.

    let queryString = JSON.stringify(queryCopy);
    queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    // /\b()\b/g is a regular expression, and we need to put what we need to change inside the bracket.

    // gt-> greater than, gte-> greater than or equal to
    
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    // let's say there are 50 products, and on the first page we show only 10. so what we do is we skip 0 products on the first page, skip 10 products on the second, 20 on the third and so on.
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;