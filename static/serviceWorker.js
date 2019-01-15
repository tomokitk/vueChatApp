self.addEventListener('fetch', function(event) {
    console.log(event)
    console.log('fetch1')
});

self.addEventListener('install', function(event) {
    console.log('install')
    console.log(event)
});