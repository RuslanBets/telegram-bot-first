const form = document.querySelector('form')

form.addEventListener('submit', function() {
  let data = Object.fromEntries(new FormData(this))
  fetch('/api/number',{method:"POST", body: JSON.stringify(data)})
  this.reset()
})