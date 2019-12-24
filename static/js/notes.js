(function(window, document, undefined) {
  document.querySelector('.right').addEventListener('click', function() {
    this.className = 'right right-show'
    document.querySelector('.page').className = 'page show'
  }, false)
  document.querySelector('.nav-bg').addEventListener('click', function() {
    document.querySelector('.page').className = 'page'
    document.querySelector('.right').className = 'right'
  }, false)
})(window, document)