// Спасибо Вадиму Макееву за полезный урок
// https://youtu.be/4JS70KB9GS0

function findVideos() {
	let videos = document.querySelectorAll('.js-video');

	for (let i = 0; i < videos.length; i++) {
		setupVideo(videos[i]);
	}
}

function setupVideo(video) {
	let link = video.querySelector('.js-video__link');
	let button = video.querySelector('.js-video__button');
	let id = parseMediaURL(link);

	video.addEventListener('click', () => {
		let iframe = createIframe(id);

		link.remove();
		button.remove();
		video.appendChild(iframe);
	});

	link.removeAttribute('href');
	video.classList.add('js-video--enabled');
}

function parseMediaURL(link) {
	let regexp = /https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/i;
	let url = link.href;
	let match = url.match(regexp);

	return match[1];
}

function createIframe(id) {
	let iframe = document.createElement('iframe');

	iframe.setAttribute('allowfullscreen', '');
	iframe.setAttribute('allow', 'autoplay');
	iframe.setAttribute('src', generateURL(id));
	iframe.classList.add('js-video__media');

	return iframe;
}

function generateURL(id) {
	let query = '?rel=0&showinfo=0&autoplay=1';

	return 'https://www.youtube.com/embed/' + id + query;
}

findVideos();
