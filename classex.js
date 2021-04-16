class Home {
  constructor(request, response) {
    this.request = request;
    this.response = response;
  }

  split() {
    var qs = require('querystring');
    var post = qs.parse(this.request);
    return post;
  }
  split_title() {
    var post = this.split();
    return post.title;

  }
  split_desc() {
    var post = this.split();
    return post.description;
  }
  split_ip() {
    var post = this.split();
    return post.ip;

  }
  get title() {
    return this.split_title();
  }

  get description() {
    return this.split_desc();
  }

  get ip() {
    return this.split_ip();
  }


}
module.exports = Home
