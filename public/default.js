const $content = document.getElementById('content');
const $name = document.getElementById('name');
const $download = document.getElementById('download');
const $result = document.getElementById('result');

$download.addEventListener('click', e => {
  e.preventDefault();
  fetch('/download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: $name.value,
      content: $content.value
    })
  })
  .then(res => res.json())
  .then(res => {
    $result.textContent = 'Download';
    $result.setAttribute('href', '/download/' + res._id);
    setTimeout(() => {
      $result.textContent = '...expired';
      $result.removeAttribute('href');
    }, res.timer);
  });
});
